import type { ConfigService } from '@nestjs/config';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { AppEnvironment, parseCorsOrigins } from './environment';

const allowedHeaders = [
  'Authorization',
  'Content-Type',
  'X-Request-Id',
  'X-Client-Type',
  'X-Client-Version',
];

const allowedMethods = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'];

export function createCorsOptions(
  configService: ConfigService<AppEnvironment, true>,
): CorsOptions {
  const nodeEnv = configService.get('NODE_ENV', { infer: true });
  const allowedOrigins = parseCorsOrigins(
    configService.get('CORS_ORIGINS', { infer: true }),
  );
  const allowAllOrigins = allowedOrigins.includes('*');

  if (nodeEnv === 'production' && allowAllOrigins) {
    throw new Error('生产环境禁止将 CORS_ORIGINS 配置为 *');
  }

  return {
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ) => {
      // 移动端、服务端脚本和健康检查可能没有 Origin，不能按浏览器跨域请求拒绝。
      if (origin === undefined) {
        callback(null, true);
        return;
      }

      if (allowAllOrigins || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS origin not allowed: ${origin}`), false);
    },
    credentials: true,
    allowedHeaders,
    methods: allowedMethods,
    optionsSuccessStatus: 204,
  };
}
