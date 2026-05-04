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

**附加功能：** 汇总报告 · 李同学案例快速填充 · 暗色模式 · 响应式布局 · 简历创建器（10 模板 + 随机样式 + PDF 导出）

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) + React 19 + TypeScript |
| 认证 | JWT (jose) — HttpOnly Cookie，无数据库依赖 |
| AI | OpenAI 兼容协议，支持 DeepSeek / OpenAI / 智谱 / 阿里云等 |
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

1. 注册并登录应用（首次登录会自动跳转至模型管理页）
2. 进入「模型管理」（设置页）
3. 选择内置模型（DeepSeek Chat / DeepSeek Reasoner）或添加自定义模型（支持任何 OpenAI 兼容 API，如 OpenAI / 智谱 / 阿里云等）
4. 输入 API Key 并**测试连接**（连接成功后方可使用）
5. 设为活跃模型

也可通过 `.env.local` 配置 `DEFAULT_AI_BASE_URL`、`DEFAULT_AI_MODEL`、`DEFAULT_AI_API_KEY`，首次打开设置页时自动加载为默认配置。

所有 AI 请求通过后端 API Route 代理，前端不直接调用 AI 服务。AI 返回的 JSON 会自动去除 Markdown 代码围栏，确保解析稳定。

## 项目结构

```
src/
├── app/
│   ├── (auth)/             # 登录/注册路由组
│   ├── (dashboard)/        # 工作台路由组（需登录 + API Key）
│   │   ├── profile/        # 个人信息（支持快速填充李同学数据）
│   │   ├── diagnosis/      # AI 诊断
│   │   ├── translation/    # 经历转译
│   │   ├── job/            # JD 解析
│   │   ├── match/          # 人岗匹配
│   │   ├── resume/         # 简历优化
│   │   ├── resume-builder/ # 简历创建器（10 模板 + 随机样式 + PDF 导出）
│   │   ├── interview/      # 面试训练
│   │   ├── plan/           # 能力计划
│   │   ├── report/         # 汇总报告
│   │   └── settings/       # 模型管理
│   ├── api/
│   │   ├── auth/           # 认证 API（登录/注册/登出）
│   │   └── ai/             # AI 服务 API（12 个端点）
│   ├── globals.css         # Design Token 系统
│   ├── layout.tsx          # 根布局（字体、metadata、Providers）
│   ├── providers.tsx       # Context Provider 组合
│   └── page.tsx            # 首页
├── components/
│   ├── ui/                 # 基础 UI 组件（Button/Card/Input/Modal/Tag/Skeleton/Icon...）
│   ├── layout/             # 布局组件（StepNav/ThemeToggle）
│   ├── business/           # 业务组件（InterviewChat/PlanTimeline/ResumePreview/EditorToolbar...）
│   └── resume-templates/   # 简历模板系统（10 个模板）
│       ├── classic/        # 经典 — 标准单栏，ATS 友好
│       ├── modern/         # 现代 — 主题色高亮，视觉感强
│       ├── fresh-grad/     # 应届生 — 强调教育和项目
│       ├── sidebar/        # 双栏侧边 — 左侧深色侧栏
│       ├── elegant/        # 优雅简约 — 精致排版
│       ├── compact/        # 紧凑高效 — 信息密度高
│       ├── bold-header/    # 醒目头部 — 渐变 Banner
│       ├── minimal/        # 极简留白 — 大量留白，细线分隔
│       ├── timeline/       # 时间轴 — 左侧时间线连接各模块
│       └── tech/           # 科技感 — 深色头部，技术风格
├── contexts/               # React Context（Auth/Theme/AI/JobFlow/ResumeBuilder）
├── hooks/                  # 自定义 Hooks（useAI/useResumeBuilder...）
├── lib/
│   ├── ai/                 # AI 客户端 + 模型配置 + 流式处理
│   ├── auth/               # JWT + Cookie 工具
│   ├── repository/         # 数据访问层（内存实现）
│   └── utils/              # 加密 + 简历构建 + JSON 解析工具
├── prompts/                # AI Prompt 模板（8 个场景）
├── types/                  # TypeScript 类型定义
└── data/                   # 李同学示例数据

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

## 快速体验流程

1. 注册并登录应用
2. 首次登录自动跳转「模型管理」，配置 API Key 并测试连接
3. 进入「个人信息」→ 点击「填充李同学数据」快速填写表单
4. 点击「开始 AI 诊断」，AI 实时调用生成求职画像
5. 按侧边栏顺序依次体验：画像诊断 → 经历转译 → JD 解析 → 人岗匹配 → 简历优化 → 面试训练 → 能力计划 → 汇总报告
6. 每一步均调用真实 AI 接口，进度条自动打勾
7. 进入「简历创建器」可从 AI 结果一键生成简历，选择 10 种模板之一，支持「随机样式」和 PDF 导出

## 简历创建器

- **10 种模板**：经典、现代、应届生、双栏侧边、优雅简约、紧凑高效、醒目头部、极简留白、时间轴、科技感
- **随机样式**：一键随机模板 + 字体 + 主题色，快速探索不同风格
- **PDF 导出**：所见即所得，导出文件名为「姓名 - 简历.pdf」
- **AI 填充**：从 AI 分析结果自动填入简历内容
- **打印优化**：导出时自动隐藏导航栏、侧边栏等 UI 元素

## 开发 Wave 记录

| Wave | 内容 | 状态 |
|------|------|------|
| Wave 1 | 项目骨架 + 设计系统 + JWT 认证 | 完成 |
| Wave 2 | AI 服务层 + 模型管理 | 完成 |
| Wave 3 | 核心业务页面（上半） | 完成 |
| Wave 4 | 核心业务页面（下半） | 完成 |
| Wave 5 | 首页 + 动画打磨 | 完成 |
| Wave 6 | 测试 + 部署 + 性能优化 | 完成 |
| Wave 7 | 简历创建器（多模板 + PDF 导出） | 完成 |
| Wave 8 | 全站视觉升级 + 图标体系统一 + 国内资源替换 + Bug 修复 | 完成 |
| Wave 9 | 移除 Demo 模式 + JSON 解析修复 + 新模板 + 随机样式 + PDF 优化 | 完成 |

## License

MIT
