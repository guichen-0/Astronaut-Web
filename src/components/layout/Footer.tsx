import Link from "next/link";
import { Star } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

const FOOTER_LINKS = [
  {
    title: "百科",
    links: [
      { href: "/planets", label: "行星" },
      { href: "/stars", label: "恒星" },
      { href: "/constellations", label: "星座" },
    ],
  },
  {
    title: "探索",
    links: [
      { href: "/starmap", label: "交互式星图" },
      { href: "/events", label: "天文事件" },
      { href: "/discover", label: "每日发现" },
    ],
  },
  {
    title: "其他",
    links: [
      { href: "/news", label: "天文资讯" },
      { href: "/tools", label: "天文工具" },
      { href: "/search", label: "搜索" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 text-lg font-bold">
              <Star className="h-5 w-5 text-primary" />
              <span>{SITE_NAME}</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              探索宇宙的奥秘，从仰望星空开始。
            </p>
          </div>

          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <h4 className="mb-3 text-sm font-semibold">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {SITE_NAME}. 保留所有权利。</p>
        </div>
      </div>
    </footer>
  );
}
