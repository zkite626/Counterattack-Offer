import type { ReactNode } from "react";
import "./auth.css";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-layout">
      <div className="auth-layout__bg" />
      <div className="auth-layout__content">
        <div className="auth-layout__brand">
          <picture className="auth-logo auth-logo--light">
            <source srcSet="/logo-wide-light.webp" type="image/webp" />
            <img src="/logo-wide-light.png" alt="逆袭Offer" className="auth-layout__logo" />
          </picture>
          <picture className="auth-logo auth-logo--dark">
            <source srcSet="/logo-wide-dark.webp" type="image/webp" />
            <img src="/logo-wide-dark.png" alt="逆袭Offer" className="auth-layout__logo" />
          </picture>
        </div>
        {children}
      </div>
    </div>
  );
}
