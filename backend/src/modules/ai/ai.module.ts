import { Module } from '@nestjs/common';
import { ModelConfigModule } from '../model-config/model-config.module';
import { AiService } from './ai.service';

@Module({
  imports: [ModelConfigModule],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
