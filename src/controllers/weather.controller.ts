import { Request, Response } from "express";
import { evaluateWeather, evaluateRoute } from "../services/weather.service";
import { calculateComfortScore } from "../services/scoring.service";
import { calculateHeatIndex } from "../utils/heatIndex";
import { calculateWindChill } from "../utils/windChill";
import type { WeatherEvaluationDTO } from "../dtos/weather.dto";

function getVerdict(score: number): WeatherEvaluationDTO["verdict"] {
  if (score >= 80) return "EXCELLENT";
  if (score >= 60) return "GOOD";
  if (score >= 40) return "MODERATE";
  return "POOR";
}

export async function evaluate(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.userId;

    const { latitude, longitude, activity } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    const raw = await evaluateWeather(
      Number(latitude),
      Number(longitude),
      String(activity),
      userId
    );

    const temp = raw.temperature_2m ?? raw.temperature;
    const humidity = raw.relative_humidity_2m ?? raw.humidity;
    const wind = raw.wind_speed_10m ?? raw.windSpeed;

    const heatIndex = calculateHeatIndex(temp, humidity);
    const windChill = calculateWindChill(temp, wind);
    const comfortScore = calculateComfortScore({
      activity: String(activity),
      temp,
      humidity,
      wind,
    });

    const dto: WeatherEvaluationDTO = {
      activity: String(activity),
      temperature: temp,
      humidity,
      windSpeed: wind,
      heatIndex,
      windChill,
      comfortScore,
      verdict: getVerdict(comfortScore),
    };

    return res.json(dto);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function evaluateRouteHandler(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.userId;
    const { waypoints, activity } = req.body;

    if (!waypoints || !Array.isArray(waypoints) || waypoints.length < 2) {
      return res.status(400).json({ error: "waypoints must be an array with at least 2 [lon, lat] pairs" });
    }

    if (!activity) {
      return res.status(400).json({ error: "activity is required" });
    }

    const result = await evaluateRoute(waypoints, activity, userId);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
