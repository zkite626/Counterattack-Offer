import { Module } from '@nestjs/common';
import { RateLimitModule } from '../../common/rate-limit/rate-limit.module';
import { AuditModule } from '../audit/audit.module';
import { MailModule } from '../mail/mail.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailVerifiedGuard } from './guards/email-verified.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [MailModule, RateLimitModule, AuditModule],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, RolesGuard, EmailVerifiedGuard],
  exports: [AuthService, JwtAuthGuard, RolesGuard, EmailVerifiedGuard],
})
export class AuthModule {}
