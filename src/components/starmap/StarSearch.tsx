"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";

interface StarData {
  id: string;
  name: string | null;
  bayerDesignation: string | null;
}

interface StarSearchProps {
  stars: StarData[];
  onSelect: (star: StarData) => void;
}

export function StarSearch({ stars, onSelect }: StarSearchProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return stars
      .filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.bayerDesignation?.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query, stars]);

  return (
    <div className="absolute left-4 top-4 z-10 w-64">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="搜索恒星..."
          className="h-9 border-border bg-card/80 pl-9 text-sm backdrop-blur-sm"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => results.length > 0 && setOpen(true)}
        />
      </div>

      {open && results.length > 0 && (
        <div className="mt-1 overflow-hidden rounded-lg border border-border bg-card shadow-lg backdrop-blur-sm">
          {results.map((star) => (
            <button
              key={star.id}
              onClick={() => {
                onSelect(star);
                setQuery("");
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
            >
              <span className="font-medium">{star.name ?? "未知"}</span>
              {star.bayerDesignation && (
                <span className="text-xs text-muted-foreground">
                  {star.bayerDesignation}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {open && query && results.length === 0 && (
        <div className="mt-1 rounded-lg border border-border bg-card p-3 text-center text-xs text-muted-foreground shadow-lg backdrop-blur-sm">
          未找到匹配的恒星
        </div>
      )}

      {open && query && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
