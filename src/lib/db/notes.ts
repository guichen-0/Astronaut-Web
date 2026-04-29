import { prisma } from "@/lib/prisma";

export async function getUserNotes(userId: string) {
  return prisma.userNote.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getNoteById(id: string) {
  return prisma.userNote.findUnique({ where: { id } });
}

export async function createNote(
  userId: string,
  data: { entityType: string; entityId: string; title?: string; content: string; isPublic?: boolean }
) {
  return prisma.userNote.create({ data: { ...data, userId } });
}

export async function updateNote(id: string, userId: string, data: { title?: string; content?: string; isPublic?: boolean }) {
  return prisma.userNote.update({
    where: { id },
    data,
  });
}

export async function deleteNote(id: string) {
  await prisma.userNote.delete({ where: { id } });
}
