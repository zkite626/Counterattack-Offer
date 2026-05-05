import { Module } from '@nestjs/common';
import { RateLimitModule } from '../../common/rate-limit/rate-limit.module';
import { AuditModule } from '../audit/audit.module';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { ModelConfigModule } from '../model-config/model-config.module';
import { AdminAIModelsController } from './admin-ai-models.controller';
import { AdminOpsController } from './admin-ops.controller';
import { AdminSmtpController } from './admin-smtp.controller';

@Module({
  imports: [AuthModule, MailModule, AuditModule, ModelConfigModule, RateLimitModule],
  controllers: [AdminSmtpController, AdminAIModelsController, AdminOpsController],
})
export class AdminModule {}
