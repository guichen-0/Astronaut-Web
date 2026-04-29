import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { Users, Newspaper, Globe, Star, Telescope } from "lucide-react";

export default async function AdminDashboardPage() {
  const [userCount, articleCount, sourceCount, planetCount, starCount, constellationCount] = await Promise.all([
    prisma.user.count(),
    prisma.article.count(),
    prisma.crawlSource.count(),
    prisma.planet.count(),
    prisma.star.count(),
    prisma.constellation.count(),
  ]);

  const stats = [
    { label: "用户数", value: userCount, icon: Users, color: "text-blue-600 bg-blue-500/10" },
    { label: "文章", value: articleCount, icon: Newspaper, color: "text-green-600 bg-green-500/10" },
    { label: "爬虫源", value: sourceCount, icon: Globe, color: "text-amber-600 bg-amber-500/10" },
    { label: "行星", value: planetCount, icon: Globe, color: "text-purple-600 bg-purple-500/10" },
    { label: "恒星", value: starCount, icon: Star, color: "text-yellow-600 bg-yellow-500/10" },
    { label: "星座", value: constellationCount, icon: Telescope, color: "text-cyan-600 bg-cyan-500/10" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">仪表盘</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick links */}
      <h2 className="mb-4 mt-10 text-xl font-bold">快捷操作</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickLink href="/admin/users" label="管理用户" desc="查看和编辑用户角色" />
        <QuickLink href="/admin/articles" label="管理文章" desc="编辑或删除已抓取的文章" />
        <QuickLink href="/admin/sources" label="管理爬虫源" desc="配置爬虫数据源" />
        <QuickLink href="/admin/crawler" label="爬虫控制台" desc="手动运行爬虫任务" />
        <QuickLink href="/starmap" label="查看星图" desc="3D 交互星图" />
        <QuickLink href="/discover" label="发现页" desc="每日推荐和随机天体" />
      </div>
    </div>
  );
}

function QuickLink({ href, label, desc }: { href: string; label: string; desc: string }) {
  return (
    <a href={href}>
      <Card className="transition-all hover:border-primary/50 hover:shadow-sm">
        <CardContent className="p-5">
          <CardTitle className="mb-1 text-base">{label}</CardTitle>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </CardContent>
      </Card>
    </a>
  );
}
