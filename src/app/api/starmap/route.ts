import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const stars = await prisma.star.findMany({
      select: {
        id: true,
        name: true,
        bayerDesignation: true,
        rightAscension: true,
        declination: true,
        apparentMagnitude: true,
        colorIndexBv: true,
        x: true,
        y: true,
        z: true,
      },
      where: { apparentMagnitude: { lte: 6.5 } },
      orderBy: { apparentMagnitude: "asc" },
    });

    return NextResponse.json({ data: stars });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
