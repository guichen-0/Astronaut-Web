"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";

interface Suggestion {
  id: string;
  entityType: string;
  title: string;
  description: string;
  slug?: string;
}

const TYPE_LABELS: Record<string, string> = {
  planet: "行星",
  star: "恒星",
  constellation: "星座",
  article: "资讯",
};

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.trim().length < 1) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}&mode=suggest`);
      const json = await res.json();
      setSuggestions(json.data ?? []);
      setShowSuggestions(true);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchSuggestions(val), 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const navigateTo = (s: Suggestion) => {
    setShowSuggestions(false);
    setQuery("");
    let url = "#";
    switch (s.entityType) {
      case "planet": url = `/planets/${s.slug}`; break;
      case "star": url = `/stars/${s.slug}`; break;
      case "constellation": url = `/constellations/${s.slug}`; break;
      case "article": url = `/news/${s.slug}`; break;
    }
    router.push(url);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="搜索天体、资讯..."
          className="h-9 w-40 pl-9 text-sm lg:w-64"
          value={query}
          onChange={handleChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        />
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute right-0 top-full z-50 mt-1 w-80 overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
          {suggestions.map((s) => (
            <button
              key={`${s.entityType}-${s.id}`}
              onClick={() => navigateTo(s)}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-accent"
            >
              <span className="shrink-0 rounded bg-secondary px-1.5 py-0.5 text-xs text-muted-foreground">
                {TYPE_LABELS[s.entityType] ?? s.entityType}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{s.title}</p>
                <p className="truncate text-xs text-muted-foreground">{s.description}</p>
              </div>
            </button>
          ))}
          <button
            onClick={handleSubmit}
            className="w-full border-t border-border px-4 py-2 text-center text-xs text-muted-foreground transition-colors hover:bg-accent"
          >
            查看全部搜索结果 &rarr;
          </button>
        </div>
      )}

      {showSuggestions && loading && (
        <div className="absolute right-0 top-full z-50 mt-1 w-80 rounded-lg border border-border bg-popover p-4 text-center shadow-lg">
          <Loader2 className="mx-auto h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
