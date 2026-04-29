import Link from "next/link";
import { Star } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { ConstellationVisual } from "@/components/ui/ConstellationVisual";
import { constellationApi } from "@/lib/api";

const SEASON_ORDER: Record<string, number> = {
  "春季": 0,
  "夏季": 1,
  "秋季": 2,
  "冬季": 3,
};

async function getData() {
  try {
    const { data } = await constellationApi.list();
    return data;
  } catch {
    return [];
  }
}

export default async function ConstellationsPage() {
  const constellations = await getData();

  const grouped = constellations.reduce<Record<string, typeof constellations>>((acc, c) => {
    const season = c.season ?? "其他";
    if (!acc[season]) acc[season] = [];
    acc[season].push(c);
    return acc;
  }, {});

  const sortedSeasons = Object.keys(grouped).sort(
    (a, b) => (SEASON_ORDER[a] ?? 99) - (SEASON_ORDER[b] ?? 99)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold">88 星座大全</h1>
        <p className="mt-2 text-muted-foreground">按季节浏览北半球的星座</p>
      </div>

      {sortedSeasons.length === 0 ? (
        <p className="text-center text-muted-foreground">暂无星座数据 — 请先配置数据库并导入种子数据。</p>
      ) : (
        sortedSeasons.map((season) => (
          <section key={season} className="mb-12">
            <h2 className="mb-6 text-2xl font-bold">{season}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {grouped[season].map((constellation) => (
                <Link
                  key={constellation.id}
                  href={`/constellations/${constellation.abbreviation.toLowerCase()}`}
                >
                  <Card className="group h-full transition-all hover:border-primary/50">
                    <CardContent className="p-5">
                      <div className="mb-3 flex items-center justify-center">
                        <div className="h-20 w-full">
                          <ConstellationVisual name={constellation.name} abbreviation={constellation.abbreviation} />
                        </div>
                      </div>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">
                            {constellation.name}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground">
                            {constellation.abbreviation} · {constellation.meaning}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3" />
                          {constellation._count.stars}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
