import { z } from "zod";

export const weatherQuerySchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  activity: z.enum([
    "running",
    "cycling",
    "calisthenics",
    "surf",
    "kitesurf"
  ])
});

export default weatherQuerySchema