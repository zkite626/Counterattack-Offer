import type { Metadata } from "next";
import Providers from "./providers";
import IconSprite from "@/components/ui/IconSprite";
import "./globals.css";

export const metadata: Metadata = {
  title: "逆袭Offer — 面向低经验大学生的 AI 求职突围智能体",
  description:
    "不是每个大学生都有耀眼实习，但每段真实经历都可能藏着岗位价值。逆袭Offer 通过 AI 求职画像、经历能力转译、人岗匹配、可信简历优化、面试模拟追问和能力提升计划，帮助低经验大学生完成从经历挖掘到面试准备的完整求职闭环。",
  keywords: ["AI求职", "大学生求职", "简历优化", "面试模拟", "人岗匹配", "逆袭Offer"],
  authors: [{ name: "逆袭Offer" }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo-square.png",
  },
  openGraph: {
    title: "逆袭Offer — 面向低经验大学生的 AI 求职突围智能体",
    description:
      "不是每个大学生都有耀眼实习，但每段真实经历都可能藏着岗位价值。AI 驱动的六步求职突围闭环，帮你发现经历中的岗位价值。",
    type: "website",
    locale: "zh_CN",
    siteName: "逆袭Offer",
  },
  twitter: {
    card: "summary_large_image",
    title: "逆袭Offer — AI 求职突围智能体",
    description: "面向低经验大学生的 AI 求职陪跑平台，从经历挖掘到面试准备的完整求职闭环",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/logo-square.png" />
      </head>
      <body>
        <IconSprite />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
