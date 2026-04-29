"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ToggleSourceButton({ id, isActive }: { id: string; isActive: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    setLoading(true);
    try {
      await fetch("/api/admin/sources", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !isActive }),
      });
      router.refresh();
    } catch {}
    setLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent disabled:opacity-50"
    >
      {loading ? "..." : isActive ? "停用" : "启用"}
    </button>
  );
}
