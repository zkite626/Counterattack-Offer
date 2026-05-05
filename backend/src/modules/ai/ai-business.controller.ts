import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { AuthenticatedUser } from "../auth/auth.types";
import type { AIBusinessRequestDto } from "./dto/ai-business.dto";
import { AiBusinessService } from "./ai-business.service";

@Controller("ai")
@UseGuards(JwtAuthGuard)
export class AiBusinessController {
  constructor(private readonly aiBusinessService: AiBusinessService) {}

  @Post("diagnose")
  async diagnose(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AIBusinessRequestDto,
  ): Promise<unknown> {
    try {
      return await this.aiBusinessService.diagnose(user.id, dto);
    } catch (error) {
      throw error;
    }
  }

  @Post("translate")
  async translate(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AIBusinessRequestDto,
  ): Promise<unknown> {
    try {
      return await this.aiBusinessService.translate(user.id, dto);
    } catch (error) {
      throw error;
    }
  }

  @Post("analyze-job")
  async analyzeJob(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AIBusinessRequestDto,
  ): Promise<unknown> {
    try {
      return await this.aiBusinessService.analyzeJob(user.id, dto);
    } catch (error) {
      throw error;
    }
  }

  @Post("match")
  async match(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AIBusinessRequestDto,
  ): Promise<unknown> {
    try {
      return await this.aiBusinessService.match(user.id, dto);
    } catch (error) {
      throw error;
    }
  }

  @Post("optimize-resume")
  async optimizeResume(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AIBusinessRequestDto,
  ): Promise<unknown> {
    try {
      return await this.aiBusinessService.optimizeResume(user.id, dto);
    } catch (error) {
      throw error;
    }
  }

  @Post("interview")
  async interview(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AIBusinessRequestDto,
  ): Promise<unknown> {
    try {
      return await this.aiBusinessService.interview(user.id, dto);
    } catch (error) {
      throw error;
    }
  }

  @Post("plan")
  async plan(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AIBusinessRequestDto,
  ): Promise<unknown> {
    try {
      return await this.aiBusinessService.plan(user.id, dto);
    } catch (error) {
      throw error;
    }
  }

  @Post("report")
  async report(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AIBusinessRequestDto,
  ): Promise<{ markdown: string; report: string }> {
    try {
      return await this.aiBusinessService.report(user.id, dto);
    } catch (error) {
      throw error;
    }
  }

  @Post("generate-jd")
  async generateJd(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AIBusinessRequestDto,
  ): Promise<{ jd: string }> {
    try {
      return await this.aiBusinessService.generateJd(user.id, dto);
    } catch (error) {
      throw error;
    }
  }
}
