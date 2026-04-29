import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { planetApi, starApi, constellationApi } from "@/lib/api";
import { PlanetVisual } from "./PlanetVisual";
import { StarVisual } from "./StarVisual";
import { ConstellationVisual } from "./ConstellationVisual";
import { Badge } from "./Badge";

type DailyEntity =
  | { type: "planet"; data: { id: string; slug: string; name: string; description: string | null } }
  | { type: "star"; data: { id: string; name: string | null; description: string | null; spectralType: string | null; apparentMagnitude: number } }
  | { type: "constellation"; data: { id: string; name: string; abbreviation: string; description: string | null } };

function seedFromDate(): number {
  const today = new Date();
  return today.getFullYear() * 10000 + today.getMonth() * 100 + today.getDate();
}

async function getDailyPick(): Promise<DailyEntity | null> {
  const seed = seedFromDate();
  const entityIndex = seed % 3;

  if (entityIndex === 0) {
    const { data: planets } = await planetApi.list();
    if (planets.length) return { type: "planet", data: planets[seed % planets.length] };
  }
  if (entityIndex === 1) {
    const { data: stars } = await starApi.list({ limit: 50 });
    if (stars.length) return { type: "star", data: stars[seed % stars.length] };
  }
  const { data: constellations } = await constellationApi.list();
  if (constellations.length) return { type: "constellation", data: constellations[seed % constellations.length] };

  return null;
}

export async function DailyPick() {
  const pick = await getDailyPick();
  if (!pick) return null;

  return (
    <section className="mx-auto max-w-5xl px-4">
      <div className="overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-blue-950/40 via-primary/5 to-purple-950/40">
        <div className="flex flex-col items-center gap-8 p-8 md:flex-row">
          {/* Visual */}
          <div className="h-48 w-48 shrink-0">
            {pick.type === "planet" && (
              <PlanetVisual slug={pick.data.slug} name={pick.data.name} />
            )}
            {pick.type === "star" && (
              <StarVisual
                spectralType={pick.data.spectralType}
                magnitude={pick.data.apparentMagnitude}
                name={pick.data.name ?? ""}
              />
            )}
            {pick.type === "constellation" && (
              <ConstellationVisual
                name={pick.data.name}
                abbreviation={pick.data.abbreviation}
              />
            )}
          </div>

          {/* Content */}
          <div className="text-center md:text-left">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <Badge className="border-primary/30 text-primary">今日推荐</Badge>
            </div>
            <h2 className="mb-2 text-2xl font-bold md:text-3xl">
              {pick.data.name}
            </h2>
            <p className="mb-4 line-clamp-3 text-muted-foreground">
              {pick.data.description ?? "探索这个天体的奥秘"}
            </p>
            <Link
              href={
                pick.type === "planet"
                  ? `/planets/${pick.data.slug}`
                  : pick.type === "star"
                  ? `/stars/${pick.data.id}`
                  : `/constellations/${pick.data.abbreviation.toLowerCase()}`
              }
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              了解更多 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
