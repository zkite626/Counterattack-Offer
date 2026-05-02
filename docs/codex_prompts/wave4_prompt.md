# Wave 4 Codex 提示词 — 核心业务页面（后半段）

```
你是一个资深全栈工程师，正在为《逆袭Offer》Web MVP 完成核心业务的后半段闭环。

## 必读文档

- AGENTS.md（开发规则）
- docs/02_DATA_MODELS.md（数据模型）
- docs/03_API_SPECIFICATION.md（API 规格）
- docs/06_UI_UX_DESIGN_SYSTEM.md（设计系统）
- docs/08_COMPONENT_SPECIFICATION.md（组件规格）
- docs/09_PROMPT_TEMPLATES.md（Prompt 模板）

## 前置条件

Wave 1-3 已完成。用户可以完成：注册登录 → 配置AI模型 → 填写信息 → 生成画像 → 经历转译 → JD解析 → 人岗匹配。

## Wave 4 任务

### 任务 4.1：简历优化

创建 Prompt `src/prompts/optimize-resume.ts` 和 API Route `src/app/api/ai/optimize-resume/route.ts`。

请求体包含：rawExperiences, experienceTranslations, jobAnalysis, matchReport, modelConfig。

创建 `src/app/(dashboard)/resume/page.tsx`：
- 页面标题："可信简历优化器"
- 核心组件 ResumeCompare 卡片列表
- 每张卡片展示：
  - 来源经历（灰色顶部标签）
  - 左列"优化前"（灰色背景，删除线文字）
  - 右列"优化后"（绿色左边框，高亮文字）
  - 对应能力标签（Tag 列表）
  - 面试验证问题（可展开）
  - 风险等级标签（低=绿/中=黄/高=红）
  - 注意事项文字
- 底部：简历整体建议卡片
- "重新生成" 按钮

创建 `src/components/business/ResumeCompare.tsx`。

### 任务 4.2：面试训练

创建 Prompt `src/prompts/interview.ts` 和 API Route `src/app/api/ai/interview/route.ts`。

创建 `src/app/(dashboard)/interview/page.tsx`：

**卡片模式**（默认）：
- InterviewSimulation 卡片列表
- 每张卡片：问题类型 Tag + 主问题（大号） + 追问列表（编号）+ 推荐回答结构 + 示例答案（可展开） + 评分标准 checklist
- 支持折叠/展开

**对话模式**（可选切换）：
- 聊天界面布局
- 面试官（AI）消息居左，学生（用户）消息居右
- 用户输入文本框 + 发送按钮
- AI 流式响应（SSE）
- 使用 `/api/ai/chat` 流式接口

创建 `src/components/business/InterviewChat.tsx`。

模式切换按钮在页面顶部。

### 任务 4.3：能力补齐计划

创建 Prompt `src/prompts/improvement-plan.ts` 和 API Route `src/app/api/ai/plan/route.ts`。

创建 `src/app/(dashboard)/plan/page.tsx`：
- 页面标题："30天求职突围计划"
- 目标岗位 + 总目标 卡片
- Timeline 组件展示三段计划：
  - 7天计划（绿色节点）
  - 14天计划（蓝色节点）
  - 30天计划（紫色节点）
- 每天任务用编号列表
- 推荐产出清单（checklist 样式）

创建 `src/components/ui/Timeline.tsx`（垂直时间轴）。
创建 `src/components/business/PlanTimeline.tsx`。

### 任务 4.4：汇总报告

创建 Prompt `src/prompts/final-report.ts` 和 API Route `src/app/api/ai/report/route.ts`。

报告 API 返回 Markdown 格式文本。

创建 `src/app/(dashboard)/report/page.tsx`：
- 整合展示所有模块数据
- 分区卡片：
  1. 求职画像摘要
  2. 适配岗位方向（推荐岗位列表）
  3. 隐藏能力发现（能力标签云）
  4. 目标岗位匹配度（ScoreRing + 维度条）
  5. 简历优化重点（前后对比精简版）
  6. 面试准备重点（关键问题列表）
  7. 30天行动计划（精简版时间轴）
  8. AI 综合建议
- "生成AI综合报告" 按钮（调用报告 API 生成 Markdown）
- 渲染 Markdown 报告区域
- 完成度进度条（展示已完成 X/9 步骤）

## 验收标准

1. 简历优化前后对比正确渲染
2. 面试卡片模式正常展示
3. 面试对话模式流式输出正常
4. 能力计划时间轴三段正确
5. 汇总报告整合所有数据
6. 全流程从信息到报告可完整走通
7. 亮色/暗色模式正确
8. 响应式布局正常
```
