import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED" } }, { status: 401 });
  }

  try {
    const notes = await prisma.userNote.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json({ data: notes });
  } catch {
    return NextResponse.json({ data: [] });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED" } }, { status: 401 });
  }

  try {
    const { entityType, entityId, title, content, isPublic } = await request.json();
    if (!entityType || !entityId || !content) {
      return NextResponse.json({ error: { code: "VALIDATION_ERROR" } }, { status: 400 });
    }

    const note = await prisma.userNote.create({
      data: {
        userId: session.user.id,
        entityType,
        entityId,
        title: title ?? "",
        content,
        isPublic: isPublic ?? false,
      },
    });
    return NextResponse.json({ data: note });
  } catch {
    return NextResponse.json({ error: { code: "INTERNAL_ERROR" } }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED" } }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    await prisma.userNote.deleteMany({
      where: { id, userId: session.user.id },
    });
    return NextResponse.json({ data: { success: true } });
  } catch {
    return NextResponse.json({ error: { code: "INTERNAL_ERROR" } }, { status: 500 });
  }
}
