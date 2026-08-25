const LAT = 9.0765;
const LON = 7.3986;
const OK_TTL = 10 * 60_000;
const FAIL_TTL = 60_000;

const URL =
  `https://api.open-meteo.com/v1/forecast` +
  `?latitude=${LAT}&longitude=${LON}` +
  `&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,is_day`;

export type Sky = "clear" | "cloud" | "rain" | "storm" | "fog";
export type WeatherIcon = "sun" | "moon" | "cloud" | "rain" | "storm";

export interface Weather {
  temp: number;
  label: string;
  sky: Sky;
  day: boolean;
  icon: WeatherIcon;
  wind: number;
  windDir: number;
}

let cache: { weather: Weather | null; expires: number } | null = null;

export async function getWeather(): Promise<Weather | null> {
  if (cache && Date.now() < cache.expires) return cache.weather;

  try {
    const res = await fetch(URL, {
      headers: { "User-Agent": "davidumoru.me" },
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) throw new Error(String(res.status));
    const weather = parse(await res.json());
    cache = { weather, expires: Date.now() + OK_TTL };
    return weather;
  } catch {
    const stale = cache?.weather ?? null;
    cache = { weather: stale, expires: Date.now() + FAIL_TTL };
    return stale;
  }
}

function parse(data: {
  current?: {
    temperature_2m?: number;
    weather_code?: number;
    wind_speed_10m?: number;
    wind_direction_10m?: number;
    is_day?: number;
  };
}): Weather | null {
  const cur = data.current;
  if (
    cur?.temperature_2m == null ||
    cur.weather_code == null ||
    cur.wind_speed_10m == null ||
    cur.wind_direction_10m == null ||
    cur.is_day == null
  )
    return null;

  const code = cur.weather_code;
  const day = cur.is_day === 1;
  const sky = skyFrom(code);

  return {
    temp: Math.round(cur.temperature_2m),
    label: labelFrom(code),
    sky,
    day,
    icon: iconFrom(sky, day),
    wind: Math.round(cur.wind_speed_10m),
    windDir: cur.wind_direction_10m,
  };
}

function skyFrom(code: number): Sky {
  if (code <= 1) return "clear";
  if (code <= 3) return "cloud";
  if (code <= 48) return "fog";
  if (code >= 95) return "storm";
  return "rain";
}

function labelFrom(code: number): string {
  if (code === 0) return "Clear sky";
  if (code === 1) return "Mainly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code <= 48) return "Fog";
  if (code <= 57) return "Drizzle";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  if (code <= 86) return "Snow";
  return "Storm";
}

function iconFrom(sky: Sky, day: boolean): WeatherIcon {
  if (sky === "clear") return day ? "sun" : "moon";
  if (sky === "storm") return "storm";
  if (sky === "rain") return "rain";
  return "cloud";
}
