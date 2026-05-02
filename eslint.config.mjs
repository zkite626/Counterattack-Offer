import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // 允许在 useEffect 中 setState（初始化 localStorage 读取、异步数据加载等标准模式）
      "react-hooks/set-state-in-effect": "off",
      // 允许 _ 前缀的未使用变量（解构排除模式）
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // App Router 中 fonts 在 layout.tsx 加载是正确的，无需 _document.js
      "@next/next/no-page-custom-font": "off",
    },
  },
]);

export default eslintConfig;
