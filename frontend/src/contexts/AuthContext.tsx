"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiClient } from "@/lib/api/client";
import { authApi, type RegisterResult } from "@/lib/api/auth";
import type { User } from "@/types/auth";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<RegisterResult>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback(() => {
    apiClient.clearAccessToken();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authApi.me();
      setUser(currentUser);
    } catch {
      // 直接 /auth/me 可能因为刷新页面丢失内存 access token 而 401，
      // 此时用 HttpOnly refresh cookie 换新 access token，再读取用户。
      const refreshed = await authApi.refresh();
      apiClient.setAccessToken(refreshed.accessToken);
      const currentUser = await authApi.me();
      setUser(currentUser);
    }
  }, []);

  useEffect(() => {
    apiClient.setUnauthorizedHandler(clearSession);
    return () => apiClient.setUnauthorizedHandler(null);
  }, [clearSession]);

  // 挂载时从独立后端恢复登录态，Refresh Token 只存在 HttpOnly Cookie。
  useEffect(() => {
    async function checkAuth() {
      try {
        await refreshUser();
      } catch {
        clearSession();
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, [clearSession, refreshUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await authApi.login(email, password);
      apiClient.setAccessToken(result.accessToken);
      setUser(result.user);
    },
    []
  );

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      return authApi.register(email, password, name);
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
