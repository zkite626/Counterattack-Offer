import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 图片优化 */
  images: {
    formats: ["image/avif", "image/webp"],
  },

  /* 压缩响应 */
  compress: true,

  /* 生产环境移除 X-Powered-By 头 */
  poweredByHeader: false,

  /* 严格安全头 */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
