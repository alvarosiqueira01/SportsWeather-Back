import router from "./weather.routes";
import { authMiddleware } from "../middlewares/auth.middleware";
import { generateReport, downloadReport } from "../controllers/report.controller";

router.post(
 "/generate",
 generateReport
);

router.get(
 "/download",
 downloadReport
);


export default router;