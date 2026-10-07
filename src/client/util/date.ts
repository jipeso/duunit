export const parseDate = (date: string) => new Date(`${date}T00:00:00`)

// Today's date as YYYY-MM-DD in the user's local time zone
export const today = () => {
  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${String(date.getFullYear())}-${month}-${day}`
}

// ISO timestamp to the YYYY-MM-DDTHH:mm format of a datetime-local input,
// in the user's local time zone
export const toDateTimeLocal = (iso: string) => {
  const date = new Date(iso)
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${String(date.getFullYear())}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export const DATE_TIME_FORMAT: Intl.DateTimeFormatOptions = {
  dateStyle: 'medium',
  timeStyle: 'short',
}
