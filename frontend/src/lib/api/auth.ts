import { apiClient } from "@/lib/api/client";
import type { User } from "@/types/auth";

export interface LoginResult {
  accessToken: string;
  expiresIn: number;
  user: User;
}

export interface RegisterResult {
  user: User;
  requiresEmailVerification: boolean;
}

export interface MessageResult {
  message: string;
}

export interface ChangeEmailResult {
  message: string;
  user: User;
}

export const authApi = {
  async login(email: string, password: string): Promise<LoginResult> {
    return apiClient.post<LoginResult>("/auth/login", {
      email,
      password,
      clientType: "web",
    });
  },

  async register(email: string, password: string, name: string): Promise<RegisterResult> {
    return apiClient.post<RegisterResult>("/auth/register", { email, password, name });
  },

  async refresh(): Promise<{ accessToken: string; expiresIn: number }> {
    return apiClient.post<{ accessToken: string; expiresIn: number }>("/auth/refresh", {
      clientType: "web",
    }, { skipAuthRefresh: true });
  },

  async me(): Promise<User> {
    const result = await apiClient.get<{ user: User }>("/auth/me");
    return result.user;
  },

  async logout(): Promise<MessageResult> {
    return apiClient.post<MessageResult>("/auth/logout", { clientType: "web" }, { skipAuthRefresh: true });
  },

  async verifyEmail(token: string): Promise<MessageResult> {
    return apiClient.post<MessageResult>("/auth/verify-email", { token }, { skipAuthRefresh: true });
  },

  async resendVerification(): Promise<MessageResult> {
    return apiClient.post<MessageResult>("/auth/resend-verification");
  },

  async forgotPassword(email: string): Promise<MessageResult> {
    return apiClient.post<MessageResult>("/auth/forgot-password", { email }, { skipAuthRefresh: true });
  },

  async resetPassword(token: string, newPassword: string): Promise<MessageResult> {
    return apiClient.post<MessageResult>("/auth/reset-password", { token, newPassword }, { skipAuthRefresh: true });
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<MessageResult> {
    return apiClient.post<MessageResult>("/auth/change-password", {
      currentPassword,
      newPassword,
    });
  },

  async changeEmail(currentPassword: string, newEmail: string): Promise<ChangeEmailResult> {
    return apiClient.post<ChangeEmailResult>("/auth/change-email", {
      currentPassword,
      newEmail,
    });
  },
};
