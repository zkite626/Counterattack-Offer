import { apiClient } from "@/lib/api/client";
import type { StudentProfile } from "@/types";

export const usersApi = {
  async getProfile(): Promise<StudentProfile | null> {
    const result = await apiClient.get<{ profile: StudentProfile | null }>("/users/me/profile");
    return result.profile;
  },

  async saveProfile(profile: StudentProfile): Promise<StudentProfile> {
    const result = await apiClient.put<{ profile: StudentProfile }>("/users/me/profile", {
      name: profile.name,
      schoolType: profile.schoolType,
      major: profile.major,
      grade: profile.grade,
      targetCities: profile.targetCities,
      targetRoles: profile.targetRoles,
      educationBackground: profile.educationBackground,
      rawExperiences: profile.rawExperiences,
      skills: profile.skills,
      weaknesses: profile.weaknesses,
    });
    return result.profile;
  },
};
