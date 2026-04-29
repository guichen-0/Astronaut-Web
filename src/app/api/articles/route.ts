import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 50);

  try {
    const where: Record<string, unknown> = {};
    if (category) where.category = { slug: category };

    const articles = await prisma.article.findMany({
      where,
      include: { category: true },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ data: articles });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
