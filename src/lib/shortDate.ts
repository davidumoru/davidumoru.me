export function displayDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "short",
    timeZone: "Africa/Lagos",
  }).format(date);
}
