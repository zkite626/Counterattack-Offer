"use client";

import { type ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Icon from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";
import ThemeToggle from "@/components/ui/ThemeToggle";
import "./admin.css";

const ADMIN_NAV: { path: string; label: string; icon: IconName }[] = [
  { path: "/admin/users", label: "用户管理", icon: "user-group" },
  { path: "/admin/ai-models", label: "全局模型", icon: "key" },
  { path: "/admin/smtp", label: "邮件设置", icon: "mail" },
  { path: "/admin/audit-logs", label: "审计日志", icon: "document" },
  { path: "/admin/stats", label: "平台统计", icon: "bar-chart" },
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
          <picture className="admin-shell__mark">
            <source srcSet="/logo-square.webp" type="image/webp" />
            <img src="/logo-square.png" alt="逆袭Offer" className="admin-shell__mark-img" />
          </picture>
          <div>
            <span className="admin-shell__title">逆袭Offer 管理后台</span>
            <span className="admin-shell__subtitle">{user?.email}</span>
          </div>
        </div>
        <div className="admin-shell__header-actions">
          <button
            className="admin-shell__back-btn"
            aria-label="返回工作台"
            onClick={() => router.push("/account")}
          >
            <Icon name="arrow-left" size="1em" />
            <span>返回工作台</span>
          </button>
          <ThemeToggle />
        </div>
      </header>
      <div className="admin-shell__nav-wrap">
        <nav className="admin-shell__nav" aria-label="管理员后台导航">
          {ADMIN_NAV.map((item) => {
            const active = pathname === item.path || pathname.startsWith(`${item.path}/`);
            return (
              <a
                key={item.path}
                href={item.path}
                className={`admin-shell__nav-link ${active ? "admin-shell__nav-link--active" : ""}`}
              >
                <Icon name={item.icon} size="1em" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>
      <div className="admin-shell__body">
        <main className="admin-shell__main">{children}</main>
      </div>
    </div>
  );
}
