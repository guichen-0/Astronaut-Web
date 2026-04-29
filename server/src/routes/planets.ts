import { Router, Request, Response } from "express";
import { prisma } from "../prisma";

export const planetsRouter = Router();

planetsRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const planets = await prisma.planet.findMany({ orderBy: { distanceFromSunAu: "asc" } });
    res.json({ data: planets });
  } catch {
    res.status(500).json({ error: "获取行星列表失败" });
  }
});

planetsRouter.get("/:slug", async (req: Request, res: Response) => {
  try {
    const planet = await prisma.planet.findUnique({
      where: { slug: req.params.slug },
      include: { moons: { orderBy: { name: "asc" } } },
    });
    if (!planet) return res.status(404).json({ error: "行星不存在" });
    res.json({ data: planet });
  } catch {
    res.status(500).json({ error: "获取行星详情失败" });
  }
});
