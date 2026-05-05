import type { ApiResponse } from "@/types";

export class ApiError extends Error {
  code: string;
  status: number;
  requestId?: string;
  details?: unknown;

  constructor(message: string, options: { code: string; status: number; requestId?: string; details?: unknown }) {
    super(message);
    this.name = "ApiError";
    this.code = options.code;
    this.status = options.status;
    this.requestId = options.requestId;
    this.details = options.details;
  }
}

type QueryValue = string | number | boolean | null | undefined;

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  query?: Record<string, QueryValue>;
  skipAuthRefresh?: boolean;
}

interface RefreshTokenPayload {
  accessToken: string;
  expiresIn: number;
}

const DEFAULT_API_BASE_URL = "http://localhost:3001/api/v1";

let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;
let unauthorizedHandler: (() => void) | null = null;

function getApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return (configured && configured.length > 0 ? configured : DEFAULT_API_BASE_URL).replace(/\/$/, "");
}

function createRequestId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `web_${crypto.randomUUID()}`;
  }
  return `web_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${getApiBaseUrl()}${cleanPath}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const text = await response.text();
  if (!text) return { success: response.ok, data: undefined as T };

  try {
    return JSON.parse(text) as ApiResponse<T>;
  } catch {
    return {
      success: false,
      error: { code: "INVALID_JSON", message: "后端返回了无法解析的 JSON" },
    };
  }
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const response = await fetch(buildUrl("/auth/refresh"), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-Request-Id": createRequestId(),
        },
        body: JSON.stringify({ clientType: "web" }),
      });
      const json = await parseResponse<RefreshTokenPayload>(response);
      if (!response.ok || !json.success || !json.data?.accessToken) {
        accessToken = null;
        return null;
      }
      accessToken = json.data.accessToken;
      return accessToken;
    } catch {
      accessToken = null;
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const hasBody = options.body !== undefined;
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  if (hasBody && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (!headers.has("X-Request-Id")) headers.set("X-Request-Id", createRequestId());
  if (accessToken && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(buildUrl(path, options.query), {
    ...options,
    body: hasBody ? (isFormData ? options.body as BodyInit : JSON.stringify(options.body)) : undefined,
    headers,
    credentials: "include",
  });

  if (response.status === 401 && !options.skipAuthRefresh) {
    const nextToken = await refreshAccessToken();
    if (nextToken) return request<T>(path, { ...options, skipAuthRefresh: true });
    unauthorizedHandler?.();
  }

  const json = await parseResponse<T>(response);
  if (!response.ok || !json.success) {
    const error = json.error ?? {
      code: response.status === 403 ? "AUTH_FORBIDDEN" : "REQUEST_FAILED",
      message: response.statusText || "请求失败",
    };
    throw new ApiError(error.message, {
      code: error.code,
      status: response.status,
      requestId: json.requestId,
      details: error.details,
    });
  }

  return json.data as T;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "DELETE" }),
  setAccessToken(token: string | null) {
    accessToken = token;
  },
  getAccessToken() {
    return accessToken;
  },
  clearAccessToken() {
    accessToken = null;
  },
  setUnauthorizedHandler(handler: (() => void) | null) {
    unauthorizedHandler = handler;
  },
  getApiBaseUrl,
  buildUrl,
};
