"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function AuthButtons() {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <Link href="/profile">
        <Button variant="ghost" size="sm">
          {session.user.name ?? "个人中心"}
        </Button>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/login">
        <Button variant="ghost" size="sm">
          登录
        </Button>
      </Link>
      <Link href="/register">
        <Button size="sm">注册</Button>
      </Link>
    </div>
  );
}
