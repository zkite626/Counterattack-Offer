export type NodeEnvironment = 'development' | 'test' | 'production';

export interface AppEnvironment {
  NODE_ENV: NodeEnvironment;
  PORT: number;
  API_PUBLIC_URL: string;
  WEB_PUBLIC_URL: string;
  CORS_ORIGINS: string;
  DATABASE_URL: string;
  SWAGGER_PATH: string;
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

  if (nodeEnv === 'production' && corsOrigins.split(',').map((item) => item.trim()).includes('*')) {
    throw new Error('生产环境禁止将 CORS_ORIGINS 配置为 *');
  }

  return {
    NODE_ENV: nodeEnv,
    PORT: readPort(config),
    API_PUBLIC_URL: readString(config, 'API_PUBLIC_URL', 'http://localhost:3001'),
    WEB_PUBLIC_URL: readString(config, 'WEB_PUBLIC_URL', 'http://localhost:3000'),
    CORS_ORIGINS: corsOrigins,
    DATABASE_URL: readString(
      config,
      'DATABASE_URL',
      'postgresql://postgres:postgres@127.0.0.1:5432/counterattack_offer?schema=public',
    ),
    SWAGGER_PATH: readString(config, 'SWAGGER_PATH', 'docs'),
  };
}

export function parseCorsOrigins(corsOrigins: string): string[] {
  return corsOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}
