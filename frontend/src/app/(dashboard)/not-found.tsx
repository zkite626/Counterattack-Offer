"use client";

import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";

export default function DashboardNotFound() {
  const router = useRouter();

  return (
    <div className="error-fallback">
      <div className="error-fallback__container">
        <div className="error-fallback__icon"><Icon name="compass" size="3rem" /></div>
        <h2 className="error-fallback__title">页面未找到</h2>
        <p className="error-fallback__message">
          您访问的功能页面不存在，请从导航菜单选择其他页面。
        </p>
        <div className="error-fallback__actions">
          <button
            className="btn btn--primary"
            onClick={() => router.push("/profile")}
          >
            前往个人信息
          </button>
        </div>
      </div>
    </div>
  );
}
