#!/usr/bin/env node

const apiBaseUrl = (process.env.API_BASE_URL || 'http://localhost:3001/api/v1').replace(/\/$/, '');
const email = process.env.MOBILE_TEST_EMAIL;
const password = process.env.MOBILE_TEST_PASSWORD;
const deviceName = process.env.MOBILE_TEST_DEVICE_NAME || 'Codex Mobile Contract Check';

async function readJson(response) {
  const text = await response.text();
  if (text.length === 0) return {};

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Expected JSON response, got: ${text.slice(0, 120)}`);
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Type': 'mobile',
      'X-Client-Version': process.env.MOBILE_TEST_CLIENT_VERSION || '1.0.0',
      'X-Platform': process.env.MOBILE_TEST_PLATFORM || 'ios',
      ...(options.headers || {}),
    },
  });
  const body = await readJson(response);

  if (!response.ok || body.success === false) {
    const code = body && body.error ? body.error.code : 'HTTP_ERROR';
    throw new Error(`${options.method || 'GET'} ${path} failed: ${response.status} ${code}`);
  }

  return body.data;
}

function assertString(value, label) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${label} missing from mobile contract response`);
  }
}

async function main() {
  if (!email || !password) {
    throw new Error('Set MOBILE_TEST_EMAIL and MOBILE_TEST_PASSWORD for a disposable active test user');
  }

  const login = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      clientType: 'mobile',
      deviceName,
    }),
  });

  assertString(login.accessToken, 'accessToken');
  assertString(login.refreshToken, 'refreshToken');
  console.log('mobile login ok');

  const refreshed = await request('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({
      refreshToken: login.refreshToken,
      clientType: 'mobile',
      deviceName,
    }),
  });

  assertString(refreshed.accessToken, 'refreshed accessToken');
  assertString(refreshed.refreshToken, 'refreshed refreshToken');
  console.log('mobile refresh ok');

  await request('/auth/me', {
    headers: { Authorization: `Bearer ${refreshed.accessToken}` },
  });
  console.log('mobile bearer auth ok');

  await request('/users/me/profile', {
    headers: { Authorization: `Bearer ${refreshed.accessToken}` },
  });
  console.log('mobile profile endpoint ok');

  await request('/ai/models', {
    headers: { Authorization: `Bearer ${refreshed.accessToken}` },
  });
  console.log('mobile model endpoint ok');

  if (process.env.MOBILE_VERIFY_AI === 'true') {
    await request('/ai/diagnose', {
      method: 'POST',
      headers: { Authorization: `Bearer ${refreshed.accessToken}` },
      body: JSON.stringify({
        input: {
          targetRoles: ['产品助理'],
          studentProfile: {
            schoolType: '本科',
            major: '信息管理',
            grade: '大三',
            skills: ['Excel', '用户访谈'],
          },
        },
        stream: false,
      }),
    });
    console.log('mobile AI endpoint ok');
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
