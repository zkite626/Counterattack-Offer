import { verifyToken } from "./jwt";

/**
 * 从请求中提取已认证用户的 ID。
 * 优先读取 middleware 注入的 x-user-id 头，
 * 若不存在则自行从 cookie 验证 JWT（fallback）。
 */
export async function getAuthUserId(request: Request): Promise<string | null> {
  // 优先走 middleware 注入的 header
  const headerId = request.headers.get("x-user-id");
  if (headerId) return headerId;

  // fallback：直接从 cookie 验证
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(/(?:^|;\s*)token=([^;]*)/);
  if (!match) return null;

  const payload = await verifyToken(decodeURIComponent(match[1]));
  return payload?.sub ?? null;
}
