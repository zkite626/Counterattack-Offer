import type {
  CareerDiagnosis,
  CoreAbility,
  ImprovementPlan,
  InterviewSimulation,
  JobAnalysis,
  MatchReport,
  ResumeOptimization,
  ResumeOptimizationResult,
} from "@/types";
import type { RecommendedRole } from "@/types/student";

type JsonRecord = Record<string, unknown>;

const DEFAULT_SCORE_CRITERIA = [
  "回答内容与岗位要求的相关性",
  "表达的逻辑性和条理性",
  "具体事例和细节的充分程度",
  "自我认知和反思能力",
];

const MATCH_DIMENSIONS = [
  {
    dimension: "岗位能力",
    aliases: ["岗位能力", "能力匹配", "核心能力", "岗位能力匹配"],
    fallbackDelta: 0,
    reason: "根据岗位核心能力要求与当前画像综合评估。",
  },
  {
    dimension: "经历相关",
    aliases: ["经历相关", "经历相关性", "经验匹配", "实践经历", "运营经验"],
    fallbackDelta: -5,
    reason: "评估校园经历、项目经历与目标岗位任务的迁移程度。",
  },
  {
    dimension: "技能工具",
    aliases: ["技能工具", "工具技能", "数据能力", "专业技能", "硬技能"],
    fallbackDelta: -8,
    reason: "评估办公工具、数据处理和岗位基础技能储备。",
  },
  {
    dimension: "沟通协作",
    aliases: ["沟通协作", "沟通表达", "协作能力", "软性能力"],
    fallbackDelta: 3,
    reason: "评估表达、协作、反馈和跨角色沟通能力。",
  },
  {
    dimension: "学习潜力",
    aliases: ["学习潜力", "学习能力", "成长潜力", "可培养性"],
    fallbackDelta: 8,
    reason: "评估短期补齐能力、主动学习和适应新任务的空间。",
  },
  {
    dimension: "投递风险",
    aliases: ["投递风险", "风险可控", "风险控制", "短板风险", "稳定性"],
    fallbackDelta: -10,
    reason: "评估短板暴露、竞争强度和面试可解释风险。",
  },
] as const;

function isRecord(value: unknown): value is JsonRecord {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function unwrapRecord(raw: unknown, keys: string[]): JsonRecord | null {
  if (!isRecord(raw)) return null;
  for (const key of keys) {
    const nested = raw[key];
    if (isRecord(nested)) return nested;
  }
  return raw;
}

function pick(record: JsonRecord, keys: string[]): unknown {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null) return record[key];
  }
  return undefined;
}

function toText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.min(100, Math.round(value)));
  }
  if (typeof value === "string") {
    const match = value.match(/\d+(?:\.\d+)?/);
    if (match) return Math.max(0, Math.min(100, Math.round(Number(match[0]))));
  }
  return fallback;
}

function normalizeTextArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => {
        if (isRecord(item)) {
          const day = toText(pick(item, ["day", "date", "天", "日期"]));
          const task = toText(pick(item, ["task", "action", "todo", "content", "description", "任务", "行动"]));
          if (day && task) return `第${day.replace(/^第|天$/g, "")}天：${task}`;
          return toText(
            pick(item, [
              "text",
              "content",
              "name",
              "title",
              "requirement",
              "description",
              "ability",
              "task",
              "criteria",
              "criterion",
              "point",
              "item",
              "标准",
              "要点",
              "能力",
              "任务",
              "内容",
            ])
          );
        }
        return toText(item);
      })
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\n|；|;/)
      .map((item) => item.replace(/^\s*[-*、\d.）)]+\s*/, "").trim())
      .filter(Boolean);
  }

  if (isRecord(value)) {
    return Object.values(value).flatMap(normalizeTextArray).filter(Boolean);
  }

  return [];
}

function normalizeRiskLevel(value: unknown): ResumeOptimization["riskLevel"] {
  const text = toText(value);

  if (text.includes("高")) return "高";
  if (text.includes("中")) return "中";

  return "低";
}

function normalizeImportance(value: unknown): CoreAbility["importance"] {
  const text = toText(value);
  if (text.includes("高") && text.includes("中")) return "中高";
  if (text === "高" || text.includes("非常高") || text.includes("重要")) return "高";
  if (text === "低" || text.includes("较低")) return "低";
  return "中";
}

function normalizeAbility(value: unknown): CoreAbility | null {
  if (typeof value === "string") {
    const ability = value.trim();
    return ability ? { ability, importance: "中" } : null;
  }

  if (!isRecord(value)) return null;

  const ability = toText(
    pick(value, ["ability", "name", "title", "requirement", "能力", "核心能力", "能力项"])
  );
  if (!ability) return null;

  return {
    ability,
    importance: normalizeImportance(pick(value, ["importance", "level", "score", "重要性", "等级"])),
  };
}

function normalizeCoreAbilities(value: unknown): CoreAbility[] {
  if (Array.isArray(value)) {
    return value.map(normalizeAbility).filter((item): item is CoreAbility => !!item);
  }

  if (isRecord(value)) {
    return Object.entries(value)
      .map(([ability, importance]) => ({ ability, importance: normalizeImportance(importance) }))
      .filter((item) => item.ability.trim());
  }

  return normalizeTextArray(value).map((ability) => ({ ability, importance: "中" }));
}

export function normalizeJobAnalysis(raw: unknown): JobAnalysis | null {
  const record = unwrapRecord(raw, ["jobAnalysis", "analysis", "result", "data", "岗位解析"]);
  if (!record) return null;

  const jobTitle = toText(pick(record, ["jobTitle", "title", "position", "jobName", "岗位名称", "岗位", "职位"]));
  if (!jobTitle) return null;

  const coreAbilities = normalizeCoreAbilities(
    pick(record, ["coreAbilities", "abilityModel", "abilities", "核心能力", "核心能力要求", "能力模型"])
  );
  const hardRequirements = normalizeTextArray(
    pick(record, [
      "hardRequirements",
      "mustHave",
      "requiredSkills",
      "qualifications",
      "requirements",
      "硬性要求",
      "任职要求",
      "岗位要求",
      "必要条件",
    ])
  );
  const softRequirements = normalizeTextArray(
    pick(record, ["softRequirements", "softSkills", "competencies", "软性要求", "素质要求", "通用能力"])
  );
  const bonusPoints = normalizeTextArray(
    pick(record, ["bonusPoints", "niceToHave", "preferredQualifications", "加分项", "优先条件", "优先"])
  );
  const hiddenExpectations = normalizeTextArray(
    pick(record, ["hiddenExpectations", "hiddenRequirements", "implicitRequirements", "隐性期待", "隐性要求", "面试关注点"])
  );

  return {
    jobTitle,
    hardRequirements: hardRequirements.length
      ? hardRequirements
      : coreAbilities.slice(0, 3).map((item) => `具备${item.ability}相关能力`),
    softRequirements: softRequirements.length
      ? softRequirements
      : ["沟通表达清晰，能主动协作推进任务", "具备学习意愿和基础执行力"],
    bonusPoints,
    coreAbilities,
    hiddenExpectations: hiddenExpectations.length
      ? hiddenExpectations
      : [
          "面试中会关注候选人是否能用真实经历证明岗位相关能力",
          "希望候选人能快速理解任务目标并主动反馈进展",
        ],
  };
}

function normalizePriority(value: unknown, score: number): RecommendedRole["priority"] {
  const text = toText(value).toLowerCase();
  if (["safe", "稳妥", "保底", "低风险"].some((item) => text.includes(item))) return "safe";
  if (["challenge", "挑战", "冲刺", "高挑战"].some((item) => text.includes(item))) return "challenge";
  if (["recommended", "recommend", "推荐", "优先"].some((item) => text.includes(item))) return "recommended";
  if (score >= 75) return "recommended";
  if (score >= 60) return "safe";
  return "challenge";
}

function normalizeRecommendedRole(value: unknown): RecommendedRole | null {
  if (!isRecord(value)) {
    const role = toText(value);
    return role ? { role, reason: "与当前经历和求职目标有一定关联", fitScore: 60, priority: "safe" } : null;
  }

  const role = toText(pick(value, ["role", "name", "title", "jobTitle", "岗位", "岗位名", "方向"]));
  if (!role) return null;
  const fitScore = toNumber(pick(value, ["fitScore", "score", "matchScore", "匹配度", "匹配分"]), 60);

  return {
    role,
    reason: toText(pick(value, ["reason", "description", "推荐理由", "理由"])) || "与当前经历和求职目标有一定关联",
    fitScore,
    priority: normalizePriority(pick(value, ["priority", "level", "type", "标签", "优先级"]), fitScore),
  };
}

export function normalizeCareerDiagnosis(raw: unknown): CareerDiagnosis | null {
  const record = unwrapRecord(raw, ["careerDiagnosis", "diagnosis", "result", "data", "画像诊断"]);
  if (!record) return null;

  const recommendedRoles = normalizeTextArray(pick(record, ["recommendedRoles", "roles", "推荐岗位", "适配岗位"]))
    .map((role) => normalizeRecommendedRole(role))
    .filter((role): role is RecommendedRole => !!role);
  const roleRecords = pick(record, ["recommendedRoles", "roles", "推荐岗位", "适配岗位"]);
  const normalizedRoles = (Array.isArray(roleRecords)
    ? roleRecords.map(normalizeRecommendedRole)
    : recommendedRoles
  )
    .filter((role): role is RecommendedRole => !!role)
    .sort((a, b) => b.fitScore - a.fitScore);

  return {
    studentType: toText(pick(record, ["studentType", "type", "学生类型", "画像类型"])) || "低经验求职探索型学生",
    summary: toText(pick(record, ["summary", "overview", "diagnosisSummary", "整体诊断概述", "总结"])) || "",
    coreStrengths: normalizeTextArray(pick(record, ["coreStrengths", "strengths", "优势", "核心优势"])),
    mainWeaknesses: normalizeTextArray(pick(record, ["mainWeaknesses", "weaknesses", "gaps", "短板", "主要短板"])),
    recommendedRoles: normalizedRoles,
    careerAdvice: toText(pick(record, ["careerAdvice", "advice", "综合建议", "建议"])) || "",
  };
}

function normalizeDimension(value: unknown): MatchReport["dimensionScores"][number] | null {
  if (!isRecord(value)) return null;
  const dimension = toText(pick(value, ["dimension", "name", "title", "维度", "评分维度"]));
  if (!dimension) return null;
  return {
    dimension,
    score: toNumber(pick(value, ["score", "value", "匹配分", "得分"]), 60),
    reason: toText(pick(value, ["reason", "description", "原因", "理由"])) || "与学生现有经历存在一定关联",
  };
}

function completeSixDimensions(
  dimensions: MatchReport["dimensionScores"],
  overallMatchScore: number
): MatchReport["dimensionScores"] {
  return MATCH_DIMENSIONS.map((target) => {
    const matched = dimensions.find((item) =>
      target.aliases.some((alias) => item.dimension.includes(alias) || alias.includes(item.dimension))
    );
    if (matched) {
      return {
        ...matched,
        dimension: target.dimension,
        reason: matched.reason || target.reason,
      };
    }

    return {
      dimension: target.dimension,
      score: Math.max(0, Math.min(100, overallMatchScore + target.fallbackDelta)),
      reason: target.reason,
    };
  });
}

export function normalizeMatchReport(raw: unknown): MatchReport | null {
  const record = unwrapRecord(raw, ["matchReport", "report", "result", "data", "匹配报告"]);
  if (!record) return null;

  const overallMatchScore = toNumber(
    pick(record, ["overallMatchScore", "score", "matchScore", "totalScore", "整体匹配度", "总分"]),
    60
  );
  const dimensionRaw = pick(record, ["dimensionScores", "dimensions", "scores", "维度评分", "匹配维度"]);
  const dimensionScores = (Array.isArray(dimensionRaw)
    ? dimensionRaw.map(normalizeDimension)
    : isRecord(dimensionRaw)
      ? Object.entries(dimensionRaw).map(([dimension, value]) => ({
          dimension,
          score: toNumber(isRecord(value) ? pick(value, ["score", "value", "得分"]) : value, overallMatchScore),
          reason: isRecord(value) ? toText(pick(value, ["reason", "description", "原因"])) : "综合评估得分",
        }))
      : []
  ).filter((item): item is MatchReport["dimensionScores"][number] => !!item);

  const sixDimensions = completeSixDimensions(dimensionScores, overallMatchScore);
  const advantages = normalizeTextArray(pick(record, ["advantages", "strengths", "优势", "匹配优势"]));
  const gaps = normalizeTextArray(pick(record, ["gaps", "weaknesses", "risks", "差距", "短板"]));

  return {
    overallMatchScore,
    matchLevel: toText(pick(record, ["matchLevel", "level", "匹配等级", "匹配结论"])) || scoreToMatchLevel(overallMatchScore),
    dimensionScores: sixDimensions,
    advantages: advantages.length
      ? advantages
      : [
          `${sixDimensions[3].dimension}得分 ${sixDimensions[3].score}，说明沟通表达和协作基础可用于岗位切入。`,
          `${sixDimensions[4].dimension}得分 ${sixDimensions[4].score}，短期补齐岗位知识的空间较好。`,
          "已有经历可以通过 STAR 法则转译为岗位相关案例，适合低经验求职起步。",
        ],
    gaps: gaps.length
      ? gaps
      : [
          `${sixDimensions[2].dimension}仍需补强，建议补齐岗位常用工具和数据处理方法。`,
          `${sixDimensions[1].dimension}需要更多量化成果支撑，简历中应补充过程、数据和复盘。`,
          "面试中可能被追问正式实习不足，需要提前准备真实经历的解释和迁移逻辑。",
        ],
    applicationStrategy: toText(pick(record, ["applicationStrategy", "strategy", "投递策略", "求职策略"])) || "优先选择匹配度较高的岗位，并围绕真实经历准备 2-3 个结构化案例。",
    riskWarning: toText(pick(record, ["riskWarning", "warning", "risks", "风险提醒", "避坑提醒"])) || "",
  };
}

function scoreToMatchLevel(score: number): string {
  if (score >= 90) return "高度匹配";
  if (score >= 75) return "较匹配";
  if (score >= 60) return "部分匹配";
  return "暂不建议优先投递";
}

export function normalizeImprovementPlan(raw: unknown): ImprovementPlan | null {
  const record = unwrapRecord(raw, ["improvementPlan", "plan", "result", "data", "行动计划", "能力补齐计划"]);
  if (!record) return null;

  const targetRole = toText(pick(record, ["targetRole", "role", "jobTitle", "目标岗位", "岗位"])) || "目标岗位";
  const sevenDayPlan = normalizeTextArray(pick(record, ["sevenDayPlan", "firstWeek", "week1", "第1周", "7天计划", "一周计划"]));
  const fourteenDayPlan = normalizeTextArray(pick(record, ["fourteenDayPlan", "secondWeek", "week2", "第2周", "14天计划", "两周计划"]));
  const thirtyDayPlan = normalizeTextArray(pick(record, ["thirtyDayPlan", "weeks3And4", "week3", "week4", "第3周", "第4周", "30天计划", "一个月计划"]));
  const recommendedOutputs = normalizeTextArray(pick(record, ["recommendedOutputs", "outputs", "deliverables", "推荐产出", "产出清单"]));

  return {
    targetRole,
    goal: toText(pick(record, ["goal", "summary", "目标概述", "总目标"])) || `围绕${targetRole}补齐岗位认知、项目表达和面试准备。`,
    sevenDayPlan: sevenDayPlan.length
      ? sevenDayPlan
      : ["第1天：拆解目标岗位 JD，整理 5 个高频能力关键词", "第2-3天：用 STAR 法则重写 2 段最相关经历", "第4-7天：补齐岗位基础知识并输出一页学习笔记"],
    fourteenDayPlan: fourteenDayPlan.length
      ? fourteenDayPlan
      : ["第8-10天：完成一个与目标岗位相关的小项目或案例分析", "第11-12天：整理项目过程、数据和复盘结论", "第13-14天：更新简历并准备 3 个面试故事"],
    thirtyDayPlan: thirtyDayPlan.length
      ? thirtyDayPlan
      : ["第15-21天：定向投递 10-15 个匹配岗位并记录反馈", "第22-26天：根据反馈优化简历和自我介绍", "第27-30天：完成 2 次模拟面试并复盘薄弱问题"],
    recommendedOutputs: recommendedOutputs.length
      ? recommendedOutputs
      : ["岗位能力关键词清单", "STAR 经历素材库", "目标岗位小项目复盘", "一版可投递简历"],
  };
}

function normalizeResumeOptimizationItem(value: unknown): ResumeOptimization | null {
  if (!isRecord(value)) return null;

  const sourceExperience = toText(
    pick(value, [
      "sourceExperience",
      "rawExperience",
      "experience",
      "source",
      "来源经历",
      "原始经历",
    ])
  );
  const before =
    toText(pick(value, ["before", "original", "raw", "优化前", "原表达"])) ||
    sourceExperience;
  const after = toText(
    pick(value, [
      "after",
      "resumeBullet",
      "businessLanguage",
      "optimized",
      "optimizedResume",
      "rewrite",
      "优化后",
      "简历条目",
      "企业语言",
    ])
  );

  if (!before && !after) return null;

  return {
    sourceExperience: sourceExperience || before || "来源经历",
    before: before || "原始经历待补充",
    after: after || before,
    targetAbility: normalizeTextArray(
      pick(value, ["targetAbility", "abilityTags", "abilities", "skills", "能力标签", "目标能力"])
    ),
    verificationQuestions: normalizeTextArray(
      pick(value, [
        "verificationQuestions",
        "interviewQuestions",
        "questions",
        "面试验证问题",
        "验证问题",
      ])
    ),
    riskLevel: normalizeRiskLevel(pick(value, ["riskLevel", "risk", "风险等级"])),
    note: toText(
      pick(value, [
        "note",
        "authenticityNote",
        "suggestion",
        "comment",
        "说明",
        "真实性说明",
        "建议",
      ])
    ),
  };
}

export function normalizeResumeOptimization(
  raw: unknown,
): ResumeOptimizationResult | null {
  const record = unwrapRecord(raw, [
    "resumeOptimizationResult",
    "resume",
    "result",
    "data",
    "简历优化",
  ]);
  const source = Array.isArray(raw)
    ? raw
    : record
      ? pick(record, [
          "resumeOptimization",
          "optimizations",
          "items",
          "resumeItems",
          "简历优化项",
          "优化建议",
        ])
      : null;
  const items = (Array.isArray(source) ? source : [])
    .map(normalizeResumeOptimizationItem)
    .filter((item): item is ResumeOptimization => !!item);

  if (items.length === 0) return null;

  return {
    resumeOptimization: items,
    resumeSummary:
      record === null
        ? ""
        : toText(pick(record, ["resumeSummary", "summary", "overallAdvice", "简历整体摘要", "整体建议"])),
  };
}

function normalizeInterviewItem(value: unknown): InterviewSimulation | null {
  if (!isRecord(value)) return null;
  const mainQuestion = toText(pick(value, ["mainQuestion", "question", "title", "主问题", "问题"]));
  if (!mainQuestion) return null;
  return {
    questionType: toText(pick(value, ["questionType", "type", "category", "题型", "类型"])) || "综合面试",
    mainQuestion,
    followUpQuestions: normalizeTextArray(pick(value, ["followUpQuestions", "followUps", "追问", "连续追问"])),
    answerStructure: toText(pick(value, ["answerStructure", "structure", "framework", "回答结构", "推荐回答结构"])) || "建议使用 STAR 法则：情境(Situation) → 任务(Task) → 行动(Action) → 结果(Result)",
    sampleAnswer: toText(pick(value, ["sampleAnswer", "answer", "示例答案", "参考答案"])) || "请结合自己的真实经历，用具体场景和行动细节回答。",
    scoreCriteria: normalizeTextArray(pick(value, ["scoreCriteria", "scoringCriteria", "criteria", "evaluationCriteria", "评分标准", "评价标准", "评分要点"])),
  };
}

export function normalizeInterviewSimulations(raw: unknown): InterviewSimulation[] {
  const record = unwrapRecord(raw, ["interview", "result", "data", "面试训练"]);
  const source = Array.isArray(raw)
    ? raw
    : record
      ? pick(record, ["interviewSimulation", "simulations", "questions", "interviews", "面试问题"])
      : null;

  const items = (Array.isArray(source) ? source : []).map(normalizeInterviewItem).filter((item): item is InterviewSimulation => !!item);

  return items.map((item) => ({
    ...item,
    scoreCriteria: item.scoreCriteria.length ? item.scoreCriteria : DEFAULT_SCORE_CRITERIA,
  }));
}
