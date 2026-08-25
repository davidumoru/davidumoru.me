import { TIME_ZONE } from "./date";

const URL = "https://letterboxd.com/umoru/rss/";
const OK_TTL = 10 * 60_000;
const FAIL_TTL = 60_000;
const MAX = 8;

export interface Watch {
  title: string;
  url: string;
  poster?: string;
  rating?: number;
  watched?: string;
  rewatch?: boolean;
}

let cache: { watches: Watch[] | null; expires: number } | null = null;

export async function getRecentWatches(limit = MAX): Promise<Watch[] | null> {
  if (cache && Date.now() < cache.expires) {
    return cache.watches?.slice(0, limit) ?? null;
  }

  try {
    const res = await fetch(URL, {
      headers: { "User-Agent": "davidumoru.me" },
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) throw new Error(String(res.status));
    const watches = parse(await res.text());
    cache = { watches, expires: Date.now() + OK_TTL };
    return watches?.slice(0, limit) ?? null;
  } catch {
    const stale = cache?.watches ?? null;
    cache = { watches: stale, expires: Date.now() + FAIL_TTL };
    return stale?.slice(0, limit) ?? null;
  }
}

function parse(xml: string): Watch[] | null {
  const watches: Watch[] = [];
  for (const block of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const item = block[1];
    const title = field(item, "filmTitle");
    const href = item.match(/<link>([^<]*)<\/link>/)?.[1];
    if (!title || !href) continue;
    const rating = Number(field(item, "memberRating"));
    watches.push({
      title: decode(title),
      url: href,
      poster: item.match(/<img src="([^"]+)"/)?.[1],
      rating: Number.isFinite(rating) ? rating : undefined,
      watched: field(item, "watchedDate"),
      rewatch: field(item, "rewatch") === "Yes",
    });
    if (watches.length === MAX) break;
  }
  return watches.length ? watches : null;
}

function field(item: string, name: string): string | undefined {
  return item.match(
    new RegExp(`<letterboxd:${name}>([^<]*)</letterboxd:${name}>`),
  )?.[1];
}

function codePoint(raw: string, radix: number): string {
  const point = Number.parseInt(raw, radix);
  return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : "";
}

// decodes last so an escaped entity is not decoded twice
function decode(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => codePoint(hex, 16))
    .replace(/&#(\d+);/g, (_, dec) => codePoint(dec, 10))
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}

const dayIn = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  dateStyle: "short",
});

export function formatWatchStatus(watch: Watch, now = new Date()): string {
  const verb = watch.rewatch ? "Rewatched" : "Watched";
  if (!watch.watched) return verb;

  const then = new Date(`${watch.watched}T12:00:00+01:00`);
  if (dayIn.format(then) === dayIn.format(now)) return `${verb} today`;

  const yesterday = new Date(now.getTime() - 86_400_000);
  if (dayIn.format(then) === dayIn.format(yesterday))
    return `${verb} yesterday`;

  const days = Math.round((now.getTime() - then.getTime()) / 86_400_000);
  if (days < 7) return `${verb} ${days} day${days === 1 ? "" : "s"} ago`;

  const weeks = Math.round(days / 7);
  if (weeks < 5) return `${verb} ${weeks} week${weeks === 1 ? "" : "s"} ago`;

  return verb;
}
