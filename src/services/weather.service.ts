import { getWeather } from "./openmeteo.service";
import { calculateHeatIndex } from "../utils/heatIndex";
import { calculateWindChill } from "../utils/windChill";
import { calculateComfortScore } from "./scoring.service";

export async function evaluateWeather(
  lat: number,
  lon: number,
  activity: string
) {
  const weather = await getWeather(
    lat,
    lon
  );

  const heatIndex =
    calculateHeatIndex(
      weather.temperature_2m,
      weather.relative_humidity_2m
    );

  const windChill =
    calculateWindChill(
      weather.temperature_2m,
      weather.wind_speed_10m
    );

  const comfortScore =
    calculateComfortScore({
      activity,
      temp: weather.temperature_2m,
      humidity:
        weather.relative_humidity_2m,
      wind:
        weather.wind_speed_10m
    });

  return {
    activity,
    temperature:
      weather.temperature_2m,
    humidity:
      weather.relative_humidity_2m,
    windSpeed:
      weather.wind_speed_10m,
    heatIndex,
    windChill,
    comfortScore,
    verdict:
      comfortScore >= 80
        ? "EXCELLENT"
        : comfortScore >= 60
        ? "GOOD"
        : comfortScore >= 40
        ? "MODERATE"
        : "POOR"
  };
}