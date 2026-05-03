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
  { path: "/resume-builder", label: "简历创建器", icon: "resume-builder" },
  { path: "/interview", label: "面试训练", icon: "interview" },
  { path: "/plan", label: "能力计划", icon: "plan" },
  { path: "/report", label: "汇总报告", icon: "report" },
  { path: "/settings", label: "模型管理", icon: "settings" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const { activeModel } = useAI();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [showDemoBanner, setShowDemoBanner] = useState(true);

  // 检测 Demo 模式
  useEffect(() => {
    setIsDemo(sessionStorage.getItem("isDemoMode") === "true");
  }, []);

  // 未登录 → 重定向到登录页
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isDemo) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, isDemo, router]);

  // 正式登录但未配置 API Key → 跳转设置页
  useEffect(() => {
    if (!isDemo && pathname !== "/settings" && activeModel && !activeModel.apiKey) {
      router.replace("/settings");
    }
  }, [isDemo, pathname, activeModel, router]);

  // 鉴权检查中或未登录，显示加载态
  if (isLoading || (!isAuthenticated && !isDemo)) {
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
      {/* Demo 模式 Banner */}
      {isDemo && showDemoBanner && (
        <div className="demo-banner">
          <span className="demo-banner__badge">
            <Icon name="lightning" size="0.875em" />
            Demo
          </span>
          <span className="demo-banner__text">正在体验模拟数据，无需配置 API Key</span>
          <button className="demo-banner__close" onClick={() => setShowDemoBanner(false)} aria-label="关闭提示">×</button>
        </div>
      )}

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

      {/* StepNav */}
      <div className="dashboard__stepnav">
        <StepNav />
      </div>

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
