"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { useSession } from "next-auth/react";

interface Props {
  entityType: string;
  entityId: string;
}

export function FavoriteButton({ entityType, entityId }: Props) {
  const { data: session } = useSession();
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch("/api/favorites")
      .then((r) => r.json())
      .then((d) => {
        const favs = d.data ?? [];
        setIsFav(favs.some((f: { entityType: string; entityId: string }) => f.entityType === entityType && f.entityId === entityId));
      })
      .catch(() => {});
  }, [session, entityType, entityId]);

  const toggle = async () => {
    if (!session?.user?.id) {
      window.location.href = "/login";
      return;
    }
    setLoading(true);
    try {
      if (isFav) {
        await fetch("/api/favorites", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entityType, entityId }),
        });
        setIsFav(false);
      } else {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entityType, entityId }),
        });
        setIsFav(true);
      }
    } catch {}
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        isFav
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:border-primary/50"
      }`}
    >
      <Bookmark className={`h-3.5 w-3.5 ${isFav ? "fill-primary" : ""}`} />
      {isFav ? "已收藏" : "收藏"}
    </button>
  );
}
