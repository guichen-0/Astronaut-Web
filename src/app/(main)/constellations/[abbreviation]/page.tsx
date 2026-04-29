import { notFound } from "next/navigation";
import { Star, MapPin, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EntityActions } from "@/components/ui/EntityActions";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ConstellationVisual } from "@/components/ui/ConstellationVisual";
import { constellationApi } from "@/lib/api";

interface Props {
  params: { abbreviation: string };
}

export default async function ConstellationDetailPage({ params }: Props) {
  const { data: constellation } = await constellationApi.get(params.abbreviation).catch(() => ({ data: null }));

  if (!constellation) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <Breadcrumb items={[{ label: "星座大全", href: "/constellations" }, { label: constellation.name }]} />

      {/* Hero */}
      <div className="mb-10 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex flex-col items-center gap-6 p-8 sm:flex-row">
          <div className="h-36 w-36 shrink-0">
            <ConstellationVisual name={constellation.name} abbreviation={constellation.abbreviation} />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-bold">{constellation.name}</h1>
            <p className="mt-1 text-lg text-muted-foreground">
              {constellation.abbreviation} · {constellation.genitive} · {constellation.meaning}
            </p>
            <div className="mt-3">
              <EntityActions entityType="constellation" entityId={constellation.id} entityName={constellation.name} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Sidbar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4 text-primary" />
                基本信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {constellation.season && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">最佳观测季节</span>
                  <span className="font-medium">{constellation.season}</span>
                </div>
              )}
              {constellation.areaSqDeg && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">面积</span>
                  <span className="font-medium">{constellation.areaSqDeg.toFixed(1)} 平方度</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">已知恒星</span>
                <span className="font-medium">{constellation.stars.length} 颗</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main */}
        <div className="space-y-8 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>简介</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-muted-foreground">{constellation.description}</p>
            </CardContent>
          </Card>

          {constellation.mythos && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  神话传说
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-muted-foreground">{constellation.mythos}</p>
              </CardContent>
            </Card>
          )}

          {constellation.stars.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  主要恒星
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-border">
                  {constellation.stars.map((star: { id: string; name: string | null; bayerDesignation: string | null; hipId: number | null; spectralType: string | null; apparentMagnitude: number }) => (
                    <div key={star.id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">
                          {star.name ?? star.bayerDesignation ?? `HIP ${star.hipId}`}
                        </p>
                        {star.spectralType && (
                          <p className="text-xs text-muted-foreground">{star.spectralType}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm">{star.apparentMagnitude.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">视星等</p>
                      </div>
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
