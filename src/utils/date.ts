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

const TIME_ZONE = "Africa/Lagos";

const partsIn = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, ...options });

const dayIn = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  dateStyle: "short",
});
const timeIn = partsIn({ hour: "numeric", minute: "2-digit" });
const weekdayIn = partsIn({ weekday: "long" });
const dateIn = partsIn({ month: "long", day: "numeric" });

export function formatPlayedAt(iso: string, now = new Date()): string {
  const then = new Date(iso);
  const minutes = Math.floor((now.getTime() - then.getTime()) / 60_000);

  if (minutes < 1) return "just now";
  if (minutes < 60)
    return minutes === 1 ? "a minute ago" : `${minutes} minutes ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 6 || dayIn.format(then) === dayIn.format(now))
    return hours === 1 ? "an hour ago" : `${hours} hours ago`;

  const yesterday = new Date(now.getTime() - 86_400_000);
  if (dayIn.format(then) === dayIn.format(yesterday))
    return `yesterday at ${timeIn.format(then)}`;

  if (minutes < 60 * 24 * 6)
    return `on ${weekdayIn.format(then)} at ${timeIn.format(then)}`;

  return `on ${dateIn.format(then)}`;
}

export function formatListeningStatus(track: {
  live: boolean;
  playedAt?: string;
}): string {
  if (track.live) return "Listening now";
  if (track.playedAt) return `Last played ${formatPlayedAt(track.playedAt)}`;
  return "Last played";
}
