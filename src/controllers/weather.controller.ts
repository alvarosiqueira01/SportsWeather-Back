import { Request, Response } from "express";

import { evaluateWeather }
from "../services/weather.service";

export async function evaluate(
  req: Request,
  res: Response
) {

  const {
    latitude,
    longitude,
    activity
  } = req.query;

  const result =
    await evaluateWeather(
      Number(latitude),
      Number(longitude),
      String(activity)
    );

  return res.json(result);
}