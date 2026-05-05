import { Module } from "@nestjs/common";
import { CareerFlowController } from "./career-flow.controller";
import { CareerFlowService } from "./career-flow.service";

@Module({
  controllers: [CareerFlowController],
  providers: [CareerFlowService],
  exports: [CareerFlowService],
})
export class CareerFlowModule {}
