import { eventApi } from "@/lib/api";
import { EVENT_TYPES } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

const TYPE_COLORS: Record<string, string> = {
  METEOR_SHOWER: "bg-orange-500/10 text-orange-600 border-orange-200",
  LUNAR_ECLIPSE: "bg-purple-500/10 text-purple-600 border-purple-200",
  SOLAR_ECLIPSE: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
  PLANET_OPPOSITION: "bg-blue-500/10 text-blue-600 border-blue-200",
  PLANET_CONJUNCTION: "bg-cyan-500/10 text-cyan-600 border-cyan-200",
  COMET_VISIBILITY: "bg-green-500/10 text-green-600 border-green-200",
  SOLSTICE: "bg-red-500/10 text-red-600 border-red-200",
  EQUINOX: "bg-indigo-500/10 text-indigo-600 border-indigo-200",
  SUPERMOON: "bg-pink-500/10 text-pink-600 border-pink-200",
  OTHER: "bg-gray-500/10 text-gray-600 border-gray-200",
};

function getTypeLabel(type: string): string {
  return EVENT_TYPES.find((t) => t.value === type)?.label ?? type;
}

function getTypeColor(type: string): string {
  return TYPE_COLORS[type] ?? TYPE_COLORS.OTHER;
}

export default async function EventsPage() {
  const { data: events } = await eventApi.list();

  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.startDate) >= now);
  const past = events.filter((e) => new Date(e.startDate) < now);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold">天文事件</h1>
        <p className="mt-2 text-muted-foreground">即将到来的天文观测事件</p>
      </div>

      {upcoming.length > 0 && (
        <>
          <h2 className="mb-4 text-xl font-semibold">即将发生</h2>
          <div className="mb-12 space-y-4">
            {upcoming.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <Card className="transition-all hover:border-primary/50">
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="shrink-0 text-center">
                      <div className="text-2xl font-bold text-primary">
                        {new Date(event.startDate).getDate()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(event.startDate).toLocaleDateString("zh-CN", { month: "short" })}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                        {event.description}
                      </p>
                      {event.visibility && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          可见区域: {event.visibility}
                        </p>
                      )}
                    </div>
                    <Badge className={getTypeColor(event.eventType)}>
                      {getTypeLabel(event.eventType)}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}

      {past.length > 0 && (
        <>
          <h2 className="mb-4 text-xl font-semibold">历史事件</h2>
          <div className="space-y-3">
            {past.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <Card className="opacity-70 transition-all hover:opacity-100">
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className="shrink-0 text-center">
                      <div className="text-lg font-bold">{new Date(event.startDate).getDate()}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(event.startDate).toLocaleDateString("zh-CN", { month: "short" })}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                    <Badge className={getTypeColor(event.eventType)}>
                      {getTypeLabel(event.eventType)}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}

      {events.length === 0 && (
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>暂无数据</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">暂无天文事件数据。</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
