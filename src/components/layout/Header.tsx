import Link from "next/link";
import { Star } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { AuthButtons } from "./AuthButtons";
import { MobileNav } from "./MobileNav";
import { SITE_NAME } from "@/lib/constants";
import { auth } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/planets", label: "行星" },
  { href: "/stars", label: "恒星" },
  { href: "/constellations", label: "星座" },
  { href: "/events", label: "天文事件" },
  { href: "/starmap", label: "星图" },
  { href: "/news", label: "资讯" },
  { href: "/discover", label: "发现" },
  { href: "/tools", label: "工具" },
];

export async function Header() {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 lg:gap-6">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-bold transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Star className="h-4 w-4" />
          </div>
          <span className="hidden sm:inline">{SITE_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="rounded-lg px-3 py-2 text-sm text-amber-500 transition-all hover:bg-amber-500/10"
            >
              管理
            </Link>
          )}
        </nav>

        <MobileNav items={NAV_ITEMS} isAdmin={isAdmin} />

        <div className="flex flex-1 items-center justify-end gap-2">
          <SearchBar />
          <AuthButtons />
        </div>
      </div>
    </header>
  );
}
