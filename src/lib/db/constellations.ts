import { prisma } from "@/lib/prisma";

export async function getConstellations() {
  return prisma.constellation.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getConstellationByAbbreviation(abbreviation: string) {
  return prisma.constellation.findUnique({
    where: { abbreviation: abbreviation.toUpperCase() },
    include: {
      stars: {
        orderBy: { apparentMagnitude: "asc" },
        take: 50,
      },
    },
  });
}
