import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { saveFavoriteLocationSchema } from "../schemas/location.schema";
import { saveFavorite, history, getFavorites } from "../controllers/location.controller";

const router = Router();

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
