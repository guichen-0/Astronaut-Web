import { Router, Request, Response } from "express";
import { prisma } from "../prisma";
import { authenticate } from "../middleware/auth";

export const notesRouter = Router();

notesRouter.get("/", authenticate, async (req: Request, res: Response) => {
  try {
    const { entityType, entityId } = req.query;
    const where: any = { userId: req.user!.userId };
    if (entityType) where.entityType = entityType as string;
    if (entityId) where.entityId = entityId as string;

    const notes = await prisma.userNote.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });
    res.json({ data: notes });
  } catch {
    res.status(500).json({ error: "获取笔记列表失败" });
  }
});

notesRouter.post("/", authenticate, async (req: Request, res: Response) => {
  try {
    const { entityType, entityId, title, content, isPublic } = req.body;
    if (!entityType || !entityId || !content) {
      return res.status(400).json({ error: "缺少必要参数" });
    }

    const note = await prisma.userNote.create({
      data: {
        userId: req.user!.userId,
        entityType,
        entityId,
        title: title || "",
        content,
        isPublic: isPublic || false,
      },
    });
    res.status(201).json({ data: note });
  } catch {
    res.status(500).json({ error: "创建笔记失败" });
  }
});

notesRouter.put("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const note = await prisma.userNote.findUnique({ where: { id: req.params.id } });
    if (!note) return res.status(404).json({ error: "笔记不存在" });
    if (note.userId !== req.user!.userId) return res.status(403).json({ error: "无权操作" });

    const { title, content, isPublic } = req.body;
    const updated = await prisma.userNote.update({
      where: { id: req.params.id },
      data: { title: title ?? note.title, content: content ?? note.content, isPublic: isPublic ?? note.isPublic },
    });
    res.json({ data: updated });
  } catch {
    res.status(500).json({ error: "更新笔记失败" });
  }
});

notesRouter.delete("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const note = await prisma.userNote.findUnique({ where: { id: req.params.id } });
    if (!note) return res.status(404).json({ error: "笔记不存在" });
    if (note.userId !== req.user!.userId) return res.status(403).json({ error: "无权操作" });
    await prisma.userNote.delete({ where: { id: req.params.id } });
    res.json({ data: { id: req.params.id } });
  } catch {
    res.status(500).json({ error: "删除笔记失败" });
  }
});
