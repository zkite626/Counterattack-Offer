import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { ModelConfigModule } from '../model-config/model-config.module';
import { AdminAIModelsController } from './admin-ai-models.controller';
import { AdminSmtpController } from './admin-smtp.controller';

@Module({
  imports: [AuthModule, MailModule, AuditModule, ModelConfigModule],
  controllers: [AdminSmtpController, AdminAIModelsController],
})
export class AdminModule {}
