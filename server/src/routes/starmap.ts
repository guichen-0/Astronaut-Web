import { Router, Request, Response } from "express";
import { prisma } from "../prisma";
import linesData from "../../../src/data/constellation-lines.json";

export const starmapRouter = Router();

starmapRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const stars = await prisma.star.findMany({
      select: {
        id: true,
        name: true,
        bayerDesignation: true,
        rightAscension: true,
        declination: true,
        apparentMagnitude: true,
        colorIndexBv: true,
        x: true,
        y: true,
        z: true,
      },
      where: { apparentMagnitude: { lte: 6.5 } },
      orderBy: { apparentMagnitude: "asc" },
    });
    res.json({ data: stars });
  } catch {
    res.status(500).json({ error: "获取星图数据失败" });
  }
});

starmapRouter.get("/lines", async (_req: Request, res: Response) => {
  try {
    const allStars = await prisma.star.findMany({
      select: { name: true, bayerDesignation: true, x: true, y: true, z: true },
    });
    const starMap = new Map(allStars.filter(s => s.name).map(s => [s.name!, s]));
    const bayerMap = new Map(allStars.filter(s => s.bayerDesignation).map(s => [s.bayerDesignation!, s]));

    const result: { positions: number[] }[] = [];

    for (const constellation of linesData as typeof linesData) {
      const positions: number[] = [];
      for (const line of constellation.lines) {
        const star = starMap.get(line.fromName) || bayerMap.get(line.fromName);
        const star2 = starMap.get(line.toName) || bayerMap.get(line.toName);
        if (star && star2) {
          positions.push(star.x, star.y, star.z, star2.x, star2.y, star2.z);
        }
      }
      if (positions.length > 0) {
        result.push({ positions });
      }
    }

    res.json({ data: result });
  } catch {
    res.status(500).json({ error: "获取星座连线失败" });
  }
});
