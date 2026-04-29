import { CrawlSourceConfig } from "./types";

export const SOURCES: CrawlSourceConfig[] = [
  {
    name: "NASA Breaking News",
    baseUrl: "https://www.nasa.gov",
    feedUrl: "https://www.nasa.gov/rss/dyn/breaking_news.rss",
    type: "rss",
    category: "天文新闻",
  },
  {
    name: "ESA Space News",
    baseUrl: "https://www.esa.int",
    feedUrl: "https://www.esa.int/rssfeed/space-news",
    type: "rss",
    category: "天文新闻",
  },
  {
    name: "APOD",
    baseUrl: "https://apod.nasa.gov",
    type: "apod",
    category: "天文图片",
  },
];
