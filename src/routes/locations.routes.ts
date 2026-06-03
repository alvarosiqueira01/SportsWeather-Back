import router from "./weather.routes";
import { authMiddleware } from "../middlewares/auth.middleware";
import { Request, Response } from "express";
import { validate } from "../middlewares/validation.middleware";
import { saveFavoriteLocationSchema } from "../schemas/location.schema";
import { saveFavorite, history } from "../controllers/location.controller";
import { getFavorites } from "../controllers/location.controller";

router.get(
  "/favorites",
  authMiddleware,
  getFavorites
);

router.post(
 "/favorites",
 validate(saveFavoriteLocationSchema),
 authMiddleware,
 saveFavorite
);

router.get(
 "/history",
 authMiddleware,
 history
);


export default router;