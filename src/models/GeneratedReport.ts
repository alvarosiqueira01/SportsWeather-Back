import { Schema, model, Types } from "mongoose";

const GeneratedReportSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "users",
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ["weekly-report", "monthly-report", "custom-report"]
    },
    s3Key: {
      type: String,
      required: true
    },
    metadata: {
      periodStart: { type: Date, required: true },
      periodEnd: { type: Date, required: true }
    }
  },
  { timestamps: true }
);

export default model("generated_reports", GeneratedReportSchema);