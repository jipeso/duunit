import {
  STATUS_DATE_FIELDS,
  statusRank,
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
) =>
  STATUS_DATE_FIELDS.slice(statusRank(status)).some(
    later => later !== 'closedOn' && application[later]
  )
