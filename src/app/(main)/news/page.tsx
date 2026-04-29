import { articleApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import Link from "next/link";

export const dynamic = "force-dynamic";

const PER_PAGE = 10;

interface Props {
  searchParams: { page?: string };
}

export default async function NewsPage({ searchParams }: Props) {
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);

  const { data: articles, totalPages } = await articleApi.list({ page, perPage: PER_PAGE }).catch(() => ({ data: [], totalPages: 0 }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold">天文资讯</h1>
        <p className="mt-2 text-muted-foreground">
          来自全球天文机构的最新资讯 · 第 {page}/{totalPages} 页
        </p>
      </div>

      {articles.length === 0 ? (
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>暂无资讯</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">资讯模块尚未抓取数据，请先运行爬虫或手动导入数据。</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-6">
            {articles.map((article) => (
              <Link key={article.id} href={`/news/${article.slug}`}>
                <Card className="transition-all hover:border-primary/50">
                  <CardContent className="p-6">
                    <div className="mb-2 flex items-center gap-2">
                      {article.category && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                          {article.category.name}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {article.publishedAt?.toLocaleDateString("zh-CN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span className="text-xs text-muted-foreground">{article.sourceName}</span>
                    </div>
                    <h2 className="mb-2 text-xl font-semibold">{article.title}</h2>
                    {article.summary && (
                      <p className="line-clamp-2 text-sm text-muted-foreground">{article.summary}</p>
                    )}
                    {article.author && (
                      <p className="mt-2 text-xs text-muted-foreground">作者: {article.author}</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} basePath="/news" />
        </>
      )}
    </div>
  );
}
