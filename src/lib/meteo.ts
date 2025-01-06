import { fetchWeatherApi } from "openmeteo";

export const getWeatherData = async () => {
  const isDev = import.meta.env.DEV;
  if (isDev) return { temperature: 42, weatherStatus: "The sky was above" };

  const params = {
    latitude: 9.0765,
    longitude: 7.3986,
    current: ["temperature_2m", "weather_code"],
    timezone: "auto",
    forecast_days: 1,
  };
  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);

  const response = responses[0];

  const current = response.current()!;

  const codes = {
    "The sky was sunny": [0, 1],
    "The sky was cloudy": [2],
    "The sky was overcast": [3],
    "The weather was foggy": [45, 48],
    "It was raining": [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82],
    "It was snowing": [71, 73, 75, 77, 85, 86],
    "It was stormy": [95, 96, 98],
  };

  const temperature = Math.round(current.variables(0)!.value());
  const weatherCode = current.variables(1)!.value();

  const weatherStatus = Object.entries(codes).find(([_, codes]) =>
    codes.includes(weatherCode)
  );
  return { temperature, weatherStatus: weatherStatus?.[0] };
};
