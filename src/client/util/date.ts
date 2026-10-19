const MINUTE_MS = 60 * 1000

export const parseDate = (date: string) => new Date(`${date}T00:00:00`)

const toLocalIso = (date: Date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * MINUTE_MS).toISOString()

export const today = () => toLocalIso(new Date()).slice(0, 10)

export const toDateTimeLocal = (iso: string) =>
  toLocalIso(new Date(iso)).slice(0, 16)

export const DATE_TIME_FORMAT: Intl.DateTimeFormatOptions = {
  dateStyle: 'medium',
  timeStyle: 'short',
}
