import { Module } from "@nestjs/common";
import { RateLimitModule } from "../../common/rate-limit/rate-limit.module";
import { AuthModule } from "../auth/auth.module";
import { CareerFlowModule } from "../career-flow/career-flow.module";
import { ModelConfigModule } from "../model-config/model-config.module";
import { AiBusinessController } from "./ai-business.controller";
import { AiBusinessService } from "./ai-business.service";
import { AiService } from "./ai.service";

@Module({
  imports: [AuthModule, ModelConfigModule, CareerFlowModule, RateLimitModule],
  controllers: [AiBusinessController],
  providers: [AiService, AiBusinessService],
  exports: [AiService],
})
export class AiModule {}
