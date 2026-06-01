import router from "./weather.routes";
import { Request, Response } from "express";

router.post(
 "/generate",
 generateReport
);

router.get(
 "/download",
 downloadReport
);

export function generateReport(
 req: Request,
 res: Response
){
 res.status(501).json({
   message:
   "Report generation not implemented. AWS S3 pending."
 });
}

export function downloadReport(
 req: Request,
 res: Response
){
 res.status(501).json({
   message:
   "Signed URLs unavailable. AWS S3 pending."
 });
}

export default router;