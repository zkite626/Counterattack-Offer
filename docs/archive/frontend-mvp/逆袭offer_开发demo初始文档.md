# 逆袭Offer：面向低经验大学生的AI求职突围智能体

> 开发 Demo 初始文档  
> 适用场景：AI+求职赛道参赛 Demo / 高保真原型 / 可运行 Web MVP  
> 当前版本：v0.1  
> 文档用途：供 Codex / 开发者继续完善产品基础文档、代码结构、页面实现、接口设计与 Demo 演示素材。

---

## 1. 项目基本信息

### 1.1 作品名称

**逆袭Offer：面向低经验大学生的AI求职突围智能体**

### 1.2 推荐参赛命名格式

**AI+求职-产品Demo-逆袭Offer：面向低经验大学生的AI求职突围智能体-XXX团队/个人**

### 1.3 项目定位

本项目是一个面向低经验大学生的 AI 求职陪跑 Demo，聚焦“实习少、项目少、方向不清晰、不会包装简历、不会准备面试”的大学生群体，通过 AI 完成从个人经历挖掘、能力画像生成、岗位匹配分析、简历可信优化、面试追问训练到能力补齐计划的完整求职闭环。

项目不是一个通用聊天机器人，也不是单纯的简历润色工具，而是一个围绕大学生求职全流程设计的场景化智能体。

### 1.4 核心理念

低经验大学生并非没有能力，而是缺少将真实经历转化为企业可识别岗位能力的工具。

本系统通过 AI 将学生已有的课程作业、社团经历、兼职经历、比赛经历、校园项目、兴趣实践等内容，转译为企业招聘语境中的能力标签与简历表达，并给出匹配岗位、面试准备和短期能力补齐方案。

---

## 2. Demo 总体目标

### 2.1 Demo 目标

在 3-5 分钟演示视频中，让评委清晰看到：

1. 系统能识别低经验大学生的真实求职困境；
2. 系统能基于学生经历生成能力画像；
3. 系统能解析岗位 JD 并完成人岗匹配；
4. 系统能将普通经历转译为岗位相关能力；
5. 系统能生成可信、不过度包装的简历优化建议；
6. 系统能根据简历和岗位生成面试追问；
7. 系统能输出 7/14/30 天能力补齐计划；
8. 整体流程形成完整求职闭环，而非单点 AI 工具。

### 2.2 Demo 交付形态

优先级从高到低：

1. **可运行 Web Demo**：推荐使用 React / Next.js / Vue / Streamlit。
2. **高保真交互原型**：适合快速参赛展示。
3. **半自动 Demo**：前端页面 + Mock 数据 + AI 接口模拟。
4. **纯演示版**：固定输入案例 + 固定输出结果，用于视频演示。

### 2.3 MVP 范围

本次初始 Demo 不追求完整商业化系统，只需实现核心闭环。

MVP 必须包含：

- 学生信息输入页；
- 低经验画像诊断页；
- 岗位 JD 输入/解析页；
- 人岗匹配报告页；
- 经历挖掘与能力转译页；
- 简历可信优化页；
- AI 面试追问页；
- 能力补齐计划页；
- Demo 案例数据；
- 提示词模板；
- Mock API 或真实大模型 API 调用封装。

---

## 3. 目标用户与核心场景

### 3.1 目标用户

#### 一级目标用户

低经验大学生，包括：

- 普通本科 / 高职 / 专科毕业生；
- 没有大厂实习经历的学生；
- 项目经历较少的学生；
- 不知道自己适合什么岗位的学生；
- 简历内容空泛、表达弱的学生；
- 面试时无法清晰表达个人经历的学生。

#### 二级目标用户

- 高校就业指导老师；
- 辅导员；
- 高校就业办；
- 校园招聘服务平台；
- 企业校园招聘 HR。

当前 Demo 优先服务学生端。

### 3.2 核心用户痛点

| 痛点 | 具体表现 | 本系统解决方式 |
|---|---|---|
| 方向不清晰 | 不知道能投什么岗位 | AI 生成职业画像和岗位方向 |
| 经历少 | 简历空、没有亮点 | 经历挖掘与能力转译 |
| 不会匹配岗位 | 盲目海投 | JD 解析 + 匹配度评分 |
| 简历表达弱 | 写成流水账 | 岗位导向简历优化 |
| 害怕面试 | 不知道会被问什么 | AI 面试追问训练 |
| 能力差距大 | 不知道怎么补 | 7/14/30 天能力补齐计划 |
| 容易 AI 造假 | 简历被过度包装 | 真实经历来源校验 |

### 3.3 Demo 样例用户

建议 Demo 固定使用以下模拟用户，便于演示完整流程。

#### 用户名称

李同学

#### 基础信息

- 学校：普通本科院校
- 年级：大四
- 专业：市场营销
- 目标城市：杭州 / 上海 / 深圳
- 求职状态：准备秋招 / 春招
- 目标方向：运营助理、用户运营、产品助理

#### 低经验特点

- 无大厂实习；
- 无正式互联网公司项目经历；
- 只有社团宣传、课程调研、奶茶店兼职、校园活动组织经历；
- 简历内容较空泛；
- 面试表达不够结构化。

#### 原始经历输入

```text
1. 大二时在学校新媒体社团做过宣传，负责公众号推文排版和活动海报文案。
2. 市场调研课程中，小组做过一个关于校园二手交易需求的问卷调查，我负责收集问卷和整理结果。
3. 寒假在奶茶店做过兼职，负责点单、收银、客户沟通。
4. 参加过一次创新创业比赛，但没有获奖，项目是校园闲置物品交换平台。
5. 英语四级，熟悉 Excel、PPT，会使用剪映和基础设计工具。
```

---

## 4. 产品核心闭环

### 4.1 主流程

```text
学生输入基础信息与经历
        ↓
AI 生成低经验求职画像
        ↓
AI 挖掘经历中的隐藏能力
        ↓
输入目标岗位 JD
        ↓
AI 解析岗位能力要求
        ↓
生成学生-岗位匹配报告
        ↓
输出简历可信优化建议
        ↓
生成面试问题与追问链
        ↓
生成能力补齐计划
        ↓
形成求职行动清单
```

### 4.2 产品价值闭环

```text
不知道自己能做什么
        ↓
知道适合哪些岗位
        ↓
知道自己和岗位差在哪里
        ↓
知道如何修改简历
        ↓
知道面试如何表达
        ↓
知道接下来如何补齐能力
```

---

## 5. 功能模块设计

## 5.1 模块一：学生基础信息采集

### 5.1.1 功能目标

收集学生的基础背景、经历、技能、求职目标，为后续 AI 分析提供输入。

### 5.1.2 输入字段

```json
{
  "name": "李同学",
  "school_type": "普通本科",
  "major": "市场营销",
  "grade": "大四",
  "target_city": ["杭州", "上海", "深圳"],
  "target_roles": ["运营助理", "用户运营", "产品助理"],
  "education_background": "本科，市场营销专业",
  "raw_experiences": [
    "学校新媒体社团宣传，负责公众号推文排版和活动海报文案",
    "市场调研课程中完成校园二手交易需求问卷调查",
    "寒假奶茶店兼职，负责点单、收银和客户沟通",
    "参加创新创业比赛，项目为校园闲置物品交换平台",
    "英语四级，熟悉 Excel、PPT、剪映"
  ],
  "skills": ["Excel", "PPT", "剪映", "公众号排版", "问卷整理"],
  "weaknesses": ["没有正式实习", "项目经历少", "不清楚适合岗位", "面试紧张"]
}
```

### 5.1.3 页面设计建议

页面名称：**我的求职起点**

页面区块：

1. 基础信息；
2. 求职目标；
3. 我的真实经历；
4. 我的技能工具；
5. 当前困惑；
6. 开始 AI 诊断按钮。

### 5.1.4 Demo 实现方式

- 可以使用表单输入；
- 也可以提供“一键填充示例用户”；
- 参赛演示建议加入“一键导入李同学案例”。

---

## 5.2 模块二：低经验画像诊断

### 5.2.1 功能目标

基于学生原始信息，生成求职画像，识别优势、短板和适配岗位方向。

### 5.2.2 输出内容

```json
{
  "student_type": "低经验但具备运营潜力型学生",
  "core_strengths": [
    "具备基础内容表达能力",
    "有校园用户场景理解",
    "有一定沟通服务经验",
    "具备初步调研和信息整理能力"
  ],
  "main_weaknesses": [
    "缺少正式互联网实习经历",
    "项目成果缺少量化表达",
    "对目标岗位能力要求理解不足",
    "面试表达缺少结构化案例"
  ],
  "recommended_roles": [
    {
      "role": "运营助理",
      "reason": "已有社团宣传、内容排版、活动沟通经历，可迁移到内容运营和活动运营场景",
      "fit_score": 86
    },
    {
      "role": "用户运营实习生",
      "reason": "有问卷调研和用户沟通基础，适合从用户反馈收集和社群维护岗位切入",
      "fit_score": 82
    },
    {
      "role": "产品助理",
      "reason": "有校园二手交易平台项目想法，但产品方法论和项目深度不足，可作为冲刺方向",
      "fit_score": 68
    }
  ],
  "career_advice": "建议优先投递运营助理和用户运营类岗位，同时用 30 天补齐产品分析作品集后冲刺产品助理。"
}
```

### 5.2.3 页面展示建议

页面名称：**AI 求职画像报告**

页面组件：

- 用户类型标签；
- 核心优势卡片；
- 主要短板卡片；
- 推荐岗位雷达图或进度条；
- AI 总结建议。

---

## 5.3 模块三：经历挖掘与能力转译

### 5.3.1 功能目标

将学生看似普通的校园经历、兼职经历和课程经历，转译为企业招聘语言中的能力标签。

### 5.3.2 典型示例

| 原始经历 | 可转译能力 | 简历表达方向 |
|---|---|---|
| 社团公众号排版 | 内容运营、视觉表达、活动传播 | 参与校园活动宣传内容制作，负责公众号排版与文案优化 |
| 课程问卷调查 | 用户调研、数据整理、需求分析 | 围绕校园二手交易需求设计并收集问卷，整理用户反馈 |
| 奶茶店兼职 | 客户沟通、服务意识、现场应变 | 负责点单收银与客户沟通，提升服务响应效率 |
| 创新创业比赛 | 产品思维、项目策划、场景洞察 | 参与校园闲置物品交换平台方案设计，梳理用户痛点与功能设想 |

### 5.3.3 输出结构

```json
{
  "experience_translations": [
    {
      "raw_experience": "学校新媒体社团宣传，负责公众号推文排版和活动海报文案",
      "ability_tags": ["内容运营", "活动传播", "文案表达", "视觉协作"],
      "business_language": "具备基础内容运营与校园活动传播能力，能够根据活动目标完成推文排版、海报文案和传播素材整理。",
      "resume_bullet": "参与校园新媒体社团宣传工作，负责公众号推文排版及活动海报文案撰写，支持多场校园活动的信息触达与内容传播。",
      "interview_questions": [
        "你当时负责的推文主要面向哪些用户？",
        "你如何判断一篇推文排版是否有效？",
        "活动宣传效果有没有数据或反馈？"
      ]
    }
  ]
}
```

### 5.3.4 页面展示建议

页面名称：**经历能力转译器**

每条经历展示为三栏：

1. 我的原始经历；
2. AI 识别出的能力；
3. 可用于简历和面试的表达。

### 5.3.5 关键差异化

本模块是作品的核心创新点之一。要强调：

- 不伪造经历；
- 不过度包装；
- 只从真实经历中挖掘可验证能力；
- 每条优化内容都保留来源。

---

## 5.4 模块四：岗位 JD 解析

### 5.4.1 功能目标

输入目标岗位 JD，AI 自动拆解岗位要求，便于后续匹配。

### 5.4.2 示例岗位 JD

```text
岗位名称：用户运营实习生
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
5. 对互联网产品和用户增长感兴趣。
```

### 5.4.3 输出结构

```json
{
  "job_title": "用户运营实习生",
  "hard_requirements": ["本科及以上在读", "熟悉 Excel", "具备沟通表达能力"],
  "soft_requirements": ["执行力", "用户意识", "活动策划能力", "复盘意识"],
  "bonus_points": ["社团经验", "新媒体运营经验", "问卷调研经验", "互联网产品兴趣"],
  "core_abilities": [
    {
      "ability": "用户沟通",
      "importance": "高"
    },
    {
      "ability": "活动运营",
      "importance": "中高"
    },
    {
      "ability": "数据整理",
      "importance": "中"
    },
    {
      "ability": "内容发布",
      "importance": "中"
    }
  ],
  "hidden_expectations": [
    "候选人需要能处理重复性运营工作",
    "候选人最好有用户反馈整理经验",
    "面试中可能会追问活动复盘和数据意识"
  ]
}
```

### 5.4.4 页面展示建议

页面名称：**岗位需求解析器**

展示：

- 岗位名称；
- 硬性要求；
- 软性要求；
- 加分项；
- 核心能力权重；
- 面试可能关注点。

---

## 5.5 模块五：人岗匹配与避坑雷达

### 5.5.1 功能目标

基于学生画像和岗位 JD，输出匹配分数、优势、短板、简历优化重点和投递建议。

### 5.5.2 输出结构

```json
{
  "overall_match_score": 82,
  "match_level": "建议优先投递",
  "dimension_scores": [
    {
      "dimension": "经历相关度",
      "score": 78,
      "reason": "社团宣传、课程调研和兼职经历与用户运营岗位有一定关联"
    },
    {
      "dimension": "技能匹配度",
      "score": 84,
      "reason": "具备 Excel、PPT、问卷整理和内容排版能力"
    },
    {
      "dimension": "岗位理解度",
      "score": 70,
      "reason": "对用户运营的指标和复盘方法理解仍需补强"
    },
    {
      "dimension": "面试表达准备度",
      "score": 62,
      "reason": "现有经历需要转化为结构化案例"
    }
  ],
  "advantages": [
    "有社团宣传和内容发布经历",
    "有问卷调研和用户反馈整理基础",
    "有服务类兼职带来的沟通经验"
  ],
  "gaps": [
    "缺少正式运营数据复盘案例",
    "简历中缺少量化结果",
    "对用户增长指标理解不足"
  ],
  "application_strategy": "建议投递用户运营实习生、内容运营实习生和活动运营助理类岗位。产品助理可作为冲刺方向，但需要补充产品分析作品。",
  "risk_warning": "不建议短期内直接投递高要求产品经理、增长策略或数据分析岗位。"
}
```

### 5.5.3 页面展示建议

页面名称：**岗位匹配与避坑雷达**

页面组件：

- 总体匹配分数；
- 维度评分条；
- 优势匹配点；
- 短板差距；
- 推荐投递策略；
- 不建议岗位提醒。

### 5.5.4 评委记忆点

普通系统只推荐岗位，本系统还告诉学生：

- 为什么适合；
- 差在哪里；
- 哪些岗位不建议盲投；
- 如何补齐差距。

---

## 5.6 模块六：简历可信优化

### 5.6.1 功能目标

基于岗位 JD 和学生真实经历，输出更适合目标岗位的简历表达。

### 5.6.2 关键原则

必须遵守：

1. 不编造不存在的经历；
2. 不虚构获奖、实习、数据；
3. 可以帮助学生量化，但需要提示“请确认真实数据”；
4. 每条优化表达都要保留来源经历；
5. 每条表达都要能经得起面试追问。

### 5.6.3 输出结构

```json
{
  "resume_optimization": [
    {
      "source_experience": "市场调研课程中完成校园二手交易需求问卷调查",
      "before": "做过市场调研课程作业，收集过问卷。",
      "after": "围绕校园二手交易场景参与用户需求调研，负责问卷收集与结果整理，协助小组分析学生闲置物品交易痛点，并形成课程汇报材料。",
      "target_ability": ["用户调研", "需求分析", "数据整理", "汇报表达"],
      "verification_questions": [
        "你们问卷主要问了哪些问题？",
        "最后发现了哪些用户痛点？",
        "你的具体分工是什么？"
      ],
      "risk_level": "低",
      "note": "该表达基于真实课程经历，未虚构结果数据。若补充问卷数量，需要用户确认真实数值。"
    }
  ],
  "resume_summary": "该候选人适合突出内容传播、用户调研、沟通服务和执行协作能力，简历应弱化无正式实习的劣势，强化可迁移能力。"
}
```

### 5.6.4 页面展示建议

页面名称：**可信简历优化器**

每条简历建议展示：

- 原始表达；
- 优化表达；
- 来源经历；
- 对应岗位能力；
- 面试验证问题；
- 真实性风险等级。

---

## 5.7 模块七：AI 面试追问训练

### 5.7.1 功能目标

根据目标岗位和优化后的简历内容，生成面试问题和连续追问，帮助学生训练表达。

### 5.7.2 面试问题类型

- 自我介绍；
- 简历经历追问；
- 岗位理解问题；
- 行为面试问题；
- 场景模拟问题；
- 压力追问；
- 反问建议。

### 5.7.3 输出结构

```json
{
  "interview_simulation": [
    {
      "question_type": "简历追问",
      "main_question": "你在校园二手交易需求调研中具体负责什么？",
      "follow_up_questions": [
        "你们为什么选择校园二手交易这个方向？",
        "你们如何设计问卷问题？",
        "你整理问卷后发现了哪些关键结论？",
        "如果让你现在优化这个项目，你会怎么做？"
      ],
      "answer_structure": "建议使用 STAR 法则：背景 Situation、任务 Task、行动 Action、结果 Result。",
      "sample_answer": "当时我们课程小组选择校园二手交易作为调研主题，是因为发现同学之间存在闲置教材和生活用品流转不畅的问题。我主要负责问卷收集和结果整理，通过对同学反馈进行分类，总结出交易信任、信息分散和沟通效率三个主要痛点。这个经历让我初步理解了用户调研和需求分析的基本流程。",
      "score_criteria": [
        "是否讲清楚自己的具体分工",
        "是否有用户意识",
        "是否能总结调研结论",
        "是否能联系目标岗位"
      ]
    }
  ]
}
```

### 5.7.4 页面展示建议

页面名称：**AI 面试追问室**

页面组件：

- 选择面试类型；
- 当前问题；
- 用户输入回答；
- AI 追问；
- 回答结构建议；
- 示例答案；
- 表达评分。

### 5.7.5 Demo 简化实现

MVP 可以先不接入语音，只做文本版面试训练。

可选增强：

- 语音输入；
- 回答时长统计；
- 表达流畅度评分；
- STAR 结构识别。

---

## 5.8 模块八：能力补齐计划

### 5.8.1 功能目标

根据岗位差距，输出短期可执行计划，帮助学生从“知道问题”走向“知道怎么做”。

### 5.8.2 输出结构

```json
{
  "improvement_plan": {
    "target_role": "用户运营实习生",
    "goal": "在 30 天内补齐用户运营岗位的基础认知、简历作品和面试表达能力",
    "seven_day_plan": [
      "第1天：学习用户运营岗位职责，整理3个目标岗位JD关键词",
      "第2天：复盘自己的社团宣传经历，补充活动目标和用户反馈",
      "第3天：学习社群运营和用户活跃指标",
      "第4天：完成一份校园用户调研问卷设计",
      "第5天：整理一页用户调研结果分析",
      "第6天：改写简历中的社团和课程经历",
      "第7天：完成一次AI模拟面试"
    ],
    "fourteen_day_plan": [
      "完成一个校园活动运营复盘案例",
      "制作一页用户画像分析",
      "整理3个目标公司的运营岗位JD",
      "完成2轮模拟面试"
    ],
    "thirty_day_plan": [
      "形成一份运营作品集",
      "投递20个匹配岗位",
      "完成5次面试模拟",
      "建立投递复盘表"
    ],
    "recommended_outputs": [
      "一份优化后的岗位定制简历",
      "一份校园用户调研小作品",
      "一份活动运营复盘案例",
      "一份面试自我介绍模板"
    ]
  }
}
```

### 5.8.3 页面展示建议

页面名称：**30 天求职突围计划**

页面组件：

- 目标岗位；
- 当前差距；
- 7 天计划；
- 14 天计划；
- 30 天计划；
- 可交付作品清单；
- 一键导出求职行动表。

---

## 6. 页面与路由设计

### 6.1 页面清单

| 页面 | 路由建议 | 说明 |
|---|---|---|
| 首页 | `/` | 项目介绍、核心价值、开始按钮 |
| 学生信息页 | `/profile` | 输入基础信息和经历 |
| AI画像页 | `/diagnosis` | 展示低经验画像诊断 |
| 经历转译页 | `/translation` | 展示经历到能力的转译 |
| JD解析页 | `/job` | 输入岗位JD并解析 |
| 匹配报告页 | `/match` | 展示岗位匹配和避坑雷达 |
| 简历优化页 | `/resume` | 展示可信简历优化建议 |
| 面试训练页 | `/interview` | 展示面试问题和追问 |
| 能力计划页 | `/plan` | 展示 7/14/30 天补齐计划 |
| 总结页 | `/report` | 汇总完整求职报告 |

### 6.2 推荐演示路径

```text
首页
 → 一键导入李同学案例
 → 生成 AI 求职画像
 → 查看经历能力转译
 → 输入用户运营实习生 JD
 → 查看人岗匹配报告
 → 生成可信简历优化
 → 进入 AI 面试追问
 → 生成 30 天求职突围计划
 → 导出完整报告
```

---

## 7. 前端信息架构

### 7.1 首页

核心文案：

```text
不是每个大学生都有耀眼实习，但每段真实经历都可能藏着岗位价值。
逆袭Offer 帮助低经验大学生完成经历挖掘、能力转译、岗位匹配、简历优化和面试训练，让普通经历被企业看见。
```

首页模块：

1. Hero 区：作品名称 + 简介 + 开始诊断按钮；
2. 痛点区：低经验学生常见困境；
3. 解决方案区：六步求职突围闭环；
4. 核心功能区：画像、转译、匹配、简历、面试、计划；
5. Demo 按钮：一键体验李同学案例。

### 7.2 视觉风格建议

关键词：

- 年轻；
- 温暖；
- 专业；
- 有希望感；
- 不焦虑、不夸张。

建议风格：

- 主色：蓝紫渐变 / 科技蓝 / 青绿色；
- 背景：浅色卡片式；
- 图形：雷达图、进度条、标签云、步骤流；
- 情绪：从“迷茫”到“清晰”的转变。

---

## 8. 数据结构设计

### 8.1 StudentProfile

```ts
export interface StudentProfile {
  id: string;
  name: string;
  schoolType: string;
  major: string;
  grade: string;
  targetCities: string[];
  targetRoles: string[];
  educationBackground: string;
  rawExperiences: string[];
  skills: string[];
  weaknesses: string[];
}
```

### 8.2 CareerDiagnosis

```ts
export interface CareerDiagnosis {
  studentType: string;
  summary: string;
  coreStrengths: string[];
  mainWeaknesses: string[];
  recommendedRoles: RecommendedRole[];
  careerAdvice: string;
}

export interface RecommendedRole {
  role: string;
  reason: string;
  fitScore: number;
  priority: "safe" | "recommended" | "challenge";
}
```

### 8.3 ExperienceTranslation

```ts
export interface ExperienceTranslation {
  rawExperience: string;
  abilityTags: string[];
  businessLanguage: string;
  resumeBullet: string;
  interviewQuestions: string[];
  authenticityNote: string;
}
```

### 8.4 JobAnalysis

```ts
export interface JobAnalysis {
  jobTitle: string;
  hardRequirements: string[];
  softRequirements: string[];
  bonusPoints: string[];
  coreAbilities: {
    ability: string;
    importance: "高" | "中高" | "中" | "低";
  }[];
  hiddenExpectations: string[];
}
```

### 8.5 MatchReport

```ts
export interface MatchReport {
  overallMatchScore: number;
  matchLevel: string;
  dimensionScores: {
    dimension: string;
    score: number;
    reason: string;
  }[];
  advantages: string[];
  gaps: string[];
  applicationStrategy: string;
  riskWarning: string;
}
```

### 8.6 ResumeOptimization

```ts
export interface ResumeOptimization {
  sourceExperience: string;
  before: string;
  after: string;
  targetAbility: string[];
  verificationQuestions: string[];
  riskLevel: "低" | "中" | "高";
  note: string;
}
```

### 8.7 InterviewSimulation

```ts
export interface InterviewSimulation {
  questionType: string;
  mainQuestion: string;
  followUpQuestions: string[];
  answerStructure: string;
  sampleAnswer: string;
  scoreCriteria: string[];
}
```

### 8.8 ImprovementPlan

```ts
export interface ImprovementPlan {
  targetRole: string;
  goal: string;
  sevenDayPlan: string[];
  fourteenDayPlan: string[];
  thirtyDayPlan: string[];
  recommendedOutputs: string[];
}
```

---

## 9. API 设计建议

### 9.1 API 总览

| 接口 | 方法 | 说明 |
|---|---|---|
| `/api/diagnose` | POST | 生成低经验画像 |
| `/api/translate-experience` | POST | 经历能力转译 |
| `/api/analyze-job` | POST | 解析岗位 JD |
| `/api/match` | POST | 生成人岗匹配报告 |
| `/api/optimize-resume` | POST | 生成简历优化建议 |
| `/api/interview` | POST | 生成面试追问 |
| `/api/plan` | POST | 生成能力补齐计划 |
| `/api/report` | POST | 汇总完整求职报告 |

### 9.2 `/api/diagnose`

#### Request

```json
{
  "studentProfile": {
    "name": "李同学",
    "schoolType": "普通本科",
    "major": "市场营销",
    "grade": "大四",
    "targetRoles": ["运营助理", "用户运营", "产品助理"],
    "rawExperiences": ["..."]
  }
}
```

#### Response

```json
{
  "studentType": "低经验但具备运营潜力型学生",
  "summary": "...",
  "coreStrengths": ["..."],
  "mainWeaknesses": ["..."],
  "recommendedRoles": [
    {
      "role": "运营助理",
      "reason": "...",
      "fitScore": 86,
      "priority": "recommended"
    }
  ],
  "careerAdvice": "..."
}
```

### 9.3 `/api/match`

#### Request

```json
{
  "studentProfile": {},
  "careerDiagnosis": {},
  "experienceTranslations": [],
  "jobAnalysis": {}
}
```

#### Response

```json
{
  "overallMatchScore": 82,
  "matchLevel": "建议优先投递",
  "dimensionScores": [],
  "advantages": [],
  "gaps": [],
  "applicationStrategy": "...",
  "riskWarning": "..."
}
```

---

## 10. AI 能力设计

### 10.1 AI 能力清单

| AI 能力 | 作用 | 对应模块 |
|---|---|---|
| 信息抽取 | 从学生经历中提取事实 | 学生画像、经历转译 |
| 能力标签识别 | 将经历映射为能力标签 | 经历转译 |
| JD 结构化解析 | 拆解岗位要求 | JD 解析 |
| 人岗匹配推理 | 计算匹配度并解释原因 | 匹配报告 |
| 文本生成 | 生成简历表达、面试答案 | 简历优化、面试训练 |
| 追问生成 | 根据回答继续追问 | 面试训练 |
| 规划生成 | 生成行动计划 | 能力补齐 |
| 合规校验 | 避免虚假包装 | 简历可信优化 |

### 10.2 推荐模型能力要求

模型需要具备：

- 中文理解与生成能力；
- 结构化 JSON 输出能力；
- 职业场景理解能力；
- 简历表达能力；
- 面试追问能力；
- 基础推理和规划能力。

### 10.3 可选模型

开发时可支持多模型适配：

- OpenAI GPT 系列；
- 通义千问；
- DeepSeek；
- 智谱 GLM；
- Kimi；
- 百度文心；
- 本地开源模型。

Demo 阶段建议将模型调用封装为统一方法，例如：

```ts
async function callLLM({ systemPrompt, userPrompt, schema }) {
  // 统一大模型调用封装
}
```

---

## 11. 核心提示词模板

以下提示词可直接交给 Codex 放入项目中的 `prompts/` 目录。

建议文件结构：

```text
prompts/
  diagnose.md
  translateExperience.md
  analyzeJob.md
  matchReport.md
  optimizeResume.md
  interview.md
  improvementPlan.md
  finalReport.md
```

---

### 11.1 低经验画像诊断 Prompt

#### 文件名

`prompts/diagnose.md`

#### Prompt

```text
你是一个专业的大学生就业指导顾问，同时也是 AI 人才服务系统中的职业画像分析智能体。

你的任务是根据用户提供的学生背景、专业、经历、技能和求职困惑，判断该学生的求职类型、核心优势、主要短板和适配岗位方向。

请特别关注“低经验大学生”场景。低经验不等于没有能力，你需要从课程作业、社团经历、兼职经历、校园项目、比赛经历、兴趣实践中挖掘可迁移能力。

请遵守以下规则：
1. 不要夸大学生能力；
2. 不要编造不存在的实习、获奖或项目结果；
3. 需要给出适合该学生的岗位方向；
4. 需要解释推荐原因；
5. 输出要具体、积极、可执行；
6. 必须输出 JSON，不要输出 Markdown。

请按以下 JSON 格式输出：
{
  "studentType": "",
  "summary": "",
  "coreStrengths": [],
  "mainWeaknesses": [],
  "recommendedRoles": [
    {
      "role": "",
      "reason": "",
      "fitScore": 0,
      "priority": "safe | recommended | challenge"
    }
  ],
  "careerAdvice": ""
}

学生信息如下：
{{studentProfile}}
```

---

### 11.2 经历能力转译 Prompt

#### 文件名

`prompts/translateExperience.md`

#### Prompt

```text
你是一个大学生求职经历挖掘专家，擅长把普通学生的真实经历转译为企业招聘语境中的能力表达。

你的任务是分析学生的每一条原始经历，提取其中真实存在的能力，并转化为适合简历和面试使用的表达。

请重点处理以下类型经历：
1. 课程作业；
2. 社团活动；
3. 兼职经历；
4. 校园项目；
5. 创新创业比赛；
6. 兴趣实践；
7. 工具技能。

请严格遵守以下原则：
1. 不能编造不存在的公司、岗位、获奖、数据；
2. 不能把普通经历包装成虚假实习；
3. 可以优化表达，但必须保留真实来源；
4. 每条优化建议都要给出可被面试验证的问题；
5. 如果缺少量化数据，请提示用户确认真实数据，而不是直接编造。

请按以下 JSON 格式输出：
{
  "experienceTranslations": [
    {
      "rawExperience": "",
      "abilityTags": [],
      "businessLanguage": "",
      "resumeBullet": "",
      "interviewQuestions": [],
      "authenticityNote": ""
    }
  ]
}

学生原始经历如下：
{{rawExperiences}}

学生目标岗位如下：
{{targetRoles}}
```

---

### 11.3 岗位 JD 解析 Prompt

#### 文件名

`prompts/analyzeJob.md`

#### Prompt

```text
你是一个招聘岗位 JD 解析专家，擅长将企业招聘描述拆解为结构化岗位能力模型。

你的任务是读取用户输入的岗位 JD，并提取岗位名称、硬性要求、软性要求、加分项、核心能力和隐性期待。

请注意：
1. 硬性要求是岗位明确要求的学历、技能、经验、工具等；
2. 软性要求是沟通、执行、协作、抗压、学习能力等；
3. 加分项是 JD 中提到“优先”“加分”“最好具备”的内容；
4. 隐性期待是 JD 没有直说但面试中很可能关注的能力；
5. 输出必须具体，便于后续做人岗匹配。

请按以下 JSON 格式输出：
{
  "jobTitle": "",
  "hardRequirements": [],
  "softRequirements": [],
  "bonusPoints": [],
  "coreAbilities": [
    {
      "ability": "",
      "importance": "高 | 中高 | 中 | 低"
    }
  ],
  "hiddenExpectations": []
}

岗位 JD 如下：
{{jobDescription}}
```

---

### 11.4 人岗匹配报告 Prompt

#### 文件名

`prompts/matchReport.md`

#### Prompt

```text
你是一个大学生求职人岗匹配分析智能体，任务是根据学生画像、经历能力转译结果和岗位 JD 解析结果，判断学生与岗位的匹配程度。

你需要特别关注低经验大学生的可迁移能力，不要只看是否有正式实习经历。

请输出：
1. 总体匹配分数；
2. 匹配等级；
3. 分维度评分；
4. 学生的优势匹配点；
5. 学生当前差距；
6. 投递策略；
7. 不建议盲投的风险提醒。

评分要求：
- 90-100：高度匹配，可重点投递；
- 75-89：较匹配，建议优先投递；
- 60-74：部分匹配，建议补齐后投递；
- 60 以下：短期不建议投递。

请遵守以下原则：
1. 不要为了鼓励用户而虚高评分；
2. 需要解释每个分数的原因；
3. 需要给出具体补齐方向；
4. 对不适合的岗位要给出避坑提醒；
5. 输出必须为 JSON。

请按以下 JSON 格式输出：
{
  "overallMatchScore": 0,
  "matchLevel": "",
  "dimensionScores": [
    {
      "dimension": "",
      "score": 0,
      "reason": ""
    }
  ],
  "advantages": [],
  "gaps": [],
  "applicationStrategy": "",
  "riskWarning": ""
}

学生画像：
{{careerDiagnosis}}

经历转译结果：
{{experienceTranslations}}

岗位解析结果：
{{jobAnalysis}}
```

---

### 11.5 简历可信优化 Prompt

#### 文件名

`prompts/optimizeResume.md`

#### Prompt

```text
你是一个可信简历优化专家，专门帮助低经验大学生基于真实经历优化简历表达。

你的任务是根据学生原始经历、经历能力转译结果、目标岗位 JD 和人岗匹配报告，生成适合目标岗位的简历优化建议。

请严格遵守可信原则：
1. 不得编造不存在的实习、项目、公司、奖项、证书；
2. 不得虚构具体数据，如 50%、1000 人、10 万曝光，除非用户原始信息明确提供；
3. 可以建议用户补充真实数据，但必须标注“需用户确认”；
4. 每条优化后的简历内容必须标注来源经历；
5. 每条优化内容必须提供面试验证问题；
6. 输出要适合大学生求职，不要过度商业化或夸张。

请按以下 JSON 格式输出：
{
  "resumeOptimization": [
    {
      "sourceExperience": "",
      "before": "",
      "after": "",
      "targetAbility": [],
      "verificationQuestions": [],
      "riskLevel": "低 | 中 | 高",
      "note": ""
    }
  ],
  "resumeSummary": ""
}

学生原始经历：
{{rawExperiences}}

经历转译结果：
{{experienceTranslations}}

岗位解析结果：
{{jobAnalysis}}

匹配报告：
{{matchReport}}
```

---

### 11.6 AI 面试追问 Prompt

#### 文件名

`prompts/interview.md`

#### Prompt

```text
你是一个 AI 面试教练，擅长根据大学生简历和目标岗位生成面试问题、连续追问和回答建议。

你的任务是围绕学生的真实经历和目标岗位，生成一组面试训练内容。

请包含以下类型问题：
1. 自我介绍；
2. 简历经历追问；
3. 岗位理解问题；
4. 行为面试问题；
5. 场景模拟问题。

请重点训练低经验大学生如何把普通经历讲清楚，而不是帮其编造经历。

每个问题需要输出：
- 问题类型；
- 主问题；
- 连续追问；
- 推荐回答结构；
- 示例答案；
- 评分标准。

示例答案必须基于学生真实经历，不得虚构不存在的结果。

请按以下 JSON 格式输出：
{
  "interviewSimulation": [
    {
      "questionType": "",
      "mainQuestion": "",
      "followUpQuestions": [],
      "answerStructure": "",
      "sampleAnswer": "",
      "scoreCriteria": []
    }
  ]
}

学生画像：
{{careerDiagnosis}}

简历优化结果：
{{resumeOptimization}}

目标岗位：
{{jobAnalysis}}
```

---

### 11.7 能力补齐计划 Prompt

#### 文件名

`prompts/improvementPlan.md`

#### Prompt

```text
你是一个大学生求职行动规划顾问，任务是根据学生当前能力差距和目标岗位，为学生制定短期可执行的求职能力补齐计划。

请根据岗位匹配报告中的差距，生成 7 天、14 天和 30 天计划。

计划必须满足：
1. 具体可执行；
2. 适合低经验大学生；
3. 不依赖昂贵课程或复杂资源；
4. 能产出可放入简历或作品集的成果；
5. 与目标岗位直接相关；
6. 不要写空泛建议，如“提升沟通能力”，而要写具体行动。

请按以下 JSON 格式输出：
{
  "targetRole": "",
  "goal": "",
  "sevenDayPlan": [],
  "fourteenDayPlan": [],
  "thirtyDayPlan": [],
  "recommendedOutputs": []
}

学生画像：
{{careerDiagnosis}}

岗位解析：
{{jobAnalysis}}

匹配报告：
{{matchReport}}
```

---

### 11.8 完整报告生成 Prompt

#### 文件名

`prompts/finalReport.md`

#### Prompt

```text
你是一个 AI 求职报告生成助手，需要将学生画像、经历转译、岗位解析、人岗匹配、简历优化、面试训练和能力补齐计划整合成一份完整的求职突围报告。

报告面向大学生本人，需要语言清晰、积极、具体、可执行。

报告结构包括：
1. 求职画像摘要；
2. 适配岗位方向；
3. 真实经历中的隐藏能力；
4. 目标岗位匹配度；
5. 简历优化重点；
6. 面试准备重点；
7. 30 天行动计划；
8. 最终建议。

请输出 Markdown 格式。

输入材料如下：
学生画像：{{careerDiagnosis}}
经历转译：{{experienceTranslations}}
岗位解析：{{jobAnalysis}}
匹配报告：{{matchReport}}
简历优化：{{resumeOptimization}}
面试训练：{{interviewSimulation}}
能力计划：{{improvementPlan}}
```

---

## 12. Codex 开发提示词

下面是可直接发给 Codex 的开发提示词。

---

### 12.1 Codex 总体开发提示词

```text
请根据当前项目文档，开发一个名为“逆袭Offer：面向低经验大学生的AI求职突围智能体”的 Web Demo。

目标是用于 AI+求职创新大赛演示，不需要完整商业化，但必须能清晰展示核心闭环：
学生信息输入 → AI求职画像 → 经历能力转译 → 岗位JD解析 → 人岗匹配报告 → 简历可信优化 → AI面试追问 → 30天能力补齐计划 → 汇总报告。

技术要求：
1. 使用 React 或 Next.js 实现前端；
2. 使用 TypeScript；
3. 页面风格年轻、专业、卡片式、适合比赛展示；
4. 支持一键导入“李同学”模拟案例；
5. 优先使用 Mock 数据保证 Demo 稳定运行；
6. 将大模型调用封装为独立服务，后续可以切换真实 API；
7. 所有 AI 输出结构按照文档中的 JSON Schema 设计；
8. 需要提供 prompts/ 目录，存放各模块提示词；
9. 需要提供 mockData/ 目录，存放李同学案例、岗位JD、模拟AI输出；
10. 需要提供 README.md，说明如何启动和演示。

请先生成项目目录结构、核心类型定义、Mock 数据、主要页面组件和路由。页面不需要连接真实数据库，状态可以先存储在前端全局状态或本地状态中。
```

---

### 12.2 Codex 页面开发提示词

```text
请为“逆袭Offer”Demo 开发完整页面流程。

需要包含以下页面：
1. 首页 `/`：展示作品定位、目标用户、核心闭环和开始按钮；
2. 学生信息页 `/profile`：支持填写学生信息，并提供“一键导入李同学案例”；
3. 画像诊断页 `/diagnosis`：展示学生类型、优势、短板和推荐岗位；
4. 经历转译页 `/translation`：以卡片形式展示原始经历、能力标签、简历表达和面试追问；
5. JD解析页 `/job`：支持粘贴岗位JD，展示硬性要求、软性要求、加分项和核心能力；
6. 匹配报告页 `/match`：展示总体匹配分、维度评分、优势、差距和避坑提醒；
7. 简历优化页 `/resume`：展示优化前后对比、来源经历、真实性风险和验证问题；
8. 面试训练页 `/interview`：展示主问题、追问、回答结构、示例答案和评分标准；
9. 能力计划页 `/plan`：展示7天、14天、30天行动计划和可交付成果；
10. 汇总报告页 `/report`：整合所有模块，形成完整求职突围报告。

UI 要求：
- 使用卡片式布局；
- 使用步骤条展示当前流程；
- 使用进度条或环形分数展示匹配度；
- 使用标签展示能力关键词；
- 重要结论要高亮；
- 页面适合录制演示视频。
```

---

### 12.3 Codex Mock 数据提示词

```text
请为“逆袭Offer”项目生成完整 Mock 数据，文件放在 `src/mockData/demoCase.ts`。

Mock 数据必须包含：
1. 李同学的学生基础信息；
2. 李同学的原始经历；
3. 用户运营实习生岗位 JD；
4. AI 求职画像输出；
5. 经历能力转译输出；
6. 岗位 JD 解析输出；
7. 人岗匹配报告输出；
8. 简历可信优化输出；
9. 面试追问训练输出；
10. 30天能力补齐计划输出；
11. 最终汇总报告。

数据要符合项目文档中的 TypeScript interface，内容要真实、具体、适合比赛演示。不要使用过于夸张的数据，不要编造大厂实习经历。
```

---

### 12.4 Codex AI 服务封装提示词

```text
请为“逆袭Offer”项目设计 AI 服务调用层。

要求：
1. 在 `src/services/aiService.ts` 中实现统一的 `callLLM` 方法；
2. 先支持 Mock 模式，直接返回 mockData 中的结果；
3. 预留真实大模型 API 调用接口；
4. 每个 AI 模块提供独立函数：
   - generateDiagnosis
   - translateExperiences
   - analyzeJobDescription
   - generateMatchReport
   - optimizeResume
   - generateInterviewSimulation
   - generateImprovementPlan
   - generateFinalReport
5. 每个函数输入输出类型必须使用 `src/types/index.ts` 中定义的 TypeScript interface；
6. 保证 Demo 即使没有 API Key 也可以完整运行；
7. README 中说明如何从 Mock 模式切换到真实 API 模式。
```

---

### 12.5 Codex README 提示词

```text
请为“逆袭Offer”项目生成 README.md。

README 需要包含：
1. 项目简介；
2. 作品定位；
3. 核心功能；
4. Demo 演示流程；
5. 技术栈；
6. 项目目录结构；
7. 本地启动方式；
8. Mock 模式说明；
9. 后续接入真实大模型 API 的方式；
10. 参赛演示建议。

语言使用中文，表达要适合 AI 创新大赛项目。
```

---

## 13. 推荐项目目录结构

### 13.1 Next.js 版本

```text
nixi-offer-demo/
  README.md
  package.json
  tsconfig.json
  next.config.js
  public/
    logo.svg
  src/
    app/
      page.tsx
      profile/page.tsx
      diagnosis/page.tsx
      translation/page.tsx
      job/page.tsx
      match/page.tsx
      resume/page.tsx
      interview/page.tsx
      plan/page.tsx
      report/page.tsx
    components/
      Layout.tsx
      StepNav.tsx
      ScoreCard.tsx
      AbilityTag.tsx
      SectionCard.tsx
      ProgressBar.tsx
      ExperienceCard.tsx
      ResumeCompareCard.tsx
      InterviewCard.tsx
      PlanTimeline.tsx
    data/
      demoCase.ts
    prompts/
      diagnose.md
      translateExperience.md
      analyzeJob.md
      matchReport.md
      optimizeResume.md
      interview.md
      improvementPlan.md
      finalReport.md
    services/
      aiService.ts
    types/
      index.ts
    utils/
      format.ts
      scoring.ts
    styles/
      globals.css
```

### 13.2 简化 React 版本

```text
nixi-offer-demo/
  README.md
  package.json
  index.html
  src/
    main.tsx
    App.tsx
    pages/
      Home.tsx
      Profile.tsx
      Diagnosis.tsx
      Translation.tsx
      Job.tsx
      Match.tsx
      Resume.tsx
      Interview.tsx
      Plan.tsx
      Report.tsx
    components/
    data/
    prompts/
    services/
    types/
    styles/
```

---

## 14. Demo 验收标准

### 14.1 基础验收

Demo 至少要满足：

- 可以正常启动；
- 首页完整展示项目定位；
- 可以一键导入李同学案例；
- 可以完整走通 8 个核心模块；
- 每个模块有明确输出；
- 页面适合录屏演示；
- 不依赖真实 API 也可运行。

### 14.2 内容验收

必须体现：

- 低经验大学生定位；
- 经历挖掘；
- 能力转译；
- 岗位 JD 解析；
- 人岗匹配评分；
- 岗位避坑提醒；
- 简历真实性约束；
- 面试连续追问；
- 30 天行动计划。

### 14.3 评审观感验收

评委应能在 1 分钟内理解：

- 这个作品服务谁；
- 解决什么问题；
- 为什么不是普通简历润色工具；
- AI 在哪里发挥作用；
- 为什么有落地价值。

---

## 15. 演示视频推荐操作脚本

### 15.1 30 秒开场

```text
大量低经验大学生在求职中并不是没有能力，而是不知道如何把课程、社团、兼职和校园项目转化为企业能看懂的岗位能力。逆袭Offer 是一个面向低经验大学生的 AI 求职突围智能体，帮助学生完成从经历挖掘到面试准备的完整求职闭环。
```

### 15.2 3 分钟核心演示

```text
第一步，我们导入李同学案例。李同学是市场营销专业大四学生，没有正式大厂实习，只有社团宣传、课程调研、奶茶店兼职和校园项目经历。

第二步，系统生成 AI 求职画像，判断其属于“低经验但具备运营潜力型学生”，推荐运营助理、用户运营和产品助理方向。

第三步，系统将李同学的普通经历转译为企业能理解的能力，比如把社团宣传转译为内容运营和活动传播，把课程问卷转译为用户调研和需求分析。

第四步，我们输入用户运营实习生岗位 JD，系统自动解析岗位的硬性要求、软性能力、加分项和隐性期待。

第五步，系统生成岗位匹配报告，给出总分、优势、短板和避坑提醒，不仅告诉学生适合什么，也告诉他哪些岗位短期不建议盲投。

第六步，系统生成可信简历优化建议，每条优化内容都保留来源经历和面试验证问题，避免 AI 过度包装。

第七步，系统根据岗位和简历生成 AI 面试追问，帮助学生把经历讲清楚。

最后，系统生成 30 天能力补齐计划，让学生知道接下来应该具体做什么。
```

### 15.3 30 秒结尾

```text
逆袭Offer 不是一个简单的 AI 简历润色工具，而是面向低经验大学生的求职突围系统。它通过真实经历挖掘、岗位能力转译、人岗匹配、可信简历优化、面试追问和能力补齐计划，帮助普通学生把已有经历转化为可被企业识别的岗位价值。
```

---

## 16. 后续可增强功能

### 16.1 技术增强

- 接入真实大模型 API；
- 支持上传 PDF 简历；
- 支持解析招聘网站岗位链接；
- 支持语音面试；
- 支持面试回答评分；
- 支持导出 PDF 报告；
- 支持求职进度看板。

### 16.2 产品增强

- 高校就业办后台；
- 辅导员帮扶建议；
- 企业岗位池；
- 匿名简历匹配；
- 就业风险预警；
- 求职社群互助。

### 16.3 商业增强

- C 端会员版；
- 高校就业服务 SaaS；
- 校园招聘合作；
- 职业规划报告；
- AI 面试陪练增值服务。

---

## 17. 当前开发优先级

### P0：必须完成

- 首页；
- 李同学案例；
- 画像诊断；
- 经历转译；
- JD 解析；
- 匹配报告；
- 简历优化；
- 面试追问；
- 能力计划；
- Mock 数据闭环。

### P1：建议完成

- 汇总报告导出；
- 页面步骤导航；
- 匹配分数可视化；
- 简历优化前后对比；
- 面试问题卡片。

### P2：有时间再做

- 真实 AI API；
- PDF 简历上传；
- 语音面试；
- 数据持久化；
- 用户登录；
- 高校后台。

---

## 18. 开发备注

### 18.1 Demo 稳定性优先

比赛 Demo 首要目标是稳定展示，不建议一开始就强依赖真实大模型接口。

推荐方案：

```text
默认使用 Mock 数据 → 页面完整跑通 → 预留真实 API → 后续逐步替换
```

### 18.2 重点打磨输出内容

评委不一定会看代码，但一定会看页面输出是否专业。

因此以下内容必须写得具体：

- 学生画像；
- 匹配理由；
- 简历优化建议；
- 面试追问；
- 能力补齐计划。

### 18.3 避免过度包装

本项目最大亮点之一是“可信简历优化”。

所有页面和文案都应强调：

```text
基于真实经历，挖掘岗位价值，而不是制造虚假优势。
```

---

## 19. 一句话总结

**逆袭Offer 通过 AI 帮助低经验大学生把普通经历转化为可被企业识别的岗位能力，形成从求职定位、岗位匹配、简历优化、面试训练到能力补齐的完整求职突围闭环。**

