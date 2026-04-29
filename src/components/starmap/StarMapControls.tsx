"use client";

import { useStarMap } from "@/hooks/useStarMap";

export function StarMapControls() {
  const {
    magnitudeLimit,
    showConstellations,
    showGrid,
    showLabels,
    setMagnitudeLimit,
    setShowConstellations,
    setShowGrid,
    setShowLabels,
  } = useStarMap();

  return (
    <div className="absolute right-4 top-4 z-10 space-y-2">
      <div className="rounded-lg border border-border bg-card/80 p-3 text-sm backdrop-blur-sm">
        <p className="mb-2 text-xs font-medium text-muted-foreground">显示控制</p>

        <label className="mb-2 flex items-center gap-2">
          <input
            type="checkbox"
            checked={showConstellations}
            onChange={(e) => setShowConstellations(e.target.checked)}
            className="rounded"
          />
          <span className="text-xs">星座连线</span>
        </label>

        <label className="mb-2 flex items-center gap-2">
          <input
            type="checkbox"
            checked={showGrid}
            onChange={(e) => setShowGrid(e.target.checked)}
            className="rounded"
          />
          <span className="text-xs">赤纬网格</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showLabels}
            onChange={(e) => setShowLabels(e.target.checked)}
            className="rounded"
          />
          <span className="text-xs">恒星标签</span>
        </label>
      </div>

      <div className="rounded-lg border border-border bg-card/80 p-3 text-sm backdrop-blur-sm">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          星等限制: {magnitudeLimit}
        </p>
        <input
          type="range"
          min={1}
          max={10}
          step={0.5}
          value={magnitudeLimit}
          onChange={(e) => setMagnitudeLimit(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}
