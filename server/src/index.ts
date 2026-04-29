import "dotenv/config";
import express from "express";
import cors from "cors";
import { config } from "./config";
import { planetsRouter } from "./routes/planets";
import { starsRouter } from "./routes/stars";
import { constellationsRouter } from "./routes/constellations";
import { eventsRouter } from "./routes/events";
import { articlesRouter } from "./routes/articles";
import { searchRouter } from "./routes/search";
import { starmapRouter } from "./routes/starmap";
import { authRouter } from "./routes/auth";
import { favoritesRouter } from "./routes/favorites";
import { notesRouter } from "./routes/notes";
import { adminRouter } from "./routes/admin";

const app = express();

app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());

// Public routes
app.use("/api/auth", authRouter);
app.use("/api/planets", planetsRouter);
app.use("/api/stars", starsRouter);
app.use("/api/constellations", constellationsRouter);
app.use("/api/events", eventsRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/search", searchRouter);
app.use("/api/starmap", starmapRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/notes", notesRouter);
app.use("/api/admin", adminRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(config.port, () => {
  console.log(`🚀 天文后端服务启动: http://localhost:${config.port}`);
  console.log(`📡 CORS 允许: ${config.corsOrigin}`);
});
