import { z } from 'zod'

export const APPLICATION_STATUSES = [
  'saved',
  'applied',
  'interviewing',
  'offer',
  'rejected',
  'accepted',
  'withdrawn',
] as const

export const MIN_APPLIED_DATE = '2015-01-01'
export const MIN_TEXT_LENGTH = 1
export const MAX_TEXT_LENGTH = 100
export const MAX_COVER_LETTER_LENGTH = 6000
export const MAX_NOTES_LENGTH = 6000

export const ApplicationStatusSchema = z.enum(APPLICATION_STATUSES)

const emptyToNull = (value: string) =>
  value.trim() === '' ? null : value.trim()

const requiredText = (max: number) =>
  z.string().trim().min(MIN_TEXT_LENGTH).max(max)

const optionalText = (max: number) =>
  z.string().trim().max(max).transform(emptyToNull).nullish()

export const NewApplicationSchema = z.object({
  company: requiredText(MAX_TEXT_LENGTH),
  position: requiredText(MAX_TEXT_LENGTH),
  status: ApplicationStatusSchema,
  jobPostingUrl: z
    .string()
    .transform(emptyToNull)
    .pipe(z.url().nullable())
    .nullish(),
  location: optionalText(MAX_TEXT_LENGTH),
  appliedAt: z
    .string()
    .transform(emptyToNull)
    .pipe(
      z.iso
        .date()
        .refine(date => date >= MIN_APPLIED_DATE, {
          error: 'validation.tooEarly',
        })
        .nullable()
    )
    .nullish(),
  deadline: z
    .string()
    .transform(emptyToNull)
    .pipe(z.iso.date().nullable())
    .nullish(),
  nextInterviewAt: z
    .string()
    .transform(emptyToNull)
    .pipe(
      z.iso
        .datetime({ local: true })
        .transform(value => new Date(value).toISOString())
        .nullable()
    )
    .nullish(),
  salary: optionalText(MAX_TEXT_LENGTH),
  coverLetter: optionalText(MAX_COVER_LETTER_LENGTH),
  notes: optionalText(MAX_NOTES_LENGTH),
})

export const ApplicationResponseSchema = z.object({
  id: z.uuid(),
  company: z.string(),
  position: z.string(),
  status: ApplicationStatusSchema,
  jobPostingUrl: z.string().nullable(),
  location: z.string().nullable(),
  appliedAt: z.iso.date().nullable(),
  deadline: z.iso.date().nullable(),
  nextInterviewAt: z.iso.datetime().nullable(),
  salary: z.string().nullable(),
  coverLetter: z.string().nullable(),
  notes: z.string().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export const UpdateApplicationSchema = NewApplicationSchema.partial().refine(
  values => Object.keys(values).length > 0,
  { error: 'At least one field must be provided' }
)

export const StatusEventResponseSchema = z.object({
  id: z.uuid(),
  status: ApplicationStatusSchema,
  occurredOn: z.iso.date(),
})

export const UpdateStatusEventSchema = z.object({
  occurredOn: z.iso.date(),
})

export type StatusEventResponse = z.infer<typeof StatusEventResponseSchema>
export type ApplicationStatus = z.infer<typeof ApplicationStatusSchema>
export type NewApplication = z.infer<typeof NewApplicationSchema>
export type NewApplicationInput = z.input<typeof NewApplicationSchema>
export type UpdateApplication = z.infer<typeof UpdateApplicationSchema>
export type ApplicationResponse = z.infer<typeof ApplicationResponseSchema>
