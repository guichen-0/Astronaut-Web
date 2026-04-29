import { Router, Request, Response } from "express";
import { prisma } from "../prisma";

export const searchRouter = Router();

searchRouter.get("/", async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string || "").trim();
    if (!q) return res.json({ data: [] });

    const [planets, stars, constellations, articles] = await Promise.all([
      prisma.planet.findMany({
        where: { OR: [{ name: { contains: q } }, { englishName: { contains: q } }] },
        take: 5,
      }),
      prisma.star.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { bayerDesignation: { contains: q } },
          ],
        },
        take: 5,
      }),
      prisma.constellation.findMany({
        where: { OR: [{ name: { contains: q } }, { abbreviation: { contains: q.toUpperCase() } }] },
        take: 5,
      }),
      prisma.article.findMany({
        where: { OR: [{ title: { contains: q } }, { summary: { contains: q } }] },
        take: 5,
      }),
    ]);

    res.json({ data: { planets, stars, constellations, articles } });
  } catch {
    res.status(500).json({ error: "搜索失败" });
  }
});
