import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { BarChart3, Globe, Newspaper, Users, Settings, Cpu } from "lucide-react";
import Link from "next/link";

const SIDEBAR_ITEMS = [
  { href: "/admin", label: "仪表盘", icon: BarChart3 },
  { href: "/admin/users", label: "用户管理", icon: Users },
  { href: "/admin/articles", label: "文章管理", icon: Newspaper },
  { href: "/admin/sources", label: "爬虫源管理", icon: Globe },
  { href: "/admin/crawler", label: "爬虫控制", icon: Cpu },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-border bg-card lg:block">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <Settings className="h-5 w-5 text-primary" />
          <span className="font-bold">后台管理</span>
        </div>
        <nav className="space-y-1 p-4">
          {SIDEBAR_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile nav */}
      <div className="flex h-14 items-center gap-3 border-b border-border bg-card px-4 lg:hidden">
        <Settings className="h-5 w-5 text-primary" />
        <span className="font-bold">后台管理</span>
        <div className="flex gap-2 overflow-x-auto ml-4">
          {SIDEBAR_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-md bg-secondary px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
      </div>
    </div>
  );
}
