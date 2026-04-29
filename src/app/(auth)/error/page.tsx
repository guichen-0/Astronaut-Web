import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function AuthErrorPage() {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold">认证错误</h1>
      <p className="mt-2 text-muted-foreground">登录过程中出现问题，请重试</p>
      <Link href="/login" className="mt-6 inline-block">
        <Button>返回登录</Button>
      </Link>
    </div>
  );
}
