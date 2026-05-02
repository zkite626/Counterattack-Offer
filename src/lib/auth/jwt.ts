import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-dev-secret-change-in-production-min-32-chars"
);

export interface TokenPayload extends JWTPayload {
  sub: string;
  email: string;
  name: string;
}

// 签发 JWT Token
export async function signToken(
  payload: { sub: string; email: string; name: string },
  rememberMe?: boolean
): Promise<string> {
  const expiresIn = rememberMe ? "30d" : "7d";
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

// 验证 JWT Token
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as TokenPayload;
  } catch {
    return null;
  }
}
