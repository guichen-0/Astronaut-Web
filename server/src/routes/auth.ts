import { Router, Request, Response } from "express";
import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../prisma";
import { config } from "../config";

export const authRouter = Router();

const registerSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

authRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "该邮箱已注册" });
    }

    const passwordHash = await hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, passwordHash, role: "USER" },
    });

    const token = jwt.sign({ userId: user.id, role: user.role }, config.jwtSecret, { expiresIn: "7d" });

    res.status(201).json({
      data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } },
    });
  } catch (e: any) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ error: "输入数据无效", details: e.errors });
    }
    res.status(500).json({ error: "注册失败" });
  }
});

authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "请输入邮箱和密码" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: "邮箱或密码错误" });
    }

    const valid = await compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "邮箱或密码错误" });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, config.jwtSecret, { expiresIn: "7d" });

    res.json({
      data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } },
    });
  } catch {
    res.status(500).json({ error: "登录失败" });
  }
});

authRouter.get("/me", async (req: Request, res: Response) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "未登录" });
  }
  try {
    const token = header.slice(7);
    const payload = jwt.verify(token, config.jwtSecret) as { userId: string; role: string };
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) return res.status(404).json({ error: "用户不存在" });
    res.json({ data: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch {
    res.status(401).json({ error: "Token 无效" });
  }
});
