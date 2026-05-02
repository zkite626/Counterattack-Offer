# Wave 3 开发提示词 — 核心业务页面（前半段）

```
你是一个资深全栈工程师，正在为《逆袭Offer》Web MVP 开发核心业务页面的前半段。

## 必读文档

- AGENTS.md（开发规则）
- docs/02_DATA_MODELS.md（数据模型 — 学生/岗位类型）
- docs/03_API_SPECIFICATION.md（API 规格 — AI API）
- docs/06_UI_UX_DESIGN_SYSTEM.md（设计系统）
- docs/07_PAGE_ROUTES_FLOW.md（页面路由与流程）
- docs/08_COMPONENT_SPECIFICATION.md（组件规格）
- docs/09_PROMPT_TEMPLATES.md（Prompt 模板）
- docs/10_STATE_MANAGEMENT.md（状态管理 — JobFlowContext）
- docs/11_DEMO_DATA.md（Demo 数据 — 李同学案例）

## 前置条件

Wave 1 和 Wave 2 已完成：基础组件、认证、AI 服务层、模型管理均已就绪。

## Wave 3 任务

### 任务 3.1：TypeScript 类型定义

创建 `src/types/` 下的类型文件：
- `auth.ts` — User, CreateUserDTO, LoginDTO, AuthResponse, JWTPayload
- `student.ts` — StudentProfile, CareerDiagnosis, RecommendedRole, ExperienceTranslation
- `job.ts` — JobAnalysis, CoreAbility, MatchReport, DimensionScore, ResumeOptimization, InterviewSimulation, ImprovementPlan
- `index.ts` — FlowStep, JobFlowState, JobFlowAction, ApiResponse, Theme

所有类型参考 `docs/02_DATA_MODELS.md`。

### 任务 3.2：JobFlowContext

创建 `src/contexts/JobFlowContext.tsx`：
- useReducer 管理 JobFlowState
- dispatch 后自动持久化到 localStorage('nixi-job-flow')
- 提供 loadDemoCase, resetFlow, canAccessStep, getCompletionPercentage 方法
- 刷新恢复状态

参考 `docs/10_STATE_MANAGEMENT.md` §10.5。

### 任务 3.3：步骤导航组件

创建 `src/components/layout/StepNav.tsx`：
- 展示 9 个步骤：📝信息 → 🔍画像 → 🔄转译 → 💼JD → 📊匹配 → 📄简历 → 🎤面试 → 📅计划 → 📋报告
- 三种状态：completed（绿色✅）、current（主色高亮动画）、locked（灰色不可点击）
- 步骤间有连接线
- 响应式：桌面端水平，移动端水平滚动
- 点击已完成步骤可跳转

更新 `src/app/(dashboard)/layout.tsx` 引入 StepNav。

### 任务 3.4：Demo 案例数据

创建 `src/data/demo-case.ts`：
- DEMO_STUDENT_PROFILE — 李同学完整信息
- DEMO_JOB_DESCRIPTION — 用户运营实习生 JD

参考 `docs/11_DEMO_DATA.md`。

### 任务 3.5：可视化组件

创建以下组件（参考 docs/08）：
- `src/components/ui/ProgressBar.tsx` — 进度条（带动画）
- `src/components/ui/ScoreRing.tsx` — 环形分数（SVG 动画）
- `src/components/ui/RadarChart.tsx` — 雷达图（纯 SVG/Canvas）
- `src/components/ui/Skeleton.tsx` — 骨架屏（加载占位）

### 任务 3.6：学生信息页

创建 `src/app/(dashboard)/profile/page.tsx`：
- 表单区域：姓名、学校类型(下拉)、专业、年级(下拉)、目标城市(多选Tag)、目标岗位(多选Tag)、原始经历(多行文本,可添加多条)、技能(Tag输入)、困惑(Tag输入)
- "一键导入李同学案例" 按钮（紫色渐变，醒目）
- "开始AI诊断" 按钮
- 表单设计精美，卡片式分区

### 任务 3.7：画像诊断

创建 Prompt 文件 `src/prompts/diagnose.ts` 和 API Route `src/app/api/ai/diagnose/route.ts`。
API Route 模式：验证JWT → 解析请求 → 创建AIClient → 加载Prompt → 调用AI → 解析JSON → 返回。

创建 `src/app/(dashboard)/diagnosis/page.tsx`：
- 加载状态：Skeleton 骨架屏 + "AI 正在分析你的求职画像..."
- 结果展示：
  - 学生类型标签（大号 Tag）
  - 总结文字
  - 核心优势（绿色卡片列表）
  - 主要短板（橙色卡片列表）
  - 推荐岗位（每个岗位一张卡片：名称 + ScoreRing + 理由 + 优先级 Tag）
  - AI 综合建议
- "重新生成" 按钮

### 任务 3.8：经历转译

Prompt + API Route + 页面：
- 页面展示 ExperienceCard 列表
- 每张卡片三栏：原始经历 | 能力标签(Tags) | 简历表达+面试问题
- 底部显示真实性说明
- 卡片入场动画（stagger）

### 任务 3.9：JD 解析

Prompt + API Route + 页面：
- 大文本输入框粘贴 JD（提供示例 JD 一键填充）
- 解析结果：岗位名称、硬性要求列表、软性要求列表、加分项、核心能力（带重要度 ProgressBar）、隐性期待

### 任务 3.10：人岗匹配

Prompt + API Route + 页面：
- 中心：ScoreRing 总分（大号，带动画）
- 匹配等级 Tag
- RadarChart 维度评分
- 维度评分条（ProgressBar 列表）
- 优势匹配点（绿色列表）
- 短板差距（橙色列表）
- 投递策略（卡片）
- 避坑提醒（红色警告卡片）

## 验收标准

1. 一键导入李同学案例正常
2. 5 个页面依次可走通
3. AI 返回正确 JSON 并渲染
4. 步骤导航正确反映状态
5. 雷达图和分数环正确渲染动画
6. 骨架屏加载态正常
7. 亮色/暗色模式正确
8. 手机端布局正常
```
