import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import 'dotenv/config';

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/users.routes";
import locationRoutes from "./routes/locations.routes";
import weatherRoutes from "./routes/weather.routes";
import reportRoutes from "./routes/reports.routes";

import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/reports", reportRoutes);

app.get("/health", (_, res) => {
  res.status(200).json({
    status: "UP",
    timestamp: new Date().toISOString()
  });
});

app.use(errorHandler);

export default app;