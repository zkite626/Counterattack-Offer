"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";
import Icon from "@/components/ui/Icon";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

function readRequestId(error: Error | null): string | null {
  const candidate = error as (Error & { requestId?: string }) | null;

  if (candidate !== null && typeof candidate.requestId === "string") {
    return candidate.requestId;
  }

  return null;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("[ErrorBoundary] 捕获到错误:", error, errorInfo);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      const requestId = readRequestId(this.state.error);

      return (
        <div className="error-fallback">
          <div className="error-fallback__container">
            <div className="error-fallback__icon"><Icon name="triangle-warning" size="3rem" /></div>
            <h2 className="error-fallback__title">页面出现了问题</h2>
            <p className="error-fallback__message">
              抱歉，页面加载时遇到了意外错误。请尝试刷新页面或返回上一页。
            </p>
            {requestId && (
              <p className="error-fallback__message">
                请求编号：{requestId}
              </p>
            )}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="error-fallback__details">
                <summary>错误详情（开发模式）</summary>
                <pre className="error-fallback__stack">
                  {this.state.error.message}
                  {"\n\n"}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            <div className="error-fallback__actions">
              <button
                className="btn btn--primary"
                onClick={this.handleReload}
              >
                重试
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
