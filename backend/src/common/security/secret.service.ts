import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';
import type { AppEnvironment } from '../../config/environment';
import { SecretCryptoService } from './secret-crypto.service';

const secretFieldPattern =
  /(authorization|cookie|apiKey|api_key|password|token|secret|encryptedApiKey|encrypted_api_key|encryptedPassword|encrypted_password)(["'\s:=]+)([^"'\s,}]+)/gi;
const bearerPattern = /(authorization\s*:\s*bearer\s+)[^\s,}]+/gi;
const cookiePattern = /(cookie\s*:\s*)[^\n,}]+/gi;

@Injectable()
export class SecretService {
  private readonly hmacSecret: string;

  constructor(
    private readonly secretCryptoService: SecretCryptoService,
    configService: ConfigService<AppEnvironment, true>,
  ) {
    this.hmacSecret = configService.get('APP_KEY_ENCRYPTION_SECRET', {
      infer: true,
    });
  }

  encrypt(plainText: string): string {
    try {
      return this.secretCryptoService.encrypt(plainText);
    } catch (error) {
      throw error;
    }
  }

  decrypt(encryptedValue: string): string {
    try {
      return this.secretCryptoService.decrypt(encryptedValue);
    } catch (error) {
      throw error;
    }
  }

  fingerprint(secret: string): string {
    try {
      return createHmac('sha256', this.hmacSecret)
        .update(secret, 'utf8')
        .digest('hex');
    } catch (error) {
      throw error;
    }
  }

  mask(secret: string): string {
    const trimmed = secret.trim();

    if (trimmed.length <= 8) {
      return '***';
    }

    const prefixLength = trimmed.includes('-') ? trimmed.indexOf('-') + 1 : 3;
    const prefix = trimmed.slice(0, Math.min(prefixLength, 6));
    const suffix = trimmed.slice(-4);

    return `${prefix}***${suffix}`;
  }

  redactLogText(value: string): string {
    return value
      .replace(bearerPattern, '$1***')
      .replace(cookiePattern, '$1***')
      .replace(
        secretFieldPattern,
        (_match, key: string, sep: string) => `${key}${sep}***`,
      );
  }

  redactUnknown(value: unknown): unknown {
    if (typeof value === 'string') {
      return this.redactLogText(value);
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.redactUnknown(item));
    }

    if (typeof value === 'object' && value !== null) {
      const safeValue: Record<string, unknown> = {};

      for (const [key, item] of Object.entries(value)) {
        safeValue[key] = this.isSensitiveKey(key)
          ? '***'
          : this.redactUnknown(item);
      }

      return safeValue;
    }

    return value;
  }

  private isSensitiveKey(key: string): boolean {
    return /authorization|cookie|apiKey|api_key|password|token|secret|encryptedApiKey|encrypted_api_key|encryptedPassword|encrypted_password/i.test(
      key,
    );
  }
}
