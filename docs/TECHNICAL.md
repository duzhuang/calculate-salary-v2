# 家教薪资助手 - 技术文档

## 1. 项目概述

基于原有 `calculate_salary` 项目的功能复刻与全面升级版本。原项目为桌面端 Web 应用，本项目重新设计为**移动端优先**的全栈应用，使用 Next.js + Tailwind CSS + SQLite/Prisma 替代原有的 CRA + json-server + CSS Modules 技术栈。

### 1.1 核心改进点

| 原项目问题 | 本项目改进 |
|-----------|-----------|
| json-server 仅限开发环境 | SQLite + Prisma 提供真实持久化数据库 |
| 高中年级（10-12）缺少价格配置 | 补全所有年级价格，支持自定义价格 |
| 客户端全量获取数据再聚合 | 服务端 API 按需查询，支持分页 |
| 桌面端布局，移动端体验差 | 移动端优先设计，底部 Tab 导航 |
| 无数据校验 | Zod schema 校验 + Prisma 约束 |
| CSS Modules 样式分散 | Tailwind CSS 统一设计系统 |
| 无 TypeScript | 全面 TypeScript 类型安全 |

---

## 2. 技术栈

| 层级 | 技术 | 版本 | 用途 |
|------|------|------|------|
| 框架 | Next.js (App Router) | 15.x | SSR/SSG、API Routes、文件路由 |
| UI | React | 19.x | 组件化 UI |
| 样式 | Tailwind CSS | 4.x | 原子化 CSS + 设计系统 |
| ORM | Prisma | 6.x | 数据库 ORM + 迁移 |
| 数据库 | SQLite | - | 轻量级本地数据库 |
| 校验 | Zod | 3.x | API 请求/响应校验 |
| 图标 | Lucide React | 0.400+ | SVG 图标库 |
| Excel | xlsx | 0.18+ | Excel 导入导出 |
| 类型 | TypeScript | 5.x | 类型安全 |
| 包管理 | pnpm | 9.x | 快速包管理器 |

---

## 3. 项目结构

```
calculate-salary-v2/
├── docs/
│   ├── TECHNICAL.md          # 技术文档
│   └── DESIGN.md             # 设计文档
├── prisma/
│   ├── schema.prisma         # 数据库 Schema
│   ├── seed.ts               # 种子数据
│   └── migrations/           # 迁移文件
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx        # 根布局（含底部导航）
│   │   ├── page.tsx          # 首页（当日记录）
│   │   ├── globals.css       # 全局样式 + Tailwind
│   │   ├── record/
│   │   │   ├── page.tsx      # 添加/编辑记录
│   │   │   └── [id]/
│   │   │       └── page.tsx  # 编辑记录
│   │   ├── students/
│   │   │   └── page.tsx      # 学生管理
│   │   ├── overview/
│   │   │   ├── page.tsx      # 年度总览
│   │   │   ├── [year]/
│   │   │   │   ├── page.tsx  # 月度总览
│   │   │   │   └── [month]/
│   │   │   │       └── page.tsx  # 日度详情
│   │   ├── export/
│   │   │   └── page.tsx      # 导出 Excel
│   │   ├── import/
│   │   │   └── page.tsx      # 导入 Excel
│   │   └── api/
│   │       ├── records/
│   │       │   ├── route.ts         # GET(列表) / POST(创建)
│   │       │   └── [id]/
│   │       │       └── route.ts     # GET/PUT/DELETE
│   │       ├── students/
│   │       │   ├── route.ts         # GET / POST
│   │       │   └── [id]/
│   │       │       └── route.ts     # GET/PUT/DELETE
│   │       ├── stats/
│   │       │   ├── day/route.ts     # 日度统计
│   │       │   ├── month/route.ts   # 月度统计
│   │       │   └── year/route.ts    # 年度统计
│   │       └── export/route.ts      # 服务端 Excel 导出
│   ├── components/           # 可复用组件
│   │   ├── ui/               # 基础 UI 组件
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── Skeleton.tsx
│   │   ├── record/           # 记录相关组件
│   │   │   ├── RecordForm.tsx
│   │   │   ├── RecordCard.tsx
│   │   │   ├── RecordItem.tsx
│   │   │   └── TimeRangePicker.tsx
│   │   ├── student/          # 学生相关组件
│   │   │   ├── StudentForm.tsx
│   │   │   └── StudentList.tsx
│   │   ├── overview/         # 总览相关组件
│   │   │   ├── DayCard.tsx
│   │   │   ├── MonthCard.tsx
│   │   │   └── YearCard.tsx
│   │   └── shared/           # 通用业务组件
│   │       ├── EmptyState.tsx
│   │       └── ConfirmDialog.tsx
│   ├── lib/                  # 工具库
│   │   ├── prisma.ts         # Prisma 客户端单例
│   │   ├── utils.ts          # 通用工具函数
│   │   ├── constants.ts      # 常量定义（年级、价格等）
│   │   └── validators.ts     # Zod 校验 Schema
│   ├── hooks/                # 自定义 Hooks
│   │   ├── useRecords.ts     # 记录 CRUD Hook
│   │   ├── useStudents.ts    # 学生 CRUD Hook
│   │   └── useStats.ts       # 统计数据 Hook
│   └── types/                # TypeScript 类型定义
│       ├── record.ts
│       ├── student.ts
│       └── stats.ts
├── public/
│   └── icons/                # PWA 图标
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── .env                      # 环境变量
```

---

## 4. 数据库设计 (Prisma Schema)

### 4.1 Schema 定义

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model Student {
  id        String   @id @default(cuid())
  name      String
  phone     String?
  grade     String   // "1"-"12"
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  records   Record[]
}

model Record {
  id           String   @id @default(cuid())
  recordDate   String   // "YYYY-MM-DD"
  weekDay      String   // "星期一" 等
  studentName  String
  studentGrade String   // "1"-"12"
  subject      String   // "1"-"9" 对应科目枚举
  teacherName  String   @default("裴斐然")
  classTimeStart String // "HH:MM"
  classTimeEnd   String // "HH:MM"
  classPeriod  Float    // 课时数（自动计算）
  classMain    String   @default("1") // "1"=正课, "2"=试听
  classWay     String   @default("2") // "1"=线上, "2"=线下
  classType    String   @default("1") // "1"=一对一, "2"=小班, "3"=大班
  salary       Float    // 薪资（自动计算）
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  student      Student? @relation(fields: [studentName, studentGrade], references: [name, grade])
}
```

### 4.2 数据模型说明

**Student（学生）**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String (CUID) | 主键 |
| name | String | 学生姓名 |
| phone | String? | 手机号（可选） |
| grade | String | 年级代码 "1"-"12" |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

**Record（教学记录）**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String (CUID) | 主键 |
| recordDate | String | 教学日期 "YYYY-MM-DD" |
| weekDay | String | 星期几（自动填充） |
| studentName | String | 学生姓名 |
| studentGrade | String | 学生年级代码 |
| subject | String | 科目代码 "1"-"9" |
| teacherName | String | 授课老师（默认"裴斐然"） |
| classTimeStart | String | 开始时间 "HH:MM" |
| classTimeEnd | String | 结束时间 "HH:MM" |
| classPeriod | Float | 课时数（自动计算） |
| classMain | String | "1"=正课, "2"=试听 |
| classWay | String | "1"=线上, "2"=线下 |
| classType | String | "1"=一对一, "2"=小班, "3"=大班 |
| salary | Float | 薪资（自动计算） |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

---

## 5. API 设计

### 5.1 RESTful API 路由

#### Records（教学记录）

| 方法 | 路径 | 说明 | 查询参数 |
|------|------|------|---------|
| GET | `/api/records` | 获取记录列表 | `?date=YYYY-MM-DD&year=YYYY&month=MM&page=1&limit=20` |
| POST | `/api/records` | 创建记录 | - |
| GET | `/api/records/[id]` | 获取单条记录 | - |
| PUT | `/api/records/[id]` | 更新记录 | - |
| DELETE | `/api/records/[id]` | 删除记录 | - |

#### Students（学生）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/students` | 获取学生列表 |
| POST | `/api/students` | 添加学生 |
| GET | `/api/students/[id]` | 获取单个学生 |
| PUT | `/api/students/[id]` | 更新学生 |
| DELETE | `/api/students/[id]` | 删除学生 |

#### Stats（统计数据）

| 方法 | 路径 | 说明 | 查询参数 |
|------|------|------|---------|
| GET | `/api/stats/day` | 日度统计 | `?year=YYYY&month=MM` |
| GET | `/api/stats/month` | 月度统计 | `?year=YYYY` |
| GET | `/api/stats/year` | 年度统计 | - |

#### Export（导出）

| 方法 | 路径 | 说明 | 查询参数 |
|------|------|------|---------|
| GET | `/api/export` | 导出 Excel | `?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` |

### 5.2 请求/响应示例

**POST /api/records**
```json
{
  "recordDate": "2025-05-28",
  "studentName": "张三",
  "studentGrade": "7",
  "subject": "1",
  "teacherName": "裴斐然",
  "classTimeStart": "14:00",
  "classTimeEnd": "16:00",
  "classMain": "1",
  "classWay": "2",
  "classType": "1"
}
```

**响应 (201)**
```json
{
  "id": "clx1234567890",
  "recordDate": "2025-05-28",
  "weekDay": "星期三",
  "studentName": "张三",
  "studentGrade": "7",
  "subject": "1",
  "teacherName": "裴斐然",
  "classTimeStart": "14:00",
  "classTimeEnd": "16:00",
  "classPeriod": 2.0,
  "classMain": "1",
  "classWay": "2",
  "classType": "1",
  "salary": 260.0,
  "createdAt": "2025-05-28T10:00:00Z",
  "updatedAt": "2025-05-28T10:00:00Z"
}
```

**GET /api/stats/day?year=2025&month=5**
```json
[
  {
    "date": "2025-05-28",
    "totalPeriod": 4.5,
    "totalSalary": 585,
    "recordCount": 2,
    "records": [...]
  },
  ...
]
```

### 5.3 校验规则 (Zod)

```typescript
// src/lib/validators.ts
import { z } from 'zod';

export const createRecordSchema = z.object({
  recordDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  studentName: z.string().min(1, "学生姓名不能为空"),
  studentGrade: z.enum(["1","2","3","4","5","6","7","8","9","10","11","12"]),
  subject: z.enum(["1","2","3","4","5","6","7","8","9"]),
  teacherName: z.string().default("裴斐然"),
  classTimeStart: z.string().regex(/^\d{2}:\d{2}$/),
  classTimeEnd: z.string().regex(/^\d{2}:\d{2}$/),
  classMain: z.enum(["1", "2"]).default("1"),
  classWay: z.enum(["1", "2"]).default("2"),
  classType: z.enum(["1", "2", "3"]).default("1"),
});

export const createStudentSchema = z.object({
  name: z.string().min(1, "姓名不能为空"),
  phone: z.string().optional(),
  grade: z.enum(["1","2","3","4","5","6","7","8","9","10","11","12"]),
});
```

---

## 6. 薪资计算逻辑

### 6.1 年级价格表（已补全高中）

```typescript
// src/lib/constants.ts

export const GRADE_PRICE: Record<string, number> = {
  "1": 110,  "2": 110,  "3": 110,   // 小学低年级
  "4": 120,  "5": 120,  "6": 120,   // 小学高年级
  "7": 130,                             // 初一
  "8": 140,                             // 初二
  "9": 150,                             // 初三
  "10": 160, "11": 170, "12": 180,   // 高中（新增）
};

export function calculateSalary(grade: string, classPeriod: number): number {
  const price = GRADE_PRICE[grade];
  if (!price) throw new Error(`未知年级: ${grade}`);
  return Number((classPeriod * price).toFixed(2));
}

export function calculateClassPeriod(startTime: string, endTime: string): number {
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  const diffMinutes = (endH * 60 + endM) - (startH * 60 + startM);
  return Number((diffMinutes / 60).toFixed(1));
}
```

### 6.2 计算规则

- **课时** = (结束时间 - 开始时间) / 60 分钟
- **薪资** = 课时 × 年级时薪
- 薪资在服务端计算并存储，不依赖客户端计算

---

## 7. 环境配置

### 7.1 环境变量

```env
# .env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_NAME="家教薪资助手"
```

### 7.2 初始化命令

```bash
# 安装依赖
pnpm install

# 初始化数据库
pnpm prisma migrate dev --name init

# 生成 Prisma Client
pnpm prisma generate

# 填充种子数据（可选）
pnpm prisma db seed

# 启动开发服务器
pnpm dev
```

---

## 8. 部署方案

### 8.1 本地部署

```bash
# 构建
pnpm build

# 启动
pnpm start
```

### 8.2 Vercel 部署（推荐）

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量 `DATABASE_URL`
4. 使用 Vercel Postgres 或 Turso 替换 SQLite

### 8.3 Docker 部署

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```
