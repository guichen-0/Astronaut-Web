import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const stars = await prisma.star.findMany({
      where: { name: { not: null } },
      select: {
        id: true,
        name: true,
        rightAscension: true,
        declination: true,
        apparentMagnitude: true,
      },
      orderBy: { apparentMagnitude: "asc" },
      take: 200,
    });
    return NextResponse.json({ data: stars });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
