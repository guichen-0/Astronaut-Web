"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Loader2, FileText, Globe, Star, Map as MapIcon } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { SEARCH_TYPES } from "@/lib/constants";

interface Result {
  id: string;
  entityType: string;
  title: string;
  description: string;
  slug?: string;
}

const ENTITY_ICONS: Record<string, React.ReactNode> = {
  planet: <Globe className="h-4 w-4" />,
  star: <Star className="h-4 w-4" />,
  constellation: <MapIcon className="h-4 w-4" />,
  article: <FileText className="h-4 w-4" />,
};

const ENTITY_COLORS: Record<string, string> = {
  planet: "bg-blue-500/10 text-blue-600",
  star: "bg-yellow-500/10 text-yellow-600",
  constellation: "bg-purple-500/10 text-purple-600",
  article: "bg-green-500/10 text-green-600",
};

export function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState("all");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = useCallback(async (q: string, t: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}&type=${t}`);
      const json = await res.json();
      setResults(json.data ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialQuery) {
      doSearch(initialQuery, type);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(query, type);
  };

  const getEntityUrl = (r: Result): string => {
    switch (r.entityType) {
      case "planet": return `/planets/${r.slug}`;
      case "star": return `/stars/${r.slug}`;
      case "constellation": return `/constellations/${r.slug}`;
      case "article": return `/news/${r.slug}`;
      default: return "#";
    }
  };

  const getTypeLabel = (type: string): string => {
    return SEARCH_TYPES.find((t) => t.value === type)?.label ?? type;
  };

  // Highlight matching text
  const highlightMatch = (text: string, search: string) => {
    if (!search.trim()) return text;
    const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="rounded-sm bg-primary/20 px-0.5 text-foreground">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-center text-3xl font-bold">搜索</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索行星、恒星、星座、资讯..."
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "搜索"}
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {SEARCH_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setType(t.value)}
              className={`rounded-full px-3 py-1 text-xs transition-colors ${
                type === t.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </form>

      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="py-12 text-center">
          <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
          <p className="text-lg text-muted-foreground">未找到与 &ldquo;{query}&rdquo; 相关的结果</p>
          <p className="mt-1 text-sm text-muted-foreground/60">试试其他关键词或筛选类别</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">找到 {results.length} 个结果</p>
          {results.map((r) => (
            <Link key={`${r.entityType}-${r.id}`} href={getEntityUrl(r)}>
              <Card className="transition-all hover:border-primary/50 hover:shadow-sm">
                <CardContent className="flex items-center gap-4 p-4">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${ENTITY_COLORS[r.entityType] ?? "bg-secondary text-muted-foreground"}`}>
                    {ENTITY_ICONS[r.entityType] ?? <Search className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{highlightMatch(r.title, query)}</p>
                    <p className="text-sm text-muted-foreground">{highlightMatch(r.description, query)}</p>
                  </div>
                  <span className="shrink-0 rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                    {getTypeLabel(r.entityType)}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
