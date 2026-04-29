import { Router, Request, Response } from "express";
import { prisma } from "../prisma";

export const articlesRouter = Router();

articlesRouter.get("/", async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const perPage = Math.min(50, Math.max(1, parseInt(req.query.perPage as string) || 10));
    const slug = req.query.slug as string;
    const categorySlug = req.query.categorySlug as string;

    const where: any = {};
    if (slug) where.slug = slug;
    if (categorySlug) where.category = { slug: categorySlug };

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: { category: true },
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.article.count({ where }),
    ]);

    res.json({ data: articles, total, page, totalPages: Math.ceil(total / perPage) });
  } catch {
    res.status(500).json({ error: "获取文章列表失败" });
  }
});

articlesRouter.get("/:slug", async (req: Request, res: Response) => {
  try {
    const article = await prisma.article.findUnique({
      where: { slug: req.params.slug },
      include: { category: true },
    });
    if (!article) return res.status(404).json({ error: "文章不存在" });
    res.json({ data: article });
  } catch {
    res.status(500).json({ error: "获取文章详情失败" });
  }
});
