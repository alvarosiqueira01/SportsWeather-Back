import { getWeather }
from "./openmeteo.service";

import { WeatherRepository }
from "../repositories/weather.repository";

import { calculateComfortScore } from "./scoring.service";
import { calculateHeatIndex } from "../utils/heatIndex";
import { calculateWindChill } from "../utils/windChill";
import { haversineDistance } from "../utils/haversine";
import type { RouteEvaluationDTO, RouteSegment, CriticalSegment } from "../dtos/route.dto";

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

function getVerdict(score: number): RouteSegment["verdict"] {
  if (score >= 80) return "EXCELLENT";
  if (score >= 60) return "GOOD";
  if (score >= 40) return "MODERATE";
  return "POOR";
}

function sampleWaypoints(waypoints: [number, number][], maxSamples: number): number[] {
  if (waypoints.length <= maxSamples) {
    return waypoints.map((_, i) => i);
  }
  const indices: number[] = [];
  const step = (waypoints.length - 1) / (maxSamples - 1);
  for (let i = 0; i < maxSamples; i++) {
    indices.push(Math.round(i * step));
  }
  return indices;
}

async function evaluateWaypoint(
  lat: number,
  lon: number,
  activity: string
): Promise<Omit<RouteSegment, "index">> {
  const raw = await getWeather(lat, lon);

  const temp = raw.temperature_2m ?? raw.temperature;
  const humidity = raw.relative_humidity_2m ?? raw.humidity;
  const wind = raw.wind_speed_10m ?? raw.windSpeed;

  const heatIndex = calculateHeatIndex(temp, humidity);
  const windChill = calculateWindChill(temp, wind);
  const comfortScore = calculateComfortScore({ activity, temp, humidity, wind });

  return {
    lat,
    lon,
    temperature: temp,
    humidity,
    windSpeed: wind,
    heatIndex,
    windChill,
    comfortScore,
    verdict: getVerdict(comfortScore),
  };
}

function findCriticalSegments(segments: RouteSegment[]): CriticalSegment[] {
  const critical: CriticalSegment[] = [];
  let start: number | null = null;

  for (let i = 0; i < segments.length; i++) {
    const isBad = segments[i].comfortScore < 60;
    if (isBad && start === null) {
      start = i;
    } else if (!isBad && start !== null) {
      const slice = segments.slice(start, i);
      const avgScore = Math.round(slice.reduce((s, seg) => s + seg.comfortScore, 0) / slice.length);
      const fromWaypoint = segments[start].index;
      const toWaypoint = segments[i - 1].index;
      const reasons: string[] = [];
      if (slice.some((s) => s.temperature > 32)) reasons.push("Temperatura acima de 32°C");
      if (slice.some((s) => s.humidity > 80)) reasons.push("Umidade acima de 80%");
      if (slice.some((s) => s.windSpeed > 30)) reasons.push("Vento acima de 30 km/h");
      critical.push({
        fromIndex: fromWaypoint,
        toIndex: toWaypoint,
        reason: reasons.join("; ") || "Condições desfavoráveis",
        avgScore,
      });
      start = null;
    }
  }

  if (start !== null) {
    const slice = segments.slice(start);
    const avgScore = Math.round(slice.reduce((s, seg) => s + seg.comfortScore, 0) / slice.length);
    const fromWaypoint = segments[start].index;
    const toWaypoint = segments[segments.length - 1].index;
    const reasons: string[] = [];
    if (slice.some((s) => s.temperature > 32)) reasons.push("Temperatura acima de 32°C");
    if (slice.some((s) => s.humidity > 80)) reasons.push("Umidade acima de 80%");
    if (slice.some((s) => s.windSpeed > 30)) reasons.push("Vento acima de 30 km/h");
    critical.push({
      fromIndex: fromWaypoint,
      toIndex: toWaypoint,
      reason: reasons.join("; ") || "Condições desfavoráveis",
      avgScore,
    });
  }

  return critical;
}

export async function evaluateRoute(
  waypoints: [number, number][],
  activity: string,
  userId?: string
): Promise<RouteEvaluationDTO> {
  const sampleIndices = sampleWaypoints(waypoints, 10);
  const results = await Promise.all(
    sampleIndices.map(async (i) => {
      const [lon, lat] = waypoints[i];
      const evalResult = await evaluateWaypoint(lat, lon, activity);
      return { index: i, ...evalResult } as RouteSegment;
    })
  );

  const overallScore = Math.round(
    results.reduce((sum, s) => sum + s.comfortScore, 0) / results.length
  );

  const criticalSegments = findCriticalSegments(results);

  let totalDistance = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const [lon1, lat1] = waypoints[i];
    const [lon2, lat2] = waypoints[i + 1];
    totalDistance += haversineDistance(lat1, lon1, lat2, lon2);
  }

  return {
    activity,
    totalDistance: Math.round(totalDistance * 10) / 10,
    overallScore,
    overallVerdict: getVerdict(overallScore),
    segments: results,
    criticalSegments,
  };
}