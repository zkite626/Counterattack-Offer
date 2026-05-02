# 08 — 组件规格文档

## 概述

组件分为三类：基础UI组件（`components/ui/`）、布局组件（`components/layout/`）、业务组件（`components/business/`）。

---

## 8.1 基础 UI 组件

### Button

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | `'primary'\|'secondary'\|'ghost'\|'danger'` | `'primary'` | 样式变体 |
| size | `'sm'\|'md'\|'lg'` | `'md'` | 尺寸 |
| loading | `boolean` | `false` | 加载状态 |
| disabled | `boolean` | `false` | 禁用 |
| icon | `ReactNode` | - | 前置图标 |
| fullWidth | `boolean` | `false` | 撑满宽度 |
| onClick | `() => void` | - | 点击事件 |
| children | `ReactNode` | - | 按钮文字 |

### Card

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | `'default'\|'glass'\|'gradient'` | `'default'` | 样式变体 |
| padding | `'none'\|'sm'\|'md'\|'lg'` | `'md'` | 内边距 |
| hoverable | `boolean` | `false` | 悬停效果 |
| className | `string` | - | 自定义类名 |

### Input

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| label | `string` | - | 标签文字 |
| error | `string` | - | 错误信息 |
| helper | `string` | - | 帮助文字 |
| type | `string` | `'text'` | 输入类型 |
| placeholder | `string` | - | 占位符 |
| required | `boolean` | `false` | 必填 |

### Tag

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | `'default'\|'success'\|'warning'\|'danger'` | `'default'` | 颜色 |
| size | `'sm'\|'md'` | `'sm'` | 尺寸 |
| removable | `boolean` | `false` | 可删除 |

### ProgressBar

| Prop | 类型 | 说明 |
|------|------|------|
| value | `number` | 0-100 百分比 |
| label | `string` | 标签 |
| showValue | `boolean` | 显示数值 |
| color | `string` | 自定义颜色 |
| animated | `boolean` | 动画效果 |

### ScoreRing

| Prop | 类型 | 说明 |
|------|------|------|
| score | `number` | 0-100 分数 |
| size | `number` | 直径(px) |
| strokeWidth | `number` | 线条宽度 |
| label | `string` | 中心标签 |
| animated | `boolean` | 动画 |

### RadarChart

| Prop | 类型 | 说明 |
|------|------|------|
| dimensions | `{ label: string; value: number }[]` | 维度数据 |
| size | `number` | 画布尺寸 |
| maxValue | `number` | 最大值(100) |

### Timeline

| Prop | 类型 | 说明 |
|------|------|------|
| items | `{ title: string; content: string; status: string }[]` | 时间轴项 |
| orientation | `'vertical'\|'horizontal'` | 方向 |

### Skeleton

| Prop | 类型 | 说明 |
|------|------|------|
| width | `string` | 宽度 |
| height | `string` | 高度 |
| variant | `'text'\|'rect'\|'circle'` | 形状 |
| count | `number` | 重复行数 |

### Modal

| Prop | 类型 | 说明 |
|------|------|------|
| isOpen | `boolean` | 显示状态 |
| onClose | `() => void` | 关闭回调 |
| title | `string` | 标题 |
| size | `'sm'\|'md'\|'lg'` | 尺寸 |

### ThemeToggle

无 Props。自动读取/设置 ThemeContext。三态切换按钮。

### Icon

| Prop | 类型 | 说明 |
|------|------|------|
| name | `string` | 图标名称（对应 SVG Sprite 中的 id） |
| size | `number` | 图标尺寸(px)，默认 24 |
| className | `string` | 自定义类名 |

通过 `IconSprite` 组件在页面注入 SVG Sprite，`Icon` 通过 `<use>` 引用。

---

## 8.2 布局组件

### Header

- Logo + 应用名
- 步骤条（桌面端）
- 主题切换按钮
- 用户头像 + 下拉菜单

### Sidebar

- 导航菜单列表
- 当前路径高亮
- 折叠/展开控制
- 移动端：抽屉模式

### StepNav

- 步骤图标 + 标签
- 进度连接线
- 当前/完成/锁定三态
- 可点击已完成步骤

### Footer

- 版权信息
- 仅首页展示

---

## 8.3 业务组件

### ExperienceCard

展示一条经历的转译结果。

| 区域 | 内容 |
|------|------|
| 左列 | 原始经历文字 |
| 中列 | 能力标签（Tag组件） |
| 右列 | 简历表达 + 面试问题 |
| 底部 | 真实性说明 |

### ResumeCompare

简历优化前后对比卡片。

| 区域 | 内容 |
|------|------|
| 左 | 优化前（灰色背景） |
| 右 | 优化后（绿色边框高亮） |
| 底部 | 来源经历 + 对应能力 + 风险等级 + 验证问题 |

### MatchScoreBoard

人岗匹配总览面板。

| 区域 | 内容 |
|------|------|
| 中心 | ScoreRing（总分） |
| 周围 | 维度评分条 |
| 下方 | 优势/差距 列表 |
| 底部 | 投递策略 + 风险提醒 |

### InterviewChat

面试对话组件。

| 模式 | 说明 |
|------|------|
| 卡片模式 | 展示预生成的面试题+追问+示例答案 |
| 对话模式 | 实时AI对话，流式输出 |

### PlanTimeline

能力补齐计划时间轴。

| 区域 | 内容 |
|------|------|
| 标题 | 目标岗位 + 总目标 |
| 时间轴 | 7天/14天/30天 三段 |
| 底部 | 推荐产出清单 |

### ModelManager

模型管理组件。

| 功能 | 说明 |
|------|------|
| 模型列表 | 内置+自定义模型卡片 |
| 添加模型 | Modal表单 |
| 编辑模型 | 修改配置 |
| 测试连接 | 发送测试请求 |
| 删除模型 | 确认删除 |
| 切换激活 | 单选激活 |

### SectionNavigator（简历创建器）

模块导航组件，显示简历各模块列表。

| 功能 | 说明 |
|------|------|
| 模块列表 | 6个模块（基本信息/教育/经历/项目/技能/自我评价） |
| 选中高亮 | 当前编辑模块高亮 |
| 上移/下移 | 调整模块顺序 |
| 显隐切换 | 控制模块在预览中的可见性 |

### SectionEditor（简历创建器）

编辑面板路由组件，根据当前选中的模块显示对应编辑面板。

| 子面板 | 说明 |
|--------|------|
| BasicInfoPanel | 姓名/邮箱/电话/地址/求职意向 |
| EducationPanel | 教育经历列表（增删改） |
| ExperiencePanel | 实习经历列表（增删改） |
| ProjectPanel | 项目经历列表（增删改） |
| SkillsPanel | 技能标签管理 |
| SelfEvaluationPanel | 自我评价文本编辑 |

### ResumePreview（简历创建器）

A4 纸张预览组件。

| 功能 | 说明 |
|------|------|
| 自适应缩放 | ResizeObserver 监听容器宽度，自动缩放 A4 纸张 |
| 模板渲染 | 通过 registry 加载当前选中模板 |
| 实时同步 | 编辑区数据变化立即反映到预览 |

### EditorToolbar（简历创建器）

编辑器工具栏。

| 功能 | 说明 |
|------|------|
| 模板选择 | 切换经典/现代/应届生模板 |
| 主题色 | 6种预设颜色 |
| 全局设置 | 字号/字体/行高/间距/内边距 |
| AI导入 | 从 AI 分析结果预填充简历 |
| PDF导出 | 触发浏览器打印（@media print） |
| 返回 | 回到简历列表页 |
