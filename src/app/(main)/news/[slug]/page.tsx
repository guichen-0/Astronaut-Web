import { notFound } from "next/navigation";
import { articleApi } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/Card";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

interface Props {
  params: { slug: string };
}

export default async function NewsDetailPage({ params }: Props) {
  const { data: article } = await articleApi.get(params.slug).catch(() => ({ data: null }));
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Breadcrumb items={[{ label: "天文资讯", href: "/news" }, { label: article.title }]} />

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

      <h1 className="mb-4 text-3xl font-bold">{article.title}</h1>

      {article.author && (
        <p className="mb-8 text-sm text-muted-foreground">作者: {article.author}</p>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed text-muted-foreground [&>p]:mb-4">
            {article.content.split("\n\n").map((paragraph: string, i: number) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </CardContent>
      </Card>

      {article.sourceUrl && (
        <p className="mt-4 text-xs text-muted-foreground">
          来源:{" "}
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            {article.sourceName}
          </a>
        </p>
      )}
    </div>
  );
}
