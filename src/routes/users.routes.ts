import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { profile, updatePreferences } from "../controllers/user.controller";

const router = Router();

router.get(
  "/profile",
  authMiddleware,
  profile
);

router.put(
  "/preferences",
  authMiddleware,
  updatePreferences
);

export default router;
