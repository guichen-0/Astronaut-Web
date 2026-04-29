import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Single star lookup for info panel
    if (id) {
      const star = await prisma.star.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          bayerDesignation: true,
          apparentMagnitude: true,
          absoluteMagnitude: true,
          spectralType: true,
          distanceParsecs: true,
          colorIndexBv: true,
        },
      });
      if (!star) return NextResponse.json({ data: null }, { status: 404 });
      return NextResponse.json({ data: star });
    }

    const stars = await prisma.star.findMany({
      where: { name: { not: null } },
      select: { id: true, name: true, x: true, y: true, z: true },
      orderBy: { apparentMagnitude: "asc" },
    });
    return NextResponse.json({ data: stars });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
