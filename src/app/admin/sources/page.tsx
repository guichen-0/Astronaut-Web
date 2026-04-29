import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ToggleSourceButton } from "./ToggleSourceButton";
import { DeleteSourceButton } from "./DeleteSourceButton";

export default async function AdminSourcesPage() {
  const sources = await prisma.crawlSource.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">爬虫源管理</h1>
      <p className="mb-6 text-sm text-muted-foreground">共 {sources.length} 个爬虫源</p>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">全部爬虫源</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">名称</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">网址</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Feed</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">间隔(分钟)</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">状态</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">操作</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((source) => (
                  <tr key={source.id} className="border-b border-border transition-colors hover:bg-secondary/30">
                    <td className="px-4 py-3 font-medium">{source.name}</td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-muted-foreground">
                      {source.baseUrl}
                    </td>
                    <td className="max-w-[150px] truncate px-4 py-3 text-muted-foreground">
                      {source.feedUrl ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">{source.crawlIntervalMinutes}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${
                        source.isActive
                          ? "bg-green-500/10 text-green-600"
                          : "bg-secondary text-muted-foreground"
                      }`}>
                        {source.isActive ? "活跃" : "停用"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <ToggleSourceButton id={source.id} isActive={source.isActive} />
                        <DeleteSourceButton id={source.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
