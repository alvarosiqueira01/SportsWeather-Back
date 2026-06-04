import { Request, Response } from "express";
import { evaluateWeather } from "../services/weather.service";
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
