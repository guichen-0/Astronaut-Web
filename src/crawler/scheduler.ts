import * as cron from "node-cron";
import type { ScheduledTask } from "node-cron";
import { prisma } from "@/lib/prisma";
import { crawlSource } from "./index";

let running = false;
let task: ScheduledTask | null = null;
let lastRun: Date | null = null;
let runCount = 0;

/**
 * Start the crawler scheduler.
 * Runs every 30 minutes and crawls all active sources that are due.
 */
export function startScheduler() {
  if (task) {
    console.log("[Scheduler] 调度器已在运行");
    return;
  }

  // Every 30 minutes
  task = cron.schedule("*/30 * * * *", async () => {
    if (running) {
      console.log("[Scheduler] 上次抓取尚未完成，跳过本轮");
      return;
    }
    await runAllSources();
  });

  console.log("[Scheduler] 爬虫调度器已启动 (每30分钟)");
}

export function stopScheduler() {
  if (task) {
    task.stop();
    task = null;
    console.log("[Scheduler] 爬虫调度器已停止");
  }
}

/**
 * Crawl all active sources that are due for a crawl.
 */
export async function runAllSources(): Promise<CrawlReport> {
  running = true;
  lastRun = new Date();
  runCount++;

  const results: SourceResult[] = [];

  try {
    const sources = await prisma.crawlSource.findMany({
      where: { isActive: true },
    });

    console.log(`[Scheduler] 第 ${runCount} 轮：检查 ${sources.length} 个活跃源`);

    for (const source of sources) {
      // Check if source is due for crawling
      if (source.lastCrawledAt) {
        const nextCrawl = new Date(source.lastCrawledAt.getTime() + source.crawlIntervalMinutes * 60 * 1000);
        if (nextCrawl > new Date()) {
          const remaining = Math.round((nextCrawl.getTime() - Date.now()) / 60000);
          console.log(`[Scheduler] ${source.name}: 下次抓取在 ${remaining} 分钟后`);
          continue;
        }
      }

      console.log(`[Scheduler] 开始抓取: ${source.name}`);
      const result = await crawlSource(source.id);
      results.push({ sourceId: source.id, sourceName: source.name, ...result });

      // Wait between sources to be polite
      await sleep(5000);
    }
  } catch (err) {
    console.error("[Scheduler] 调度错误:", err);
  } finally {
    running = false;
  }

  const totalArticles = results.reduce((sum, r) => sum + r.count, 0);
  const totalErrors = results.reduce((sum, r) => sum + r.errors, 0);
  console.log(`[Scheduler] 第 ${runCount} 轮完成: ${totalArticles} 篇文章, ${totalErrors} 个错误`);

  return {
    runAt: lastRun,
    runNumber: runCount,
    totalArticles,
    totalErrors,
    sources: results,
  };
}

export function getSchedulerStatus(): SchedulerStatus {
  return {
    running,
    isActive: task !== null,
    lastRun,
    runCount,
  };
}

interface SourceResult {
  sourceId: string;
  sourceName: string;
  count: number;
  errors: number;
}

export interface CrawlReport {
  runAt: Date;
  runNumber: number;
  totalArticles: number;
  totalErrors: number;
  sources: SourceResult[];
}

interface SchedulerStatus {
  running: boolean;
  isActive: boolean;
  lastRun: Date | null;
  runCount: number;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
