import { BadRequestException, Injectable } from "@nestjs/common";
import type { Experience, StudentProfile, User } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import type {
  ExperienceInputDto,
  ExperienceResponse,
  SaveStudentProfileDto,
  SaveStudentProfileInput,
  StudentProfileResponse,
} from "./dto/profile.dto";

type ProfileWithUserAndExperiences = StudentProfile & {
  user: Pick<User, "name">;
  experiences: Experience[];
};

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getStudentProfile(
    userId: string,
  ): Promise<StudentProfileResponse | null> {
    try {
      const profile = await this.prismaService.studentProfile.findUnique({
        where: { userId },
        include: {
          user: { select: { name: true } },
          experiences: {
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
          },
        },
      });

      return profile === null ? null : this.toProfileResponse(profile);
    } catch (error) {
      throw error;
    }
  }

  async saveStudentProfile(
    userId: string,
    dto: SaveStudentProfileDto,
  ): Promise<StudentProfileResponse> {
    try {
      const input = this.validateProfileDto(dto);

      const saved = await this.prismaService.$transaction(async (tx) => {
        if (input.name !== undefined) {
          await tx.user.update({
            where: { id: userId },
            data: { name: input.name },
          });
        }

        const profile = await tx.studentProfile.upsert({
          where: { userId },
          create: {
            userId,
            schoolType: input.schoolType,
            major: input.major,
            grade: input.grade,
            targetCities: input.targetCities,
            targetRoles: input.targetRoles,
            educationBackground: input.educationBackground,
            skills: input.skills,
            weaknesses: input.weaknesses,
          },
          update: {
            schoolType: input.schoolType,
            major: input.major,
            grade: input.grade,
            targetCities: input.targetCities,
            targetRoles: input.targetRoles,
            educationBackground: input.educationBackground,
            skills: input.skills,
            weaknesses: input.weaknesses,
          },
        });

        await tx.experience.deleteMany({ where: { profileId: profile.id } });

        if (input.experiences.length > 0) {
          await tx.experience.createMany({
            data: input.experiences.map((experience) => ({
              userId,
              profileId: profile.id,
              rawContent: experience.rawContent,
              type: experience.type,
              sortOrder: experience.sortOrder,
            })),
          });
        }

        return tx.studentProfile.findUniqueOrThrow({
          where: { id: profile.id },
          include: {
            user: { select: { name: true } },
            experiences: {
              orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            },
          },
        });
      });

      return this.toProfileResponse(saved);
    } catch (error) {
      throw error;
    }
  }

  private validateProfileDto(
    dto: SaveStudentProfileDto,
  ): SaveStudentProfileInput {
    return {
      name:
        dto.name === undefined
          ? undefined
          : this.readOptionalString(dto.name, "name"),
      schoolType: this.readOptionalString(dto.schoolType, "schoolType") ?? "",
      major: this.readOptionalString(dto.major, "major") ?? "",
      grade: this.readOptionalString(dto.grade, "grade") ?? "",
      targetCities: this.readStringArray(dto.targetCities, "targetCities"),
      targetRoles: this.readStringArray(dto.targetRoles, "targetRoles"),
      educationBackground:
        this.readOptionalString(
          dto.educationBackground,
          "educationBackground",
        ) ?? "",
      skills: this.readStringArray(dto.skills, "skills"),
      weaknesses: this.readStringArray(dto.weaknesses, "weaknesses"),
      experiences: this.readExperiences(dto),
    };
  }

  private readExperiences(
    dto: SaveStudentProfileDto,
  ): SaveStudentProfileInput["experiences"] {
    if (Array.isArray(dto.experiences)) {
      return dto.experiences
        .map((item, index) =>
          this.readExperienceInput(item, index, `experiences[${index}]`),
        )
        .filter((item) => item.rawContent.length > 0);
    }

    return this.readStringArray(dto.rawExperiences, "rawExperiences").map(
      (rawContent, index) => ({
        rawContent,
        type: "other",
        sortOrder: index,
      }),
    );
  }

  private readExperienceInput(
    value: unknown,
    fallbackOrder: number,
    fieldName: string,
  ): SaveStudentProfileInput["experiences"][number] {
    if (!this.isRecord(value)) {
      throw new BadRequestException({
        code: "VALIDATION_ERROR",
        message: `${fieldName} 格式无效`,
      });
    }

    const dto = value as ExperienceInputDto;
    const rawContent =
      this.readOptionalString(dto.rawContent, `${fieldName}.rawContent`) ??
      this.readOptionalString(
        dto.rawExperience,
        `${fieldName}.rawExperience`,
      ) ??
      "";
    const type =
      this.readOptionalString(dto.type, `${fieldName}.type`) ?? "other";
    const sortOrder =
      typeof dto.sortOrder === "number" && Number.isInteger(dto.sortOrder)
        ? dto.sortOrder
        : fallbackOrder;

    return { rawContent, type, sortOrder };
  }

  private readStringArray(value: unknown, fieldName: string): string[] {
    if (value === undefined || value === null) {
      return [];
    }

    if (!Array.isArray(value)) {
      throw new BadRequestException({
        code: "VALIDATION_ERROR",
        message: `${fieldName} 必须是字符串数组`,
      });
    }

    return value
      .map((item) => {
        if (typeof item !== "string") {
          throw new BadRequestException({
            code: "VALIDATION_ERROR",
            message: `${fieldName} 必须是字符串数组`,
          });
        }

        return item.trim();
      })
      .filter((item) => item.length > 0);
  }

  private readOptionalString(
    value: unknown,
    fieldName: string,
  ): string | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }

    if (typeof value !== "string") {
      throw new BadRequestException({
        code: "VALIDATION_ERROR",
        message: `${fieldName} 必须是字符串`,
      });
    }

    return value.trim();
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  private toProfileResponse(
    profile: ProfileWithUserAndExperiences,
  ): StudentProfileResponse {
    const experiences = profile.experiences.map((experience) =>
      this.toExperienceResponse(experience),
    );

    return {
      id: profile.id,
      userId: profile.userId,
      name: profile.user.name,
      schoolType: profile.schoolType,
      major: profile.major,
      grade: profile.grade,
      targetCities: profile.targetCities,
      targetRoles: profile.targetRoles,
      educationBackground: profile.educationBackground,
      rawExperiences: experiences.map((experience) => experience.rawContent),
      experiences,
      skills: profile.skills,
      weaknesses: profile.weaknesses,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }

  private toExperienceResponse(experience: Experience): ExperienceResponse {
    return {
      id: experience.id,
      rawContent: experience.rawContent,
      rawExperience: experience.rawContent,
      type: experience.type,
      sortOrder: experience.sortOrder,
      createdAt: experience.createdAt.toISOString(),
    };
  }
}
