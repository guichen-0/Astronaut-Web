import { Router, Request, Response } from "express";
import { prisma } from "../prisma";

export const starsRouter = Router();

starsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { magnitudeLt, constellation, limit } = req.query;
    const where: any = {};
    if (magnitudeLt) where.apparentMagnitude = { lte: parseFloat(magnitudeLt as string) };
    if (constellation) where.constellationAbbreviation = constellation as string;

    const stars = await prisma.star.findMany({
      where,
      orderBy: { apparentMagnitude: "asc" },
      take: limit ? parseInt(limit as string) : 100,
    });
    res.json({ data: stars });
  } catch {
    res.status(500).json({ error: "获取恒星列表失败" });
  }
});

starsRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const star = await prisma.star.findUnique({
      where: { id: req.params.id },
      include: { constellation: true },
    });
    if (!star) return res.status(404).json({ error: "恒星不存在" });
    res.json({ data: star });
  } catch {
    res.status(500).json({ error: "获取恒星详情失败" });
  }
});

starsRouter.get("/visibility/calculate", async (req: Request, res: Response) => {
  try {
    const { lat, lng, date } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ error: "需要经纬度参数" });
    }
    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const now = date ? new Date(date as string) : new Date();

    const stars = await prisma.star.findMany({
      where: { apparentMagnitude: { lte: 6 } },
      orderBy: { apparentMagnitude: "asc" },
      take: 50,
    });

    const results = stars.map((star) => {
      const decRad = (star.declination * Math.PI) / 180;
      const latRad = (latitude * Math.PI) / 180;
      const hourAngle = ((now.getUTCHours() + now.getUTCMinutes() / 60) * 15 - star.rightAscension * 15 + longitude) * Math.PI / 180;
      const altitude = Math.asin(Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(hourAngle));
      return {
        id: star.id,
        name: star.name,
        bayerDesignation: star.bayerDesignation,
        apparentMagnitude: star.apparentMagnitude,
        altitude: (altitude * 180) / Math.PI,
        visible: altitude > 0,
      };
    });

    res.json({ data: results });
  } catch {
    res.status(500).json({ error: "计算可见性失败" });
  }
});
