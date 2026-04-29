import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(request: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "未授权" }, { status: 403 });
  }

  try {
    const { userId, role } = await request.json();
    if (!["USER", "ADMIN"].includes(role)) {
      return NextResponse.json({ error: "无效角色" }, { status: 400 });
    }
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}
