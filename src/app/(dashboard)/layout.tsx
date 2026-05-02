"use client";

import { type ReactNode, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
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
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [showDemoBanner, setShowDemoBanner] = useState(true);

  // 检测 Demo 模式
  useEffect(() => {
    setIsDemo(sessionStorage.getItem("isDemoMode") === "true");
  }, []);

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <div className={`dashboard${isDemo && showDemoBanner ? " dashboard--demo-banner" : ""}`}>
      {/* Demo 模式 Banner */}
      {isDemo && showDemoBanner && (
        <div className="demo-banner">
          <Icon name="lightning" size="1.25em" className="demo-banner__icon" />
          <span>正在使用 Demo 模式，数据为模拟案例 — 体验完整 AI 求职流程</span>
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
            <picture>
              <source srcSet="/logo-square.webp" type="image/webp" />
              <img src="/logo-square.png" alt="逆袭Offer" width={32} height={32} className="dashboard__logo" />
            </picture>
            <span className="dashboard__app-name">逆袭Offer</span>
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
