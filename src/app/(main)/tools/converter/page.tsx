"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

const UNITS = [
  { id: "au_km", label: "天文单位 (AU) → 千米 (km)", factor: 149597870.7 },
  { id: "ly_km", label: "光年 (ly) → 千米 (km)", factor: 9460730472580.8 },
  { id: "pc_km", label: "秒差距 (pc) → 千米 (km)", factor: 30856775814671.9 },
  { id: "ly_pc", label: "光年 (ly) → 秒差距 (pc)", factor: 0.306601 },
  { id: "au_ly", label: "天文单位 (AU) → 光年 (ly)", factor: 0.000015813 },
  { id: "pc_ly", label: "秒差距 (pc) → 光年 (ly)", factor: 3.26156 },
  { id: "sol_kg", label: "太阳质量 (M☉) → 千克 (kg)", factor: 1.98847e30 },
  { id: "rj_km", label: "木星半径 (R♃) → 千米 (km)", factor: 69911 },
  { id: "re_km", label: "地球半径 (R⊕) → 千米 (km)", factor: 6371 },
];

export default function ConverterPage() {
  const [values, setValues] = useState<Record<string, string>>({});

  const handleChange = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">单位转换器</h1>
      <p className="mb-8 text-muted-foreground">天文单位转换：光年、秒差距、天文单位、太阳质量等</p>

      <div className="space-y-4">
        {UNITS.map((unit) => {
          const inputVal = values[unit.id] ?? "";
          const result = inputVal ? parseFloat(inputVal) * unit.factor : null;

          return (
            <Card key={unit.id}>
              <CardContent className="p-4">
                <label className="mb-2 block text-sm font-medium">{unit.label}</label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    placeholder="输入数值"
                    value={inputVal}
                    onChange={(e) => handleChange(unit.id, e.target.value)}
                  />
                  <span className="shrink-0 text-sm text-muted-foreground">=</span>
                  <span className="min-w-[120px] text-sm font-medium">
                    {result !== null ? (
                      result > 1e12
                        ? `${result.toExponential(4)}`
                        : result.toLocaleString("zh-CN", { maximumFractionDigits: 4 })
                    ) : (
                      "结果"
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
