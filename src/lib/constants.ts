export const SITE_NAME = "天文探索";
export const SITE_DESCRIPTION = "探索宇宙的奥秘 — 行星、恒星、星座、天文事件一站式科普平台";
export const SITE_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

export const PLANET_TYPES = [
  "类地行星",
  "气态巨行星",
  "冰巨行星",
  "矮行星",
] as const;

export const EVENT_TYPES = [
  { value: "METEOR_SHOWER", label: "流星雨" },
  { value: "LUNAR_ECLIPSE", label: "月食" },
  { value: "SOLAR_ECLIPSE", label: "日食" },
  { value: "PLANET_OPPOSITION", label: "行星冲日" },
  { value: "PLANET_CONJUNCTION", label: "行星合月" },
  { value: "COMET_VISIBILITY", label: "彗星可见" },
  { value: "SOLSTICE", label: "至点" },
  { value: "EQUINOX", label: "分点" },
  { value: "SUPERMOON", label: "超级月亮" },
  { value: "OTHER", label: "其他" },
] as const;

export const SEASONS = ["春季", "夏季", "秋季", "冬季"] as const;

export const SEARCH_TYPES = [
  { value: "all", label: "全部" },
  { value: "planet", label: "行星" },
  { value: "star", label: "恒星" },
  { value: "constellation", label: "星座" },
  { value: "article", label: "资讯" },
] as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const STAR_MAP = {
  DEFAULT_MAGNITUDE_LIMIT: 6,
  MAX_STARS: 50000,
} as const;
