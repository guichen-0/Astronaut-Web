import { planetApi, starApi, eventApi, constellationApi, articleApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";
import { EVENT_TYPES } from "@/lib/constants";

function getTypeLabel(type: string): string {
  return EVENT_TYPES.find((t) => t.value === type)?.label ?? type;
}

export default async function DiscoverPage() {
  // Fetch random entities
  const { data: planets } = await planetApi.list();
  const randomPlanet = planets.length > 0 ? planets[Math.floor(Math.random() * planets.length)] : null;

  const { data: allStars } = await starApi.list({ limit: 60 });
  const stars = allStars.filter((s: Record<string, unknown>) => s.name);
  const randomStar = stars.length > 0 ? stars[Math.floor(Math.random() * stars.length)] : null;

  const constellations = (await constellationApi.list()).data;
  const randomCons = constellations.length > 0 ? constellations[Math.floor(Math.random() * constellations.length)] : null;

  // Random entity
  const entities = [
    randomPlanet ? { type: "planet", name: randomPlanet.name, slug: randomPlanet.slug, description: randomPlanet.englishName } : null,
    randomStar ? { type: "star", name: randomStar.name ?? "未知恒星", slug: randomStar.id, description: `视星等 ${randomStar.apparentMagnitude}` } : null,
    randomCons ? { type: "constellation", name: randomCons.name, slug: randomCons.abbreviation.toLowerCase(), description: randomCons.meaning ?? "" } : null,
  ].filter(Boolean);
  const randomEntity = entities.length > 0 ? entities[Math.floor(Math.random() * entities.length)] : null;

  // Upcoming events
  const { data: allEvents } = await eventApi.list();
  const upcomingEvents = (allEvents || []).filter((e: { startDate: string }) => new Date(e.startDate) > new Date()).slice(0, 3);

  // Recent articles
  const { data: recentArticles } = await articleApi.list({ perPage: 4 });

  const getEntityUrl = (e: typeof randomEntity): string => {
    if (!e) return "#";
    switch (e.type) {
      case "planet": return `/planets/${e.slug}`;
      case "star": return `/stars/${e.slug}`;
      case "constellation": return `/constellations/${e.slug}`;
      default: return "#";
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold">每日发现</h1>
        <p className="mt-2 text-muted-foreground">每天发现一个宇宙的奇妙之处</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Random Entity */}
        <Card className="transition-all hover:border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">随机天体</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {randomEntity ? (
              <Link href={getEntityUrl(randomEntity)} className="group block">
                <h3 className="text-xl font-bold group-hover:text-primary">{randomEntity.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{randomEntity.description}</p>
                <p className="mt-2 text-xs text-primary">查看详情 →</p>
              </Link>
            ) : (
              <p className="text-sm text-muted-foreground">暂无数据</p>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle>宇宙数字</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{planets.length}</p>
                <p className="text-xs text-muted-foreground">行星</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{stars.length}+</p>
                <p className="text-xs text-muted-foreground">恒星</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{constellations.length}</p>
                <p className="text-xs text-muted-foreground">星座</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{upcomingEvents.length}</p>
                <p className="text-xs text-muted-foreground">即将发生的天文事件</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">即将发生的天文事件</h2>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <Card className="transition-all hover:border-primary/50">
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className="shrink-0 text-center">
                      <div className="text-lg font-bold text-primary">
                        {new Date(event.startDate).getDate()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(event.startDate).toLocaleDateString("zh-CN", { month: "short" })}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{event.title}</p>
                      <p className="line-clamp-1 text-sm text-muted-foreground">{event.description}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                      {getTypeLabel(event.eventType)}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Articles */}
      {recentArticles.length > 0 && (
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">最新资讯</h2>
            <Link href="/news" className="text-sm text-primary hover:underline">查看全部 →</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {recentArticles.map((article) => (
              <Link key={article.id} href={`/news/${article.slug}`}>
                <Card className="h-full transition-all hover:border-primary/50">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground">
                      {article.publishedAt?.toLocaleDateString("zh-CN")}
                    </p>
                    <h3 className="mt-1 font-medium line-clamp-2">{article.title}</h3>
                    {article.summary && (
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{article.summary}</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link href="/planets">
          <Card className="transition-all hover:border-primary/50">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold">行星百科</h3>
              <p className="mt-1 text-sm text-muted-foreground">探索太阳系行星</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/stars">
          <Card className="transition-all hover:border-primary/50">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold">恒星目录</h3>
              <p className="mt-1 text-sm text-muted-foreground">了解遥远恒星</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/constellations">
          <Card className="transition-all hover:border-primary/50">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold">星座图鉴</h3>
              <p className="mt-1 text-sm text-muted-foreground">识别夜空星座</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
