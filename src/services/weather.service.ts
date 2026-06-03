import { getWeather }
from "./openmeteo.service";

import { WeatherRepository }
from "../repositories/weather.repository";

const repo = new WeatherRepository();

export async function evaluateWeather(
  lat: number,
  lon: number,
  activity: string,
  userId?: string
) {
  
  const cached = await repo.getCache(lat, lon);
  if (cached) {
    if (userId) {
      await repo.saveUserSearch({
        userId,
        query: { city: "Busca via Coordenadas", coordinates: [lon, lat] },
        searchedAt: new Date()
      });
    }
    return cached;
  }

  const weather = await getWeather(lat, lon);

  await repo.saveCache({
    lat,
    lon,
    provider: "openmeteo",
    temperature: weather.temperature_2m,
    humidity: weather.relative_humidity_2m,
    windSpeed: weather.wind_speed_10m,
    timestamp: new Date()
  });

  await repo.saveHistory({
    location: { type: "Point", coordinates: [lon, lat] },
    capturedAt: new Date(),
    temperature: weather.temperature_2m,
    humidity: weather.relative_humidity_2m,
    wind: weather.wind_speed_10m,
    provider: "openmeteo"
  });

  if (userId) {
    await repo.saveUserSearch({
      userId,
      query: {
        city: `Lat: ${lat}, Lon: ${lon}`, 
        coordinates: [lon, lat]
      },
      searchedAt: new Date()
    });
  }

  return weather;
}