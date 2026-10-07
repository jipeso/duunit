export const parseDate = (date: string) => new Date(`${date}T00:00:00`)

// Today's date as YYYY-MM-DD in the user's local time zone
export const today = () => {
  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${String(date.getFullYear())}-${month}-${day}`
}
