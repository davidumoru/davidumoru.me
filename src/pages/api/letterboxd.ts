export const prerender = false;

import type { APIRoute } from "astro";
import { kv } from "@vercel/kv";

const LETTERBOXD_USERNAME = "umoru";
const RSS_URL = `https://letterboxd.com/${LETTERBOXD_USERNAME}/rss/`;
const CACHE_KEY = "letterboxd-recent";
const CACHE_TTL_SECONDS = 60 * 60 * 6;
const MAX_ENTRIES = 6;

const HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
  "Access-Control-Allow-Origin": "*",
};

interface FilmEntry {
  title: string;
  year: string;
  link: string;
  posterUrl: string | null;
  rating: number | null;
  watchedDate: string;
  rewatch: boolean;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'");
}

function stripCdata(s: string | undefined): string {
  if (!s) return "";
  return s.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "");
}

function pick(xml: string, tag: string): string | undefined {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`);
  const m = xml.match(re);
  return m ? stripCdata(m[1]).trim() : undefined;
}

function parseRss(xml: string): FilmEntry[] {
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];

  const films: FilmEntry[] = [];

  for (const item of items) {
    const watchedDate = pick(item, "letterboxd:watchedDate");
    if (!watchedDate) continue;

    const filmTitle = pick(item, "letterboxd:filmTitle");
    const filmYear = pick(item, "letterboxd:filmYear");
    const link = pick(item, "link");
    const ratingRaw = pick(item, "letterboxd:memberRating");
    const rewatchRaw = pick(item, "letterboxd:rewatch");
    const description = pick(item, "description") || "";

    if (!filmTitle) continue;

    const posterMatch = description.match(/<img[^>]+src="([^"]+)"/);
    let posterUrl = posterMatch ? posterMatch[1] : null;
    if (posterUrl) {
      posterUrl = posterUrl.replace(
        /0-150-0-225-crop/,
        "0-300-0-450-crop",
      );
    }

    films.push({
      title: decodeEntities(filmTitle),
      year: filmYear || "",
      link: link || "",
      posterUrl,
      rating: ratingRaw ? parseFloat(ratingRaw) : null,
      watchedDate,
      rewatch: rewatchRaw === "Yes",
    });

    if (films.length >= MAX_ENTRIES) break;
  }

  return films;
}

export const GET: APIRoute = async () => {
  try {
    const cached = await kv.get<FilmEntry[]>(CACHE_KEY);
    if (cached) {
      return new Response(JSON.stringify({ films: cached }), {
        status: 200,
        headers: HEADERS,
      });
    }
  } catch {}

  try {
    const res = await fetch(RSS_URL, {
      headers: { "User-Agent": "davidumoru.me Letterboxd widget" },
    });

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: `Letterboxd returned ${res.status}` }),
        { status: 502, headers: HEADERS },
      );
    }

    const xml = await res.text();
    const films = parseRss(xml);

    if (films.length === 0) {
      return new Response(
        JSON.stringify({ error: "No recent films found." }),
        { status: 404, headers: HEADERS },
      );
    }

    try {
      await kv.set(CACHE_KEY, films, { ex: CACHE_TTL_SECONDS });
    } catch {}

    return new Response(JSON.stringify({ films }), {
      status: 200,
      headers: HEADERS,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch Letterboxd RSS.";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: HEADERS,
    });
  }
};
