# 07 — 页面路由与流程文档

## 7.1 页面清单

| # | 页面 | 路由 | 布局 | 认证 | 说明 |
|---|------|------|------|------|------|
| 0 | 首页 | `/` | Landing | ❌ | 全屏 Hero + 痛点 + 六步路径 + 功能区 + CTA |
| A1 | 登录 | `/login` | Auth | ❌ | 邮箱+密码 |
| A2 | 注册 | `/register` | Auth | ❌ | 邮箱+密码+姓名 |
| 1 | 学生信息 | `/profile` | Dashboard | ✅ | 表单 + 一键导入 |
| 2 | AI画像 | `/diagnosis` | Dashboard | ✅ | 画像诊断结果 |
| 3 | 经历转译 | `/translation` | Dashboard | ✅ | 能力转译卡片 |
| 4 | JD解析 | `/job` | Dashboard | ✅ | 输入JD + 解析 |
| 5 | 人岗匹配 | `/match` | Dashboard | ✅ | 匹配分数 + 雷达 |
| 6 | 简历优化 | `/resume` | Dashboard | ✅ | 前后对比 |
| 7 | 面试训练 | `/interview` | Dashboard | ✅ | 问答 + 对话 |
| 8 | 能力计划 | `/plan` | Dashboard | ✅ | 时间轴 |
| 9 | 汇总报告 | `/report` | Dashboard | ✅ | 完整报告 |
| S | 模型设置 | `/settings` | Dashboard | ✅ | 模型管理 |
| R1 | 简历列表 | `/resume-builder` | Dashboard | ✅ | 多简历管理（新建/删除/复制） |
| R2 | 简历编辑 | `/resume-builder/[id]` | Dashboard | ✅ | 三栏编辑器（导航+编辑+预览） |

## 7.2 步骤导航

Dashboard Layout 顶部固定步骤条：

```
user 基础信息 → diagnosis AI画像 → translate 经历转译 → job JD解析 → match 人岗匹配 → resume 简历优化 → interview 面试训练 → plan 能力计划 → report 汇总报告
```

步骤状态：
- `completed`：已完成（绿色✅）
- `current`：当前步骤（主色高亮）
- `locked`：未解锁（灰色，不可点击）

### 解锁规则

| 步骤 | 前置条件 |
|------|----------|
| 基础信息 | 无 |
| AI画像 | 基础信息已填写 |
| 经历转译 | AI画像已生成 |
| JD解析 | 无（可独立使用） |
| 人岗匹配 | AI画像 + JD解析 |
| 简历优化 | 人岗匹配 |
| 面试训练 | 简历优化 |
| 能力计划 | 人岗匹配 |
| 汇总报告 | 至少5个步骤已完成 |

## 7.3 推荐体验路径

```
首页 → 注册/登录 → 配置 API Key 并测试连接 → 个人信息（填充李同学数据）→ 开始 AI 诊断 → 经历转译 → 输入 JD → 人岗匹配 → 简历优化 → 面试训练 → 能力计划 → 汇总报告 → 简历创建器（选模板 + 随机样式 + 导出 PDF）
```

> 注：每一步均调用真实 AI 接口，进度条自动打勾。无 Demo 模式。

## 7.4 导航结构

### 侧边栏（桌面端）

```
Logo + 逆袭Offer
──────────────
user 我的求职起点
diagnosis AI求职画像
translate 经历能力转译
job 岗位需求解析
match 匹配避坑雷达
resume 可信简历优化
interview AI面试追问
plan 突围行动计划
report 求职报告
──────────────
resume-builder 简历创建器
──────────────
settings 模型设置
user 个人信息
logout 退出登录
```

### 底部导航栏（移动端）

只展示 5 个核心入口：信息 | 画像 | 匹配 | 面试 | 报告

---

## 7.5 页面状态流转

```
空状态（未填写）
  ↓ 用户填写/AI生成
加载中（Skeleton + 动画）
  ↓ 成功
内容展示
  ↓ 可选
重新生成（重新调用AI）
```

每个功能页面都应有三种状态：

1. **空状态**：提示用户开始操作或完成前置步骤
2. **加载中**：Skeleton 骨架屏 + "AI 正在分析..." 提示
3. **结果展示**：结构化数据 + 可视化
