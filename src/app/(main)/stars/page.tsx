import Link from "next/link";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { starApi } from "@/lib/api";

const SPECTRAL_COLORS: Record<string, string> = {
  O: "text-blue-300",
  B: "text-blue-400",
  A: "text-blue-200",
  F: "text-yellow-200",
  G: "text-yellow-300",
  K: "text-orange-300",
  M: "text-red-300",
};

function getSpectralColor(type: string | null): string {
  if (!type) return "text-foreground";
  const first = type[0].toUpperCase();
  return SPECTRAL_COLORS[first] ?? "text-foreground";
}

const PER_PAGE = 30;

export const dynamic = "force-dynamic";

interface Props {
  searchParams: { page?: string };
}

export default async function StarsPage({ searchParams }: Props) {
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);
  const { data: allStars } = await starApi.list({ limit: 500 }).catch(() => ({ data: [] }));
  const total = allStars.length;
  const totalPages = Math.ceil(total / PER_PAGE);
  const stars = allStars.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold">恒星目录</h1>
        <p className="mt-2 text-muted-foreground">
          共 {total} 颗恒星 · 第 {page}/{totalPages} 页
        </p>
      </div>

      <div className="mb-8">
        <div className="relative mx-auto max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索恒星..."
            className="pl-9"
            disabled
          />
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          使用顶部搜索栏查找特定恒星
        </p>
      </div>

      {stars.length === 0 ? (
        <p className="text-center text-muted-foreground">暂无恒星数据 — 请先配置数据库并导入种子数据。</p>
      ) : (
        <>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">名称</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">拜耳命名</th>
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground">视星等</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">光谱类型</th>
                      <th className="hidden px-4 py-3 text-right font-medium text-muted-foreground sm:table-cell">距离 (pc)</th>
                      <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">星座</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stars.map((star) => (
                      <tr
                        key={star.id}
                        className="border-b border-border transition-colors hover:bg-secondary/50"
                      >
                        <td className="px-4 py-3">
                          <Link href={`/stars/${star.id}`} className="font-medium hover:text-primary">
                            {star.name ?? "—"}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {star.bayerDesignation ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-right font-mono">
                          {star.apparentMagnitude.toFixed(2)}
                        </td>
                        <td className={`px-4 py-3 font-mono ${getSpectralColor(star.spectralType)}`}>
                          {star.spectralType ?? "—"}
                        </td>
                        <td className="hidden px-4 py-3 text-right font-mono sm:table-cell">
                          {star.distanceParsecs ? star.distanceParsecs.toFixed(1) : "—"}
                        </td>
                        <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                          {star.constellationAbbreviation ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          <Pagination currentPage={page} totalPages={totalPages} basePath="/stars" />
        </>
      )}
    </div>
  );
}
