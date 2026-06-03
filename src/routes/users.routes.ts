import { authMiddleware } from "../middlewares/auth.middleware";
import router from "./weather.routes";
import { profile, updatePreferences } from "../controllers/user.controller";

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