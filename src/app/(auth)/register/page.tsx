import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">创建账号</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">开启你的宇宙探索之旅</p>
      </div>
      <RegisterForm />
    </div>
  );
}
