import { Body, Controller, Post, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";
import { Readable } from "node:stream";
import { RateLimitService } from "../../common/rate-limit/rate-limit.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { AuthenticatedUser } from "../auth/auth.types";
import type { AIBusinessRequestDto } from "./dto/ai-business.dto";
import { AiBusinessService } from "./ai-business.service";

@Controller("ai")
@UseGuards(JwtAuthGuard)
export class AiBusinessController {
  constructor(
    private readonly aiBusinessService: AiBusinessService,
    private readonly rateLimitService: RateLimitService,
  ) {}

  @Post("diagnose")
  async diagnose(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AIBusinessRequestDto,
  ): Promise<unknown> {
    try {
      await this.rateLimitService.consumeAiCall(user.id);
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
      await this.rateLimitService.consumeAiCall(user.id);
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
      await this.rateLimitService.consumeAiCall(user.id);
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
      await this.rateLimitService.consumeAiCall(user.id);
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
      await this.rateLimitService.consumeAiCall(user.id);
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
      await this.rateLimitService.consumeAiCall(user.id);
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
      await this.rateLimitService.consumeAiCall(user.id);
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
      await this.rateLimitService.consumeAiCall(user.id);
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
      await this.rateLimitService.consumeAiCall(user.id);
      return await this.aiBusinessService.generateJd(user.id, dto);
    } catch (error) {
      throw error;
    }
  }

  @Post("career-qa")
  async careerQa(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AIBusinessRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.rateLimitService.consumeAiCall(user.id);
      const stream = await this.aiBusinessService.careerQa(user.id, dto);
      const nodeStream = Readable.fromWeb(stream as never);

      res.status(200);
      res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no");
      res.flushHeaders?.();

      nodeStream.on("error", (error) => {
        if (!res.headersSent) {
          res.status(500);
        }

        res.destroy(error instanceof Error ? error : undefined);
      });

      nodeStream.pipe(res);
    } catch (error) {
      throw error;
    }
  }
}
