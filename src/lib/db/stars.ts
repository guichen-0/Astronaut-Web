import { prisma } from "@/lib/prisma";

export async function getStars(params?: {
  magnitudeLimit?: number;
  constellation?: string;
  page?: number;
  pageSize?: number;
}) {
  const { magnitudeLimit, constellation, page = 1, pageSize = 50 } = params ?? {};
  const where: Record<string, unknown> = {};

  if (magnitudeLimit !== undefined) {
    where.apparentMagnitude = { lte: magnitudeLimit };
  }
  if (constellation) {
    where.constellationAbbreviation = constellation;
  }

  const [stars, total] = await Promise.all([
    prisma.star.findMany({
      where,
      orderBy: { apparentMagnitude: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.star.count({ where }),
  ]);

  return { stars, total, page, pageSize };
}

export async function getStarById(id: string) {
  return prisma.star.findUnique({
    where: { id },
    include: { constellation: true },
  });
}
