// API Key 加密/解密工具（MVP 阶段使用 Base64 + 字符偏移）

const SHIFT = 3; // 字符偏移量

/**
 * 加密 API Key
 * 方案：先字符偏移，再 Base64 编码
 */
export function encryptApiKey(key: string): string {
  if (!key) return '';
  // 字符偏移：每个字符的 charCode + SHIFT
  const shifted = key
    .split('')
    .map((c) => String.fromCharCode(c.charCodeAt(0) + SHIFT))
    .join('');
  // Base64 编码（处理 Unicode）
  return btoa(
    encodeURIComponent(shifted).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
}

/**
 * 解密 API Key
 * 方案：Base64 解码，再反向字符偏移
 */
export function decryptApiKey(encrypted: string): string {
  if (!encrypted) return '';
  // Base64 解码
  const decoded = decodeURIComponent(
    atob(encrypted)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  // 反向字符偏移
  return decoded
    .split('')
    .map((c) => String.fromCharCode(c.charCodeAt(0) - SHIFT))
    .join('');
}
