import RobotsParser from "robots-parser";
import { prisma } from "@/lib/prisma";

const USER_AGENT = "AstronomyWebBot/1.0";

export async function isAllowed(url: string, sourceId: string): Promise<boolean> {
  try {
    const source = await prisma.crawlSource.findUnique({ where: { id: sourceId } });
    if (!source) return false;

    let robotsContent = source.robotsCache;

    // Cache robots.txt for 24 hours
    if (!robotsContent || isExpired(source.updatedAt, 24)) {
      try {
        const robotsUrl = new URL("/robots.txt", source.baseUrl).toString();
        const response = await fetch(robotsUrl, {
          headers: { "User-Agent": source.userAgent },
          signal: AbortSignal.timeout(10000),
        });
        robotsContent = await response.text();
        await prisma.crawlSource.update({
          where: { id: sourceId },
          data: { robotsCache: robotsContent },
        });
      } catch {
        // If robots.txt fetch fails, allow crawling
        return true;
      }
    }

    const robots = RobotsParser(source.baseUrl, robotsContent ?? "");
    return robots.isAllowed(url, USER_AGENT) ?? true;
  } catch {
    return true;
  }
}

export async function getCrawlDelay(sourceId: string): Promise<number> {
  try {
    const source = await prisma.crawlSource.findUnique({ where: { id: sourceId } });
    if (!source?.robotsCache) return 10;

    const robots = RobotsParser(source.baseUrl, source.robotsCache);
    return robots.getCrawlDelay(USER_AGENT) ?? 10;
  } catch {
    return 10;
  }
}

function isExpired(date: Date, hours: number): boolean {
  return Date.now() - date.getTime() > hours * 60 * 60 * 1000;
}
