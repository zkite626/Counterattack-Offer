# 11 — 示例数据文档

## 概述

李同学示例数据存放在 `src/data/demo-case.ts`，用于"填充李同学数据"功能。该功能仅填充表单字段，用户点击「开始 AI 诊断」后将调用真实 AI 接口进行分析，所有模块数据均由 AI 实时生成。

---

## 11.1 李同学基础信息

```typescript
export const DEMO_STUDENT_PROFILE: StudentProfile = {
  id: 'demo-student-001',
  name: '李同学',
  schoolType: '普通本科',
  major: '市场营销',
  grade: '大四',
  targetCities: ['杭州', '上海', '深圳'],
  targetRoles: ['运营助理', '用户运营', '产品助理'],
  educationBackground: '本科，市场营销专业',
  rawExperiences: [
    '大二时在学校新媒体社团做过宣传，负责公众号推文排版和活动海报文案。',
    '市场调研课程中，小组做过一个关于校园二手交易需求的问卷调查，我负责收集问卷和整理结果。',
    '寒假在奶茶店做过兼职，负责点单、收银、客户沟通。',
    '参加过一次创新创业比赛，但没有获奖，项目是校园闲置物品交换平台。',
    '英语四级，熟悉 Excel、PPT，会使用剪映和基础设计工具。',
  ],
  skills: ['Excel', 'PPT', '剪映', '公众号排版', '问卷整理'],
  weaknesses: ['没有正式实习', '项目经历少', '不清楚适合岗位', '面试紧张'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
```

---

## 11.2 示例岗位 JD

```typescript
export const DEMO_JOB_DESCRIPTION = `岗位名称：用户运营实习生
岗位职责：
1. 负责社群用户日常维护，提升用户活跃度；
2. 协助完成用户调研、反馈收集和数据整理；
3. 参与活动策划与内容发布；
4. 支持运营数据统计和复盘。

任职要求：
1. 本科及以上在读，专业不限；
2. 有社团、活动运营、新媒体运营经验优先；
3. 具备良好的沟通表达能力和执行力；
4. 熟悉 Excel、PPT、问卷工具者优先；
5. 对互联网产品和用户增长感兴趣。`;
```

---

## 11.3 AI 输出参考（仅用于文档参考，实际由 AI 实时生成）

### 画像诊断参考

```json
{
  "studentType": "低经验但具备运营潜力型学生",
  "summary": "李同学拥有基础的内容表达、用户调研和沟通服务能力...",
  "coreStrengths": [
    "具备基础内容表达能力",
    "有校园用户场景理解",
    "有一定沟通服务经验",
    "具备初步调研和信息整理能力"
  ],
  "mainWeaknesses": [
    "缺少正式互联网实习经历",
    "项目成果缺少量化表达",
    "对目标岗位能力要求理解不足",
    "面试表达缺少结构化案例"
  ],
  "recommendedRoles": [
    { "role": "运营助理", "reason": "已有社团宣传、内容排版经历", "fitScore": 86, "priority": "recommended" },
    { "role": "用户运营实习生", "reason": "有问卷调研和用户沟通基础", "fitScore": 82, "priority": "recommended" },
    { "role": "产品助理", "reason": "有校园项目想法但深度不足", "fitScore": 68, "priority": "challenge" }
  ],
  "careerAdvice": "建议优先投递运营助理和用户运营类岗位"
}
```

### 匹配报告参考

```json
{
  "overallMatchScore": 82,
  "matchLevel": "建议优先投递",
  "dimensionScores": [
    { "dimension": "经历相关度", "score": 78, "reason": "社团宣传和课程调研有关联" },
    { "dimension": "技能匹配度", "score": 84, "reason": "具备Excel、PPT等工具能力" },
    { "dimension": "岗位理解度", "score": 70, "reason": "运营指标理解需补强" },
    { "dimension": "面试表达准备度", "score": 62, "reason": "需转化为结构化案例" }
  ],
  "advantages": ["有社团宣传经历", "有问卷调研基础", "有服务类沟通经验"],
  "gaps": ["缺少运营数据复盘案例", "简历缺少量化结果", "对用户增长指标理解不足"],
  "applicationStrategy": "建议投递用户运营和内容运营实习岗位",
  "riskWarning": "不建议短期直接投递高要求产品经理或数据分析岗位"
}
```

---

## 11.4 使用方式

```typescript
// 在 profile 页面，点击"填充李同学数据"按钮
function handleLoadSampleData() {
  setName("李同学");
  setSchoolType("普通本科");
  setMajor("市场营销");
  // ... 填充表单字段
  // 用户随后点击"开始 AI 诊断"触发真实 AI 调用
}
```

### 设计说明

- **不使用 Demo 模式**：所有 AI 分析结果均通过真实 API 调用生成
- **不预填充 AI 结果**：填充李同学数据后，用户需逐步点击各模块触发 AI 生成
- **进度条真实反映状态**：每完成一个 AI 模块，对应的进度条步骤自动打勾
