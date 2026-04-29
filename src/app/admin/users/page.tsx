import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { UserRoleToggle } from "./UserRoleToggle";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { favorites: true, notes: true } },
    },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">用户管理</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">全部用户 ({users.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">用户名</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">邮箱</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">角色</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">收藏</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">笔记</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">注册时间</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border transition-colors hover:bg-secondary/30">
                    <td className="px-4 py-3 font-medium">{user.name ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        user.role === "ADMIN"
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-secondary text-muted-foreground"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{user._count.favorites}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{user._count.notes}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.createdAt.toLocaleDateString("zh-CN")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <UserRoleToggle userId={user.id} currentRole={user.role} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
