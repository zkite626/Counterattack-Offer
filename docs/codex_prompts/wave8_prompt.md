# Wave 8 开发提示词 — 全站视觉升级 + 图标体系统一 + 国内资源替换 + Bug 修复

```
你是一个资深前端工程师兼 UI 设计专家，正在为《逆袭Offer》Web MVP 进行全站视觉美化升级。

## 必读文档

- AGENTS.md（开发规则）
- docs/06_UI_UX_DESIGN_SYSTEM.md（设计系统）
- docs/08_COMPONENT_SPECIFICATION.md（组件规格）
- docs/codex_prompts/wave7_prompt.md（Wave 7 完成状态参考）

## 前置条件

Wave 1-7 已完成，全部功能页面可用，简历创建器已上线。本 Wave 聚焦视觉品质统一、图标体系规范化、国内资源替换和已知 Bug 修复。

## 设计概要

本次升级的核心目标：
1. **彻底移除所有 emoji**：项目中仍在使用 emoji 作为图标的页面（痛点卡片、功能卡片、步骤导航、CTA 等）全部替换为 iconfont SVG 图标，使用已有的 `<Icon>` 组件体系
2. **统一样式风格**：所有页面的卡片、按钮、间距、圆角、阴影、动画节奏保持一致
3. **替换为国内资源**：Google Fonts 替换为国内 CDN 源，确保国内访问速度
4. **品牌资源就位**：Logo 和 Favicon 移入正确目录并在全站引用
5. **修复 Next.js 16 构建警告**：middleware → proxy 约定迁移

## Wave 8 任务

### 任务 8.1：Logo 和 Favicon 资源迁移

当前状态：
- `favicon.ico`（265KB 自定义品牌图标）在项目根目录，未被使用
- `logo方.png`（322KB 方形 Logo）在项目根目录，未被使用
- `logo长.png`（424KB 横版 Logo）在项目根目录，未被使用
- `src/app/favicon.ico`（26KB）是 Next.js 默认 favicon，正在被使用
- `public/` 目录下没有品牌资源

操作：
1. 将根目录 `favicon.ico` 移动到 `public/favicon.ico`（替换默认）
2. 将根目录 `logo方.png` 重命名为 `logo-square.png` 后移动到 `public/logo-square.png`
3. 将根目录 `logo长.png` 重命名为 `logo-wide.png` 后移动到 `public/logo-wide.png`
4. 删除 `src/app/favicon.ico`（旧的默认 favicon）
5. 删除根目录的原始文件（已移入 public/）

在 `src/app/layout.tsx` 中更新 metadata：
```tsx
export const metadata: Metadata = {
  // ... 现有 title, description 等保持不变
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo-square.png",
  },
};
```

在 `<head>` 中：
- 移除手动的 `<link rel="icon" href="/favicon.ico" sizes="any" />`（metadata.icons 已处理）
- 添加 `<link rel="apple-touch-icon" href="/logo-square.png" />`

在 Dashboard 侧边栏 Header 和首页 Hero 区使用 Logo：
- 侧边栏品牌区：`<img src="/logo-square.png" alt="逆袭Offer" width={32} height={32} />`
- 首页顶部/CTA：`<img src="/logo-wide.png" alt="逆袭Offer" />`

### 任务 8.2：Google Fonts 替换为国内 CDN

当前 `src/app/layout.tsx` 通过 Google Fonts CDN 加载 Inter、Noto Sans SC、Outfit 三个字体，国内访问慢或不可用。

**方案**：使用国内字体 CDN 源替换。

替换 layout.tsx 中的 Google Fonts 链接为以下国内源方案之一（按优先级）：

**推荐方案 — 字体托管到本地/public/fonts/：**
1. 下载 Inter（400/500/600/700）、Noto Sans SC（400/500/700）、Outfit（600/700）的 woff2 文件
2. 放入 `public/fonts/` 目录
3. 在 `globals.css` 顶部用 `@font-face` 声明：
```css
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/inter-v18-latin-chinese-400.woff2') format('woff2');
}
/* 重复每个字重... */
```
4. 移除 layout.tsx 中的 Google Fonts `<link>` 标签和 `preconnect`
5. globals.css 中的 `--font-sans` 等变量保持不变（字体名称一致）

**备选方案 — 使用国内公共 CDN：**
如果本地字体文件过大，可使用：
- `https://cdn.bootcdn.net/` (BootCDN)
- `https://cdn.jsdelivr.net/npm/@fontsource/` (jsDelivr 国内镜像)

### 任务 8.3：全面替换 Emoji 为 IconFont 图标

项目中存在 emoji 的位置（需逐文件排查并替换）：

**已知使用 emoji 的位置：**

1. **首页 `src/app/page.tsx`**：
   - 痛点卡片：🎯📄🔍✏️😰📈 → 替换为 `<Icon name="target">`, `<Icon name="document">`, `<Icon name="search">`, `<Icon name="pen">`, `<Icon name="warning">`, `<Icon name="trending">`
   - 解决方案步骤图标
   - 功能卡片图标
   - CTA 区 badges

2. **侧边栏 `src/app/(dashboard)/layout.tsx`**：
   - 导航项前的 emoji → 替换为对应 `<Icon name="xxx">`
   - 使用已有的 IconSprite 中定义的图标

3. **StepNav `src/components/layout/StepNav.tsx`**：
   - 步骤编号图标替换

4. **各功能页面**（diagnosis, translation, job, match, resume, interview, plan, report）：
   - 空状态提示中的 emoji
   - 区块标题前的 emoji
   - 操作按钮中的 emoji

5. **Auth 页面**（login, register）：
   - 表单标题或提示中的 emoji

6. **Error/Not-Found 页面**：
   - 错误状态图标

7. **Settings 页面**：
   - 模型卡片中的 emoji

**替换规则：**
- 使用已有的 `<Icon name="xxx" size="1.25em" />` 组件
- 如果现有 IconSprite 中缺少需要的图标，在 `src/components/ui/IconSprite.tsx` 中新增对应 symbol（从 iconfont.cn 获取标准 Material Design Icons 路径）
- 同时在 `src/components/ui/Icon.tsx` 的 `IconName` 联合类型中补充新图标名
- 图标颜色使用 `currentColor` 继承父元素颜色，不硬编码
- 图标大小统一规范：
  - 行内图标：`1em`
  - 卡片图标：`2rem`
  - 导航图标：`1.25em`
  - 大号 Feature 图标：`2.5rem`

### 任务 8.4：新增缺失的 IconSprite 图标

基于任务 8.3 排查结果，在 `src/components/ui/IconSprite.tsx` 中补充以下图标（如尚未定义）：

需要确认是否已存在，缺失则新增：
- `icon-fire` — 热门/活跃（替代🔥）
- `icon-award` — 荣誉/成就（替代🏆）
- `icon-book` — 学习/知识（替代📖）
- `icon-chat` — 对话/聊天（替代💬）
- `icon-handshake` — 合作/匹配（替代🤝）
- `icon-puzzle` — 组合/模块（替代🧩）
- `icon-gift` — 礼物/惊喜（替代🎁）
- `icon-bulb` — 灵感（替代💡，已有 lightbulb 确认是否够用）
- `icon-clock` — 时间/计划（替代⏰）
- `icon-mail` — 邮件/联系（替代📧）

每个 symbol 使用 viewBox="0 0 24 24"，路径来自 Material Design Icons 开源图标集（Apache 2.0 协议），保持与现有图标风格一致（单色填充，currentColor）。

同步更新 `IconName` 类型和 `Icon.css` 样式。

### 任务 8.5：全站样式统一

逐页审查并统一以下视觉规范：

**卡片样式统一：**
- 所有卡片圆角：`var(--radius-lg)` (0.75rem)
- 卡片间距：`var(--space-6)` (1.5rem)
- 卡片内边距：`var(--space-6)`
- 卡片阴影：`var(--shadow-card)`
- 卡片悬停：`translateY(-2px)` + `var(--shadow-lg)`
- 卡片入场动画：`slideUp` + `fadeIn`，stagger 100ms

**按钮样式统一：**
- 主按钮：`var(--gradient-primary)` 背景，白色文字
- 次按钮：透明背景 + `var(--color-primary-500)` 边框和文字
- 危险按钮：`var(--color-danger-500)`
- 所有按钮统一 `var(--radius-md)` 圆角
- hover 微上浮 `translateY(-1px)` + glow 阴影

**间距统一：**
- 页面标题区下方间距：`var(--space-8)`
- 区块间距：`var(--space-10)`
- 卡片网格间距：`var(--space-6)`
- 表单行间距：`var(--space-4)`

**排版统一：**
- 页面标题：`var(--text-2xl)` + `font-weight: 600`
- 区块标题：`var(--text-xl)` + `font-weight: 600`
- 卡片标题：`var(--text-lg)` + `font-weight: 600`
- 正文：`var(--text-base)` + `var(--color-text-secondary)`
- 辅助文字：`var(--text-sm)` + `var(--color-text-tertiary)`

**空状态统一：**
- 居中图标（3rem）+ 主题色
- 标题 + 描述文案
- 可选操作按钮

**Loading 状态统一：**
- 所有 AI 生成按钮：loading 时显示 Skeleton shimmer 或 Spinner
- 页面级 loading：使用已有的 loading.tsx 骨架屏
- 按钮级 loading：禁用 + 旋转图标

### 任务 8.6：首页视觉增强

在 `src/app/page.tsx` 和 `src/app/home.css` 中：

1. **Hero 区增强**：
   - 产品 Logo（`/logo-wide.png`）置于标题上方，宽度 200px
   - 微妙的背景网格/点阵纹理（纯 CSS 实现）
   - 浮动装饰元素动画

2. **痛点卡片**：
   - emoji 全部替换为 Icon 组件
   - 卡片左侧色条（每张不同颜色，取自品牌色阶）
   - 统一 glassmorphism 效果

3. **解决方案步骤流**：
   - emoji 替换为 Icon 组件
   - 步骤间连线使用 CSS 渐变线而非简单 border
   - 当前步骤脉冲动画

4. **功能卡片**：
   - 统一图标尺寸 2.5rem
   - 渐变色背景 hover 效果
   - 卡片底部"了解更多"链接带 `arrow-right` 图标

5. **CTA 区**：
   - 移除 emoji badges
   - 使用 Icon + 文字的 Tag 组件替代
   - 品牌 Logo 展示

### 任务 8.7：Dashboard 侧边栏视觉优化

在 `src/app/(dashboard)/layout.tsx` 和 `src/app/(dashboard)/dashboard.css` 中：

1. **品牌区**：
   - 使用 `/logo-square.png` 作为品牌图标
   - 品牌名"逆袭Offer"使用 `var(--font-display)` 字体

2. **导航项**：
   - 所有 emoji 替换为 `<Icon>` 组件
   - 当前页面高亮：左侧色条 + 背景色
   - 图标与文字间距 `var(--space-3)`
   - hover 状态：背景微变色

3. **用户信息区**：
   - 头像使用圆形 + 边框
   - 登出按钮使用 `<Icon name="close">` 或新增 `icon-logout`

4. **移动端**：
   - 抽屉菜单动画优化
   - 遮罩层模糊效果

### 任务 8.8：功能页面逐页美化

以下页面逐一检查并优化（参照任务 8.5 的统一规范）：

**个人画像 `/profile`：**
- 表单卡片样式统一
- Demo 数据导入按钮使用 `<Icon name="sparkle">`
- 表单分组标题图标化

**AI 诊断 `/diagnosis`：**
- 诊断结果卡片图标替换
- 分数展示区统一使用 ScoreRing 组件
- 加载态骨架屏完善

**经历转译 `/translation`：**
- 经历卡片操作图标替换
- 转译结果对比区样式优化

**JD 解析 `/job`：**
- 分析结果卡片图标统一
- 关键词 Tag 样式统一

**人岗匹配 `/match`：**
- 雷达图区域容器样式统一
- 匹配建议卡片图标替换

**简历优化 `/resume`：**
- Before/After 对比区样式优化
- 操作按钮图标统一

**简历创建器 `/resume-builder`：**
- 简历卡片列表样式统一
- 编辑器三栏间距优化
- 模板选择 Modal 样式美化

**面试训练 `/interview`：**
- 聊天气泡样式优化
- 面试模式切换按钮图标化

**能力计划 `/plan`：**
- Timeline 节点图标替换 emoji
- 计划卡片样式统一

**汇总报告 `/report`：**
- 模块报告卡片图标替换
- 分数展示统一
- 导出按钮使用 `<Icon name="download">`

**设置 `/settings`：**
- 模型卡片图标替换 emoji
- 操作按钮图标化
- 测试连接状态图标统一

### 任务 8.9：认证页面美化

**登录页 `/login`：**
- 顶部品牌 Logo（`/logo-wide.png`）
- 表单图标：邮箱输入框前 `<Icon name="mail">` 或 `<Icon name="user">`
- 密码输入框前 `<Icon name="key">`
- 登录按钮 loading 态

**注册页 `/register`：**
- 同登录页风格统一
- 注册成功提示图标

### 任务 8.10：错误和空状态页面美化

**404 页面 `not-found.tsx`：**
- 大号 `icon-compass` 或 `icon-search` 图标
- 品牌色插画风背景
- 返回首页按钮

**Error 页面 `error.tsx`（root + auth + dashboard）：**
- `icon-triangle-warning` 图标
- 统一错误卡片样式
- 重试按钮 + 返回首页按钮

**Loading 页面 `loading.tsx`：**
- 品牌色骨架屏
- shimmer 动画统一

### 任务 8.11：暗色模式全面适配

所有新增/修改的样式必须在 `[data-theme="dark"]` 下验证：
- Icon 颜色：使用 `currentColor`，自动适配
- 卡片背景：`--color-surface` 自动切换
- 渐变效果：暗色模式下降低亮度
- 阴影效果：暗色模式下使用更暗的阴影或发光效果
- Logo：提供暗色模式下的反白版本（如需要，在 CSS 中用 `filter: invert()` 处理）

### 任务 8.12：响应式全面检查

所有美化后的页面在以下断点验证：
- 375px（iPhone SE）
- 390px（iPhone 14）
- 768px（iPad 竖屏）
- 1024px（iPad 横屏 / 小笔记本）
- 1280px（桌面）
- 1536px（大桌面）

重点检查：
- Logo 尺寸在不同屏幕下的缩放
- 图标与文字的对齐
- 卡片网格的列数变化
- 侧边栏折叠/展开行为

### 任务 8.13：修复 middleware 弃用警告

Next.js 16 已将 `middleware` 文件约定标记为弃用，推荐使用 `proxy` 约定。

**当前状态：**
- 文件：`src/middleware.ts`
- 构建警告：`The "middleware" file convention is deprecated. Please use "proxy" instead.`

**修复方案：**

1. 将 `src/middleware.ts` 重命名为 `src/proxy.ts`

2. 更新导出格式。Next.js 16 的 `proxy` 约定使用不同的 API：

```typescript
// src/proxy.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";

const protectedPaths = [
  "/profile", "/diagnosis", "/translation", "/job",
  "/match", "/resume", "/resume-builder", "/interview",
  "/plan", "/report", "/settings",
];

const authPaths = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // 1. AI API 路由保护
  if (pathname.startsWith("/api/ai/")) {
    if (!token) {
      return NextResponse.json(
        { success: false, error: { code: "AUTH_TOKEN_MISSING", message: "未登录" } },
        { status: 401 }
      );
    }
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: { code: "AUTH_TOKEN_EXPIRED", message: "Token已过期" } },
        { status: 401 }
      );
    }
    const headers = new Headers(request.headers);
    headers.set("x-user-id", payload.sub);
    return NextResponse.next({ headers });
  }

  // 2. Dashboard 页面保护
  if (protectedPaths.some((p) => pathname.startsWith(p))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 3. 已登录用户访问认证页 → 重定向
  if (authPaths.some((p) => pathname.startsWith(p))) {
    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        return NextResponse.redirect(new URL("/profile", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/ai/:path*",
    "/profile",
    "/profile/:path*",
    "/diagnosis",
    "/translation",
    "/job",
    "/match",
    "/resume",
    "/resume-builder",
    "/resume-builder/:path*",
    "/interview",
    "/plan",
    "/report",
    "/settings",
    "/login",
    "/register",
  ],
};
```

**关键变更：**
- 导出函数名从 `middleware` 改为 `proxy`
- 文件名从 `middleware.ts` 改为 `proxy.ts`
- matcher 中补充了 `/resume-builder` 和 `/resume-builder/:path*`（之前遗漏导致简历创建器页面未受路由保护）
- 补充了 `/profile/:path*` 等通配路由（如有子路由）

> **注意**：如果 Next.js 16.2.4 的 proxy 约定 API 与上述不完全一致，请查阅 https://nextjs.org/docs/messages/middleware-to-proxy 获取最新迁移指南，按官方文档调整导出函数签名。

### 任务 8.14：构建验证

完成所有改动后：
1. 运行 `npm run build` 确认无报错和弃用警告
2. 运行 `npm run dev` 本地验证
3. 逐页检查亮色/暗色模式
4. 逐页检查响应式布局
5. 确认所有 emoji 已替换（全局搜索 emoji 字符范围验证）
6. 确认 favicon 和 logo 正确显示

## 验收标准

1. 全站无 emoji 作为图标使用，所有图标通过 `<Icon>` 组件渲染
2. IconSprite 中的图标覆盖所有使用场景
3. 所有页面卡片、按钮、间距、排版风格统一
4. Google Fonts 替换为本地或国内 CDN，国内可正常加载
5. `/favicon.ico` 和 `/logo-square.png`、`/logo-wide.png` 在 `public/` 目录下，浏览器标签页和移动端图标正确显示
6. 侧边栏和首页正确展示品牌 Logo
7. `npm run build` 无 middleware 弃用警告
8. `/resume-builder` 路由受 proxy 保护
9. 暗色模式下所有图标、卡片、背景正常
10. 响应式在 375px ~ 1536px 范围内正常
11. Lighthouse Performance > 90, Accessibility > 95
12. 首页视觉品质明显提升，有产品感
```
