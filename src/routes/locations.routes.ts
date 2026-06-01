import router from "./weather.routes";
import { authMiddleware } from "../middlewares/auth.middleware";
import { Request, Response } from "express";

router.post(
 "/favorites",
 authMiddleware,
 saveFavorite
);

router.get(
 "/history",
 authMiddleware,
 history
);

export function saveFavorite(
 req: Request,
 res: Response
){
 return res.json({
   message:
   "Favorite location stored (mock)"
 });
}

export function history(
 req: Request,
 res: Response
){
 return res.json([]);
}

export default router;