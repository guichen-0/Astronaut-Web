import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import linesData from "@/data/constellation-lines.json";

export async function GET() {
  try {
    const allStars = await prisma.star.findMany({
      select: { name: true, x: true, y: true, z: true },
    });
    const starMap = new Map(allStars.filter(s => s.name).map(s => [s.name!, s]));

    const result: { positions: number[] }[] = [];

    for (const constellation of linesData as typeof linesData) {
      const positions: number[] = [];
      for (const line of constellation.lines) {
        const from = starMap.get(line.fromName);
        const to = starMap.get(line.toName);
        if (from && to) {
          positions.push(from.x, from.y, from.z, to.x, to.y, to.z);
        }
      }
      if (positions.length > 0) {
        result.push({ positions });
      }
    }

    return NextResponse.json({ data: result });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
