import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const upcoming = searchParams.get("upcoming") === "true";

  try {
    const where: Record<string, unknown> = {};
    if (type) where.eventType = type;
    if (upcoming) where.startDate = { gte: new Date() };

    const events = await prisma.celestialEvent.findMany({
      where,
      orderBy: { startDate: "asc" },
    });

    return NextResponse.json({ data: events });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
