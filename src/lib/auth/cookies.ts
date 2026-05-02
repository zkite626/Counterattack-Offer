const COOKIE_NAME = "token";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60, // 7天
};

const REMEMBER_ME_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  maxAge: 30 * 24 * 60 * 60, // 30天
};

// 设置认证 Cookie
export function setAuthCookie(
  cookies: {
    set: (
      name: string,
      value: string,
      options: Record<string, string | number | boolean>
    ) => void;
  },
  token: string,
  rememberMe?: boolean
) {
  const options = rememberMe ? REMEMBER_ME_COOKIE_OPTIONS : COOKIE_OPTIONS;
  cookies.set(COOKIE_NAME, token, options);
}

// 清除认证 Cookie
export function clearAuthCookie(cookies: {
  set: (
    name: string,
    value: string,
    options: Record<string, string | number | boolean>
  ) => void;
}) {
  cookies.set(COOKIE_NAME, "", { ...COOKIE_OPTIONS, maxAge: 0 });
}
