import Link from "next/link";
import { ArrowRight, Globe, Star, Telescope, Satellite, Sparkles } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DailyPick } from "@/components/ui/DailyPick";
import { SITE_NAME } from "@/lib/constants";

const FEATURES = [
  {
    title: "行星百科",
    description: "了解太阳系八大行星的奥秘",
    href: "/planets",
    icon: Globe,
  },
  {
    title: "恒星目录",
    description: "探索宇宙中的璀璨恒星",
    href: "/stars",
    icon: Star,
  },
  {
    title: "交互式星图",
    description: "在3D星空中自由漫游",
    href: "/starmap",
    icon: Telescope,
  },
  {
    title: "天文资讯",
    description: "获取最新的天文发现和新闻",
    href: "/news",
    icon: Satellite,
  },
  {
    title: "每日发现",
    description: "每天了解一个天文奇观",
    href: "/discover",
    icon: Sparkles,
  },
  {
    title: "天文工具",
    description: "距离换算、观测规划等实用工具",
    href: "/tools",
    icon: Telescope,
  },
];

export default async function HomePage() {
  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="starfield relative flex min-h-[80vh] items-center justify-center overflow-hidden">
        {/* Cosmic background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 via-indigo-950/20 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-800/20 via-indigo-900/10 to-transparent" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute left-1/4 top-1/3 h-[300px] w-[300px] rounded-full bg-indigo-500/5 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            探索宇宙，从仰望星空开始
          </div>

          <h1 className="animate-fade-in text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
            探索宇宙的
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              奥秘
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground/80">
            {SITE_NAME} 是一个全面的天文科普平台，带你了解行星、恒星、星座的奥秘，
            追踪天文事件，在交互式星图中遨游宇宙。
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/planets">
              <Button size="lg" className="group">
                开始探索
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="/starmap">
              <Button variant="secondary" size="lg">
                打开星图
              </Button>
            </Link>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Daily Pick — APOD-style */}
      <DailyPick />

      {/* Features Grid */}
      <section className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold">探索宇宙的方方面面</h2>
          <p className="mt-3 text-muted-foreground">从太阳系到深空，一站式了解天文知识</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Link key={feature.href} href={feature.href}>
              <Card className="group h-full transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="mb-5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-4 text-primary ring-1 ring-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:from-primary/15 group-hover:to-primary/10">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <CardTitle className="mb-2 text-lg">{feature.title}</CardTitle>
                  <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-4xl px-4 text-center">
        <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-blue-950/30 via-primary/5 to-purple-950/30 p-12">
          <div className="absolute right-0 top-0 h-32 w-32 translate-x-1/4 -translate-y-1/4 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative">
            <h2 className="text-2xl font-bold">加入我们的天文社区</h2>
            <p className="mt-4 text-muted-foreground">
              注册账号即可收藏你喜爱的天体、记录观测笔记，定制你的宇宙探索之旅。
            </p>
            <div className="mt-8">
              <Link href="/register">
                <Button size="lg">
                  立即注册
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
