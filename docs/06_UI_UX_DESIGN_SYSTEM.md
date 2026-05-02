# 06 — UI/UX 设计系统文档

## 6.1 设计理念

**视觉关键词**：年轻 · 温暖 · 专业 · 有希望感 · 不焦虑

**情绪曲线**：从"迷茫"到"清晰"的转变，通过渐变色和进度感传达。

---

## 6.2 Design Tokens (CSS Variables)

### 颜色系统

```css
:root {
  /* ── 品牌色 ── */
  --color-primary-50: #EEF2FF;
  --color-primary-100: #E0E7FF;
  --color-primary-200: #C7D2FE;
  --color-primary-300: #A5B4FC;
  --color-primary-400: #818CF8;
  --color-primary-500: #6366F1;   /* 主色 - 靛蓝紫 */
  --color-primary-600: #4F46E5;
  --color-primary-700: #4338CA;
  --color-primary-800: #3730A3;
  --color-primary-900: #312E81;

  /* ── 强调色（青绿） ── */
  --color-accent-50: #ECFDF5;
  --color-accent-100: #D1FAE5;
  --color-accent-200: #A7F3D0;
  --color-accent-300: #6EE7B7;
  --color-accent-400: #34D399;
  --color-accent-500: #10B981;   /* 强调色 - 翡翠绿 */
  --color-accent-600: #059669;

  /* ── 警告/危险 ── */
  --color-warning-500: #F59E0B;
  --color-danger-500: #EF4444;
  --color-success-500: #10B981;

  /* ── 中性色 ── */
  --color-gray-50: #F9FAFB;
  --color-gray-100: #F3F4F6;
  --color-gray-200: #E5E7EB;
  --color-gray-300: #D1D5DB;
  --color-gray-400: #9CA3AF;
  --color-gray-500: #6B7280;
  --color-gray-600: #4B5563;
  --color-gray-700: #374151;
  --color-gray-800: #1F2937;
  --color-gray-900: #111827;
  --color-gray-950: #030712;

  /* ── 语义色 ── */
  --color-bg: #FFFFFF;
  --color-bg-secondary: #F9FAFB;
  --color-bg-tertiary: #F3F4F6;
  --color-surface: #FFFFFF;
  --color-surface-hover: #F9FAFB;
  --color-border: #E5E7EB;
  --color-border-light: #F3F4F6;
  --color-text-primary: #111827;
  --color-text-secondary: #6B7280;
  --color-text-tertiary: #9CA3AF;
  --color-text-inverse: #FFFFFF;

  /* ── 渐变 ── */
  --gradient-primary: linear-gradient(135deg, #6366F1, #8B5CF6, #A855F7);
  --gradient-accent: linear-gradient(135deg, #10B981, #34D399);
  --gradient-hero: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  --gradient-card: linear-gradient(145deg, rgba(99,102,241,0.05), rgba(139,92,246,0.05));
  --gradient-glass: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7));
}
```

### 暗色模式

```css
[data-theme="dark"] {
  --color-bg: #0F172A;
  --color-bg-secondary: #1E293B;
  --color-bg-tertiary: #334155;
  --color-surface: #1E293B;
  --color-surface-hover: #334155;
  --color-border: #334155;
  --color-border-light: #1E293B;
  --color-text-primary: #F1F5F9;
  --color-text-secondary: #94A3B8;
  --color-text-tertiary: #64748B;
  --color-text-inverse: #0F172A;

  --gradient-glass: linear-gradient(135deg, rgba(30,41,59,0.9), rgba(30,41,59,0.7));
  --gradient-card: linear-gradient(145deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1));
}
```

### 排版

```css
:root {
  /* ── 字体族 ── */
  --font-sans: 'Inter', 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --font-display: 'Outfit', var(--font-sans);

  /* ── 字号 ── */
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */
  --text-5xl: 3rem;       /* 48px */

  /* ── 行高 ── */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;

  /* ── 字重 ── */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### 间距

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
}
```

### 圆角 & 阴影

```css
:root {
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  --radius-full: 9999px;

  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
  --shadow-glow: 0 0 20px rgba(99,102,241,0.3);
  --shadow-card: 0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04);
}
```

### 动画

```css
:root {
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 350ms ease;
  --transition-spring: 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 入场动画 */
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
@keyframes shimmer { from { background-position: -200% 0; } to { background-position: 200% 0; } }

/* 分数计数动画 */
@keyframes countUp {
  from { --count: 0; }
  to { --count: var(--target); }
}
```

---

## 6.3 响应式断点

```css
/* 移动端优先 */
/* xs: 0-479px   — 手机竖屏 */
/* sm: 480-767px  — 手机横屏 */
/* md: 768-1023px — 平板 */
/* lg: 1024-1279px — 小桌面 */
/* xl: 1280px+    — 大桌面 */

@media (min-width: 480px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

### 布局适配策略

| 组件 | 手机 | 平板 | 桌面 |
|------|------|------|------|
| 导航 | 底部Tab | 侧边抽屉 | 侧边固定 |
| 步骤条 | 横向滚动 | 横向固定 | 横向固定 |
| 卡片网格 | 1列 | 2列 | 3列 |
| 表单 | 单列 | 单列 | 双列 |
| 匹配雷达 | 240px | 320px | 400px |

---

## 6.4 暗色模式实现

### 切换机制

```typescript
// ThemeContext.tsx
type Theme = 'light' | 'dark' | 'system';

function applyTheme(theme: Theme) {
  const resolved = theme === 'system'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    : theme;
  document.documentElement.setAttribute('data-theme', resolved);
  localStorage.setItem('theme', theme);
}
```

### 切换按钮

Header 右上角提供三态切换：☀️ 亮色 / 🌙 暗色 / 🖥️ 跟随系统

---

## 6.5 组件样式规范

### 按钮

```css
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: var(--space-2);
  padding: var(--space-2) var(--space-5);
  border-radius: var(--radius-lg);
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  transition: all var(--transition-base);
  cursor: pointer; border: none;
}
.btn--primary { background: var(--gradient-primary); color: white; }
.btn--primary:hover { box-shadow: var(--shadow-glow); transform: translateY(-1px); }
.btn--secondary { background: var(--color-bg-secondary); color: var(--color-text-primary); border: 1px solid var(--color-border); }
.btn--ghost { background: transparent; color: var(--color-primary-500); }
.btn--danger { background: var(--color-danger-500); color: white; }
.btn--lg { padding: var(--space-3) var(--space-8); font-size: var(--text-base); }
.btn--sm { padding: var(--space-1) var(--space-3); font-size: var(--text-xs); }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
```

### 卡片

```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-card);
  transition: all var(--transition-base);
}
.card:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); }
.card--glass {
  background: var(--gradient-glass);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.2);
}
```

### 输入框

```css
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  background: var(--color-surface);
  color: var(--color-text-primary);
  transition: border-color var(--transition-fast);
}
.input:focus { border-color: var(--color-primary-500); outline: none; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
.input--error { border-color: var(--color-danger-500); }
```

### 标签

```css
.tag {
  display: inline-flex; align-items: center;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  background: var(--color-primary-50);
  color: var(--color-primary-700);
}
.tag--success { background: var(--color-accent-50); color: var(--color-accent-600); }
.tag--warning { background: #FEF3C7; color: #92400E; }
.tag--danger { background: #FEE2E2; color: #991B1B; }
```

---

## 6.6 Google Fonts 引入

```html
<!-- layout.tsx head -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700&family=Outfit:wght@600;700&display=swap" rel="stylesheet" />
```

---

## 6.7 图标方案

使用 Unicode Emoji + SVG 自定义图标。不引入图标库，减少依赖。

| 用途 | 方案 |
|------|------|
| 导航图标 | 内联SVG |
| 步骤图标 | Emoji (📝✅📊💼🎯📄🎤📅📋) |
| 状态图标 | Emoji (✅❌⚠️💡🔒) |
| 模型图标 | SVG 文件 (`/images/models/`) |
