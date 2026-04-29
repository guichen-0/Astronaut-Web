import { notFound } from "next/navigation";
import { eventApi } from "@/lib/api";
import { EVENT_TYPES } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

function getTypeLabel(type: string): string {
  return EVENT_TYPES.find((t) => t.value === type)?.label ?? type;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface Props {
  params: { id: string };
}

export default async function EventDetailPage({ params }: Props) {
  const { data: event } = await eventApi.get(params.id).catch(() => ({ data: null }));
  if (!event) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Breadcrumb items={[{ label: "天文事件", href: "/events" }, { label: event.title }]} />

      <div className="mb-8">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
          {getTypeLabel(event.eventType)}
        </span>
      </div>

      <h1 className="mb-2 text-3xl font-bold">{event.title}</h1>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">开始日期</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{formatDate(event.startDate)}</p>
          </CardContent>
        </Card>

        {event.endDate && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">结束日期</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{formatDate(event.endDate)}</p>
            </CardContent>
          </Card>
        )}

        {event.peakDate && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">极大时间</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{formatDate(event.peakDate)}</p>
            </CardContent>
          </Card>
        )}

        {event.visibility && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">可见区域</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{event.visibility}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>详情</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-muted-foreground">{event.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
