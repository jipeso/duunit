import { z } from 'zod'

import { NAME_MAX_LENGTH, nameField } from './common.ts'

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
export const MAX_COVER_LETTER_LENGTH = 6000

export const ApplicationStatusSchema = z.enum(APPLICATION_STATUSES)
export type ApplicationStatus = z.infer<typeof ApplicationStatusSchema>

const emptyToNull = (value: string) =>
  value.trim() === '' ? null : value.trim()

export const NewApplicationSchema = z.object({
  company: nameField,
  position: nameField,
  status: ApplicationStatusSchema,
  jobPostingUrl: z
    .string()
    .transform(emptyToNull)
    .pipe(z.url().nullable())
    .nullish(),
  location: z
    .string()
    .trim()
    .max(NAME_MAX_LENGTH)
    .transform(emptyToNull)
    .nullish(),
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
  coverLetter: z
    .string()
    .trim()
    .max(MAX_COVER_LETTER_LENGTH)
    .transform(emptyToNull)
    .nullish(),
})

export type NewApplication = z.infer<typeof NewApplicationSchema>
export type NewApplicationInput = z.input<typeof NewApplicationSchema>

export const ApplicationResponseSchema = z.object({
  id: z.uuid(),
  company: z.string(),
  position: z.string(),
  status: ApplicationStatusSchema,
  jobPostingUrl: z.string().nullable(),
  location: z.string().nullable(),
  appliedAt: z.iso.date().nullable(),
  coverLetter: z.string().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})
export type ApplicationResponse = z.infer<typeof ApplicationResponseSchema>
