export interface CrawlSourceConfig {
  name: string;
  baseUrl: string;
  feedUrl?: string;
  type: "rss" | "apod" | "html";
  category: string;
}

export interface CrawledArticle {
  title: string;
  summary: string;
  content: string;
  sourceUrl: string;
  sourceName: string;
  author?: string;
  publishedAt?: Date;
  imageUrl?: string;
  categoryName?: string;
}
