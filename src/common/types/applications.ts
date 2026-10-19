import { z } from 'zod'

import {
  requiredText,
  optionalText,
  emptyToNull,
  MAX_TEXT_LENGTH,
  MAX_LONG_TEXT_LENGTH,
} from './common.ts'

export const APPLICATION_STATUSES = [
  'saved',
  'applied',
  'interviewing',
  'offer',
  'accepted',
  'rejected',
  'no_response',
  'withdrawn',
] as const

export const STATUS_DATE_FIELD = {
  saved: null,
  applied: 'appliedOn',
  interviewing: 'interviewingOn',
  offer: 'offerOn',
  accepted: 'closedOn',
  rejected: 'closedOn',
  no_response: 'closedOn',
  withdrawn: 'closedOn',
} as const satisfies Record<ApplicationStatus, string | null>

export const STATUS_DATE_FIELDS = [
  'appliedOn',
  'interviewingOn',
  'offerOn',
  'closedOn',
] as const

export type StatusDateField = (typeof STATUS_DATE_FIELDS)[number]

export const statusRank = (status: ApplicationStatus) => {
  const field = STATUS_DATE_FIELD[status]
  return field ? STATUS_DATE_FIELDS.indexOf(field) + 1 : 0
}

export const MIN_STATUS_DATE = '2015-01-01'

const statusDate = z.iso.date().refine(date => date >= MIN_STATUS_DATE, {
  error: 'validation.tooEarly',
})

export const NewApplicationSchema = z.object({
  company: requiredText(MAX_TEXT_LENGTH),
  position: requiredText(MAX_TEXT_LENGTH),
  status: z.enum(APPLICATION_STATUSES),
  jobPostingUrl: z
    .string()
    .transform(emptyToNull)
    .pipe(z.url().nullable())
    .nullish(),
  location: optionalText(MAX_TEXT_LENGTH),
  appliedOn: z
    .string()
    .transform(emptyToNull)
    .pipe(statusDate.nullable())
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
  coverLetter: optionalText(MAX_LONG_TEXT_LENGTH),
  notes: optionalText(MAX_LONG_TEXT_LENGTH),
  resumeId: z
    .string()
    .transform(emptyToNull)
    .pipe(z.uuid().nullable())
    .nullish(),
})

export const ApplicationResponseSchema = z.object({
  id: z.uuid(),
  company: z.string(),
  position: z.string(),
  status: z.enum(APPLICATION_STATUSES),
  jobPostingUrl: z.string().nullable(),
  location: z.string().nullable(),
  appliedOn: z.iso.date().nullable(),
  interviewingOn: z.iso.date().nullable(),
  offerOn: z.iso.date().nullable(),
  closedOn: z.iso.date().nullable(),
  deadline: z.iso.date().nullable(),
  nextInterviewAt: z.iso.datetime().nullable(),
  salary: z.string().nullable(),
  coverLetter: z.string().nullable(),
  notes: z.string().nullable(),
  resumeId: z.uuid().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export const UpdateApplicationSchema = NewApplicationSchema.extend({
  interviewingOn: statusDate,
  offerOn: statusDate,
  closedOn: statusDate,
}).partial()

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]
export type NewApplication = z.infer<typeof NewApplicationSchema>
export type NewApplicationInput = z.input<typeof NewApplicationSchema>
export type UpdateApplication = z.infer<typeof UpdateApplicationSchema>
export type ApplicationResponse = z.infer<typeof ApplicationResponseSchema>
