export type NodeEnvironment = 'development' | 'test' | 'production';

export interface AppEnvironment {
  NODE_ENV: NodeEnvironment;
  PORT: number;
  API_PUBLIC_URL: string;
  WEB_PUBLIC_URL: string;
  CORS_ORIGINS: string;
  DATABASE_URL: string;
  SWAGGER_PATH: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  ACCESS_TOKEN_TTL_SECONDS: number;
  REFRESH_TOKEN_TTL_DAYS: number;
  APP_KEY_ENCRYPTION_SECRET: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
}

const allowedNodeEnvironments: ReadonlySet<string> = new Set([
  'development',
  'test',
  'production',
]);

function readString(
  config: Record<string, unknown>,
  key: keyof AppEnvironment,
  fallback?: string,
): string {
  const rawValue = config[key];
  const value = typeof rawValue === 'string' ? rawValue.trim() : '';

  if (value.length > 0) {
    return value;
  }

  if (fallback !== undefined) {
    return fallback;
  }

  throw new Error(`缺少必填环境变量 ${key}`);
}

function readPort(config: Record<string, unknown>): number {
  const rawPort = readString(config, 'PORT', '3001');
  const port = Number.parseInt(rawPort, 10);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error('PORT 必须是 1-65535 之间的整数');
  }

  return port;
}

function readPositiveInteger(
  config: Record<string, unknown>,
  key: keyof AppEnvironment,
  fallback: string,
): number {
  const rawValue = readString(config, key, fallback);
  const value = Number.parseInt(rawValue, 10);

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${key} 必须是正整数`);
  }

  return value;
}

function assertSecretLength(key: keyof AppEnvironment, value: string): void {
  if (value.length < 32) {
    throw new Error(`${key} 长度不能少于 32 个字符`);
  }
}

export function validateEnvironment(
  config: Record<string, unknown>,
): AppEnvironment {
  const rawNodeEnv = readString(config, 'NODE_ENV', 'development');

  if (!allowedNodeEnvironments.has(rawNodeEnv)) {
    throw new Error('NODE_ENV 必须是 development、test 或 production');
  }

  const nodeEnv = rawNodeEnv as NodeEnvironment;
  const corsOrigins = readString(
    config,
    'CORS_ORIGINS',
    'http://localhost:3000,https://counterattack-offer.vercel.app',
  );

  if (
    nodeEnv === 'production' &&
    corsOrigins
      .split(',')
      .map((item) => item.trim())
      .includes('*')
  ) {
    throw new Error('生产环境禁止将 CORS_ORIGINS 配置为 *');
  }

  const jwtAccessSecret = readString(
    config,
    'JWT_ACCESS_SECRET',
    nodeEnv === 'production'
      ? undefined
      : 'development-access-secret-change-me-32',
  );
  const jwtRefreshSecret = readString(
    config,
    'JWT_REFRESH_SECRET',
    nodeEnv === 'production'
      ? undefined
      : 'development-refresh-secret-change-me-32',
  );
  const encryptionSecret = readString(
    config,
    'APP_KEY_ENCRYPTION_SECRET',
    nodeEnv === 'production'
      ? undefined
      : 'MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY=',
  );

  assertSecretLength('JWT_ACCESS_SECRET', jwtAccessSecret);
  assertSecretLength('JWT_REFRESH_SECRET', jwtRefreshSecret);

  return {
    NODE_ENV: nodeEnv,
    PORT: readPort(config),
    API_PUBLIC_URL: readString(
      config,
      'API_PUBLIC_URL',
      'http://localhost:3001',
    ),
    WEB_PUBLIC_URL: readString(
      config,
      'WEB_PUBLIC_URL',
      'http://localhost:3000',
    ),
    CORS_ORIGINS: corsOrigins,
    DATABASE_URL: readString(
      config,
      'DATABASE_URL',
      'postgresql://postgres:postgres@127.0.0.1:5432/counterattack_offer?schema=public',
    ),
    SWAGGER_PATH: readString(config, 'SWAGGER_PATH', 'docs'),
    JWT_ACCESS_SECRET: jwtAccessSecret,
    JWT_REFRESH_SECRET: jwtRefreshSecret,
    ACCESS_TOKEN_TTL_SECONDS: readPositiveInteger(
      config,
      'ACCESS_TOKEN_TTL_SECONDS',
      '900',
    ),
    REFRESH_TOKEN_TTL_DAYS: readPositiveInteger(
      config,
      'REFRESH_TOKEN_TTL_DAYS',
      '30',
    ),
    APP_KEY_ENCRYPTION_SECRET: encryptionSecret,
    ADMIN_EMAIL: readString(config, 'ADMIN_EMAIL', ''),
    ADMIN_PASSWORD: readString(config, 'ADMIN_PASSWORD', ''),
  };
}

export function parseCorsOrigins(corsOrigins: string): string[] {
  return corsOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}
