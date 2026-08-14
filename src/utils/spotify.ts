import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REFRESH_TOKEN,
} from "astro:env/server";

export interface Track {
  title: string;
  artist: string;
  cover?: string;
  url?: string;
  live: boolean;
  playedAt?: string;
}

interface SpotifyImage {
  url: string;
  width?: number | null;
}

interface SpotifyItem {
  name?: string;
  artists?: { name: string }[];
  album?: { images?: SpotifyImage[] };
  external_urls?: { spotify?: string };
}

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API = "https://api.spotify.com/v1";

const OK_TTL = 20_000;
const FAIL_TTL = 60_000;

let token: { value: string; expires: number } | null = null;
let cache: { track: Track | null; expires: number } | null = null;

async function accessToken(): Promise<string> {
  if (token && Date.now() < token.expires) return token.value;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN!,
    }),
  });

  if (!res.ok) {
    throw new Error(`token ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };
  token = {
    value: data.access_token,
    expires: Date.now() + (data.expires_in - 60) * 1000,
  };
  return token.value;
}

async function api(path: string, bearer: string): Promise<unknown> {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
  if (!res.ok) throw new Error(`${path} ${res.status}`);
  const body = await res.text();
  return body ? JSON.parse(body) : null;
}

function cover(images: SpotifyImage[] = []): string | undefined {
  const byWidth = [...images].sort((a, b) => (a.width ?? 0) - (b.width ?? 0));
  const enough = byWidth.find((image) => (image.width ?? 0) >= 200);
  return (enough ?? byWidth.at(-1))?.url;
}

function toTrack(
  item: SpotifyItem | undefined | null,
  live: boolean,
  playedAt?: string,
): Track | null {
  if (!item?.name) return null;
  return {
    title: item.name,
    artist: item.artists?.map((artist) => artist.name).join(", ") ?? "",
    cover: cover(item.album?.images ?? []),
    url: item.external_urls?.spotify,
    live,
    playedAt,
  };
}

export async function getNowPlaying(): Promise<Track | null> {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    return null;
  }
  if (cache && Date.now() < cache.expires) return cache.track;

  try {
    const bearer = await accessToken();

    const playing = (await api("/me/player/currently-playing", bearer)) as {
      is_playing?: boolean;
      currently_playing_type?: string;
      item?: SpotifyItem;
    } | null;

    let track =
      playing?.is_playing && playing.currently_playing_type === "track"
        ? toTrack(playing.item, true)
        : null;

    if (!track) {
      const recent = (await api(
        "/me/player/recently-played?limit=1",
        bearer,
      )) as {
        items?: { track?: SpotifyItem; played_at?: string }[];
      } | null;
      const last = recent?.items?.[0];
      track = toTrack(last?.track, false, last?.played_at);
    }

    cache = { track, expires: Date.now() + OK_TTL };
    return track;
  } catch (error) {
    console.error("[spotify]", error instanceof Error ? error.message : error);
    cache = { track: cache?.track ?? null, expires: Date.now() + FAIL_TTL };
    return cache.track;
  }
}
