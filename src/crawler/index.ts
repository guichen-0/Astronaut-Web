import { prisma } from "@/lib/prisma";
import { isAllowed, getCrawlDelay } from "./robots";
import { CrawledArticle } from "./types";

const SLUG_MAX_LENGTH = 200;

export async function crawlSource(sourceId: string): Promise<{ count: number; errors: number }> {
  const source = await prisma.crawlSource.findUnique({ where: { id: sourceId } });
  if (!source || !source.isActive) {
    console.log(`[Crawler] 源 ${sourceId} 不存在或未激活`);
    return { count: 0, errors: 0 };
  }

  const allowed = await isAllowed(source.baseUrl, sourceId);
  if (!allowed) {
    console.log(`[Crawler] ${source.name}: robots.txt 禁止抓取`);
    return { count: 0, errors: 0 };
  }

  const delay = await getCrawlDelay(sourceId);
  await sleep(delay * 1000);

  let articles: CrawledArticle[] = [];
  let errors = 0;

  try {
    if (source.feedUrl) {
      const response = await fetch(source.feedUrl, {
        headers: { "User-Agent": source.userAgent },
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) {
        console.error(`[Crawler] ${source.name}: HTTP ${response.status}`);
        return { count: 0, errors: 1 };
      }
      const xml = await response.text();
      articles = parseRss(xml, source.name);
      console.log(`[Crawler] ${source.name}: 解析到 ${articles.length} 篇文章`);
    }

    // Look up category if source has one
    let categoryId: string | null = null;
    if (source.categoryId) {
      const cat = await prisma.articleCategory.findFirst({
        where: { slug: source.categoryId },
      });
      if (cat) categoryId = cat.id;
    }

    let count = 0;
    for (const article of articles) {
      try {
        // Skip articles without a title or sourceUrl
        if (!article.title || !article.sourceUrl) continue;

        // Clean HTML from content
        const cleanedContent = stripHtml(article.content || article.summary || article.title);

        await prisma.article.create({
          data: {
            title: article.title,
            slug: uniqueSlug(article.title),
            summary: truncate(stripHtml(article.summary || ""), 300),
            content: cleanedContent,
            sourceUrl: article.sourceUrl,
            sourceName: article.sourceName,
            author: article.author ?? null,
            publishedAt: article.publishedAt ?? null,
            imageUrl: article.imageUrl ?? null,
            categoryId,
          },
        });
        count++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        // Skip duplicates (unique constraint on sourceUrl)
        if (msg.includes("Unique constraint") && msg.includes("sourceUrl")) {
          continue;
        }
        // If slug is duplicate (rare but possible), skip
        if (msg.includes("Unique constraint") && msg.includes("slug")) {
          continue;
        }
        console.error(`[Crawler] 保存文章失败: ${msg.slice(0, 200)}`);
        errors++;
      }
    }

    await prisma.crawlSource.update({
      where: { id: sourceId },
      data: { lastCrawledAt: new Date() },
    });

    console.log(`[Crawler] ${source.name}: 成功 ${count} 篇, 失败 ${errors} 篇`);
    return { count, errors };
  } catch (err) {
    console.error(`[Crawler] ${source.name}: 抓取失败`, err instanceof Error ? err.message : err);
    return { count: 0, errors: 1 };
  }
}

// ─── RSS Parser ───

function parseRss(xml: string, sourceName: string): CrawledArticle[] {
  const articles: CrawledArticle[] = [];

  // Try RSS 2.0 first (<item>)
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  let hasItems = false;

  while ((match = itemRegex.exec(xml)) !== null) {
    hasItems = true;
    const item = match[1];
    articles.push({
      title: decodeHtml(extractTag(item, "title")),
      summary: decodeHtml(extractTag(item, "description")),
      content: decodeHtml(extractTag(item, "content:encoded") || extractTag(item, "description")),
      sourceUrl: extractTag(item, "link"),
      sourceName,
      author: extractTag(item, "dc:creator") || extractTag(item, "author") || undefined,
      publishedAt: parseDate(extractTag(item, "pubDate") || extractTag(item, "dc:date")),
      imageUrl: extractImageUrl(item),
    });
  }

  // Try Atom feed (<entry>)
  if (!hasItems) {
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/gi;
    while ((match = entryRegex.exec(xml)) !== null) {
      const entry = match[1];
      articles.push({
        title: decodeHtml(extractTag(entry, "title")),
        summary: decodeHtml(extractTag(entry, "summary") || extractTag(entry, "subtitle")),
        content: decodeHtml(extractTag(entry, "content") || extractTag(entry, "summary")),
        sourceUrl: extractHref(entry, "link") || extractTag(entry, "id"),
        sourceName,
        author: extractTag(entry, "name") || extractTag(entry, "author") || undefined,
        publishedAt: parseDate(extractTag(entry, "published") || extractTag(entry, "updated")),
        imageUrl: extractImageUrl(entry),
      });
    }
  }

  return articles;
}

function extractTag(xml: string, tag: string): string {
  // Try CDATA wrapped first
  const cdata = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i");
  const cdataMatch = cdata.exec(xml);
  if (cdataMatch) return cdataMatch[1].trim();

  // Try regular tag content
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = regex.exec(xml);
  if (match) return match[1].trim();

  // Self-closing tag
  const selfClose = new RegExp(`<${tag}[^>]*\\/>`, "i");
  if (selfClose.test(xml)) return "";

  return "";
}

function extractHref(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*href="([^"]*)"`, "i");
  const match = regex.exec(xml);
  return match?.[1] ?? "";
}

function extractImageUrl(xml: string): string | undefined {
  const patterns = [
    /<media:content[^>]*url="([^"]*)"/i,
    /<media:thumbnail[^>]*url="([^"]*)"/i,
    /<enclosure[^>]*url="([^"]*)"/i,
    /<img[^>]*src="([^"]*)"/i,
  ];
  for (const p of patterns) {
    const m = p.exec(xml);
    if (m) return m[1];
  }
  return undefined;
}

function parseDate(dateStr: string): Date | undefined {
  if (!dateStr) return undefined;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? undefined : date;
}

// ─── Helpers ───

function uniqueSlug(text: string): string {
  const base = slugify(text);
  const suffix = Math.random().toString(36).substring(2, 8);
  const slug = `${base}-${suffix}`;
  return slug.substring(0, SLUG_MAX_LENGTH);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s一-鿿-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 100);
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtml(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen).replace(/\s+\S*$/, "") + "...";
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
