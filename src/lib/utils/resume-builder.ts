import type {
  ResumeBuilderData,
  ResumeEducation,
  ResumeExperience,
  ResumeProject,
} from "@/types/resume-builder";
import { DEFAULT_RESUME_SECTIONS, DEFAULT_GLOBAL_SETTINGS } from "@/types/resume-builder";
import type {
  StudentProfile,
  CareerDiagnosis,
  ExperienceTranslation,
} from "@/types/student";
import type {
  JobAnalysis,
  ResumeOptimizationResult,
} from "@/types/job";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// 从教育背景字符串提取学校名称
function extractSchool(educationBackground: string): string {
  if (!educationBackground) return "";
  // 尝试匹配常见格式："XX大学"、"XX学院"
  const match = educationBackground.match(/([一-龥]+(?:大学|学院|学校))/);
  return match ? match[1] : educationBackground.slice(0, 20);
}

// 从经历描述中提取公司/组织名称
function extractCompany(rawExperience: string): string {
  if (!rawExperience) return "";
  // 尝试匹配 "在XX公司"、"XX有限公司" 等
  const match = rawExperience.match(/(?:在|于)?([一-龥]+(?:公司|集团|科技|网络|有限|工作室))/);
  return match ? match[1] : "";
}

// 从经历描述中提取项目名称
function extractProjectName(rawExperience: string): string {
  if (!rawExperience) return "项目经历";
  // 取前 15 个字符作为项目名
  const firstLine = rawExperience.split(/[，。；\n]/)[0];
  return firstLine.length > 20 ? firstLine.slice(0, 20) + "..." : firstLine;
}

// 判断是否是项目经历（非实习/工作）
function isProjectExperience(t: ExperienceTranslation): boolean {
  const keywords = ["项目", "开发", "设计", "比赛", "竞赛", "大作业", "课程设计", "毕设"];
  return keywords.some((k) => t.rawExperience.includes(k));
}

/**
 * 从 AI 分析结果自动构建简历数据
 */
export function buildResumeFromAIResults(
  profile: StudentProfile,
  diagnosis: CareerDiagnosis | null,
  translations: ExperienceTranslation[] | null,
  optimization: ResumeOptimizationResult | null,
  jobAnalysis: JobAnalysis | null
): ResumeBuilderData {
  const now = new Date().toISOString();

  // 基本信息
  const basic = {
    name: profile.name || "",
    title: diagnosis?.recommendedRoles?.[0]?.role || profile.targetRoles?.[0] || "",
    email: "",
    phone: "",
    location: profile.targetCities?.[0] || "",
    customFields: [],
  };

  // 教育经历
  const education: ResumeEducation[] = [
    {
      id: generateId(),
      school: extractSchool(profile.educationBackground),
      major: profile.major || "",
      degree: profile.grade || "",
      startDate: "",
      endDate: "",
      description: "",
      visible: true,
    },
  ];

  // 经历：优先使用 AI 优化后的表达
  const experience: ResumeExperience[] = [];
  const projects: ResumeProject[] = [];

  if (translations && translations.length > 0) {
    for (const t of translations) {
      // 如果有优化结果，使用优化后的表达
      const optimized = optimization?.resumeOptimization?.find(
        (o) => o.sourceExperience === t.rawExperience
      );
      const description = optimized?.after || t.resumeBullet || t.businessLanguage || "";

      if (isProjectExperience(t)) {
        projects.push({
          id: generateId(),
          name: extractProjectName(t.rawExperience),
          role: "",
          startDate: "",
          endDate: "",
          description,
          visible: true,
        });
      } else {
        experience.push({
          id: generateId(),
          company: extractCompany(t.rawExperience),
          position: "",
          startDate: "",
          endDate: "",
          description,
          visible: true,
        });
      }
    }
  } else if (profile.rawExperiences) {
    // 没有转译结果时，直接使用原始经历
    for (const raw of profile.rawExperiences) {
      experience.push({
        id: generateId(),
        company: extractCompany(raw),
        position: "",
        startDate: "",
        endDate: "",
        description: raw,
        visible: true,
      });
    }
  }

  // 技能
  const skills = profile.skills?.join("、") || "";

  return {
    id: generateId(),
    title: `AI 生成简历 - ${profile.name || "未命名"}`,
    createdAt: now,
    updatedAt: now,
    templateId: "classic",
    basic,
    education,
    experience,
    projects,
    skills,
    selfEvaluation: "",
    sections: DEFAULT_RESUME_SECTIONS.map((s) => ({ ...s })),
    globalSettings: { ...DEFAULT_GLOBAL_SETTINGS },
  };
}
