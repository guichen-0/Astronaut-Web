export function formatNumber(value: number, decimals = 2): string {
  return value.toLocaleString("zh-CN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

export function formatTemperature(kelvin: number): string {
  const celsius = kelvin - 273.15;
  return `${celsius.toFixed(0)}°C`;
}

export function formatMass(kg: string): string {
  const num = parseFloat(kg);
  if (num >= 1e30) return `${(num / 1e30).toFixed(4)} × 10³⁰ kg`;
  if (num >= 1e24) return `${(num / 1e24).toFixed(4)} × 10²⁴ kg`;
  return `${kg} kg`;
}

export function formatDiameter(km: number): string {
  if (km >= 10000) return `${(km / 1000).toFixed(1)} 万公里`;
  return `${formatNumber(km)} 公里`;
}

export function formatDistanceAu(au: number): string {
  return `${formatNumber(au)} AU`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (hours < 1) return "刚刚";
  if (hours < 24) return `${hours} 小时前`;
  if (days < 30) return `${days} 天前`;
  if (days < 365) return `${Math.floor(days / 30)} 个月前`;
  return `${Math.floor(days / 365)} 年前`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w一-鿿]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
