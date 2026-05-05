import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { AuthenticatedUser } from "../auth/auth.types";
import type {
  ResumeResponse,
  ResumeVersionResponse,
  SaveResumeDto,
} from "./dto/resume.dto";
import { ResumeService } from "./resume.service";

@Controller("resumes")
@UseGuards(JwtAuthGuard)
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Get()
  async listResumes(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ resumes: ResumeResponse[] }> {
    try {
      return { resumes: await this.resumeService.listResumes(user.id) };
    } catch (error) {
      throw error;
    }
  }

  @Post()
  async createResume(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SaveResumeDto,
  ): Promise<{ resume: ResumeResponse }> {
    try {
      return { resume: await this.resumeService.createResume(user.id, dto) };
    } catch (error) {
      throw error;
    }
  }

  @Get(":id")
  async getResume(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
  ): Promise<{ resume: ResumeResponse }> {
    try {
      return { resume: await this.resumeService.getResume(user.id, id) };
    } catch (error) {
      throw error;
    }
  }

  @Patch(":id")
  async updateResume(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body() dto: SaveResumeDto,
  ): Promise<{ resume: ResumeResponse }> {
    try {
      return {
        resume: await this.resumeService.updateResume(user.id, id, dto),
      };
    } catch (error) {
      throw error;
    }
  }

  @Post(":id/versions")
  async createVersion(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
  ): Promise<{ version: ResumeVersionResponse }> {
    try {
      return { version: await this.resumeService.createVersion(user.id, id) };
    } catch (error) {
      throw error;
    }
  }

  @Post(":id/duplicate")
  async duplicateResume(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
  ): Promise<{ resume: ResumeResponse }> {
    try {
      return { resume: await this.resumeService.duplicateResume(user.id, id) };
    } catch (error) {
      throw error;
    }
  }
}
