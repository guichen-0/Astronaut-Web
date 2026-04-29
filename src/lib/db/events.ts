import { prisma } from "@/lib/prisma";

export async function getUpcomingEvents(limit = 10) {
  return prisma.celestialEvent.findMany({
    where: {
      startDate: { gte: new Date() },
    },
    orderBy: { startDate: "asc" },
    take: limit,
  });
}

export async function getEventsByDateRange(start: Date, end: Date) {
  return prisma.celestialEvent.findMany({
    where: {
      startDate: { lte: end },
      endDate: { gte: start },
    },
    orderBy: { startDate: "asc" },
  });
}

export async function getEventById(id: string) {
  return prisma.celestialEvent.findUnique({ where: { id } });
}
