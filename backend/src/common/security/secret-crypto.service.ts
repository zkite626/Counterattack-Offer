import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import type { AppEnvironment } from '../../config/environment';

interface EncryptedPayload {
  version: 1;
  iv: string;
  authTag: string;
  ciphertext: string;
}

@Injectable()
export class SecretCryptoService {
  private readonly key: Buffer;

  constructor(configService: ConfigService<AppEnvironment, true>) {
    const rawSecret = configService.get('APP_KEY_ENCRYPTION_SECRET', {
      infer: true,
    });
    this.key = this.parseKey(rawSecret);
  }

  encrypt(plainText: string): string {
    try {
      const iv = randomBytes(12);
      const cipher = createCipheriv('aes-256-gcm', this.key, iv);
      const ciphertext = Buffer.concat([
        cipher.update(plainText, 'utf8'),
        cipher.final(),
      ]);
      const payload: EncryptedPayload = {
        version: 1,
        iv: iv.toString('base64url'),
        authTag: cipher.getAuthTag().toString('base64url'),
        ciphertext: ciphertext.toString('base64url'),
      };

      return JSON.stringify(payload);
    } catch (error) {
      throw error;
    }
  }

  decrypt(encryptedValue: string): string {
    try {
      const payload = this.parsePayload(encryptedValue);
      const decipher = createDecipheriv(
        'aes-256-gcm',
        this.key,
        Buffer.from(payload.iv, 'base64url'),
      );

      decipher.setAuthTag(Buffer.from(payload.authTag, 'base64url'));

      return Buffer.concat([
        decipher.update(Buffer.from(payload.ciphertext, 'base64url')),
        decipher.final(),
      ]).toString('utf8');
    } catch (error) {
      throw error;
    }
  }

  private parseKey(rawSecret: string): Buffer {
    const base64Key = Buffer.from(rawSecret, 'base64');

    if (base64Key.length === 32) {
      return base64Key;
    }

    const utf8Key = Buffer.from(rawSecret, 'utf8');

    if (utf8Key.length === 32) {
      return utf8Key;
    }

    throw new Error(
      'APP_KEY_ENCRYPTION_SECRET 必须是 32 字节明文或 base64-32-byte-secret',
    );
  }

  private parsePayload(encryptedValue: string): EncryptedPayload {
    const rawJson = encryptedValue.trim().startsWith('{')
      ? encryptedValue
      : Buffer.from(encryptedValue, 'base64url').toString('utf8');
    const value: unknown = JSON.parse(rawJson);

    if (
      typeof value === 'object' &&
      value !== null &&
      'version' in value &&
      'iv' in value &&
      'authTag' in value &&
      'ciphertext' in value
    ) {
      const payload = value as Record<string, unknown>;

      if (
        payload.version === 1 &&
        typeof payload.iv === 'string' &&
        typeof payload.authTag === 'string' &&
        typeof payload.ciphertext === 'string'
      ) {
        return {
          version: 1,
          iv: payload.iv,
          authTag: payload.authTag,
          ciphertext: payload.ciphertext,
        };
      }
    }

    throw new Error('密文格式无效');
  }
}
