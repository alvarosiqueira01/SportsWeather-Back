import { Router } from "express";

import { evaluate }
from "../controllers/weather.controller";

const router = Router();

router.get("/evaluate", evaluate);

export default router;