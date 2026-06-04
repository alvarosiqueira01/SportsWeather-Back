import { Router } from "express";

import { evaluate, evaluateRouteHandler }
from "../controllers/weather.controller";

const router = Router();

router.get("/evaluate", evaluate);
router.post("/evaluate-route", evaluateRouteHandler);

export default router;