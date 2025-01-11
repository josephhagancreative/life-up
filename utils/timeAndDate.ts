import { formatDate } from "date-fns"

export function formatToLocalDate(date: Date | string) {
  return formatDate(date, "dd-MM-yyyy")
}
