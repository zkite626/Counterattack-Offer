# Wave 7 Codex 提示词 — 简历创建器（Resume Builder）

```
你是一个资深全栈工程师，正在为《逆袭Offer》Web MVP 新增简历创建器功能。

## 必读文档

- AGENTS.md（开发规则）
- docs/02_DATA_MODELS.md（数据模型）
- docs/06_UI_UX_DESIGN_SYSTEM.md（设计系统）
- docs/08_COMPONENT_SPECIFICATION.md（组件规格）
- docs/17_RESUME_BUILDER_DESIGN.md（简历创建器设计 — 核心参考）

## 前置条件

Wave 1-6 已完成。全部功能页面可用，AI 服务可调用。

## 设计概要

简历创建器提供编辑+实时预览+PDF导出功能：
- 三栏布局：模块导航 | 表单编辑 | A4预览
- 模板系统：经典/现代/应届生 3个模板
- AI预填充：从现有AI分析结果自动填入简历
- PDF导出：浏览器 window.print() + @media print

## Wave 7 任务

### 任务 7.1：简历构建器类型定义

在 `src/types/resume-builder.ts` 中定义：
- ResumeBasicInfo, ResumeCustomField
- ResumeEducation, ResumeExperience, ResumeProject
- ResumeSection, ResumeGlobalSettings
- ResumeTemplate, ResumeBuilderData
- DEFAULT_RESUME_SECTIONS

详见 `docs/17_RESUME_BUILDER_DESIGN.md` §17.3。

### 任务 7.2：ResumeBuilderContext

创建 `src/contexts/ResumeBuilderContext.tsx`：
- useReducer 管理 ResumeBuilderState
- 支持多份简历管理（resumes Record）
- 持久化到 localStorage('nixi-resume-builder')
- 提供 createResume, updateBasic, addEducation, updateEducation, deleteEducation 等方法
- 支持 LOAD_FROM_AI action 从 AI 结果填充

创建 `src/hooks/useResumeBuilder.ts`。

### 任务 7.3：模板系统

创建 `src/components/resume-templates/` 目录：

**registry.ts**：
- TEMPLATE_REGISTRY 数组
- getTemplateComponent(layout) 查找函数
- RESUME_TEMPLATES 导出所有模板配置

**经典模板** `classic/`：
- config.ts：标准单栏，黑色主题，ATS友好
- index.tsx：按 sections 顺序渲染各模块
- sections/：BasicSection, EducationSection, ExperienceSection, ProjectSection, SkillSection

**现代模板** `modern/`：
- config.ts：现代风格，主题色高亮
- index.tsx：类似经典但标题有色块装饰

**应届生模板** `fresh-grad/`：
- config.ts：强调教育和项目区域
- index.tsx：教育区域放大，项目描述详细

每个模板渲染逻辑：
```tsx
const enabledSections = data.sections.filter(s => s.enabled).sort((a,b) => a.order - b.order);
enabledSections.map(section => renderSection(section.id))
```

每个 section 组件用 `data-section-id={sectionId}` 属性标记，支持点击导航。

### 任务 7.4：模块导航组件

创建 `src/components/business/SectionNavigator.tsx`：
- 列表展示所有模块（图标 + 标题）
- 当前选中模块高亮
- 每个模块有显隐开关（Switch）
- 拖拽排序（简单实现：上移/下移按钮）
- 点击模块切换编辑面板

### 任务 7.5：编辑面板

创建 `src/components/business/SectionEditor.tsx`：
根据 activeSection 切换渲染：
- basic → BasicInfoPanel（姓名、求职意向、邮箱、电话、城市、头像上传）
- education → EducationPanel（学校、专业、学位、时间、描述；可添加/删除）
- experience → ExperiencePanel（公司、职位、时间、描述；可添加/删除）
- projects → ProjectPanel（项目名、角色、时间、描述、链接；可添加/删除）
- skills → SkillsPanel（textarea 编辑技能）
- selfEvaluation → SelfEvaluationPanel（textarea 自我评价）

每个 Panel 使用 Card 组件包裹，Input 组件表单，Button 操作。

### 任务 7.6：A4 预览组件

创建 `src/components/business/ResumePreview.tsx`：
- 容器模拟 A4 纸张（210mm × 297mm）
- 白色背景 + 阴影
- CSS transform scale 适配容器宽度
- 使用 ResizeObserver 监听容器宽度自动计算 scaleFactor
- 渲染 Template Registry 中的对应模板组件
- 点击 section 区域触发编辑面板切换
- 分页线提示（虚线 + "第N页结束"）

### 任务 7.7：工具栏

创建 `src/components/business/EditorToolbar.tsx`：
- 简历标题（可编辑 input）
- 模板选择按钮（打开 Modal 展示模板缩略图网格）
- 主题色选择器（预设 6 色 + 自定义）
- 字体选择（Inter / Noto Sans SC）
- 页边距滑块
- AI 预填充按钮（从 JobFlowContext 读取数据填入）
- 打印/导出 PDF 按钮
- 返回按钮

### 任务 7.8：简历列表页

创建 `src/app/(dashboard)/resume-builder/page.tsx`：
- 页面标题："我的简历"
- 操作区："新建空白简历"按钮 + "从AI结果创建"按钮
- 简历卡片网格：
  - 缩略图（模板预览缩小版或占位图）
  - 标题
  - 更新时间
  - 操作按钮（编辑、复制、删除）
- 空状态提示

### 任务 7.9：编辑工作台页

创建 `src/app/(dashboard)/resume-builder/[id]/page.tsx`：
- 三栏响应式布局：
  - 桌面：SectionNavigator(200px) | SectionEditor(flex-1) | ResumePreview(flex-1)
  - 平板：SectionEditor + ResumePreview（导航收起为抽屉）
  - 手机：Tab 切换编辑/预览
- 顶部 EditorToolbar
- 三栏可折叠（参考 Magic Resume PreviewDock 模式）

### 任务 7.10：AI 预填充逻辑

创建 `src/lib/utils/resume-builder.ts`：
- `buildResumeFromAIResults(profile, diagnosis, translations, optimization)` 函数
- 将 AI 分析结果映射到 ResumeBuilderData 结构
- 智能提取学校、公司名称
- 使用 AI 优化后的表达作为描述

### 任务 7.11：PDF 导出

在 globals.css 中添加 @media print 样式：
- 隐藏所有非预览元素
- 预览区域全屏 A4
- @page 设置 A4 尺寸和零 margin
- 分页控制

### 任务 7.12：集成入口

在现有页面添加入口：
- 简历优化页（/resume）底部添加 "用AI结果创建简历 →" 按钮
- 汇总报告页（/report）添加 "生成简历" 入口
- 侧边栏添加 "简历创建器" 导航项（📝 图标）
- 步骤导航可选新增 "简历创建" 步骤

更新路由相关文件。

## 验收标准

1. 可新建空白简历并进入编辑器
2. 三栏布局正常：左导航 + 中编辑 + 右预览
3. 编辑内容实时反映在右侧预览
4. 三个模板可切换，预览正确
5. 模块排序和显隐控制正常
6. 从AI结果一键创建简历，内容正确填充
7. Ctrl+P / 导出按钮可打印 A4 PDF
8. 多份简历管理正常
9. 数据持久化到 localStorage
10. 亮色/暗色模式下编辑器正常（预览区始终白底）
11. 响应式：手机端 Tab 切换编辑/预览
```
