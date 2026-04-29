# Astronaut Web — 全栈天文科普平台

一个基于 Next.js 14 + Three.js + Express 的天文科普网站，包含 3D 交互星图、行星/恒星/星座百科、天文事件日历、资讯爬虫等功能。

## 技术栈

| 前端 | 后端 | 数据库 |
|------|------|--------|
| Next.js 14 (App Router) | Express.js | SQLite + Prisma |
| TypeScript + Tailwind CSS | JWT 认证 | Prisma ORM |
| Three.js + R3F (3D 星图) | RESTful API | 种子数据 |

## 功能

- **行星百科** — 太阳系 8 大行星 + 5 颗矮行星的详细数据
- **恒星目录** — 87 颗亮星数据，支持按星座/星等筛选
- **星座大全** — 88 星座按季节分组，含 SVG 星图图形
- **3D 交互星图** — Three.js 渲染，支持缩放/平移/点击查看恒星信息，含星座连线
- **天文事件** — 即将发生的天文事件日历
- **资讯聚合** — 多源天文新闻抓取与展示
- **用户系统** — 注册/登录、收藏、笔记
- **天文工具** — 单位转换、距离计算、恒星可见性计算

## 快速开始

### 环境要求

- Node.js 18+
- npm

### 安装

```bash
# 克隆仓库
git clone https://github.com/guichen-0/Astronaut-Web.git
cd Astronaut-Web

# 安装前端依赖
npm install

# 安装后端依赖
cd server && npm install && cd ..

# 生成 Prisma 客户端
npx prisma generate

# 导入种子数据（行星、恒星、星座）
npx prisma db seed
```

### 配置环境变量

```bash
# 复制环境变量文件
cp .env .env.local
```

编辑 `.env.local`，根据需要修改：
- `DATABASE_URL` — SQLite 数据库路径（默认 `file:./dev.db`）
- `API_URL` — 后端 API 地址（默认 `http://localhost:4000/api`）
- `NEXTAUTH_SECRET` — 登录加密密钥
- `NASA_API_KEY` — NASA API 密钥（可选，用于 APOD）

### 启动

需要同时启动后端和前端两个服务：

**终端 1 — 后端 API 服务（端口 4000）：**
```bash
cd server
npx tsx src/index.ts
```

**终端 2 — 前端页面服务（端口 3000）：**
```bash
npm run dev
```

浏览器打开 `http://localhost:3000` 即可访问。

## 项目结构

```
├── server/              # Express 后端 API
│   └── src/
│       ├── routes/      # API 路由模块
│       └── middleware/   # 认证中间件
├── prisma/
│   ├── schema.prisma    # 数据模型
│   └── seeds/           # 种子数据
├── src/
│   ├── app/             # Next.js 页面路由
│   │   ├── (main)/      # 主站页面组
│   │   ├── (auth)/      # 登录注册
│   │   └── admin/       # 后台管理
│   ├── components/      # 组件
│   │   ├── starmap/     # 3D 星图组件
│   │   ├── layout/      # 布局组件
│   │   └── ui/          # 通用 UI
│   └── lib/             # 工具库
├── src/data/            # JSON 种子数据
└── src/crawler/         # 资讯爬虫模块
```

## 前后端分离架构

前端 Next.js 通过 `src/lib/api.ts` 调用后端 Express API。开发环境下，Next.js 自动将 `/api/*` 请求代理到 `localhost:4000`。
