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

const DAY_MS = 24 * 60 * 60 * 1000

export const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())

export const daysBetween = (from: Date, to: Date) =>
  Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / DAY_MS)

export const monthsBetween = (from: Date, to: Date) =>
  (to.getFullYear() - from.getFullYear()) * 12 + to.getMonth() - from.getMonth()

export const daysAgo = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() - days)

export const monthsAgo = (date: Date, months: number) =>
  new Date(date.getFullYear(), date.getMonth() - months, 1)
