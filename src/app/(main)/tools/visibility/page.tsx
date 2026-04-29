"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

interface Star {
  id: string;
  name: string;
  rightAscension: number;
  declination: number;
  apparentMagnitude: number;
}

export default function VisibilityPage() {
  const [stars, setStars] = useState<Star[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [lat, setLat] = useState("40.0");
  const [lng, setLng] = useState("116.4");
  const [dateStr, setDateStr] = useState(() => new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stars/visibility")
      .then((r) => r.json())
      .then((d) => setStars(d.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const selected = stars.find((s) => s.id === selectedId);

  const computeVisibility = () => {
    if (!selected || !lat || !dateStr) return null;

    const latitude = parseFloat(lat);
    if (isNaN(latitude)) return null;

    const dec = selected.declination;
    // A star is visible if its declination and the observer's latitude allow it
    // circumpolar: dec > 90 - |lat| (always visible for that hemisphere)
    // never rises: dec < -(90 - |lat|)
    const neverRises = dec < -(90 - Math.abs(latitude));
    const circumpolar = dec > 90 - Math.abs(latitude);
    const alwaysVisible = latitude >= 0 ? circumpolar : false;
    const neverVisible = latitude >= 0 ? neverRises : false;

    let summary: string;
    if (alwaysVisible) {
      summary = `该恒星在纬度 ${lat}° 处是拱极星，全年每夜可见。`;
    } else if (neverVisible) {
      summary = `该恒星在纬度 ${lat}° 处永不升起，无法观测。`;
    } else {
      const seasonal = dec > 0 ? "北半球" : "南半球";
      summary = `该恒星在纬度 ${lat}° 处可见，在${seasonal}的观测条件更好。`;
    }

    return summary;
  };

  const visibility = computeVisibility();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">观测可见性</h1>
      <p className="mb-8 text-muted-foreground">查询特定天体的观测可见性</p>

      <Card>
        <CardHeader>
          <CardTitle>观测参数设置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">选择恒星</label>
            <select
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              disabled={loading}
            >
              <option value="">-- 选择 --</option>
              {stars.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name || s.id} (星等 {s.apparentMagnitude})
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">观测纬度 (°)</label>
              <Input
                type="number"
                placeholder="例如: 40.0"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">观测经度 (°)</label>
              <Input
                type="number"
                placeholder="例如: 116.4"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">观测日期</label>
            <Input
              type="date"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
            />
          </div>

          {selected && (
            <div className="rounded-lg bg-secondary/30 p-3 text-xs text-muted-foreground">
              <p>赤经: {selected.rightAscension.toFixed(2)}h</p>
              <p>赤纬: {selected.declination.toFixed(2)}°</p>
              <p>视星等: {selected.apparentMagnitude}</p>
            </div>
          )}

          {visibility && (
            <div className="rounded-lg bg-primary/5 p-4 text-center">
              <p className="text-sm font-medium">{visibility}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
