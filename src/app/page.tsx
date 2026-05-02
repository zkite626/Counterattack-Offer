"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--space-8)",
      padding: "var(--space-8)",
      textAlign: "center",
      background: "var(--color-bg)",
    }}>
      <div style={{ position: "absolute", top: "var(--space-4)", right: "var(--space-4)" }}>
        <ThemeToggle />
      </div>

      <div>
        <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>🚀</div>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-5xl)",
          fontWeight: "var(--font-bold)",
          background: "var(--gradient-primary)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          逆袭Offer
        </h1>
        <p style={{
          fontSize: "var(--text-xl)",
          color: "var(--color-text-secondary)",
          marginTop: "var(--space-4)",
          maxWidth: 480,
        }}>
          面向低经验大学生的 AI 求职突围智能体
        </p>
      </div>

      <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap", justifyContent: "center" }}>
        {!isLoading && (
          isAuthenticated ? (
            <Button size="lg" onClick={() => router.push("/profile")}>
              进入工作台
            </Button>
          ) : (
            <>
              <Button size="lg" onClick={() => router.push("/login")}>
                登录
              </Button>
              <Button variant="secondary" size="lg" onClick={() => router.push("/register")}>
                注册账号
              </Button>
            </>
          )
        )}
      </div>

      <div style={{
        display: "flex",
        gap: "var(--space-8)",
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: "var(--space-8)",
      }}>
        {[
          { icon: "📊", label: "能力画像" },
          { icon: "🎯", label: "岗位匹配" },
          { icon: "📄", label: "简历优化" },
          { icon: "🎤", label: "面试训练" },
        ].map((item) => (
          <div key={item.label} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--space-2)",
          }}>
            <span style={{ fontSize: "2rem" }}>{item.icon}</span>
            <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
