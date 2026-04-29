import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { User, Bookmark, FileText, Calendar } from "lucide-react";

const TYPE_LABELS: Record<string, string> = {
  planet: "行星",
  star: "恒星",
  constellation: "星座",
  article: "资讯",
};

const TYPE_COLORS: Record<string, string> = {
  planet: "bg-blue-500/10 text-blue-500",
  star: "bg-yellow-500/10 text-yellow-500",
  constellation: "bg-purple-500/10 text-purple-500",
  article: "bg-green-500/10 text-green-500",
};

async function getUserData(userId: string) {
  try {
    const [favorites, notes, user] = await Promise.all([
      prisma.favorite.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 20 }),
      prisma.userNote.findMany({ where: { userId }, orderBy: { updatedAt: "desc" }, take: 10 }),
      prisma.user.findUnique({ where: { id: userId } }),
    ]);
    return { favorites, notes, user };
  } catch {
    return { favorites: [], notes: [], user: null };
  }
}

function getEntityUrl(fav: { entityType: string; entityId: string }): string {
  switch (fav.entityType) {
    case "planet": return `/planets/${fav.entityId}`;
    case "star": return `/stars/${fav.entityId}`;
    case "constellation": return `/constellations/${fav.entityId.toLowerCase()}`;
    case "article": return `/news/${fav.entityId}`;
    default: return "#";
  }
}

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { favorites, notes, user } = await getUserData(session.user.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Profile Header */}
      <div className="mb-10 overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/5 to-transparent p-8">
        <div className="flex items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20">
            <User className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user?.name ?? "用户"}</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                注册于 {user?.createdAt?.toLocaleDateString("zh-CN") ?? "—"}
              </span>
              <span>{favorites.length} 收藏</span>
              <span>{notes.length} 笔记</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Favorites */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-primary" />
              我的收藏
            </CardTitle>
          </CardHeader>
          <CardContent>
            {favorites.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                还没有收藏任何内容
              </p>
            ) : (
              <div className="divide-y divide-border/60">
                {favorites.map((fav) => (
                  <a
                    key={fav.id}
                    href={getEntityUrl(fav)}
                    className="flex items-center justify-between py-3 transition-colors hover:text-foreground"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`rounded px-1.5 py-0.5 text-xs ${TYPE_COLORS[fav.entityType] ?? "bg-secondary text-muted-foreground"}`}>
                        {TYPE_LABELS[fav.entityType] ?? fav.entityType}
                      </span>
                      <span className="text-sm font-medium">{fav.entityId}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {fav.createdAt.toLocaleDateString("zh-CN")}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              最近笔记
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notes.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                还没有记录任何笔记
              </p>
            ) : (
              <div className="divide-y divide-border/60">
                {notes.map((note) => (
                  <div key={note.id} className="py-3">
                    <p className="text-sm font-medium">{note.title || "无标题笔记"}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {note.content}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground/60">
                      {note.updatedAt.toLocaleDateString("zh-CN")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
