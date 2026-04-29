import { notFound } from "next/navigation";
import { Globe, Thermometer, Ruler, Orbit, Clock, Moon, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EntityActions } from "@/components/ui/EntityActions";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PlanetVisual } from "@/components/ui/PlanetVisual";
import { planetApi } from "@/lib/api";

interface Props {
  params: { slug: string };
}

export default async function PlanetDetailPage({ params }: Props) {
  const { data: planet } = await planetApi.get(params.slug).catch(() => ({ data: null }));
  if (!planet) notFound();

  const stats = [
    { label: "类型", value: planet.planetType, icon: Globe },
    { label: "直径", value: planet.diameterKm ? `${(planet.diameterKm / 1000).toFixed(0)} 万 km` : "未知", icon: Ruler },
    { label: "距太阳", value: planet.distanceFromSunAu ? `${planet.distanceFromSunAu} AU` : "未知", icon: Orbit },
    { label: "公转周期", value: planet.orbitalPeriodDays ? `${planet.orbitalPeriodDays.toFixed(1)} 天` : "未知", icon: Clock },
    { label: "自转周期", value: planet.rotationPeriodHours ? `${Math.abs(planet.rotationPeriodHours).toFixed(1)} 小时` : "未知", icon: Clock },
    { label: "卫星数量", value: `${planet.numberOfMoons}`, icon: Moon },
    { label: "表面温度", value: `${planet.temperatureMin ?? "?"}°C ~ ${planet.temperatureMax ?? "?"}°C`, icon: Thermometer },
    { label: "环系统", value: planet.hasRings ? "有" : "无", icon: Layers },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <Breadcrumb items={[{ label: "行星百科", href: "/planets" }, { label: planet.name }]} />

      {/* Hero */}
      <div className="mb-10 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex flex-col items-center gap-6 p-8 sm:flex-row">
          <div className="h-32 w-32 shrink-0">
            <PlanetVisual slug={planet.slug} name={planet.name} />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-bold">{planet.name}</h1>
            <p className="mt-1 text-lg text-muted-foreground">{planet.englishName}</p>
            <div className="mt-3">
              <EntityActions entityType="planet" entityId={planet.id} entityName={planet.name} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Stats Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">基本参数</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <stat.icon className="h-4 w-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-sm font-medium">{stat.value}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-8 lg:col-span-2">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>简介</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-muted-foreground">{planet.description}</p>
            </CardContent>
          </Card>

          {/* Fun Fact */}
          {planet.funFact && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-primary">你知道吗？</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">{planet.funFact}</p>
              </CardContent>
            </Card>
          )}

          {/* Moons */}
          {planet.moons.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  卫星 ({planet.moons.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {planet.moons.map((moon) => (
                    <div key={moon.id} className="rounded-lg border border-border p-3">
                      <h4 className="font-medium">{moon.name}</h4>
                      {moon.diameterKm && (
                        <p className="text-sm text-muted-foreground">
                          直径: {(moon.diameterKm / 1000).toFixed(1)} km
                        </p>
                      )}
                      {moon.discoverer && (
                        <p className="text-sm text-muted-foreground">
                          发现: {moon.discoverer} ({moon.discoveryYear})
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Atmosphere */}
          {planet.atmosphereComposition && (
            <Card>
              <CardHeader>
                <CardTitle>大气成分</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(JSON.parse(planet.atmosphereComposition) as Record<string, number>).map(([gas, pct]) => (
                    <div
                      key={gas}
                      className="rounded-full border border-border bg-secondary px-4 py-2 text-sm"
                    >
                      <span className="font-medium">{gas}</span>
                      <span className="ml-1 text-muted-foreground">{pct}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
