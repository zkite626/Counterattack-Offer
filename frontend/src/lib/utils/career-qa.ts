import type { JobFlowState } from "@/types";

export interface CareerQaContextBlock {
  label: string;
  value: string;
}

function joinList(items: string[], limit = items.length): string {
  return items
    .slice(0, limit)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .join("、");
}

function formatProfile(state: JobFlowState["studentProfile"]): string {
  if (!state) return "";

  const lines = [
    state.name ? `姓名：${state.name}` : null,
    `学校类型：${state.schoolType}`,
    `专业：${state.major}`,
    `年级：${state.grade}`,
    state.targetCities.length > 0 ? `目标城市：${joinList(state.targetCities, 4)}` : null,
    state.targetRoles.length > 0 ? `目标岗位：${joinList(state.targetRoles, 4)}` : null,
    state.skills.length > 0 ? `技能：${joinList(state.skills, 5)}` : null,
    state.weaknesses.length > 0 ? `短板：${joinList(state.weaknesses, 3)}` : null,
  ].filter((line): line is string => Boolean(line));

  return lines.join("；");
}

function formatDiagnosis(state: JobFlowState["careerDiagnosis"]): string {
  if (!state) return "";

  const lines = [
    state.studentType ? `学生类型：${state.studentType}` : null,
    state.summary ? `整体判断：${state.summary}` : null,
    state.coreStrengths.length > 0 ? `核心优势：${joinList(state.coreStrengths, 3)}` : null,
    state.mainWeaknesses.length > 0 ? `主要短板：${joinList(state.mainWeaknesses, 3)}` : null,
    state.recommendedRoles.length > 0
      ? `推荐方向：${state.recommendedRoles.slice(0, 3).map((item) => item.role).join("、")}`
      : null,
  ].filter((line): line is string => Boolean(line));

  return lines.join("；");
}

function formatTranslations(state: JobFlowState["experienceTranslations"]): string {
  if (!state || state.length === 0) return "";

  return state
    .slice(0, 3)
    .map((item, index) => {
      const tags = item.abilityTags.length > 0 ? `（${joinList(item.abilityTags, 4)}）` : "";
      return `${index + 1}. ${item.businessLanguage}${tags}`;
    })
    .join("；");
}

function formatJobAnalysis(state: JobFlowState["jobAnalysis"]): string {
  if (!state) return "";

  const lines = [
    state.jobTitle ? `岗位：${state.jobTitle}` : null,
    state.hardRequirements.length > 0 ? `硬性要求：${joinList(state.hardRequirements, 4)}` : null,
    state.coreAbilities.length > 0
      ? `核心能力：${state.coreAbilities.slice(0, 4).map((item) => item.ability).join("、")}`
      : null,
    state.hiddenExpectations.length > 0
      ? `隐性期待：${joinList(state.hiddenExpectations, 3)}`
      : null,
  ].filter((line): line is string => Boolean(line));

  return lines.join("；");
}

function formatMatchReport(state: JobFlowState["matchReport"]): string {
  if (!state) return "";

  const lines = [
    `匹配分数：${state.overallMatchScore}，等级：${state.matchLevel}`,
    state.advantages.length > 0 ? `优势：${joinList(state.advantages, 3)}` : null,
    state.gaps.length > 0 ? `差距：${joinList(state.gaps, 3)}` : null,
    state.applicationStrategy ? `投递建议：${state.applicationStrategy}` : null,
  ].filter((line): line is string => Boolean(line));

  return lines.join("；");
}

function formatResumeOptimization(state: JobFlowState["resumeOptimization"]): string {
  if (!state) return "";

  const lines = [
    state.resumeSummary ? `整体摘要：${state.resumeSummary}` : null,
    state.resumeOptimization.length > 0
      ? `优化重点：${state.resumeOptimization.slice(0, 3).map((item) => item.after).join("；")}`
      : null,
  ].filter((line): line is string => Boolean(line));

  return lines.join("；");
}

export function buildCareerQaContextBlocks(state: JobFlowState): CareerQaContextBlock[] {
  const blocks: CareerQaContextBlock[] = [];

  const profile = formatProfile(state.studentProfile);
  if (profile) blocks.push({ label: "学生资料", value: profile });

  const diagnosis = formatDiagnosis(state.careerDiagnosis);
  if (diagnosis) blocks.push({ label: "求职画像", value: diagnosis });

  const translations = formatTranslations(state.experienceTranslations);
  if (translations) blocks.push({ label: "经历转译", value: translations });

  const jobAnalysis = formatJobAnalysis(state.jobAnalysis);
  if (jobAnalysis) blocks.push({ label: "岗位解析", value: jobAnalysis });

  const matchReport = formatMatchReport(state.matchReport);
  if (matchReport) blocks.push({ label: "匹配报告", value: matchReport });

  const resumeOptimization = formatResumeOptimization(state.resumeOptimization);
  if (resumeOptimization) blocks.push({ label: "简历优化", value: resumeOptimization });

  return blocks;
}

export function buildCareerQaContextSummary(state: JobFlowState): string {
  return buildCareerQaContextBlocks(state)
    .map((block) => `${block.label}：${block.value}`)
    .join("\n\n");
}
