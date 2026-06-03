import { Request, Response } from "express";
import { evaluateWeather } from "../services/weather.service";

export async function evaluate(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.userId; 

    const { latitude, longitude, activity } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    const result = await evaluateWeather(
      Number(latitude),
      Number(longitude),
      String(activity),
      userId 
    );

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}