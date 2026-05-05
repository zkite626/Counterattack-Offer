import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailVerifiedGuard } from './guards/email-verified.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [MailModule],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, RolesGuard, EmailVerifiedGuard],
  exports: [AuthService, JwtAuthGuard, RolesGuard, EmailVerifiedGuard],
})
export class AuthModule {}
