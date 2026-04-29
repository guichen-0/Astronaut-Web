import { NextResponse } from "next/server";
import { getPlanets } from "@/lib/db/planets";

export async function GET() {
  try {
    const planets = await getPlanets();
    return NextResponse.json({ data: planets });
  } catch {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "获取行星数据失败" } },
      { status: 500 }
    );
  }
}
