"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password, rememberMe);
      router.push("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "登录失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <h2 className="auth-card__title">欢迎回来</h2>
      <form className="auth-card__form" onSubmit={handleSubmit}>
        {error && <div className="auth-card__error">{error}</div>}
        <Input
          label="邮箱"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="密码"
          type="password"
          placeholder="输入密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="auth-card__row">
          <label className="auth-card__checkbox">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            记住我
          </label>
        </div>
        <Button type="submit" fullWidth loading={loading}>
          登录
        </Button>
      </form>
      <div className="auth-card__footer">
        还没有账号？
        <a href="/register" className="auth-card__link" style={{ marginLeft: 4 }}>
          立即注册
        </a>
      </div>
    </div>
  );
}
