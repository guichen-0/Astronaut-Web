import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <Star className="mb-6 h-16 w-16 text-primary/40" />
      <h1 className="mb-2 text-6xl font-bold text-foreground">404</h1>
      <h2 className="mb-4 text-xl font-semibold">页面未找到</h2>
      <p className="mb-8 max-w-md text-muted-foreground">
        你寻找的星辰似乎不在这片星图中。也许它被黑洞吞噬了，或者地址输入有误。
      </p>
      <div className="flex gap-4">
        <Link href="/">
          <Button>返回首页</Button>
        </Link>
        <Link href="/starmap">
          <Button variant="secondary">去星图看看</Button>
        </Link>
      </div>
    </div>
  );
}
