import { Star } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="starfield flex min-h-screen flex-col items-center justify-center px-4">
      {/* Cosmic background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-transparent to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent" />

      {/* Logo */}
      <Link href="/" className="relative mb-8 flex items-center gap-2 text-lg font-bold transition-opacity hover:opacity-80">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Star className="h-4 w-4" />
        </div>
        <span>天文探索</span>
      </Link>

      <div className="relative w-full max-w-sm">
        <div className="rounded-xl border border-border/60 bg-card p-8 shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
