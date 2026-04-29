"use client";

import { useEffect, useState } from "react";
import { X, ExternalLink } from "lucide-react";
import { useStarMap } from "@/hooks/useStarMap";
import Link from "next/link";

interface StarDetail {
  id: string;
  name: string | null;
  bayerDesignation: string | null;
  apparentMagnitude: number;
  absoluteMagnitude: number | null;
  spectralType: string | null;
  distanceParsecs: number | null;
  colorIndexBv: number | null;
}

export function StarInfoPanel() {
  const { selectedStarId, setSelectedStar } = useStarMap();
  const [star, setStar] = useState<StarDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedStarId) {
      setStar(null);
      return;
    }
    setLoading(true);
    fetch(`/api/stars?id=${selectedStarId}`)
      .then((r) => r.json())
      .then((d) => setStar(d.data ?? null))
      .catch(() => setStar(null))
      .finally(() => setLoading(false));
  }, [selectedStarId]);

  if (!selectedStarId) return null;

  return (
    <div className="absolute bottom-4 left-4 z-10 max-w-xs rounded-lg border border-border bg-card/90 p-4 backdrop-blur-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          {loading ? "加载中..." : star?.name ?? star?.bayerDesignation ?? "未知恒星"}
        </h3>
        <button
          onClick={() => setSelectedStar(null)}
          className="rounded p-0.5 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {!loading && star && (
        <div className="space-y-1 text-xs text-muted-foreground">
          {star.bayerDesignation && (
            <p>拜耳命名: {star.bayerDesignation}</p>
          )}
          <p>视星等: {star.apparentMagnitude.toFixed(2)}</p>
          {star.absoluteMagnitude && (
            <p>绝对星等: {star.absoluteMagnitude.toFixed(2)}</p>
          )}
          {star.spectralType && <p>光谱类型: {star.spectralType}</p>}
          {star.distanceParsecs && (
            <p>距离: {star.distanceParsecs.toFixed(1)} pc ({(star.distanceParsecs * 3.26).toFixed(1)} ly)</p>
          )}
          {star.colorIndexBv && <p>B-V色指数: {star.colorIndexBv.toFixed(2)}</p>}
          <Link
            href={`/stars/${star.id}`}
            className="mt-2 flex items-center gap-1 text-primary hover:underline"
          >
            查看详情 <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      )}

      {!loading && !star && (
        <p className="text-xs text-muted-foreground">无法加载恒星数据</p>
      )}
    </div>
  );
}
