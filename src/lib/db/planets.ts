import { prisma } from "@/lib/prisma";

export async function getPlanets() {
  return prisma.planet.findMany({
    orderBy: { distanceFromSunAu: "asc" },
    include: { _count: { select: { moons: true } } },
  });
}

export async function getPlanetBySlug(slug: string) {
  return prisma.planet.findUnique({
    where: { slug },
    include: { moons: { orderBy: { name: "asc" } } },
  });
}

export async function getPlanetById(id: string) {
  return prisma.planet.findUnique({
    where: { id },
    include: { moons: { orderBy: { name: "asc" } } },
  });
}
