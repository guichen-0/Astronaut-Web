"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  currentRole: string;
}

export function UserRoleToggle({ userId, currentRole }: Props) {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(currentRole);
  const router = useRouter();

  const toggleRole = async () => {
    setLoading(true);
    const newRole = role === "ADMIN" ? "USER" : "ADMIN";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        setRole(newRole);
        router.refresh();
      }
    } catch {}
    setLoading(false);
  };

  return (
    <button
      onClick={toggleRole}
      disabled={loading}
      className="rounded px-2 py-1 text-xs transition-colors hover:bg-accent disabled:opacity-50"
    >
      {loading ? "..." : role === "ADMIN" ? "降为USER" : "提升ADMIN"}
    </button>
  );
}
