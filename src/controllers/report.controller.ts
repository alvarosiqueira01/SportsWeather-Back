import { Request, Response } from "express";
import GeneratedReport from "../models/GeneratedReport";

// Registra ou dispara o fluxo de criação do relatório no S3
export async function generateReport(req: Request, res: Response) {
  try {
    const username = (req as any).user.username;
    const userId = (req as any).user._id;
    const { type, periodStart, periodEnd } = req.body;

    // Exemplo de chave estruturada simulando o ano/mês no S3
    const currentYear = new Date().getFullYear();
    const s3Key = `reports/${currentYear}/${type}-${username}-${Date.now()}.pdf`;

    const report = await GeneratedReport.create({
      userId,
      type,
      s3Key,
      metadata: {
        periodStart: new Date(periodStart),
        periodEnd: new Date(periodEnd)
      }
    });

    return res.status(201).json({
      message: "Report metadata registered successfully. File generation triggered.",
      report
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

// Recupera a referência do relatório para o download
export async function downloadReport(req: Request, res: Response) {
  try {
    const username = (req as any).user.username;
    const { reportId } = req.params;

    const report = await GeneratedReport.findOne({ _id: reportId, username });

    if (!report) {
      return res.status(404).json({ error: "Report not found or access denied" });
    }

    // Aqui você integraria com o AWS SDK (S3) para obter uma Presigned URL:
    // const downloadUrl = await s3Service.getPresignedUrl(report.s3Key);

    return res.json({
      reportId: report._id,
      s3Key: report.s3Key,
      type: report.type,
      // URL fictícia simulando onde o arquivo estaria acessível temporariamente
      downloadUrl: `https://my-weather-bucket.s3.amazonaws.com/${report.s3Key}?token=mock_presigned_url`
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}