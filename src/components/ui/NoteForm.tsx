"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  entityType: string;
  entityId: string;
  entityName: string;
}

export function NoteForm({ entityType, entityId, entityName }: Props) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityType,
          entityId,
          title: title || `关于${entityName}的笔记`,
          content,
        }),
      });
      setDone(true);
      setTitle("");
      setContent("");
      setTimeout(() => { setDone(false); setOpen(false); }, 2000);
    } catch {}
    setSaving(false);
  };

  if (!session?.user?.id) return null;

  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50"
        >
          <FileText className="h-3.5 w-3.5" />
          记笔记
        </button>
      ) : (
        <div className="rounded-lg border border-border bg-card p-4">
          <h4 className="mb-3 text-sm font-medium">记录笔记 - {entityName}</h4>
          <input
            className="mb-2 w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm"
            placeholder="笔记标题（可选）"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="mb-3 min-h-[80px] w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm"
            placeholder="写下你的笔记..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} disabled={saving || !content.trim()}>
              {saving ? "保存中..." : done ? "已保存 ✓" : "保存笔记"}
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>
              取消
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
