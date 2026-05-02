"use client";

import { useAuth } from "@/contexts/AuthContext";
import Card from "@/components/ui/Card";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: 640 }}>
      <h1 style={{
        fontSize: "var(--text-2xl)",
        fontWeight: "var(--font-bold)",
        color: "var(--color-text-primary)",
        marginBottom: "var(--space-6)",
      }}>
        个人信息
      </h1>
      <Card>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>姓名</div>
            <div style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-medium)" }}>{user?.name}</div>
          </div>
          <div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>邮箱</div>
            <div style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-medium)" }}>{user?.email}</div>
          </div>
          <div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>注册时间</div>
            <div style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-medium)" }}>
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("zh-CN") : "-"}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
