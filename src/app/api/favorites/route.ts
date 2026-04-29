import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 });
  }

  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ data: favorites });
  } catch {
    return NextResponse.json({ data: [] });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 });
  }

  try {
    const { entityType, entityId } = await request.json();
    if (!entityType || !entityId) {
      return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "缺少必要参数" } }, { status: 400 });
    }

    const fav = await prisma.favorite.create({
      data: { userId: session.user.id, entityType, entityId },
    });
    return NextResponse.json({ data: fav });
  } catch {
    return NextResponse.json({ error: { code: "INTERNAL_ERROR", message: "收藏失败" } }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 });
  }

  try {
    const { entityType, entityId } = await request.json();
    await prisma.favorite.deleteMany({
      where: { userId: session.user.id, entityType, entityId },
    });
    return NextResponse.json({ data: { success: true } });
  } catch {
    return NextResponse.json({ error: { code: "INTERNAL_ERROR", message: "取消收藏失败" } }, { status: 500 });
  }
}
