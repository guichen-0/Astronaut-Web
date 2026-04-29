import { notFound } from "next/navigation";
import { starApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EntityActions } from "@/components/ui/EntityActions";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { StarVisual } from "@/components/ui/StarVisual";

interface Props {
  params: { id: string };
}

export default async function StarDetailPage({ params }: Props) {
  const star = await starApi.get(params.id).then(r => r.data).catch(() => null);
  if (!star) notFound();

  const starName = star.name ?? (star.bayerDesignation ?? `HIP ${star.hipId}`);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Breadcrumb items={[{ label: "恒星目录", href: "/stars" }, { label: starName }]} />

      {/* Hero */}
      <div className="mb-10 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex flex-col items-center gap-6 p-8 sm:flex-row">
          <div className="h-32 w-32 shrink-0">
            <StarVisual
              spectralType={star.spectralType}
              magnitude={star.apparentMagnitude}
              name={starName}
            />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-bold">{starName}</h1>
            {star.bayerDesignation && (
              <p className="text-lg text-muted-foreground">{star.bayerDesignation}</p>
            )}
            <div className="mt-3">
              <EntityActions entityType="star" entityId={star.id} entityName={starName} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Stats */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">基本参数</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <StatRow label="视星等" value={`${star.apparentMagnitude.toFixed(2)}`} />
              <StatRow label="绝对星等" value={star.absoluteMagnitude?.toFixed(2) ?? "未知"} />
              <StatRow label="光谱类型" value={star.spectralType ?? "未知"} />
              <StatRow label="距离" value={star.distanceParsecs ? `${star.distanceParsecs.toFixed(1)} pc (${(star.distanceParsecs * 3.26).toFixed(1)} ly)` : "未知"} />
              <StatRow label="B-V色指数" value={star.colorIndexBv?.toFixed(2) ?? "未知"} />
              {star.constellation && (
                <StatRow label="所属星座" value={star.constellation.name} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Desc */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>简介</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-muted-foreground">
                {star.description ?? "暂无详细描述。这颗恒星的坐标数据已记录在数据库中。"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
