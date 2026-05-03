# 逆袭Offer — AI 求职突围智能体

面向低经验大学生的 AI 驱动求职陪跑平台，通过六步闭环帮助学生完成从经历挖掘到面试准备的完整求职流程。

## 核心功能

| 步骤 | 功能 | 说明 |
|------|------|------|
| 1 | AI 求职画像 | 输入个人信息与经历，AI 生成职业诊断报告 |
| 2 | 经历能力转译 | 将日常生活经历转化为可写入简历的能力描述 |
| 3 | 岗位 JD 解析 | 粘贴岗位描述，AI 提取关键要求与能力模型 |
| 4 | 人岗匹配雷达 | 五维雷达图 + 匹配分数，一目了然差距所在 |
| 5 | 可信简历优化 | AI 对比优化前后，生成更专业的简历内容 |
| 6 | 面试 + 能力计划 | 模拟面试追问对话 + 7/14/30 天能力提升计划 |

**附加功能：** 汇总报告 · 一键 Demo 体验 · 暗色模式 · 响应式布局 · 简历创建器（多模板 + PDF 导出）

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) + React 19 + TypeScript |
| 认证 | JWT (jose) — HttpOnly Cookie，无数据库依赖 |
| AI | OpenAI 兼容协议，支持 DeepSeek / OpenAI / 智谱 / 阿里云 |
| 样式 | Vanilla CSS + CSS Variables + BEM 命名 + IconFont SVG Sprite |
| 状态 | React Context + useReducer，持久化至 localStorage |
| 部署 | Vercel / Docker |

## 本地启动

```bash
# 1. 克隆项目
git clone https://github.com/zkite626/counterattack-offer.git
cd counterattack-offer

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local，填入 JWT_SECRET（至少 32 字符）

# 4. 启动开发服务器
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 环境变量

在项目根目录创建 `.env.local` 文件：

```env
# JWT 密钥（至少 32 字符）
JWT_SECRET=your-jwt-secret-key-min-32-characters-long
JWT_EXPIRES_IN=7d

# 默认管理员账号
ADMIN_EMAIL=admin@nixioffer.com
ADMIN_PASSWORD=Admin@123456

# 应用配置
NEXT_PUBLIC_APP_NAME=逆袭Offer
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 内置 AI 模型（可选）
DEFAULT_AI_BASE_URL=https://api.deepseek.com
DEFAULT_AI_MODEL=deepseek-chat
DEFAULT_AI_API_KEY=
```

> **安全提示：** `NEXT_PUBLIC_` 变量会暴露到浏览器，请勿存放 API Key 等敏感信息。

## AI 模型配置

本项目不内置 API Key，需在「模型管理」页面手动配置：

1. 注册并登录应用
2. 进入「模型管理」（设置页）
3. 选择内置模型（DeepSeek / OpenAI / 智谱 / 阿里云）或添加自定义模型
4. 输入 API Key 并测试连接
5. 设为活跃模型

所有 AI 请求通过后端 API Route 代理，前端不直接调用 AI 服务。

## 项目结构

```
src/
├── proxy.ts                # 路由保护（认证 + API 代理）
├── app/
│   ├── (auth)/             # 登录/注册路由组
│   ├── (dashboard)/        # 工作台路由组（需登录）
│   │   ├── profile/        # 个人画像
│   │   ├── diagnosis/      # AI 诊断
│   │   ├── translation/    # 经历转译
│   │   ├── job/            # JD 解析
│   │   ├── match/          # 人岗匹配
│   │   ├── resume/         # 简历优化
│   │   ├── resume-builder/ # 简历创建器（多模板 + PDF 导出）
│   │   ├── interview/      # 面试训练
│   │   ├── plan/           # 能力计划
│   │   ├── report/         # 汇总报告
│   │   └── settings/       # 模型管理
│   ├── api/
│   │   ├── auth/           # 认证 API（登录/注册/登出/Demo）
│   │   └── ai/             # AI 服务 API（10 个端点）
│   ├── globals.css         # Design Token 系统
│   ├── layout.tsx          # 根布局（字体、metadata、Providers）
│   ├── providers.tsx       # Context Provider 组合
│   └── page.tsx            # 首页
├── components/
│   ├── ui/                 # 基础 UI 组件（Button/Card/Input/Modal/Tag/Skeleton/Icon/IconSprite...）
│   ├── layout/             # 布局组件（StepNav/ThemeToggle）
│   ├── business/           # 业务组件（InterviewChat/PlanTimeline/ResumeCompare/ResumePreview...）
│   └── resume-templates/   # 简历模板系统（classic/modern/fresh-grad）
├── contexts/               # React Context（Auth/Theme/AI/JobFlow/ResumeBuilder）
├── hooks/                  # 自定义 Hooks（useAI/useResumeBuilder...）
├── lib/
│   ├── ai/                 # AI 客户端 + 模型配置 + 流式处理
│   ├── auth/               # JWT + Cookie 工具
│   ├── repository/         # 数据访问层（内存实现）
│   └── utils/              # 加密 + 简历构建工具
├── prompts/                # AI Prompt 模板（8 个场景）
├── types/                  # TypeScript 类型定义
└── data/                   # Demo 模拟数据

public/
├── favicon.ico             # 品牌 Favicon
├── logo-square.png         # 方形 Logo（移动端侧边栏、Apple Touch Icon）
├── logo-square.webp        # 方形 Logo（WebP）
├── logo-wide-light.png     # 横版 Logo — 亮色模式
├── logo-wide-light.webp    # 横版 Logo — 亮色模式（WebP）
├── logo-wide-dark.png      # 横版 Logo — 暗色模式
├── logo-wide-dark.webp     # 横版 Logo — 暗色模式（WebP）
└── fonts/                  # 本地字体文件（Inter/Noto Sans SC/Outfit）

docs/
├── 00~17_*.md              # 设计文档（18 篇）
└── codex_prompts/          # 开发提示词（Wave 1~8）
```

## Demo 演示流程

1. 访问首页 → 点击「一键体验 Demo」
2. 自动创建临时账户，跳转至「个人信息」页（已预填李同学数据）
3. 按侧边栏顺序依次体验：画像诊断 → 经历转译 → JD 解析 → 人岗匹配 → 简历优化 → 面试训练 → 能力计划 → 汇总报告
4. 进入「简历创建器」可从 AI 结果一键生成简历，选择模板并导出 PDF
5. 每一步均可触发 AI 生成（需配置 API Key）

## 开发 Wave 记录

| Wave | 内容 | 状态 |
|------|------|------|
| Wave 1 | 项目骨架 + 设计系统 + JWT 认证 | 完成 |
| Wave 2 | AI 服务层 + 模型管理 | 完成 |
| Wave 3 | 核心业务页面（上半） | 完成 |
| Wave 4 | 核心业务页面（下半） | 完成 |
| Wave 5 | 首页 + Demo 模式 + 动画打磨 | 完成 |
| Wave 6 | 测试 + 部署 + 性能优化 | 完成 |
| Wave 7 | 简历创建器（多模板 + PDF 导出） | 完成 |
| Wave 8 | 全站视觉升级 + 图标体系统一 + 国内资源替换 + Bug 修复 | 完成 |

## License

MIT
