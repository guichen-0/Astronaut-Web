"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface Star {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
}

export default function DistancePage() {
  const [stars, setStars] = useState<Star[]>([]);
  const [star1, setStar1] = useState("");
  const [star2, setStar2] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stars")
      .then((r) => r.json())
      .then((d) => setStars(d.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const s1 = stars.find((s) => s.id === star1);
  const s2 = stars.find((s) => s.id === star2);

  const distance = s1 && s2
    ? Math.sqrt(
        (s1.x - s2.x) ** 2 +
        (s1.y - s2.y) ** 2 +
        (s1.z - s2.z) ** 2
      )
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">距离计算器</h1>
      <p className="mb-8 text-muted-foreground">计算两颗恒星之间的空间距离（基于3D坐标数据）</p>

      <Card>
        <CardHeader>
          <CardTitle>选择恒星</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">恒星 A</label>
            <select
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              value={star1}
              onChange={(e) => setStar1(e.target.value)}
              disabled={loading}
            >
              <option value="">-- 选择 --</option>
              {stars.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name || s.id}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">恒星 B</label>
            <select
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              value={star2}
              onChange={(e) => setStar2(e.target.value)}
              disabled={loading}
            >
              <option value="">-- 选择 --</option>
              {stars.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name || s.id}
                </option>
              ))}
            </select>
          </div>

          {distance !== null && s1 && s2 && (
            <div className="rounded-lg bg-primary/5 p-4 text-center">
              <p className="text-sm text-muted-foreground">
                {s1.name} 到 {s2.name} 的距离
              </p>
              <p className="text-2xl font-bold text-primary">
                {distance.toFixed(2)} 秒差距
              </p>
              <p className="text-sm text-muted-foreground">
                ≈ {(distance * 3.26156).toFixed(2)} 光年
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
