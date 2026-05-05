"use client";

import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="error-fallback">
      <div className="error-fallback__container">
        <div className="error-fallback__icon"><Icon name="compass" size="3rem" /></div>
        <h2 className="error-fallback__title">页面未找到</h2>
        <p className="error-fallback__message">
          抱歉，您访问的页面不存在或已被移除。
        </p>
        <div className="error-fallback__actions">
          <button
            className="btn btn--primary"
            onClick={() => router.push("/")}
          >
            返回首页
          </button>
          <button
            className="btn btn--secondary"
            onClick={() => router.back()}
          >
            返回上一页
          </button>
        </div>
      </div>
    </div>
  );
}
