import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "逆袭Offer — 面向低经验大学生的 AI 求职突围智能体",
  description:
    "不是每个大学生都有耀眼实习，但每段真实经历都可能藏着岗位价值。逆袭Offer 通过 AI 求职画像、经历能力转译、人岗匹配、可信简历优化、面试模拟追问和能力提升计划，帮助低经验大学生完成从经历挖掘到面试准备的完整求职闭环。",
  keywords: ["AI求职", "大学生求职", "简历优化", "面试模拟", "人岗匹配", "逆袭Offer"],
  authors: [{ name: "逆袭Offer" }],
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700&family=Outfit:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
