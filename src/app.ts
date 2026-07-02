import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import errorHandler from "./middlewares/errorHandler.middleware";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

import authRoutes from "./routes/auth.routes";
import courseRoutes from "./routes/course.routes";
import sectionRoutes from "./routes/section.routes";
import lessonRoutes from "./routes/lesson.routes";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/sections", sectionRoutes);
app.use("/api/v1/lessons", lessonRoutes);

app.use(errorHandler);

export default app;
