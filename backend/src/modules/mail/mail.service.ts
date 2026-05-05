import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MailStatus,
  MailType,
  SmtpSetting,
  TestStatus,
  User,
} from '@prisma/client';
import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import type { AppEnvironment } from '../../config/environment';
import { SecretCryptoService } from '../../common/security/secret-crypto.service';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  SaveSmtpSettingDto,
  SmtpSettingResponse,
  SmtpTestResponse,
  TestSmtpDto,
  ValidatedSmtpSettingInput,
} from './dto/smtp.dto';

interface MailPayload {
  userId: string | null;
  type: MailType;
  toEmail: string;
  subject: string;
  text: string;
  html: string;
}

const testStatusMap: Record<TestStatus, 'success' | 'failed'> = {
  [TestStatus.SUCCESS]: 'success',
  [TestStatus.FAILED]: 'failed',
};

@Injectable()
export class MailService {
  private readonly webPublicUrl: string;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly secretCryptoService: SecretCryptoService,
    configService: ConfigService<AppEnvironment, true>,
  ) {
    this.webPublicUrl = configService.get('WEB_PUBLIC_URL', { infer: true });
  }

  async getSmtpSetting(): Promise<SmtpSettingResponse | null> {
    try {
      const setting = await this.getLatestSmtpSetting();

      return setting === null ? null : this.toSmtpSettingResponse(setting);
    } catch (error) {
      throw error;
    }
  }

  async saveSmtpSetting(
    dto: SaveSmtpSettingDto,
    updatedBy: string,
  ): Promise<SmtpSettingResponse> {
    try {
      const existing = await this.getLatestSmtpSetting();
      const input = this.validateSmtpSettingDto(dto, existing);
      const encryptedPassword =
        input.password.length > 0
          ? this.secretCryptoService.encrypt(input.password)
          : existing?.encryptedPassword;

      if (encryptedPassword === undefined) {
        throw this.validationError('password', 'SMTP 密码不能为空');
      }

      const saved =
        existing === null
          ? await this.prismaService.smtpSetting.create({
              data: {
                host: input.host,
                port: input.port,
                secure: input.secure,
                username: input.username,
                encryptedPassword,
                fromName: input.fromName,
                fromEmail: input.fromEmail,
                isEnabled: input.isEnabled,
                updatedBy,
              },
            })
          : await this.prismaService.smtpSetting.update({
              where: { id: existing.id },
              data: {
                host: input.host,
                port: input.port,
                secure: input.secure,
                username: input.username,
                encryptedPassword,
                fromName: input.fromName,
                fromEmail: input.fromEmail,
                isEnabled: input.isEnabled,
                updatedBy,
              },
            });

      return this.toSmtpSettingResponse(saved);
    } catch (error) {
      throw error;
    }
  }

  async sendTestEmail(dto: TestSmtpDto): Promise<SmtpTestResponse> {
    const toEmail = this.normalizeEmail(
      this.readRequiredString(dto.toEmail, 'toEmail'),
    );

    this.assertEmail(toEmail, 'toEmail');

    try {
      await this.sendMail({
        userId: null,
        type: MailType.TEST,
        toEmail,
        subject: '逆袭Offer SMTP 测试邮件',
        text: '如果你收到这封邮件，说明逆袭Offer SMTP 配置已经可以正常发送邮件。',
        html: '<p>如果你收到这封邮件，说明逆袭Offer SMTP 配置已经可以正常发送邮件。</p>',
      });
      await this.updateLastTestStatus(TestStatus.SUCCESS);

      return { message: '测试邮件已发送' };
    } catch (error) {
      await this.updateLastTestStatus(TestStatus.FAILED);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadGatewayException({
        code: 'SMTP_TEST_FAILED',
        message: 'SMTP 测试发送失败，请检查配置',
      });
    }
  }

  async sendVerificationEmail(user: User, token: string): Promise<void> {
    try {
      const actionUrl = this.buildActionUrl('/verify-email', token);

      await this.sendMail({
        userId: user.id,
        type: MailType.VERIFY_EMAIL,
        toEmail: user.email,
        subject: '验证你的逆袭Offer邮箱',
        text: `你好，${user.name}。请在 60 分钟内打开以下链接完成邮箱验证：${actionUrl}`,
        html: `<p>你好，${this.escapeHtml(user.name)}。</p><p>请在 60 分钟内打开以下链接完成邮箱验证：</p><p><a href="${actionUrl}">验证邮箱</a></p>`,
      });
    } catch (error) {
      throw error;
    }
  }

  async sendPasswordResetEmail(user: User, token: string): Promise<void> {
    try {
      const actionUrl = this.buildActionUrl('/reset-password', token);

      await this.sendMail({
        userId: user.id,
        type: MailType.RESET_PASSWORD,
        toEmail: user.email,
        subject: '重置你的逆袭Offer密码',
        text: `你好，${user.name}。请在 60 分钟内打开以下链接重置密码：${actionUrl}`,
        html: `<p>你好，${this.escapeHtml(user.name)}。</p><p>请在 60 分钟内打开以下链接重置密码：</p><p><a href="${actionUrl}">重置密码</a></p>`,
      });
    } catch (error) {
      throw error;
    }
  }

  async sendWelcomeEmail(user: User): Promise<void> {
    try {
      await this.sendMail({
        userId: user.id,
        type: MailType.WELCOME,
        toEmail: user.email,
        subject: '欢迎来到逆袭Offer',
        text: `你好，${user.name}。你的邮箱已验证，可以开始使用逆袭Offer。`,
        html: `<p>你好，${this.escapeHtml(user.name)}。</p><p>你的邮箱已验证，可以开始使用逆袭Offer。</p>`,
      });
    } catch (error) {
      throw error;
    }
  }

  async sendPasswordChangedEmail(user: User): Promise<void> {
    try {
      await this.sendMail({
        userId: user.id,
        type: MailType.SECURITY_NOTICE,
        toEmail: user.email,
        subject: '你的逆袭Offer密码已重置',
        text: '你的逆袭Offer账号密码已完成重置。如果不是你本人操作，请立即联系平台管理员。',
        html: '<p>你的逆袭Offer账号密码已完成重置。</p><p>如果不是你本人操作，请立即联系平台管理员。</p>',
      });
    } catch (error) {
      throw error;
    }
  }

  private async sendMail(payload: MailPayload): Promise<void> {
    const mailEvent = await this.prismaService.mailEvent.create({
      data: {
        userId: payload.userId,
        type: payload.type,
        toEmail: payload.toEmail,
        subject: payload.subject,
        status: MailStatus.QUEUED,
      },
    });

    try {
      const setting = await this.getEnabledSmtpSetting();
      const transporter = nodemailer.createTransport(
        this.createTransportOptions(setting),
      );

      await transporter.sendMail({
        from: `"${setting.fromName}" <${setting.fromEmail}>`,
        to: payload.toEmail,
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
      });
      await this.prismaService.mailEvent.update({
        where: { id: mailEvent.id },
        data: { status: MailStatus.SENT, sentAt: new Date() },
      });
    } catch (error) {
      await this.prismaService.mailEvent.update({
        where: { id: mailEvent.id },
        data: {
          status: MailStatus.FAILED,
          errorMessage: this.toSafeErrorMessage(error),
        },
      });

      throw error;
    }
  }

  private async getEnabledSmtpSetting(): Promise<SmtpSetting> {
    const setting = await this.getLatestSmtpSetting();

    if (setting === null || !setting.isEnabled) {
      throw new BadRequestException({
        code: 'SMTP_NOT_CONFIGURED',
        message: 'SMTP 未配置或未启用',
      });
    }

    return setting;
  }

  private async getLatestSmtpSetting(): Promise<SmtpSetting | null> {
    return this.prismaService.smtpSetting.findFirst({
      orderBy: { updatedAt: 'desc' },
    });
  }

  private createTransportOptions(setting: SmtpSetting): SMTPTransport.Options {
    return {
      host: setting.host,
      port: setting.port,
      secure: setting.secure,
      auth: {
        user: setting.username,
        pass: this.secretCryptoService.decrypt(setting.encryptedPassword),
      },
    };
  }

  private async updateLastTestStatus(status: TestStatus): Promise<void> {
    const setting = await this.getLatestSmtpSetting();

    if (setting === null) {
      return;
    }

    await this.prismaService.smtpSetting.update({
      where: { id: setting.id },
      data: {
        lastTestedAt: new Date(),
        lastTestStatus: status,
      },
    });
  }

  private toSmtpSettingResponse(setting: SmtpSetting): SmtpSettingResponse {
    return {
      id: setting.id,
      host: setting.host,
      port: setting.port,
      secure: setting.secure,
      username: setting.username,
      fromName: setting.fromName,
      fromEmail: setting.fromEmail,
      isEnabled: setting.isEnabled,
      lastTestedAt: setting.lastTestedAt?.toISOString() ?? null,
      lastTestStatus:
        setting.lastTestStatus === null
          ? null
          : testStatusMap[setting.lastTestStatus],
      updatedAt: setting.updatedAt.toISOString(),
    };
  }

  private validateSmtpSettingDto(
    dto: SaveSmtpSettingDto,
    existing: SmtpSetting | null,
  ): ValidatedSmtpSettingInput {
    const host = this.readRequiredString(dto.host, 'host');
    const port = this.readPort(dto.port);
    const secure = this.readBoolean(dto.secure, 'secure');
    const username = this.readRequiredString(dto.username, 'username');
    const password = this.readOptionalPassword(dto.password, existing);
    const fromName = this.readRequiredString(dto.fromName, 'fromName');
    const fromEmail = this.normalizeEmail(
      this.readRequiredString(dto.fromEmail, 'fromEmail'),
    );
    const isEnabled = this.readBoolean(dto.isEnabled, 'isEnabled');

    this.assertEmail(fromEmail, 'fromEmail');

    return {
      host,
      port,
      secure,
      username,
      password,
      fromName,
      fromEmail,
      isEnabled,
    };
  }

  private readPort(value: unknown): number {
    const port =
      typeof value === 'number' ? value : Number.parseInt(`${value}`, 10);

    if (!Number.isInteger(port) || port <= 0 || port > 65535) {
      throw this.validationError('port', '端口必须是 1-65535 之间的整数');
    }

    return port;
  }

  private readBoolean(value: unknown, field: string): boolean {
    if (typeof value === 'boolean') {
      return value;
    }

    throw this.validationError(field, `${field} 必须是布尔值`);
  }

  private readOptionalPassword(
    value: unknown,
    existing: SmtpSetting | null,
  ): string {
    if (value === undefined || value === null || value === '') {
      return existing === null ? '' : '';
    }

    if (typeof value !== 'string') {
      throw this.validationError('password', 'SMTP 密码必须是字符串');
    }

    return value;
  }

  private readRequiredString(value: unknown, field: string): string {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw this.validationError(field, `${field} 不能为空`);
    }

    return value.trim();
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private assertEmail(email: string, field: string): void {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
      throw this.validationError(field, '邮箱格式不正确');
    }
  }

  private validationError(field: string, message: string): BadRequestException {
    return new BadRequestException({
      code: 'VALIDATION_ERROR',
      message: '参数校验失败',
      details: { [field]: [message] },
    });
  }

  private buildActionUrl(
    path: '/verify-email' | '/reset-password',
    token: string,
  ): string {
    const url = new URL(path, this.webPublicUrl);

    url.searchParams.set('token', token);

    return url.toString();
  }

  private escapeHtml(value: string): string {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  private toSafeErrorMessage(error: unknown): string {
    if (error instanceof BadRequestException) {
      return 'SMTP 未配置或未启用';
    }

    if (error instanceof Error) {
      return error.message.slice(0, 500);
    }

    return '邮件发送失败';
  }
}
