# 17 — 简历创建功能设计文档（参考 Magic Resume）

## 概述

本文档定义了逆袭Offer项目新增的**简历创建器（Resume Builder）**功能。该功能在现有「简历优化」流程基础上，提供完整的简历编辑、实时预览、多模板选择和 PDF 导出能力。

设计参考了 [Magic Resume](https://github.com/JOYCEQL/magic-resume) 开源项目的架构模式，并基于我们项目的 CSS Variables + React Context 技术栈进行了重新设计。

---

## 17.1 功能定位

```
现有流程：AI分析 → 简历优化建议（文字对比）
新增流程：AI分析 → 简历优化建议 → 简历创建器（编辑+预览+导出）
```

### 核心价值

1. **闭环体验**：用户不仅获得优化建议，还能直接生成可投递的简历
2. **AI 预填充**：从 AI 优化结果自动填入简历内容，减少手动输入
3. **多模板支持**：提供多种适合低经验大学生的简历模板
4. **实时预览**：所见即所得，左编辑右预览
5. **PDF 导出**：一键导出 A4 PDF，可直接投递

---

## 17.2 架构设计（参考 Magic Resume）

### Magic Resume 核心架构模式

```
┌─────────────────────────────────────────────────────────┐
│                    Editor Layout (三栏)                   │
│ ┌──────────┐ ┌──────────────┐ ┌────────────────────────┐ │
│ │ SidePanel │ │  EditPanel   │ │    PreviewPanel        │ │
│ │ 模块导航  │ │  表单编辑    │ │   实时预览(A4比例)      │ │
│ │ 模块排序  │ │  分区编辑    │ │   缩放适配             │ │
│ │ 显隐控制  │ │  富文本      │ │   分页线               │ │
│ └──────────┘ └──────────────┘ └────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
       │                │                │
       └────────────────┼────────────────┘
                        │
                  ResumeStore (状态管理)
                        │
              ┌─────────┼──────────┐
              │    Template        │
              │    Registry        │
              │  (模板注册表)       │
              └────────────────────┘
```

### 我们的适配设计

```
┌───────────────────────────────────────────────────────┐
│              Resume Builder Page                       │
│ ┌──────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│ │ Section  │ │  Section     │ │  Resume Preview      │ │
│ │ Navigator│ │  Editor      │ │  (A4 210mm × 297mm)  │ │
│ │          │ │              │ │                      │ │
│ │ 模块开关 │ │ 对应模块     │ │  Template渲染        │ │
│ │ 拖拽排序 │ │ 表单编辑     │ │  分页线提示          │ │
│ │ 新增模块 │ │              │ │  缩放适配            │ │
│ └──────────┘ └──────────────┘ └──────────────────────┘ │
│                                                        │
│  Toolbar: 模板选择 | AI填充 | PDF导出 | 主题色         │
└───────────────────────────────────────────────────────┘
```

**技术映射**：
| Magic Resume | 逆袭Offer（本项目） |
|-------------|---------------------|
| Zustand | React Context + useReducer |
| Tailwind CSS | Vanilla CSS + CSS Variables |
| Framer Motion | CSS @keyframes + Intersection Observer |
| Tiptap 富文本 | 原生 contentEditable / textarea |
| Puppeteer PDF | 浏览器 window.print() + @media print |
| react-resizable-panels | CSS Grid + resize handle |
| Shadcn/ui | 自有 UI 组件库 |

---

## 17.3 数据模型（参考 Magic Resume 精简重构）

### 简历数据 (`types/resume-builder.ts`)

```typescript
// 基本信息
export interface ResumeBasicInfo {
  name: string;
  title: string;                // 求职意向
  email: string;
  phone: string;
  location: string;
  birthDate?: string;
  photo?: string;               // Base64 头像
  customFields: ResumeCustomField[];
}

export interface ResumeCustomField {
  id: string;
  label: string;
  value: string;
  visible: boolean;
}

// 教育经历
export interface ResumeEducation {
  id: string;
  school: string;
  major: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;          // HTML 或纯文本
  visible: boolean;
}

// 工作/实习经历
export interface ResumeExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;          // HTML
  visible: boolean;
}

// 项目经历
export interface ResumeProject {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;          // HTML
  link?: string;
  visible: boolean;
}

// 简历模块
export interface ResumeSection {
  id: string;
  title: string;
  icon: string;
  enabled: boolean;
  order: number;
}

// 全局设置
export interface ResumeGlobalSettings {
  themeColor: string;            // 主题色
  fontFamily: string;            // 字体
  baseFontSize: number;          // 基础字号(px)
  pagePadding: number;           // 页边距(px)
  sectionSpacing: number;        // 模块间距(px)
  lineHeight: number;            // 行高
}

// 模板配置
export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;             // 模板缩略图路径
  layout: string;                // 布局标识
  colorScheme: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  spacing: {
    sectionGap: number;
    itemGap: number;
    contentPadding: number;
  };
}

// 完整简历数据
export interface ResumeBuilderData {
  id: string;
  title: string;                 // 简历标题
  createdAt: string;
  updatedAt: string;
  templateId: string;
  basic: ResumeBasicInfo;
  education: ResumeEducation[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  skills: string;                // HTML 技能描述
  selfEvaluation: string;        // HTML 自我评价
  sections: ResumeSection[];     // 模块配置（排序+显隐）
  globalSettings: ResumeGlobalSettings;
}
```

### 默认模块配置

```typescript
export const DEFAULT_RESUME_SECTIONS: ResumeSection[] = [
  { id: 'basic', title: '基本信息', icon: '👤', enabled: true, order: 0 },
  { id: 'education', title: '教育经历', icon: '🎓', enabled: true, order: 1 },
  { id: 'experience', title: '实习/工作经历', icon: '💼', enabled: true, order: 2 },
  { id: 'projects', title: '项目经历', icon: '🚀', enabled: true, order: 3 },
  { id: 'skills', title: '专业技能', icon: '⚡', enabled: true, order: 4 },
  { id: 'selfEvaluation', title: '自我评价', icon: '💬', enabled: false, order: 5 },
];
```

---

## 17.4 模板系统（参考 Magic Resume Registry Pattern）

### 注册表架构

```typescript
// components/resume-templates/registry.ts
export interface TemplateRegistryEntry {
  config: ResumeTemplate;
  Component: React.FC<{ data: ResumeBuilderData; template: ResumeTemplate }>;
}

export const TEMPLATE_REGISTRY: TemplateRegistryEntry[] = [
  { config: classicConfig, Component: ClassicTemplate },
  { config: modernConfig, Component: ModernTemplate },
  { config: freshGradConfig, Component: FreshGradTemplate },
  { config: sidebarConfig, Component: SidebarTemplate },
  { config: elegantConfig, Component: ElegantTemplate },
  { config: compactConfig, Component: CompactTemplate },
  { config: boldHeaderConfig, Component: BoldHeaderTemplate },
  { config: minimalConfig, Component: MinimalTemplate },
  { config: timelineConfig, Component: TimelineTemplate },
  { config: techConfig, Component: TechTemplate },
];

export function getTemplateComponent(layout: string): React.FC {
  return TEMPLATE_REGISTRY.find(e => e.config.layout === layout)?.Component
    ?? ClassicTemplate;
}
```

### 模板列表（10 个）

为低经验大学生定制 10 个差异化模板：

| 模板 | 布局 | 特点 | 适合场景 |
|------|------|------|----------|
| 经典 Classic | 标准单栏 | 传统简约，ATS 友好 | 通用求职 |
| 现代 Modern | 单栏+主题色高亮 | 视觉感强，重点突出 | 互联网岗位 |
| 应届生 FreshGrad | 单栏+强调教育 | 教育和项目区域放大 | 无实习经验 |
| 双栏侧边 Sidebar | 左右分栏 | 左侧深色侧栏 | 设计/创意岗位 |
| 优雅简约 Elegant | 单栏 | 精致排版，大写字母标题 | 市场营销/品牌岗位 |
| 紧凑高效 Compact | 单栏 | 间距紧凑，信息密度高 | 咨询/金融行业 |
| 醒目头部 BoldHeader | 单栏+渐变Banner | 顶部醒目渐变头部 | 销售/商务岗位 |
| 极简留白 Minimal | 单栏 | 大量留白，细线分隔 | 注重品味的创意岗位 |
| 时间轴 Timeline | 单栏+左侧时间轴 | 时间线连接各模块 | 展示成长轨迹 |
| 科技感 Tech | 单栏+深色头部 | 深色渐变头部，技术风格 | 程序员/数据分析师 |

---

## 17.5 AI 预填充功能

### 从 AI 优化结果自动生成简历

```typescript
// 将 AI 分析结果转换为简历数据
function buildResumeFromAIResults(
  profile: StudentProfile,
  diagnosis: CareerDiagnosis,
  translations: ExperienceTranslation[],
  optimization: ResumeOptimizationResult,
  jobAnalysis: JobAnalysis
): ResumeBuilderData {
  return {
    basic: {
      name: profile.name,
      title: diagnosis.recommendedRoles[0]?.role || '',
      // ... 从 profile 填充
    },
    education: [{
      school: extractSchool(profile.educationBackground),
      major: profile.major,
      // ...
    }],
    experience: optimization.resumeOptimization.map(opt => ({
      company: extractCompany(opt.sourceExperience),
      position: '',
      description: opt.after,  // 使用 AI 优化后的表达
      // ...
    })),
    projects: translations
      .filter(t => isProjectExperience(t))
      .map(t => ({
        name: extractProjectName(t.rawExperience),
        description: t.resumeBullet,
        // ...
      })),
    skills: profile.skills.join('、'),
    // ...
  };
}
```

---

## 17.6 PDF 导出方案

### 方案：浏览器原生 print + 所见即所得

使用浏览器 `window.print()` + `@media print`，导出时自动隐藏所有非简历 UI：

```css
/* dashboard.css — 隐藏导航栏、侧边栏等 */
@media print {
  .dashboard__header,
  .dashboard__stepnav,
  .dashboard__sidebar,
  .dashboard__overlay { display: none !important; }
}

/* editor-workspace.css — 隐藏编辑器，只显示预览 */
@media print {
  .editor-workspace__toolbar,
  .editor-workspace__nav,
  .editor-workspace__editor { display: none !important; }

  .editor-workspace__preview {
    border: none;
    overflow: visible;
  }
}
```

### PDF 文件名

导出时自动设置 `document.title` 为「姓名 - 简历」，浏览器另存为 PDF 时默认使用该文件名。

### 未来升级

使用 `html2pdf.js` 或服务端 Puppeteer 实现更精确的 PDF 生成。

---

## 17.7 状态管理

### ResumeBuilderContext

集成到现有 Context 体系中：

```typescript
interface ResumeBuilderState {
  resumes: Record<string, ResumeBuilderData>;
  activeResumeId: string | null;
  activeSection: string;
}

type ResumeBuilderAction =
  | { type: 'CREATE_RESUME'; payload: { templateId: string } }
  | { type: 'UPDATE_BASIC'; payload: Partial<ResumeBasicInfo> }
  | { type: 'ADD_EDUCATION'; payload: ResumeEducation }
  | { type: 'UPDATE_EDUCATION'; payload: { id: string; data: Partial<ResumeEducation> } }
  | { type: 'DELETE_EDUCATION'; payload: string }
  | { type: 'ADD_EXPERIENCE'; payload: ResumeExperience }
  | { type: 'UPDATE_EXPERIENCE'; payload: { id: string; data: Partial<ResumeExperience> } }
  | { type: 'DELETE_EXPERIENCE'; payload: string }
  | { type: 'ADD_PROJECT'; payload: ResumeProject }
  | { type: 'UPDATE_PROJECT'; payload: { id: string; data: Partial<ResumeProject> } }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'UPDATE_SKILLS'; payload: string }
  | { type: 'UPDATE_SELF_EVALUATION'; payload: string }
  | { type: 'REORDER_SECTIONS'; payload: ResumeSection[] }
  | { type: 'TOGGLE_SECTION'; payload: string }
  | { type: 'SET_ACTIVE_SECTION'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<ResumeGlobalSettings> }
  | { type: 'SET_TEMPLATE'; payload: string }
  | { type: 'LOAD_FROM_AI'; payload: ResumeBuilderData }
  | { type: 'DELETE_RESUME'; payload: string }
  | { type: 'DUPLICATE_RESUME'; payload: string };
```

### 持久化

```typescript
localStorage('nixi-resume-builder') → JSON
```

---

## 17.8 页面设计

### 路由

```
/resume-builder          → 简历列表（管理多份简历）
/resume-builder/[id]     → 简历编辑工作台
```

### 简历列表页

| 区域 | 内容 |
|------|------|
| 顶部 | "我的简历" + "新建简历" 按钮 + "从AI结果创建" 按钮 |
| 卡片网格 | 每张：缩略图 + 标题 + 更新时间 + 操作（编辑/复制/删除） |

### 编辑工作台页

三栏布局（参考 Magic Resume）：

| 左栏 (200px) | 中栏 (flex) | 右栏 (flex) |
|-------------|-------------|-------------|
| 模块导航 | 表单编辑 | A4 预览 |
| 拖拽排序 | 分区表单 | 缩放适配 |
| 显隐开关 | 富文本输入 | 分页线 |
| 新增模块 | | |

**顶部工具栏**：
- 简历标题（可编辑）
- 模板选择按钮（10 种模板可选）
- 主题色选择器（12 种预设色）
- 字体选择（4 种字体）
- 页边距调整
- AI 预填充按钮（从 AI 分析结果自动填入）
- 随机样式按钮（一键随机模板+字体+颜色）
- 打印/导出 PDF（文件名为「姓名 - 简历.pdf」，导出时隐藏导航栏）
- 返回列表

---

## 17.9 关键设计模式总结（从 Magic Resume 学到）

### 1. Template Registry Pattern（模板注册表）

所有模板通过统一注册表管理，新增模板只需：
1. 创建 `templates/xxx/config.ts` + `index.tsx`
2. 在 `registry.ts` 中注册一行

### 2. Section-based Rendering（模块化渲染）

简历按 `menuSections` 配置的顺序和显隐渲染，每个模块独立组件：
```jsx
enabledSections.map(section => renderSection(section.id))
```

### 3. A4 Preview with Scale（A4 缩放预览）

预览区使用 CSS transform scale 适配容器宽度：
```jsx
<div style={{ width: '210mm', minHeight: '297mm' }}>
  <div style={{ transform: `scale(${scaleFactor})`, transformOrigin: 'top left' }}>
    <ResumeTemplate data={data} />
  </div>
</div>
```

### 4. Debounced Persistence（防抖持久化）

编辑时使用防抖保存，避免高频写入：
```typescript
const debouncedSave = debounce((data) => {
  localStorage.setItem('resume', JSON.stringify(data));
}, 1500);
```

### 5. Section Click Navigation（点击导航）

预览区点击某个模块，编辑区自动切换到对应模块：
```jsx
const handleClick = (e) => {
  const sectionId = e.target.closest('[data-section-id]')?.dataset.sectionId;
  if (sectionId) setActiveSection(sectionId);
};
```

---

## 17.10 组件清单

### 页面组件

| 组件 | 路径 | 说明 |
|------|------|------|
| ResumeListPage | `app/(dashboard)/resume-builder/page.tsx` | 简历列表 |
| ResumeEditorPage | `app/(dashboard)/resume-builder/[id]/page.tsx` | 编辑工作台 |

### 布局组件

| 组件 | 说明 |
|------|------|
| SectionNavigator | 左侧模块导航（排序+显隐） |
| SectionEditor | 中间编辑面板（根据 activeSection 切换） |
| ResumePreview | 右侧 A4 预览 |
| EditorToolbar | 顶部工具栏 |

### 编辑器子面板

| 组件 | 说明 |
|------|------|
| BasicInfoPanel | 基本信息编辑 |
| EducationPanel | 教育经历编辑 |
| ExperiencePanel | 实习/工作经历编辑 |
| ProjectPanel | 项目经历编辑 |
| SkillsPanel | 技能编辑 |
| SelfEvaluationPanel | 自我评价编辑 |

### 模板组件

| 组件 | 说明 |
|------|------|
| ClassicTemplate | 经典模板 — 标准单栏 |
| ModernTemplate | 现代模板 — 主题色高亮 |
| FreshGradTemplate | 应届生模板 — 强调教育 |
| SidebarTemplate | 双栏侧边模板 |
| ElegantTemplate | 优雅简约模板 |
| CompactTemplate | 紧凑高效模板 |
| BoldHeaderTemplate | 醒目头部模板 |
| MinimalTemplate | 极简留白模板 |
| TimelineTemplate | 时间轴模板 |
| TechTemplate | 科技感模板 |
| TemplateSelector | 模板选择弹窗 |

---

## 17.11 与现有流程的集成

```
简历优化页面 (/resume)
  ↓ "用AI结果创建简历" 按钮
  ↓ 调用 buildResumeFromAIResults()
  ↓ 创建新简历并跳转
简历创建器 (/resume-builder/[id])
  ↓ 编辑、预览、导出
```

汇总报告页面也新增"生成简历"入口。

---

## 17.12 不引入的依赖

为保持项目轻量，以下 Magic Resume 使用的依赖**不引入**：

| 依赖 | 替代方案 |
|------|----------|
| zustand | React Context |
| tailwindcss | CSS Variables |
| framer-motion | CSS @keyframes |
| tiptap 富文本 | textarea + contentEditable |
| puppeteer PDF | window.print() + @media print |
| react-resizable-panels | CSS Grid |
| lucide-react 图标 | SVG + Emoji |
| shadcn/ui | 自有 UI 组件 |
