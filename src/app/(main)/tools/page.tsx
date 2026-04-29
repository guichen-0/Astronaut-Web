import { Calculator, Ruler, Eye } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import Link from "next/link";

const TOOLS = [
  {
    title: "单位转换器",
    description: "天文单位转换：光年、秒差距、天文单位等",
    icon: Ruler,
    href: "/tools/converter",
  },
  {
    title: "距离计算器",
    description: "计算两颗恒星之间的空间距离",
    icon: Calculator,
    href: "/tools/distance",
  },
  {
    title: "观测可见性",
    description: "查询特定天体的观测可见性",
    icon: Eye,
    href: "/tools/visibility",
  },
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold">天文工具</h1>
        <p className="mt-2 text-muted-foreground">实用的天文计算和转换工具</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <Link key={tool.href} href={tool.href}>
            <Card className="group h-full transition-all duration-300 hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5">
              <CardContent className="p-8">
                <div className="mb-5 inline-flex rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-4 text-primary ring-1 ring-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:from-primary/15 group-hover:to-primary/10">
                  <tool.icon className="h-7 w-7" />
                </div>
                <CardTitle className="mb-2">{tool.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
