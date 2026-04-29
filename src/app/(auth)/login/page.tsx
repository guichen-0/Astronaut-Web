import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">欢迎回来</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">登录你的天文探索账号</p>
      </div>
      <LoginForm />
    </div>
  );
}
