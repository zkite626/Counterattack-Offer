"use client";

import { type ReactNode, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/ui/ThemeToggle";
import "./dashboard.css";

const NAV_ITEMS = [
  { path: "/profile", label: "个人信息", icon: "📝" },
  { path: "/diagnosis", label: "画像诊断", icon: "📊" },
  { path: "/translation", label: "经历转译", icon: "🔄" },
  { path: "/job", label: "JD解析", icon: "💼" },
  { path: "/match", label: "人岗匹配", icon: "🎯" },
  { path: "/resume", label: "简历优化", icon: "📄" },
  { path: "/interview", label: "面试训练", icon: "🎤" },
  { path: "/plan", label: "能力计划", icon: "📅" },
  { path: "/report", label: "汇总报告", icon: "📋" },
  { path: "/settings", label: "模型管理", icon: "⚙️" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

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
            ☰
          </button>
          <div className="dashboard__brand">
            <span className="dashboard__logo">🚀</span>
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

      <div className="dashboard__body">
        {/* Sidebar */}
        <aside className={`dashboard__sidebar ${sidebarOpen ? "dashboard__sidebar--open" : ""}`}>
          <nav className="dashboard__nav">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={`dashboard__nav-item ${
                  pathname === item.path ? "dashboard__nav-item--active" : ""
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="dashboard__nav-icon">{item.icon}</span>
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
