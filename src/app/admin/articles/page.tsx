import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import { DeleteArticleButton } from "./DeleteArticleButton";

const PER_PAGE = 15;

interface Props {
  searchParams: { page?: string };
}

export default async function AdminArticlesPage({ searchParams }: Props) {
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      include: { category: true },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.article.count(),
  ]);
  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">文章管理</h1>
      <p className="mb-6 text-sm text-muted-foreground">共 {total} 篇文章</p>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">全部文章</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">标题</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">分类</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">来源</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">日期</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">操作</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-b border-border transition-colors hover:bg-secondary/30">
                    <td className="max-w-xs truncate px-4 py-3 font-medium">{article.title}</td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
                        {article.category?.name ?? "未分类"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{article.sourceName}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {article.publishedAt?.toLocaleDateString("zh-CN") ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <DeleteArticleButton id={article.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Pagination currentPage={page} totalPages={totalPages} basePath="/admin/articles" />
    </div>
  );
}
