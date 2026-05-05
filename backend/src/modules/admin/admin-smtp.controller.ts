import {
  Body,
  Controller,
  Get,
  Put,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequireRoles } from '../auth/decorators/require-roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { AuthenticatedUser } from '../auth/auth.types';
import { MailService } from '../mail/mail.service';
import type {
  SaveSmtpSettingDto,
  SmtpSettingResponse,
  SmtpTestResponse,
  TestSmtpDto,
} from '../mail/dto/smtp.dto';
import type { RequestWithContext } from '../../common/types/request-context.type';

@Controller('admin/smtp')
@UseGuards(JwtAuthGuard, RolesGuard)
@RequireRoles('admin')
export class AdminSmtpController {
  constructor(
    private readonly mailService: MailService,
    private readonly auditService: AuditService,
  ) {}

  @Get()
  async getSmtpSetting(): Promise<{ setting: SmtpSettingResponse | null }> {
    try {
      return { setting: await this.mailService.getSmtpSetting() };
    } catch (error) {
      throw error;
    }
  }

  @Put()
  async saveSmtpSetting(
    @Body() dto: SaveSmtpSettingDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithContext,
  ): Promise<{ setting: SmtpSettingResponse }> {
    try {
      const setting = await this.mailService.saveSmtpSetting(dto, user.id);

      await this.auditService.record({
        actorUserId: user.id,
        action: 'admin.smtp.update',
        targetType: 'smtp_settings',
        targetId: setting.id,
        metadata: {
          host: setting.host,
          port: setting.port,
          secure: setting.secure,
          fromEmail: setting.fromEmail,
          isEnabled: setting.isEnabled,
        },
        ipAddress: request.ip ?? null,
        userAgent: request.header('user-agent') ?? null,
      });

      return { setting };
    } catch (error) {
      throw error;
    }
  }

  @Post('test')
  async sendTestEmail(
    @Body() dto: TestSmtpDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithContext,
  ): Promise<SmtpTestResponse> {
    try {
      const result = await this.mailService.sendTestEmail(dto);

      await this.auditService.record({
        actorUserId: user.id,
        action: 'admin.smtp.test',
        targetType: 'smtp_settings',
        metadata: { status: 'success' },
        ipAddress: request.ip ?? null,
        userAgent: request.header('user-agent') ?? null,
      });

      return result;
    } catch (error) {
      await this.auditService.record({
        actorUserId: user.id,
        action: 'admin.smtp.test',
        targetType: 'smtp_settings',
        metadata: { status: 'failed' },
        ipAddress: request.ip ?? null,
        userAgent: request.header('user-agent') ?? null,
      });

      throw error;
    }
  }
}
