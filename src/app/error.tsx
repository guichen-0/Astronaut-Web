"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <AlertTriangle className="mb-6 h-16 w-16 text-destructive/60" />
      <h1 className="mb-2 text-4xl font-bold">出了点问题</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        服务器遇到了一些干扰，请稍后重试。
      </p>
      <div className="flex gap-4">
        <Button onClick={reset}>重试</Button>
        <a href="/">
          <Button variant="secondary">返回首页</Button>
        </a>
      </div>
    </div>
  );
}
