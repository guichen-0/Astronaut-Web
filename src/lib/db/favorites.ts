import { prisma } from "@/lib/prisma";

export async function getUserFavorites(userId: string) {
  return prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function addFavorite(userId: string, entityType: string, entityId: string) {
  return prisma.favorite.create({
    data: { userId, entityType, entityId },
  });
}

export async function removeFavorite(userId: string, entityType: string, entityId: string) {
  await prisma.favorite.deleteMany({
    where: { userId, entityType, entityId },
  });
}

export async function isFavorited(userId: string, entityType: string, entityId: string) {
  const fav = await prisma.favorite.findUnique({
    where: { userId_entityType_entityId: { userId, entityType, entityId } },
  });
  return !!fav;
}
