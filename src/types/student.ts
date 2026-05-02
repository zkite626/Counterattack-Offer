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
  createdAt: string;
  updatedAt: string;
}

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

export interface ExperienceTranslation {
  rawExperience: string;
  abilityTags: string[];
  businessLanguage: string;
  resumeBullet: string;
  interviewQuestions: string[];
  authenticityNote: string;
}
