import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { CareerFlowController } from "./career-flow.controller";
import { CareerFlowService } from "./career-flow.service";

@Module({
  imports: [AuthModule],
  controllers: [CareerFlowController],
  providers: [CareerFlowService],
  exports: [CareerFlowService],
})
export class CareerFlowModule {}
