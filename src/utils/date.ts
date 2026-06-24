export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
