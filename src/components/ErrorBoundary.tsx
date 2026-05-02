"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
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

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  private handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-fallback">
          <div className="error-fallback__container">
            <div className="error-fallback__icon">⚠️</div>
            <h2 className="error-fallback__title">页面出现了问题</h2>
            <p className="error-fallback__message">
              抱歉，页面加载时遇到了意外错误。请尝试刷新页面或返回上一页。
            </p>
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
                onClick={this.handleReset}
              >
                重试
              </button>
              <button
                className="btn btn--secondary"
                onClick={this.handleReload}
              >
                刷新页面
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
