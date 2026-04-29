import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { crawlSource } from "@/crawler/index";
import { runAllSources, startScheduler, stopScheduler, getSchedulerStatus } from "@/crawler/scheduler";

// Ensure scheduler is started when the API is first loaded
let initialized = false;
function ensureScheduler() {
  if (!initialized) {
    startScheduler();
    initialized = true;
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED" } }, { status: 401 });
  }

  ensureScheduler();

  try {
    const sources = await prisma.crawlSource.findMany({
      orderBy: { name: "asc" },
    });
    const status = getSchedulerStatus();

    return NextResponse.json({
      data: { sources, scheduler: status },
    });
  } catch {
    return NextResponse.json({ data: { sources: [], scheduler: getSchedulerStatus() } });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED" } }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, sourceId } = body;

    switch (action) {
      case "crawl-all":
        ensureScheduler();
        const report = await runAllSources();
        return NextResponse.json({ data: report });

      case "crawl-one":
        if (!sourceId) {
          return NextResponse.json({ error: { code: "VALIDATION_ERROR" } }, { status: 400 });
        }
        const result = await crawlSource(sourceId);
        return NextResponse.json({ data: result });

      case "start-scheduler":
        startScheduler();
        return NextResponse.json({ data: { status: "started" } });

      case "stop-scheduler":
        stopScheduler();
        return NextResponse.json({ data: { status: "stopped" } });

      default:
        return NextResponse.json({ error: { code: "INVALID_ACTION" } }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: { code: "INTERNAL_ERROR" } }, { status: 500 });
  }
}
