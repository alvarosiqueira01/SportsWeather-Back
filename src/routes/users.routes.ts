import { authMiddleware } from "../middlewares/auth.middleware";
import router from "./weather.routes";
import { Request, Response } from "express";

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

export function profile(
 req: Request,
 res: Response
) {

 return res.json({
   id: "mock-id",
   email:
   "athlete@test.com"
 });
}

export function updatePreferences(
 req: Request,
 res: Response
) {

 return res.json({
   message:
   "Preferences saved (mock)"
 });
}

export default router;