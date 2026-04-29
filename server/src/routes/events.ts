import { Router, Request, Response } from "express";
import { prisma } from "../prisma";

export const eventsRouter = Router();

eventsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { year, type } = req.query;
    const where: any = {};

    if (year) {
      const startOfYear = new Date(`${year}-01-01T00:00:00Z`);
      const endOfYear = new Date(`${parseInt(year as string) + 1}-01-01T00:00:00Z`);
      where.startDate = { gte: startOfYear, lt: endOfYear };
    }
    if (type) where.eventType = type;

    const events = await prisma.celestialEvent.findMany({
      where,
      orderBy: { startDate: "asc" },
    });
    res.json({ data: events });
  } catch {
    res.status(500).json({ error: "获取天文事件列表失败" });
  }
});

eventsRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const event = await prisma.celestialEvent.findUnique({ where: { id: req.params.id } });
    if (!event) return res.status(404).json({ error: "事件不存在" });
    res.json({ data: event });
  } catch {
    res.status(500).json({ error: "获取事件详情失败" });
  }
});
