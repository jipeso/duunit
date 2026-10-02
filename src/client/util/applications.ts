import type { ApplicationStatus } from '#common/types/applications.ts'

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
  withdrawn: 'default',
}
