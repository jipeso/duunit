import {
  STATUS_DATE_FIELD,
  STATUS_DATE_FIELDS,
  type ApplicationResponse,
  type ApplicationStatus,
} from '#common/types/applications.ts'

export const EMPTY_VALUE = '—'

export const statusColors: Record<
  ApplicationStatus,
  'default' | 'info' | 'warning' | 'success' | 'error'
> = {
  saved: 'default',
  applied: 'info',
  interviewing: 'warning',
  offer: 'success',
  accepted: 'success',
  rejected: 'error',
  no_response: 'default',
  withdrawn: 'default',
}

export const clearsStatusDates = (
  application: ApplicationResponse,
  status: ApplicationStatus
) => {
  const field = STATUS_DATE_FIELD[status]
  const start = field ? STATUS_DATE_FIELDS.indexOf(field) + 1 : 0

  return STATUS_DATE_FIELDS.slice(start).some(
    later => later !== 'closedOn' && application[later]
  )
}
