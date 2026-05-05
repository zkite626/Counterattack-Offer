export interface ExperienceInputDto {
  id?: unknown;
  rawContent?: unknown;
  rawExperience?: unknown;
  type?: unknown;
  sortOrder?: unknown;
}

export interface SaveStudentProfileDto {
  name?: unknown;
  schoolType?: unknown;
  major?: unknown;
  grade?: unknown;
  targetCities?: unknown;
  targetRoles?: unknown;
  educationBackground?: unknown;
  skills?: unknown;
  weaknesses?: unknown;
  rawExperiences?: unknown;
  experiences?: unknown;
}

export interface ExperienceResponse {
  id: string;
  rawContent: string;
  rawExperience: string;
  type: string;
  sortOrder: number;
  createdAt: string;
}

export interface StudentProfileResponse {
  id: string;
  userId: string;
  name: string;
  schoolType: string;
  major: string;
  grade: string;
  targetCities: string[];
  targetRoles: string[];
  educationBackground: string;
  rawExperiences: string[];
  experiences: ExperienceResponse[];
  skills: string[];
  weaknesses: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SaveStudentProfileInput {
  name?: string;
  schoolType: string;
  major: string;
  grade: string;
  targetCities: string[];
  targetRoles: string[];
  educationBackground: string;
  skills: string[];
  weaknesses: string[];
  experiences: Array<{
    rawContent: string;
    type: string;
    sortOrder: number;
  }>;
}
