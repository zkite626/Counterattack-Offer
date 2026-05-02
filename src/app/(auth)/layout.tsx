import type { ReactNode } from "react";
import "./auth.css";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-layout">
      <div className="auth-layout__bg" />
      <div className="auth-layout__content">
        <div className="auth-layout__brand">
          <span className="auth-layout__logo">🚀</span>
          <h1 className="auth-layout__title">逆袭Offer</h1>
          <p className="auth-layout__subtitle">AI 求职突围智能体</p>
        </div>
        {children}
      </div>
    </div>
  );
}
