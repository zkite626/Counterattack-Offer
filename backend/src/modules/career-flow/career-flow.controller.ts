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
  CareerFlowDetailResponse,
  CareerFlowResponse,
  CareerFlowResultsResponse,
  SaveCareerFlowDto,
} from "./dto/career-flow.dto";
import { CareerFlowService } from "./career-flow.service";

@Controller("career-flows")
@UseGuards(JwtAuthGuard)
export class CareerFlowController {
  constructor(private readonly careerFlowService: CareerFlowService) {}

  @Get()
  async listFlows(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ flows: CareerFlowResponse[] }> {
    try {
      return { flows: await this.careerFlowService.listFlows(user.id) };
    } catch (error) {
      throw error;
    }
  }

  @Post()
  async createFlow(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SaveCareerFlowDto,
  ): Promise<{ flow: CareerFlowResponse }> {
    try {
      return { flow: await this.careerFlowService.createFlow(user.id, dto) };
    } catch (error) {
      throw error;
    }
  }

  @Get(":id")
  async getFlow(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
  ): Promise<{ flow: CareerFlowDetailResponse }> {
    try {
      return { flow: await this.careerFlowService.getFlow(user.id, id) };
    } catch (error) {
      throw error;
    }
  }

  @Patch(":id")
  async updateFlow(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body() dto: SaveCareerFlowDto,
  ): Promise<{ flow: CareerFlowResponse }> {
    try {
      return {
        flow: await this.careerFlowService.updateFlow(user.id, id, dto),
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(":id/results")
  async getFlowResults(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
  ): Promise<CareerFlowResultsResponse> {
    try {
      return await this.careerFlowService.getResults(user.id, id);
    } catch (error) {
      throw error;
    }
  }
}
