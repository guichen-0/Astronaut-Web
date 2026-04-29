import { prisma } from "@/lib/prisma";

export async function getArticles(params?: {
  page?: number;
  pageSize?: number;
  categoryId?: string;
}) {
  const { page = 1, pageSize = 20, categoryId } = params ?? {};
  const where = categoryId ? { categoryId } : {};

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { category: true },
    }),
    prisma.article.count({ where }),
  ]);

  return { articles, total, page, pageSize };
}

export async function getArticleBySlug(slug: string) {
  return prisma.article.findUnique({
    where: { slug },
    include: { category: true },
  });
}

export async function getFeaturedArticles() {
  return prisma.article.findMany({
    where: { isFeatured: true },
    orderBy: { publishedAt: "desc" },
    take: 6,
    include: { category: true },
  });
}
