"use client";

import { type ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/ui/ThemeToggle";
import "./admin.css";

const ADMIN_NAV = [
  { path: "/admin/users", label: "用户" },
  { path: "/admin/ai-models", label: "全局模型" },
  { path: "/admin/smtp", label: "SMTP" },
  { path: "/admin/audit-logs", label: "审计日志" },
  { path: "/admin/stats", label: "平台统计" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoading, isAuthenticated, isAdmin, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return <div className="admin-shell"><div className="admin-card">加载中...</div></div>;
  }

  if (!isAdmin) {
    return (
      <div className="admin-shell">
        <main className="admin-shell__body">
          <section className="admin-forbidden">
            403：当前账号无管理员权限，无法访问管理员后台。
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <header className="admin-shell__header">
        <div className="admin-shell__brand">
          <span className="admin-shell__title">逆袭Offer 管理后台</span>
          <span className="admin-shell__subtitle">{user?.email}</span>
        </div>
        <ThemeToggle />
      </header>
      <div className="admin-shell__body">
        <nav className="admin-shell__nav">
          {ADMIN_NAV.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`admin-shell__nav-link ${pathname === item.path ? "admin-shell__nav-link--active" : ""}`}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <main className="admin-shell__main">{children}</main>
      </div>
    </div>
  );
}
