import type { APIRoute } from "astro";

const client_id = import.meta.env.SPOTIFY_CLIENT_ID;
const client_secret = import.meta.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = import.meta.env.SPOTIFY_REFRESH_TOKEN;

const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=1`;

const MUSIC_CACHE_HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
  "Access-Control-Allow-Origin": "*",
};

interface SpotifyImage {
  url: string;
}

interface SpotifyArtist {
  name: string;
}

interface SpotifyAlbum {
  images: SpotifyImage[];
}

interface SpotifyTrack {
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  external_urls: {
    spotify: string;
  };
}

interface SpotifyNowPlayingResponse {
  item: SpotifyTrack | null;
  is_playing: boolean;
}

async function getAccessToken(): Promise<string | null> {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${client_id}:${client_secret}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh_token!,
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.access_token;
}

function formatPlayedAt(dateString: string): string {
  const playedAt = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - playedAt.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const isToday = playedAt.toDateString() === now.toDateString();
  const isYesterday =
    new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString() ===
    playedAt.toDateString();

  if (diffMinutes < 1) {
    return "Last listened just now";
  } else if (diffMinutes < 60) {
    return `Last listened ${diffMinutes} minute${
      diffMinutes === 1 ? "" : "s"
    } ago`;
  } else if (isToday) {
    if (diffHours === 1) {
      return "Last listened 1 hour ago";
    } else {
      return `Last listened ${diffHours} hours ago`;
    }
  } else if (isYesterday) {
    const time = playedAt.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
    return `Last listened yesterday at ${time}`;
  } else if (diffDays < 7) {
    const dayName = playedAt.toLocaleDateString(undefined, { weekday: "long" });
    const time = playedAt.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
    return `Last listened ${dayName} at ${time}`;
  } else {
    const date = playedAt.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
    const time = playedAt.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
    return `Last listened ${date} at ${time}`;
  }
}

function formatTrackData(track: SpotifyTrack) {
  return {
    title: track.name,
    artists: track.artists.map((artist) => artist.name).join(", "),
    albumArtUrl: track.album.images[0]?.url,
    songUrl: track.external_urls.spotify,
  };
}

export const GET: APIRoute = async () => {
  if (!client_id || !client_secret || !refresh_token) {
    return new Response(
      JSON.stringify({
        error:
          "Server environment variables for Spotify are not configured properly.",
      }),
      { status: 500, headers: MUSIC_CACHE_HEADERS }
    );
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    return new Response(
      JSON.stringify({
        error:
          "Unable to authenticate with Spotify. Please check your credentials.",
      }),
      { status: 500, headers: MUSIC_CACHE_HEADERS }
    );
  }

  const nowPlayingResponse = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (nowPlayingResponse.status === 200) {
    const data: SpotifyNowPlayingResponse = await nowPlayingResponse.json();
    if (data && data.item && data.is_playing) {
      const songData = {
        ...formatTrackData(data.item),
        isPlaying: true,
        lastPlayed: "Listening now",
      };
      return new Response(JSON.stringify(songData), {
        status: 200,
        headers: MUSIC_CACHE_HEADERS,
      });
    }
  }

  const recentlyPlayedResponse = await fetch(RECENTLY_PLAYED_ENDPOINT, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (recentlyPlayedResponse.status === 200) {
    const data = await recentlyPlayedResponse.json();
    const lastTrack = data.items[0];
    if (lastTrack && lastTrack.track) {
      const songData = {
        ...formatTrackData(lastTrack.track),
        isPlaying: false,
        lastPlayed: formatPlayedAt(lastTrack.played_at),
      };
      return new Response(JSON.stringify(songData), {
        status: 200,
        headers: MUSIC_CACHE_HEADERS,
      });
    }
  }

  return new Response(
    JSON.stringify({
      error: "No music activity found in your Spotify account.",
    }),
    {
      status: 404,
      headers: MUSIC_CACHE_HEADERS,
    }
  );
};
