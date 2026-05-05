#!/usr/bin/env node

const apiBaseUrl = (process.env.API_BASE_URL || 'http://localhost:3001/api/v1').replace(/\/$/, '');
const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const deniedOrigin = process.env.CORS_DENIED_ORIGIN || 'https://evil.example.com';
const requestHeaders = 'Content-Type, Authorization, X-Request-Id, X-Client-Type, X-Client-Version, X-Idempotency-Key, X-Platform';

function headerIncludes(headers, name, expectedValue) {
  const raw = headers.get(name);
  return raw !== null && raw.toLowerCase().includes(expectedValue.toLowerCase());
}

async function verifyAllowed(origin) {
  const response = await fetch(`${apiBaseUrl}/health`, {
    method: 'OPTIONS',
    headers: {
      Origin: origin,
      'Access-Control-Request-Method': 'GET',
      'Access-Control-Request-Headers': requestHeaders,
    },
  });

  const allowOrigin = response.headers.get('access-control-allow-origin');
  const allowCredentials = response.headers.get('access-control-allow-credentials');

  if (![200, 204].includes(response.status)) {
    throw new Error(`OPTIONS ${origin} expected 200/204, got ${response.status}`);
  }
  if (allowOrigin !== origin) {
    throw new Error(`OPTIONS ${origin} returned Access-Control-Allow-Origin=${allowOrigin}`);
  }
  if (allowCredentials !== 'true') {
    throw new Error(`OPTIONS ${origin} did not allow credentials`);
  }
  if (!headerIncludes(response.headers, 'access-control-allow-methods', 'OPTIONS')) {
    throw new Error(`OPTIONS ${origin} did not include OPTIONS in allowed methods`);
  }
  if (!headerIncludes(response.headers, 'access-control-allow-headers', 'X-Client-Version')) {
    throw new Error(`OPTIONS ${origin} did not include expected custom headers`);
  }

  const healthResponse = await fetch(`${apiBaseUrl}/health`, {
    method: 'GET',
    headers: { Origin: origin },
  });
  const healthAllowOrigin = healthResponse.headers.get('access-control-allow-origin');

  if (healthResponse.status !== 200) {
    throw new Error(`GET /health ${origin} expected 200, got ${healthResponse.status}`);
  }
  if (healthAllowOrigin !== origin) {
    throw new Error(`GET /health ${origin} returned Access-Control-Allow-Origin=${healthAllowOrigin}`);
  }
}

async function verifyDenied(origin) {
  const response = await fetch(`${apiBaseUrl}/health`, {
    method: 'OPTIONS',
    headers: {
      Origin: origin,
      'Access-Control-Request-Method': 'GET',
      'Access-Control-Request-Headers': requestHeaders,
    },
  });
  const allowOrigin = response.headers.get('access-control-allow-origin');

  if (response.ok && allowOrigin === origin) {
    throw new Error(`Denied origin ${origin} was accepted`);
  }
  if (allowOrigin === '*') {
    throw new Error('CORS returned wildcard origin');
  }
}

async function main() {
  if (allowedOrigins.length === 0) {
    throw new Error('Set CORS_ALLOWED_ORIGINS to the Vercel and custom frontend origins');
  }

  for (const origin of allowedOrigins) {
    await verifyAllowed(origin);
    console.log(`allowed origin ok: ${origin}`);
  }

  await verifyDenied(deniedOrigin);
  console.log(`denied origin ok: ${deniedOrigin}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
