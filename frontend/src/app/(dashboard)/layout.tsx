"use client";

import { type ReactNode, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAI } from "@/contexts/AIContext";
import Icon from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";
import ThemeToggle from "@/components/ui/ThemeToggle";
import StepNav from "@/components/layout/StepNav";
import "./dashboard.css";

const NAV_ITEMS: { path: string; label: string; icon: IconName }[] = [
  { path: "/profile", label: "个人信息", icon: "user" },
  { path: "/diagnosis", label: "画像诊断", icon: "diagnosis" },
  { path: "/translation", label: "经历转译", icon: "translate" },
  { path: "/job", label: "JD解析", icon: "job" },
  { path: "/match", label: "人岗匹配", icon: "match" },
  { path: "/resume", label: "简历优化", icon: "resume" },
  { path: "/interview", label: "面试训练", icon: "interview" },
  { path: "/plan", label: "能力计划", icon: "plan" },
  { path: "/report", label: "汇总报告", icon: "report" },
  { path: "/resume-builder", label: "简历创建器", icon: "resume-builder" },
  { path: "/settings", label: "模型管理", icon: "settings" },
];

// 仅在流程页面显示步骤导航
const FLOW_PATHS = [
  "/profile", "/diagnosis", "/translation", "/job",
  "/match", "/resume", "/interview", "/plan", "/report",
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const { activeModel, envConfigLoaded } = useAI();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // 未登录 → 重定向到登录页
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // 未配置可用模型 → 跳转设置页（等待后端模型列表加载完成）
  useEffect(() => {
    if (!envConfigLoaded) return;
    if (pathname !== "/settings" && !activeModel) {
      router.replace("/settings");
    }
  }, [pathname, activeModel, router, envConfigLoaded]);

  // 侧边栏打开时锁定页面滚动
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  // 鉴权检查中或未登录，显示加载态
  if (isLoading || !isAuthenticated) {
    return (
      <div className="dashboard" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>加载中…</p>
      </div>
    );
  }

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard__header">
        <div className="dashboard__header-left">
          <button
            className="dashboard__menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="切换侧边栏"
          >
            <Icon name="menu" size="1.25em" />
          </button>
          <div className="dashboard__brand">
            {/* 桌面端：横版 Logo（亮/暗主题） */}
            <picture className="dashboard__logo-wide dashboard__logo-th--light">
              <source srcSet="/logo-wide-light.webp" type="image/webp" />
              <img src="/logo-wide-light.png" alt="逆袭Offer" className="dashboard__logo-img" />
            </picture>
            <picture className="dashboard__logo-wide dashboard__logo-th--dark">
              <source srcSet="/logo-wide-dark.webp" type="image/webp" />
              <img src="/logo-wide-dark.png" alt="逆袭Offer" className="dashboard__logo-img" />
            </picture>
            {/* 移动端：方形 Logo */}
            <picture className="dashboard__logo-square">
              <source srcSet="/logo-square.webp" type="image/webp" />
              <img src="/logo-square.png" alt="逆袭Offer" width={32} height={32} className="dashboard__logo-img" />
            </picture>
          </div>
        </div>
        <div className="dashboard__header-right">
          <ThemeToggle />
          <div className="dashboard__user-menu-wrapper">
            <button
              className="dashboard__user-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <span className="dashboard__avatar">
                {user?.name?.charAt(0) || "U"}
              </span>
              <span className="dashboard__user-name">{user?.name || "用户"}</span>
            </button>
            {showUserMenu && (
              <div className="dashboard__dropdown">
                <div className="dashboard__dropdown-header">
                  <div className="dashboard__dropdown-name">{user?.name}</div>
                  <div className="dashboard__dropdown-email">{user?.email}</div>
                </div>
                <button
                  className="dashboard__dropdown-item"
                  onClick={() => {
                    setShowUserMenu(false);
                    router.push("/profile");
                  }}
                >
                  个人信息
                </button>
                <button
                  className="dashboard__dropdown-item dashboard__dropdown-item--danger"
                  onClick={handleLogout}
                >
                  退出登录
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* StepNav — 仅流程页面显示 */}
      {FLOW_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/")) && (
        <div className="dashboard__stepnav">
          <StepNav />
        </div>
      )}

      <div className="dashboard__body">
        {/* Sidebar */}
        <aside className={`dashboard__sidebar ${sidebarOpen ? "dashboard__sidebar--open" : ""}`}>
          <nav className="dashboard__nav">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={`dashboard__nav-item ${
                  pathname === item.path || (item.path === "/resume-builder" && pathname.startsWith("/resume-builder/"))
                    ? "dashboard__nav-item--active"
                    : ""
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon name={item.icon} size="1.25em" className="dashboard__nav-icon" />
                <span className="dashboard__nav-label">{item.label}</span>
              </a>
            ))}
          </nav>
        </aside>

        {/* 遮罩层（移动端） */}
        {sidebarOpen && (
          <div
            className="dashboard__overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* 主内容区域 */}
        <main className="dashboard__main">{children}</main>
      </div>
    </div>
  );
}
