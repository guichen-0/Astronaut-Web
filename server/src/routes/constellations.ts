import { Router, Request, Response } from "express";
import { prisma } from "../prisma";

export const constellationsRouter = Router();

constellationsRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const constellations = await prisma.constellation.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { stars: true } } },
    });
    res.json({ data: constellations });
  } catch {
    res.status(500).json({ error: "获取星座列表失败" });
  }
});

constellationsRouter.get("/:abbreviation", async (req: Request, res: Response) => {
  try {
    const constellation = await prisma.constellation.findUnique({
      where: { abbreviation: req.params.abbreviation.toUpperCase() },
      include: {
        stars: { orderBy: { apparentMagnitude: "asc" }, take: 30 },
      },
    });
    if (!constellation) return res.status(404).json({ error: "星座不存在" });
    res.json({ data: constellation });
  } catch {
    res.status(500).json({ error: "获取星座详情失败" });
  }
});
