import { Router, Request, Response } from "express";
import { prisma } from "../prisma";
import { authenticate } from "../middleware/auth";

export const favoritesRouter = Router();

// Get user's favorites
favoritesRouter.get("/", authenticate, async (req: Request, res: Response) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: favorites });
  } catch {
    res.status(500).json({ error: "获取收藏列表失败" });
  }
});

// Add favorite
favoritesRouter.post("/", authenticate, async (req: Request, res: Response) => {
  try {
    const { entityType, entityId } = req.body;
    if (!entityType || !entityId) {
      return res.status(400).json({ error: "缺少必要参数" });
    }

    const favorite = await prisma.favorite.create({
      data: { userId: req.user!.userId, entityType, entityId },
    });
    res.status(201).json({ data: favorite });
  } catch (e: any) {
    if (e.code === "P2002") {
      return res.status(409).json({ error: "已收藏" });
    }
    res.status(500).json({ error: "收藏失败" });
  }
});

// Remove favorite
favoritesRouter.delete("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const fav = await prisma.favorite.findUnique({ where: { id: req.params.id } });
    if (!fav) return res.status(404).json({ error: "收藏不存在" });
    if (fav.userId !== req.user!.userId) {
      return res.status(403).json({ error: "无权操作" });
    }
    await prisma.favorite.delete({ where: { id: req.params.id } });
    res.json({ data: { id: req.params.id } });
  } catch {
    res.status(500).json({ error: "取消收藏失败" });
  }
});
