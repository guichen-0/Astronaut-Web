"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface Source {
  id: string;
  name: string;
  baseUrl: string;
  feedUrl: string | null;
  isActive: boolean;
  lastCrawledAt: string | null;
  crawlIntervalMinutes: number;
}

interface SchedulerStatus {
  running: boolean;
  isActive: boolean;
  lastRun: string | null;
  runCount: number;
}

export default function CrawlerAdminPage() {
  const { status } = useSession();
  const [sources, setSources] = useState<Source[]>([]);
  const [scheduler, setScheduler] = useState<SchedulerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [crawling, setCrawling] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (status === "authenticated") fetchStatus();
  }, [status]);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/crawler");
      const json = await res.json();
      setSources(json.data?.sources ?? []);
      setScheduler(json.data?.scheduler ?? null);
    } catch {}
    setLoading(false);
  };

  const doAction = async (action: string, sourceId?: string) => {
    setCrawling(true);
    setActionMsg("");
    const body: Record<string, unknown> = { action };
    if (sourceId) body.sourceId = sourceId;
    try {
      const res = await fetch("/api/crawler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();

      if (action === "crawl-all" || action === "crawl-one") {
        const r = json.data;
        const msg = `抓取完成: ${r.count ?? 0} 篇文章, ${r.errors ?? 0} 个错误`;
        setLog((prev) => [msg, ...prev].slice(0, 50));
        setActionMsg(msg);
      } else {
        setActionMsg(`操作成功: ${json.data?.status ?? ""}`);
      }

      fetchStatus();
    } catch {
      setActionMsg("操作失败");
    }
    setCrawling(false);
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">爬虫管理</h1>
        <p className="mt-1 text-muted-foreground">管理天文资讯抓取任务</p>
      </div>

      {/* Scheduler Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">调度器状态</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">状态</p>
              <p className={`font-medium ${scheduler?.isActive ? "text-green-600" : "text-muted-foreground"}`}>
                {scheduler?.isActive ? "运行中" : "未启动"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">正在抓取</p>
              <p className="font-medium">{scheduler?.running ? "是" : "否"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">上次运行</p>
              <p className="font-medium">
                {scheduler?.lastRun
                  ? new Date(scheduler.lastRun).toLocaleString("zh-CN")
                  : "从未"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">运行次数</p>
              <p className="font-medium">{scheduler?.runCount ?? 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Button onClick={() => doAction("crawl-all")} disabled={crawling}>
          {crawling ? "抓取中..." : "抓取全部源"}
        </Button>
        <Button
          variant="secondary"
          onClick={() => doAction("start-scheduler")}
          disabled={scheduler?.isActive}
        >
          启动调度器
        </Button>
        <Button
          variant="secondary"
          onClick={() => doAction("stop-scheduler")}
          disabled={!scheduler?.isActive}
        >
          停止调度器
        </Button>
      </div>

      {actionMsg && (
        <p className="mb-4 text-sm text-primary">{actionMsg}</p>
      )}

      {/* Crawl Sources */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">爬虫源 ({sources.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {sources.length === 0 ? (
            <p className="text-sm text-muted-foreground">没有配置爬虫源</p>
          ) : (
            <div className="divide-y divide-border">
              {sources.map((source) => (
                <div key={source.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`h-2 w-2 rounded-full ${source.isActive ? "bg-green-500" : "bg-gray-400"}`} />
                      <p className="font-medium">{source.name}</p>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{source.baseUrl}</p>
                    <p className="text-xs text-muted-foreground">
                      间隔: {source.crawlIntervalMinutes} 分钟
                      {source.lastCrawledAt && ` · 上次: ${new Date(source.lastCrawledAt).toLocaleString("zh-CN")}`}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => doAction("crawl-one", source.id)}
                    disabled={crawling}
                  >
                    抓取
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Log */}
      {log.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">运行日志</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-60 space-y-1 overflow-y-auto font-mono text-xs">
              {log.map((msg, i) => (
                <p key={i} className="text-muted-foreground">
                  {msg}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
