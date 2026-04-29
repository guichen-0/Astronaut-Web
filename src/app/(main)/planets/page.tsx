import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { PlanetVisual } from "@/components/ui/PlanetVisual";
import { planetApi } from "@/lib/api";

export default async function PlanetsPage() {
  const { data: planets } = await planetApi.list().catch(() => ({ data: [] }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold">太阳系行星百科</h1>
        <p className="mt-2 text-muted-foreground">
          了解太阳系八大行星的奥秘与特征
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {planets.map((planet) => (
          <Link key={planet.id} href={`/planets/${planet.slug}`}>
            <Card className="group h-full transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-14 w-14 shrink-0">
                    <PlanetVisual slug={planet.slug} name={planet.name} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{planet.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{planet.englishName}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">类型</span>
                    <p>{planet.planetType}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">直径</span>
                    <p>{planet.diameterKm ? `${(planet.diameterKm / 1000).toFixed(0)} 万 km` : "—"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">距太阳</span>
                    <p>{planet.distanceFromSunAu ? `${planet.distanceFromSunAu} AU` : "—"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">卫星</span>
                    <p>{planet.numberOfMoons} 颗</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
