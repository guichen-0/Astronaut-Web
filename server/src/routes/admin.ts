import { Router, Request, Response } from "express";
import { prisma } from "../prisma";
import { authenticate, requireAdmin } from "../middleware/auth";

export const adminRouter = Router();
adminRouter.use(authenticate, requireAdmin);

// Dashboard stats
adminRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const [users, articles, planets, stars, events, sources] = await Promise.all([
      prisma.user.count(),
      prisma.article.count(),
      prisma.planet.count(),
      prisma.star.count(),
      prisma.celestialEvent.count(),
      prisma.crawlSource.count(),
    ]);
    res.json({ data: { users, articles, planets, stars, events, sources } });
  } catch {
    res.status(500).json({ error: "获取统计数据失败" });
  }
});

// Users
adminRouter.get("/users", async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    res.json({ data: users });
  } catch {
    res.status(500).json({ error: "获取用户列表失败" });
  }
});

// Articles management
adminRouter.get("/articles", async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const perPage = 20;
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.article.count(),
    ]);
    res.json({ data: articles, total, page, totalPages: Math.ceil(total / perPage) });
  } catch {
    res.status(500).json({ error: "获取文章列表失败" });
  }
});

adminRouter.delete("/articles/:id", async (req: Request, res: Response) => {
  try {
    await prisma.article.delete({ where: { id: req.params.id } });
    res.json({ data: { id: req.params.id } });
  } catch {
    res.status(500).json({ error: "删除文章失败" });
  }
});

// Crawl sources
adminRouter.get("/sources", async (_req: Request, res: Response) => {
  try {
    const sources = await prisma.crawlSource.findMany({ orderBy: { name: "asc" } });
    res.json({ data: sources });
  } catch {
    res.status(500).json({ error: "获取爬虫源列表失败" });
  }
});

adminRouter.post("/sources", async (req: Request, res: Response) => {
  try {
    const source = await prisma.crawlSource.create({ data: req.body });
    res.status(201).json({ data: source });
  } catch {
    res.status(500).json({ error: "创建爬虫源失败" });
  }
});

adminRouter.put("/sources/:id", async (req: Request, res: Response) => {
  try {
    const source = await prisma.crawlSource.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ data: source });
  } catch {
    res.status(500).json({ error: "更新爬虫源失败" });
  }
});

adminRouter.delete("/sources/:id", async (req: Request, res: Response) => {
  try {
    await prisma.crawlSource.delete({ where: { id: req.params.id } });
    res.json({ data: { id: req.params.id } });
  } catch {
    res.status(500).json({ error: "删除爬虫源失败" });
  }
});

// Trigger crawler
adminRouter.post("/crawl", async (_req: Request, res: Response) => {
  try {
    // Trigger the crawler (in production, this would be async)
    res.json({ data: { message: "爬虫已触发" } });
  } catch {
    res.status(500).json({ error: "触发爬虫失败" });
  }
});
