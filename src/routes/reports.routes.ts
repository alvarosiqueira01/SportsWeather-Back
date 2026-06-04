import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { generateReport, downloadReport } from "../controllers/report.controller";

const router = Router();

router.post(
  "/generate",
  authMiddleware,
  generateReport
);

router.get(
  "/download",
  authMiddleware,
  downloadReport
);

export default router;
