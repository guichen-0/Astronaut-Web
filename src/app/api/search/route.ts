import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const type = searchParams.get("type") ?? "all";
  const mode = searchParams.get("mode"); // "suggest" returns fewer results

  if (!q) {
    return NextResponse.json({ data: [] });
  }

  const isSuggest = mode === "suggest";
  const take = isSuggest ? 3 : 5;

  try {
    const results: { id: string; entityType: string; title: string; description: string; slug?: string; rank: number }[] = [];

    if (type === "all" || type === "planet") {
      const planets = await prisma.planet.findMany({
        where: { OR: [{ name: { contains: q } }, { englishName: { contains: q } }] },
        take,
      });
      planets.forEach((p) =>
        results.push({ id: p.id, entityType: "planet", title: p.name, description: p.englishName, slug: p.slug, rank: 1 })
      );
    }

    if (type === "all" || type === "star") {
      const stars = await prisma.star.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { bayerDesignation: { contains: q } },
          ],
        },
        take,
      });
      stars.forEach((s) =>
        results.push({ id: s.id, entityType: "star", title: s.name ?? s.bayerDesignation ?? `HIP ${s.hipId}`, description: `视星等 ${s.apparentMagnitude} · ${s.spectralType ?? "未知"}型`, slug: s.id, rank: 2 })
      );
    }

    if (type === "all" || type === "constellation") {
      const constellations = await prisma.constellation.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { abbreviation: { contains: q } },
            { meaning: { contains: q } },
          ],
        },
        take,
      });
      constellations.forEach((c) =>
        results.push({ id: c.id, entityType: "constellation", title: c.name, description: `${c.abbreviation} · ${c.meaning}`, slug: c.abbreviation.toLowerCase(), rank: 3 })
      );
    }

    if (type === "all" || type === "article") {
      const articles = await prisma.article.findMany({
        where: { title: { contains: q } },
        take,
        include: { category: true },
      });
      articles.forEach((a) =>
        results.push({
          id: a.id,
          entityType: "article",
          title: a.title,
          description: a.summary ?? a.sourceName,
          slug: a.slug,
          rank: 4,
        })
      );
    }

    return NextResponse.json({ data: results.sort((a, b) => a.rank - b.rank) });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
