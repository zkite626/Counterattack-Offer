(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/src/contexts/ThemeContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider,
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const ThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const STORAGE_KEY = "theme";
// 解析系统主题偏好
function getSystemTheme() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
// 将主题应用到 DOM
function applyTheme(theme) {
    const resolved = theme === "system" ? getSystemTheme() : theme;
    document.documentElement.setAttribute("data-theme", resolved);
    return resolved;
}
function ThemeProvider({ children }) {
    _s();
    const [theme, setThemeState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("system");
    const [resolvedTheme, setResolvedTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("light");
    // 初始化：从 localStorage 读取
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            const stored = localStorage.getItem(STORAGE_KEY);
            const initial = stored || "system";
            setThemeState(initial);
            const resolved = applyTheme(initial);
            setResolvedTheme(resolved);
        }
    }["ThemeProvider.useEffect"], []);
    // 监听系统主题变化
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            if (theme !== "system") return;
            const mql = window.matchMedia("(prefers-color-scheme: dark)");
            const handler = {
                "ThemeProvider.useEffect.handler": ()=>{
                    const resolved = applyTheme("system");
                    setResolvedTheme(resolved);
                }
            }["ThemeProvider.useEffect.handler"];
            mql.addEventListener("change", handler);
            return ({
                "ThemeProvider.useEffect": ()=>mql.removeEventListener("change", handler)
            })["ThemeProvider.useEffect"];
        }
    }["ThemeProvider.useEffect"], [
        theme
    ]);
    const setTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ThemeProvider.useCallback[setTheme]": (newTheme)=>{
            setThemeState(newTheme);
            const resolved = applyTheme(newTheme);
            setResolvedTheme(resolved);
            localStorage.setItem(STORAGE_KEY, newTheme);
        }
    }["ThemeProvider.useCallback[setTheme]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
        value: {
            theme,
            resolvedTheme,
            setTheme
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/frontend/src/contexts/ThemeContext.tsx",
        lineNumber: 74,
        columnNumber: 5
    }, this);
}
_s(ThemeProvider, "M51GnTcNBLEQ8fIW1ww+o3q6daU=");
_c = ThemeProvider;
function useTheme() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
    return ctx;
}
_s1(useTheme, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/lib/api/client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApiError",
    ()=>ApiError,
    "apiClient",
    ()=>apiClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
class ApiError extends Error {
    code;
    status;
    requestId;
    details;
    constructor(message, options){
        super(message);
        this.name = "ApiError";
        this.code = options.code;
        this.status = options.status;
        this.requestId = options.requestId;
        this.details = options.details;
    }
}
const DEFAULT_API_BASE_URL = "http://localhost:3001/api/v1";
let accessToken = null;
let refreshPromise = null;
let unauthorizedHandler = null;
function getApiBaseUrl() {
    const configured = ("TURBOPACK compile-time value", "http://localhost:3001/api/v1")?.trim();
    return (configured && configured.length > 0 ? configured : DEFAULT_API_BASE_URL).replace(/\/$/, "");
}
function createRequestId() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return `web_${crypto.randomUUID()}`;
    }
    return `web_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}
function buildUrl(path, query) {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const url = new URL(`${getApiBaseUrl()}${cleanPath}`);
    if (query) {
        Object.entries(query).forEach(([key, value])=>{
            if (value !== undefined && value !== null && value !== "") {
                url.searchParams.set(key, String(value));
            }
        });
    }
    return url.toString();
}
async function parseResponse(response) {
    const text = await response.text();
    if (!text) return {
        success: response.ok,
        data: undefined
    };
    try {
        return JSON.parse(text);
    } catch  {
        return {
            success: false,
            error: {
                code: "INVALID_JSON",
                message: "后端返回了无法解析的 JSON"
            }
        };
    }
}
async function refreshAccessToken() {
    if (refreshPromise) return refreshPromise;
    refreshPromise = (async ()=>{
        try {
            const response = await fetch(buildUrl("/auth/refresh"), {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-Request-Id": createRequestId()
                },
                body: JSON.stringify({
                    clientType: "web"
                })
            });
            const json = await parseResponse(response);
            if (!response.ok || !json.success || !json.data?.accessToken) {
                accessToken = null;
                return null;
            }
            accessToken = json.data.accessToken;
            return accessToken;
        } catch  {
            accessToken = null;
            return null;
        } finally{
            refreshPromise = null;
        }
    })();
    return refreshPromise;
}
async function request(path, options = {}) {
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
        body: hasBody ? isFormData ? options.body : JSON.stringify(options.body) : undefined,
        headers,
        credentials: "include"
    });
    if (response.status === 401 && !options.skipAuthRefresh) {
        const nextToken = await refreshAccessToken();
        if (nextToken) return request(path, {
            ...options,
            skipAuthRefresh: true
        });
        unauthorizedHandler?.();
    }
    const json = await parseResponse(response);
    if (!response.ok || !json.success) {
        const error = json.error ?? {
            code: response.status === 403 ? "AUTH_FORBIDDEN" : "REQUEST_FAILED",
            message: response.statusText || "请求失败"
        };
        throw new ApiError(error.message, {
            code: error.code,
            status: response.status,
            requestId: json.requestId,
            details: error.details
        });
    }
    return json.data;
}
const apiClient = {
    get: (path, options)=>request(path, {
            ...options,
            method: "GET"
        }),
    post: (path, body, options)=>request(path, {
            ...options,
            method: "POST",
            body
        }),
    put: (path, body, options)=>request(path, {
            ...options,
            method: "PUT",
            body
        }),
    patch: (path, body, options)=>request(path, {
            ...options,
            method: "PATCH",
            body
        }),
    delete: (path, options)=>request(path, {
            ...options,
            method: "DELETE"
        }),
    setAccessToken (token) {
        accessToken = token;
    },
    getAccessToken () {
        return accessToken;
    },
    clearAccessToken () {
        accessToken = null;
    },
    setUnauthorizedHandler (handler) {
        unauthorizedHandler = handler;
    },
    getApiBaseUrl,
    buildUrl
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/lib/api/auth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authApi",
    ()=>authApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/api/client.ts [app-client] (ecmascript)");
;
const authApi = {
    async login (email, password) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post("/auth/login", {
            email,
            password,
            clientType: "web"
        });
    },
    async register (email, password, name) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post("/auth/register", {
            email,
            password,
            name
        });
    },
    async refresh () {
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post("/auth/refresh", {
            clientType: "web"
        }, {
            skipAuthRefresh: true
        });
    },
    async me () {
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get("/auth/me");
        return result.user;
    },
    async logout () {
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post("/auth/logout", {
            clientType: "web"
        }, {
            skipAuthRefresh: true
        });
    },
    async verifyEmail (token) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post("/auth/verify-email", {
            token
        }, {
            skipAuthRefresh: true
        });
    },
    async resendVerification () {
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post("/auth/resend-verification");
    },
    async forgotPassword (email) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post("/auth/forgot-password", {
            email
        }, {
            skipAuthRefresh: true
        });
    },
    async resetPassword (token, newPassword) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post("/auth/reset-password", {
            token,
            newPassword
        }, {
            skipAuthRefresh: true
        });
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/contexts/AuthContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/api/client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/api/auth.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const clearSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[clearSession]": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].clearAccessToken();
            setUser(null);
        }
    }["AuthProvider.useCallback[clearSession]"], []);
    const refreshUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[refreshUser]": async ()=>{
            try {
                const currentUser = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authApi"].me();
                setUser(currentUser);
            } catch  {
                // 直接 /auth/me 可能因为刷新页面丢失内存 access token 而 401，
                // 此时用 HttpOnly refresh cookie 换新 access token，再读取用户。
                const refreshed = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authApi"].refresh();
                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].setAccessToken(refreshed.accessToken);
                const currentUser = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authApi"].me();
                setUser(currentUser);
            }
        }
    }["AuthProvider.useCallback[refreshUser]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].setUnauthorizedHandler(clearSession);
            return ({
                "AuthProvider.useEffect": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].setUnauthorizedHandler(null)
            })["AuthProvider.useEffect"];
        }
    }["AuthProvider.useEffect"], [
        clearSession
    ]);
    // 挂载时从独立后端恢复登录态，Refresh Token 只存在 HttpOnly Cookie。
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            async function checkAuth() {
                try {
                    await refreshUser();
                } catch  {
                    clearSession();
                } finally{
                    setIsLoading(false);
                }
            }
            checkAuth();
        }
    }["AuthProvider.useEffect"], [
        clearSession,
        refreshUser
    ]);
    const login = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[login]": async (email, password)=>{
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authApi"].login(email, password);
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].setAccessToken(result.accessToken);
            setUser(result.user);
        }
    }["AuthProvider.useCallback[login]"], []);
    const register = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[register]": async (email, password, name)=>{
            return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authApi"].register(email, password, name);
        }
    }["AuthProvider.useCallback[register]"], []);
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[logout]": async ()=>{
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authApi"].logout();
            } finally{
                clearSession();
            }
        }
    }["AuthProvider.useCallback[logout]"], [
        clearSession
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuthProvider.useMemo[value]": ()=>({
                user,
                isLoading,
                isAuthenticated: !!user,
                isAdmin: user?.role === "admin",
                login,
                register,
                logout,
                refreshUser
            })
    }["AuthProvider.useMemo[value]"], [
        user,
        isLoading,
        login,
        register,
        logout,
        refreshUser
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/frontend/src/contexts/AuthContext.tsx",
        lineNumber: 109,
        columnNumber: 10
    }, this);
}
_s(AuthProvider, "Oz91Kvcyz0px80KOrxdqjpb3nWc=");
_c = AuthProvider;
function useAuth() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
_s1(useAuth, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/lib/api/ai.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "aiApi",
    ()=>aiApi,
    "normalizeModel",
    ()=>normalizeModel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/api/client.ts [app-client] (ecmascript)");
;
function normalizeModel(model, activeModelId) {
    return {
        ...model,
        name: model.displayName,
        isBuiltin: model.scope === "global",
        isActive: model.id === activeModelId
    };
}
const aiApi = {
    async listModels () {
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get("/ai/models");
    },
    async createModel (payload) {
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post("/ai/models", payload);
        return result.model;
    },
    async updateModel (id, payload) {
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].patch(`/ai/models/${id}`, payload);
        return result.model;
    },
    async deleteModel (id) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].delete(`/ai/models/${id}`);
    },
    async testModel (id) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post(`/ai/models/${id}/test`);
    },
    async setDefault (id) {
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post(`/ai/models/${id}/set-default`);
        return result.model;
    },
    async run (modulePath, input, runId, modelConfigId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post(`/ai/${modulePath}`, {
            runId: runId ?? undefined,
            modelConfigId: modelConfigId ?? undefined,
            input
        });
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/contexts/AIContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AIProvider",
    ()=>AIProvider,
    "useAI",
    ()=>useAI
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$ai$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/api/ai.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const AIContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AIProvider({ children }) {
    _s();
    const [userModels, setUserModels] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [globalModels, setGlobalModels] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [activeModelId, setActiveModelIdState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [fallbackToGlobal, setFallbackToGlobal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [envConfigLoaded, setEnvConfigLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const refreshModels = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AIProvider.useCallback[refreshModels]": async ()=>{
            setIsLoading(true);
            setError(null);
            try {
                const payload = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$ai$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["aiApi"].listModels();
                const activeId = payload.activeModelId ?? payload.userModels.find({
                    "AIProvider.useCallback[refreshModels]": (model)=>model.isDefault
                }["AIProvider.useCallback[refreshModels]"])?.id ?? payload.globalModels.find({
                    "AIProvider.useCallback[refreshModels]": (model)=>model.isDefault
                }["AIProvider.useCallback[refreshModels]"])?.id ?? payload.userModels[0]?.id ?? payload.globalModels[0]?.id ?? "";
                setActiveModelIdState(activeId);
                setFallbackToGlobal(payload.fallbackToGlobal);
                setUserModels(payload.userModels.map({
                    "AIProvider.useCallback[refreshModels]": (model)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$ai$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeModel"])(model, activeId)
                }["AIProvider.useCallback[refreshModels]"]));
                setGlobalModels(payload.globalModels.map({
                    "AIProvider.useCallback[refreshModels]": (model)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$ai$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeModel"])(model, activeId)
                }["AIProvider.useCallback[refreshModels]"]));
            } catch (err) {
                setError(err instanceof Error ? err.message : "模型列表加载失败");
                setUserModels([]);
                setGlobalModels([]);
                setActiveModelIdState("");
            } finally{
                setIsLoading(false);
                setEnvConfigLoaded(true);
            }
        }
    }["AIProvider.useCallback[refreshModels]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AIProvider.useEffect": ()=>{
            refreshModels();
        }
    }["AIProvider.useEffect"], [
        refreshModels
    ]);
    const addModel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AIProvider.useCallback[addModel]": async (input)=>{
            await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$ai$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["aiApi"].createModel(input);
            await refreshModels();
        }
    }["AIProvider.useCallback[addModel]"], [
        refreshModels
    ]);
    const updateModel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AIProvider.useCallback[updateModel]": async (id, updates)=>{
            await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$ai$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["aiApi"].updateModel(id, updates);
            await refreshModels();
        }
    }["AIProvider.useCallback[updateModel]"], [
        refreshModels
    ]);
    const removeModel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AIProvider.useCallback[removeModel]": async (id)=>{
            await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$ai$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["aiApi"].deleteModel(id);
            await refreshModels();
        }
    }["AIProvider.useCallback[removeModel]"], [
        refreshModels
    ]);
    const setActiveModel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AIProvider.useCallback[setActiveModel]": async (id)=>{
            await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$ai$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["aiApi"].setDefault(id);
            await refreshModels();
        }
    }["AIProvider.useCallback[setActiveModel]"], [
        refreshModels
    ]);
    const testModel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AIProvider.useCallback[testModel]": async (id)=>{
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$ai$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["aiApi"].testModel(id);
            await refreshModels();
            return {
                success: result.success,
                message: result.success ? `连接成功，耗时 ${result.latencyMs}ms` : result.errorCode ?? "连接失败"
            };
        }
    }["AIProvider.useCallback[testModel]"], [
        refreshModels
    ]);
    const models = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AIProvider.useMemo[models]": ()=>[
                ...userModels,
                ...globalModels
            ]
    }["AIProvider.useMemo[models]"], [
        userModels,
        globalModels
    ]);
    const activeModel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AIProvider.useMemo[activeModel]": ()=>models.find({
                "AIProvider.useMemo[activeModel]": (model)=>model.id === activeModelId
            }["AIProvider.useMemo[activeModel]"]) ?? null
    }["AIProvider.useMemo[activeModel]"], [
        models,
        activeModelId
    ]);
    const getModelConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AIProvider.useCallback[getModelConfig]": (id)=>models.find({
                "AIProvider.useCallback[getModelConfig]": (model)=>model.id === id
            }["AIProvider.useCallback[getModelConfig]"])
    }["AIProvider.useCallback[getModelConfig]"], [
        models
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AIProvider.useMemo[value]": ()=>({
                models,
                userModels,
                globalModels,
                activeModelId,
                activeModel,
                envConfigLoaded,
                isLoading,
                error,
                fallbackToGlobal,
                addModel,
                updateModel,
                removeModel,
                setActiveModel,
                testModel,
                refreshModels,
                getModelConfig
            })
    }["AIProvider.useMemo[value]"], [
        models,
        userModels,
        globalModels,
        activeModelId,
        activeModel,
        envConfigLoaded,
        isLoading,
        error,
        fallbackToGlobal,
        addModel,
        updateModel,
        removeModel,
        setActiveModel,
        testModel,
        refreshModels,
        getModelConfig
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AIContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/frontend/src/contexts/AIContext.tsx",
        lineNumber: 170,
        columnNumber: 10
    }, this);
}
_s(AIProvider, "SnkMoNGyYjqZYACVPXvMJ3uBrzM=");
_c = AIProvider;
function useAI() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AIContext);
    if (!ctx) throw new Error("useAI must be used within AIProvider");
    return ctx;
}
_s1(useAI, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "AIProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/lib/utils/ai-results.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "normalizeCareerDiagnosis",
    ()=>normalizeCareerDiagnosis,
    "normalizeImprovementPlan",
    ()=>normalizeImprovementPlan,
    "normalizeInterviewSimulations",
    ()=>normalizeInterviewSimulations,
    "normalizeJobAnalysis",
    ()=>normalizeJobAnalysis,
    "normalizeMatchReport",
    ()=>normalizeMatchReport
]);
const DEFAULT_SCORE_CRITERIA = [
    "回答内容与岗位要求的相关性",
    "表达的逻辑性和条理性",
    "具体事例和细节的充分程度",
    "自我认知和反思能力"
];
const MATCH_DIMENSIONS = [
    {
        dimension: "岗位能力",
        aliases: [
            "岗位能力",
            "能力匹配",
            "核心能力",
            "岗位能力匹配"
        ],
        fallbackDelta: 0,
        reason: "根据岗位核心能力要求与当前画像综合评估。"
    },
    {
        dimension: "经历相关",
        aliases: [
            "经历相关",
            "经历相关性",
            "经验匹配",
            "实践经历",
            "运营经验"
        ],
        fallbackDelta: -5,
        reason: "评估校园经历、项目经历与目标岗位任务的迁移程度。"
    },
    {
        dimension: "技能工具",
        aliases: [
            "技能工具",
            "工具技能",
            "数据能力",
            "专业技能",
            "硬技能"
        ],
        fallbackDelta: -8,
        reason: "评估办公工具、数据处理和岗位基础技能储备。"
    },
    {
        dimension: "沟通协作",
        aliases: [
            "沟通协作",
            "沟通表达",
            "协作能力",
            "软性能力"
        ],
        fallbackDelta: 3,
        reason: "评估表达、协作、反馈和跨角色沟通能力。"
    },
    {
        dimension: "学习潜力",
        aliases: [
            "学习潜力",
            "学习能力",
            "成长潜力",
            "可培养性"
        ],
        fallbackDelta: 8,
        reason: "评估短期补齐能力、主动学习和适应新任务的空间。"
    },
    {
        dimension: "投递风险",
        aliases: [
            "投递风险",
            "风险可控",
            "风险控制",
            "短板风险",
            "稳定性"
        ],
        fallbackDelta: -10,
        reason: "评估短板暴露、竞争强度和面试可解释风险。"
    }
];
function isRecord(value) {
    return !!value && typeof value === "object" && !Array.isArray(value);
}
function unwrapRecord(raw, keys) {
    if (!isRecord(raw)) return null;
    for (const key of keys){
        const nested = raw[key];
        if (isRecord(nested)) return nested;
    }
    return raw;
}
function pick(record, keys) {
    for (const key of keys){
        if (record[key] !== undefined && record[key] !== null) return record[key];
    }
    return undefined;
}
function toText(value) {
    if (typeof value === "string") return value.trim();
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    return "";
}
function toNumber(value, fallback = 0) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return Math.max(0, Math.min(100, Math.round(value)));
    }
    if (typeof value === "string") {
        const match = value.match(/\d+(?:\.\d+)?/);
        if (match) return Math.max(0, Math.min(100, Math.round(Number(match[0]))));
    }
    return fallback;
}
function normalizeTextArray(value) {
    if (Array.isArray(value)) {
        return value.flatMap((item)=>{
            if (isRecord(item)) {
                const day = toText(pick(item, [
                    "day",
                    "date",
                    "天",
                    "日期"
                ]));
                const task = toText(pick(item, [
                    "task",
                    "action",
                    "todo",
                    "content",
                    "description",
                    "任务",
                    "行动"
                ]));
                if (day && task) return `第${day.replace(/^第|天$/g, "")}天：${task}`;
                return toText(pick(item, [
                    "text",
                    "content",
                    "name",
                    "title",
                    "requirement",
                    "description",
                    "ability",
                    "task",
                    "criteria",
                    "criterion",
                    "point",
                    "item",
                    "标准",
                    "要点",
                    "能力",
                    "任务",
                    "内容"
                ]));
            }
            return toText(item);
        }).filter(Boolean);
    }
    if (typeof value === "string") {
        return value.split(/\n|；|;/).map((item)=>item.replace(/^\s*[-*、\d.）)]+\s*/, "").trim()).filter(Boolean);
    }
    if (isRecord(value)) {
        return Object.values(value).flatMap(normalizeTextArray).filter(Boolean);
    }
    return [];
}
function normalizeImportance(value) {
    const text = toText(value);
    if (text.includes("高") && text.includes("中")) return "中高";
    if (text === "高" || text.includes("非常高") || text.includes("重要")) return "高";
    if (text === "低" || text.includes("较低")) return "低";
    return "中";
}
function normalizeAbility(value) {
    if (typeof value === "string") {
        const ability = value.trim();
        return ability ? {
            ability,
            importance: "中"
        } : null;
    }
    if (!isRecord(value)) return null;
    const ability = toText(pick(value, [
        "ability",
        "name",
        "title",
        "requirement",
        "能力",
        "核心能力",
        "能力项"
    ]));
    if (!ability) return null;
    return {
        ability,
        importance: normalizeImportance(pick(value, [
            "importance",
            "level",
            "score",
            "重要性",
            "等级"
        ]))
    };
}
function normalizeCoreAbilities(value) {
    if (Array.isArray(value)) {
        return value.map(normalizeAbility).filter((item)=>!!item);
    }
    if (isRecord(value)) {
        return Object.entries(value).map(([ability, importance])=>({
                ability,
                importance: normalizeImportance(importance)
            })).filter((item)=>item.ability.trim());
    }
    return normalizeTextArray(value).map((ability)=>({
            ability,
            importance: "中"
        }));
}
function normalizeJobAnalysis(raw) {
    const record = unwrapRecord(raw, [
        "jobAnalysis",
        "analysis",
        "result",
        "data",
        "岗位解析"
    ]);
    if (!record) return null;
    const jobTitle = toText(pick(record, [
        "jobTitle",
        "title",
        "position",
        "jobName",
        "岗位名称",
        "岗位",
        "职位"
    ]));
    if (!jobTitle) return null;
    const coreAbilities = normalizeCoreAbilities(pick(record, [
        "coreAbilities",
        "abilityModel",
        "abilities",
        "核心能力",
        "核心能力要求",
        "能力模型"
    ]));
    const hardRequirements = normalizeTextArray(pick(record, [
        "hardRequirements",
        "mustHave",
        "requiredSkills",
        "qualifications",
        "requirements",
        "硬性要求",
        "任职要求",
        "岗位要求",
        "必要条件"
    ]));
    const softRequirements = normalizeTextArray(pick(record, [
        "softRequirements",
        "softSkills",
        "competencies",
        "软性要求",
        "素质要求",
        "通用能力"
    ]));
    const bonusPoints = normalizeTextArray(pick(record, [
        "bonusPoints",
        "niceToHave",
        "preferredQualifications",
        "加分项",
        "优先条件",
        "优先"
    ]));
    const hiddenExpectations = normalizeTextArray(pick(record, [
        "hiddenExpectations",
        "hiddenRequirements",
        "implicitRequirements",
        "隐性期待",
        "隐性要求",
        "面试关注点"
    ]));
    return {
        jobTitle,
        hardRequirements: hardRequirements.length ? hardRequirements : coreAbilities.slice(0, 3).map((item)=>`具备${item.ability}相关能力`),
        softRequirements: softRequirements.length ? softRequirements : [
            "沟通表达清晰，能主动协作推进任务",
            "具备学习意愿和基础执行力"
        ],
        bonusPoints,
        coreAbilities,
        hiddenExpectations: hiddenExpectations.length ? hiddenExpectations : [
            "面试中会关注候选人是否能用真实经历证明岗位相关能力",
            "希望候选人能快速理解任务目标并主动反馈进展"
        ]
    };
}
function normalizePriority(value, score) {
    const text = toText(value).toLowerCase();
    if ([
        "safe",
        "稳妥",
        "保底",
        "低风险"
    ].some((item)=>text.includes(item))) return "safe";
    if ([
        "challenge",
        "挑战",
        "冲刺",
        "高挑战"
    ].some((item)=>text.includes(item))) return "challenge";
    if ([
        "recommended",
        "recommend",
        "推荐",
        "优先"
    ].some((item)=>text.includes(item))) return "recommended";
    if (score >= 75) return "recommended";
    if (score >= 60) return "safe";
    return "challenge";
}
function normalizeRecommendedRole(value) {
    if (!isRecord(value)) {
        const role = toText(value);
        return role ? {
            role,
            reason: "与当前经历和求职目标有一定关联",
            fitScore: 60,
            priority: "safe"
        } : null;
    }
    const role = toText(pick(value, [
        "role",
        "name",
        "title",
        "jobTitle",
        "岗位",
        "岗位名",
        "方向"
    ]));
    if (!role) return null;
    const fitScore = toNumber(pick(value, [
        "fitScore",
        "score",
        "matchScore",
        "匹配度",
        "匹配分"
    ]), 60);
    return {
        role,
        reason: toText(pick(value, [
            "reason",
            "description",
            "推荐理由",
            "理由"
        ])) || "与当前经历和求职目标有一定关联",
        fitScore,
        priority: normalizePriority(pick(value, [
            "priority",
            "level",
            "type",
            "标签",
            "优先级"
        ]), fitScore)
    };
}
function normalizeCareerDiagnosis(raw) {
    const record = unwrapRecord(raw, [
        "careerDiagnosis",
        "diagnosis",
        "result",
        "data",
        "画像诊断"
    ]);
    if (!record) return null;
    const recommendedRoles = normalizeTextArray(pick(record, [
        "recommendedRoles",
        "roles",
        "推荐岗位",
        "适配岗位"
    ])).map((role)=>normalizeRecommendedRole(role)).filter((role)=>!!role);
    const roleRecords = pick(record, [
        "recommendedRoles",
        "roles",
        "推荐岗位",
        "适配岗位"
    ]);
    const normalizedRoles = (Array.isArray(roleRecords) ? roleRecords.map(normalizeRecommendedRole) : recommendedRoles).filter((role)=>!!role).sort((a, b)=>b.fitScore - a.fitScore);
    return {
        studentType: toText(pick(record, [
            "studentType",
            "type",
            "学生类型",
            "画像类型"
        ])) || "低经验求职探索型学生",
        summary: toText(pick(record, [
            "summary",
            "overview",
            "diagnosisSummary",
            "整体诊断概述",
            "总结"
        ])) || "",
        coreStrengths: normalizeTextArray(pick(record, [
            "coreStrengths",
            "strengths",
            "优势",
            "核心优势"
        ])),
        mainWeaknesses: normalizeTextArray(pick(record, [
            "mainWeaknesses",
            "weaknesses",
            "gaps",
            "短板",
            "主要短板"
        ])),
        recommendedRoles: normalizedRoles,
        careerAdvice: toText(pick(record, [
            "careerAdvice",
            "advice",
            "综合建议",
            "建议"
        ])) || ""
    };
}
function normalizeDimension(value) {
    if (!isRecord(value)) return null;
    const dimension = toText(pick(value, [
        "dimension",
        "name",
        "title",
        "维度",
        "评分维度"
    ]));
    if (!dimension) return null;
    return {
        dimension,
        score: toNumber(pick(value, [
            "score",
            "value",
            "匹配分",
            "得分"
        ]), 60),
        reason: toText(pick(value, [
            "reason",
            "description",
            "原因",
            "理由"
        ])) || "与学生现有经历存在一定关联"
    };
}
function completeSixDimensions(dimensions, overallMatchScore) {
    return MATCH_DIMENSIONS.map((target)=>{
        const matched = dimensions.find((item)=>target.aliases.some((alias)=>item.dimension.includes(alias) || alias.includes(item.dimension)));
        if (matched) {
            return {
                ...matched,
                dimension: target.dimension,
                reason: matched.reason || target.reason
            };
        }
        return {
            dimension: target.dimension,
            score: Math.max(0, Math.min(100, overallMatchScore + target.fallbackDelta)),
            reason: target.reason
        };
    });
}
function normalizeMatchReport(raw) {
    const record = unwrapRecord(raw, [
        "matchReport",
        "report",
        "result",
        "data",
        "匹配报告"
    ]);
    if (!record) return null;
    const overallMatchScore = toNumber(pick(record, [
        "overallMatchScore",
        "score",
        "matchScore",
        "totalScore",
        "整体匹配度",
        "总分"
    ]), 60);
    const dimensionRaw = pick(record, [
        "dimensionScores",
        "dimensions",
        "scores",
        "维度评分",
        "匹配维度"
    ]);
    const dimensionScores = (Array.isArray(dimensionRaw) ? dimensionRaw.map(normalizeDimension) : isRecord(dimensionRaw) ? Object.entries(dimensionRaw).map(([dimension, value])=>({
            dimension,
            score: toNumber(isRecord(value) ? pick(value, [
                "score",
                "value",
                "得分"
            ]) : value, overallMatchScore),
            reason: isRecord(value) ? toText(pick(value, [
                "reason",
                "description",
                "原因"
            ])) : "综合评估得分"
        })) : []).filter((item)=>!!item);
    const sixDimensions = completeSixDimensions(dimensionScores, overallMatchScore);
    const advantages = normalizeTextArray(pick(record, [
        "advantages",
        "strengths",
        "优势",
        "匹配优势"
    ]));
    const gaps = normalizeTextArray(pick(record, [
        "gaps",
        "weaknesses",
        "risks",
        "差距",
        "短板"
    ]));
    return {
        overallMatchScore,
        matchLevel: toText(pick(record, [
            "matchLevel",
            "level",
            "匹配等级",
            "匹配结论"
        ])) || scoreToMatchLevel(overallMatchScore),
        dimensionScores: sixDimensions,
        advantages: advantages.length ? advantages : [
            `${sixDimensions[3].dimension}得分 ${sixDimensions[3].score}，说明沟通表达和协作基础可用于岗位切入。`,
            `${sixDimensions[4].dimension}得分 ${sixDimensions[4].score}，短期补齐岗位知识的空间较好。`,
            "已有经历可以通过 STAR 法则转译为岗位相关案例，适合低经验求职起步。"
        ],
        gaps: gaps.length ? gaps : [
            `${sixDimensions[2].dimension}仍需补强，建议补齐岗位常用工具和数据处理方法。`,
            `${sixDimensions[1].dimension}需要更多量化成果支撑，简历中应补充过程、数据和复盘。`,
            "面试中可能被追问正式实习不足，需要提前准备真实经历的解释和迁移逻辑。"
        ],
        applicationStrategy: toText(pick(record, [
            "applicationStrategy",
            "strategy",
            "投递策略",
            "求职策略"
        ])) || "优先选择匹配度较高的岗位，并围绕真实经历准备 2-3 个结构化案例。",
        riskWarning: toText(pick(record, [
            "riskWarning",
            "warning",
            "risks",
            "风险提醒",
            "避坑提醒"
        ])) || ""
    };
}
function scoreToMatchLevel(score) {
    if (score >= 90) return "高度匹配";
    if (score >= 75) return "较匹配";
    if (score >= 60) return "部分匹配";
    return "暂不建议优先投递";
}
function normalizeImprovementPlan(raw) {
    const record = unwrapRecord(raw, [
        "improvementPlan",
        "plan",
        "result",
        "data",
        "行动计划",
        "能力补齐计划"
    ]);
    if (!record) return null;
    const targetRole = toText(pick(record, [
        "targetRole",
        "role",
        "jobTitle",
        "目标岗位",
        "岗位"
    ])) || "目标岗位";
    const sevenDayPlan = normalizeTextArray(pick(record, [
        "sevenDayPlan",
        "firstWeek",
        "week1",
        "第1周",
        "7天计划",
        "一周计划"
    ]));
    const fourteenDayPlan = normalizeTextArray(pick(record, [
        "fourteenDayPlan",
        "secondWeek",
        "week2",
        "第2周",
        "14天计划",
        "两周计划"
    ]));
    const thirtyDayPlan = normalizeTextArray(pick(record, [
        "thirtyDayPlan",
        "weeks3And4",
        "week3",
        "week4",
        "第3周",
        "第4周",
        "30天计划",
        "一个月计划"
    ]));
    const recommendedOutputs = normalizeTextArray(pick(record, [
        "recommendedOutputs",
        "outputs",
        "deliverables",
        "推荐产出",
        "产出清单"
    ]));
    return {
        targetRole,
        goal: toText(pick(record, [
            "goal",
            "summary",
            "目标概述",
            "总目标"
        ])) || `围绕${targetRole}补齐岗位认知、项目表达和面试准备。`,
        sevenDayPlan: sevenDayPlan.length ? sevenDayPlan : [
            "第1天：拆解目标岗位 JD，整理 5 个高频能力关键词",
            "第2-3天：用 STAR 法则重写 2 段最相关经历",
            "第4-7天：补齐岗位基础知识并输出一页学习笔记"
        ],
        fourteenDayPlan: fourteenDayPlan.length ? fourteenDayPlan : [
            "第8-10天：完成一个与目标岗位相关的小项目或案例分析",
            "第11-12天：整理项目过程、数据和复盘结论",
            "第13-14天：更新简历并准备 3 个面试故事"
        ],
        thirtyDayPlan: thirtyDayPlan.length ? thirtyDayPlan : [
            "第15-21天：定向投递 10-15 个匹配岗位并记录反馈",
            "第22-26天：根据反馈优化简历和自我介绍",
            "第27-30天：完成 2 次模拟面试并复盘薄弱问题"
        ],
        recommendedOutputs: recommendedOutputs.length ? recommendedOutputs : [
            "岗位能力关键词清单",
            "STAR 经历素材库",
            "目标岗位小项目复盘",
            "一版可投递简历"
        ]
    };
}
function normalizeInterviewItem(value) {
    if (!isRecord(value)) return null;
    const mainQuestion = toText(pick(value, [
        "mainQuestion",
        "question",
        "title",
        "主问题",
        "问题"
    ]));
    if (!mainQuestion) return null;
    return {
        questionType: toText(pick(value, [
            "questionType",
            "type",
            "category",
            "题型",
            "类型"
        ])) || "综合面试",
        mainQuestion,
        followUpQuestions: normalizeTextArray(pick(value, [
            "followUpQuestions",
            "followUps",
            "追问",
            "连续追问"
        ])),
        answerStructure: toText(pick(value, [
            "answerStructure",
            "structure",
            "framework",
            "回答结构",
            "推荐回答结构"
        ])) || "建议使用 STAR 法则：情境(Situation) → 任务(Task) → 行动(Action) → 结果(Result)",
        sampleAnswer: toText(pick(value, [
            "sampleAnswer",
            "answer",
            "示例答案",
            "参考答案"
        ])) || "请结合自己的真实经历，用具体场景和行动细节回答。",
        scoreCriteria: normalizeTextArray(pick(value, [
            "scoreCriteria",
            "scoringCriteria",
            "criteria",
            "evaluationCriteria",
            "评分标准",
            "评价标准",
            "评分要点"
        ]))
    };
}
function normalizeInterviewSimulations(raw) {
    const record = unwrapRecord(raw, [
        "interview",
        "result",
        "data",
        "面试训练"
    ]);
    const source = Array.isArray(raw) ? raw : record ? pick(record, [
        "interviewSimulation",
        "simulations",
        "questions",
        "interviews",
        "面试问题"
    ]) : null;
    const items = (Array.isArray(source) ? source : []).map(normalizeInterviewItem).filter((item)=>!!item);
    return items.map((item)=>({
            ...item,
            scoreCriteria: item.scoreCriteria.length ? item.scoreCriteria : DEFAULT_SCORE_CRITERIA
        }));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/data/demo-case.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEMO_JOB_DESCRIPTION",
    ()=>DEMO_JOB_DESCRIPTION,
    "DEMO_STUDENT_PROFILE",
    ()=>DEMO_STUDENT_PROFILE
]);
const DEMO_STUDENT_PROFILE = {
    id: "demo-student-001",
    name: "李同学",
    schoolType: "普通本科",
    major: "市场营销",
    grade: "大四",
    targetCities: [
        "杭州",
        "上海",
        "深圳"
    ],
    targetRoles: [
        "运营助理",
        "用户运营",
        "产品助理"
    ],
    educationBackground: "本科，市场营销专业",
    rawExperiences: [
        "大二时在学校新媒体社团做过宣传，负责公众号推文排版和活动海报文案。",
        "市场调研课程中，小组做过一个关于校园二手交易需求的问卷调查，我负责收集问卷和整理结果。",
        "寒假在奶茶店做过兼职，负责点单、收银、客户沟通。",
        "参加过一次创新创业比赛，但没有获奖，项目是校园闲置物品交换平台。",
        "英语四级，熟悉 Excel、PPT，会使用剪映和基础设计工具。"
    ],
    skills: [
        "Excel",
        "PPT",
        "剪映",
        "公众号排版",
        "问卷整理"
    ],
    weaknesses: [
        "没有正式实习",
        "项目经历少",
        "不清楚适合岗位",
        "面试紧张"
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};
const DEMO_JOB_DESCRIPTION = `岗位名称：用户运营实习生
岗位职责：
1. 负责社群用户日常维护，提升用户活跃度；
2. 协助完成用户调研、反馈收集和数据整理；
3. 参与活动策划与内容发布；
4. 支持运营数据统计和复盘。

任职要求：
1. 本科及以上在读，专业不限；
2. 有社团、活动运营、新媒体运营经验优先；
3. 具备良好的沟通表达能力和执行力；
4. 熟悉 Excel、PPT、问卷工具者优先；
5. 对互联网产品和用户增长感兴趣。`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/data/demo-results.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Demo 模式 — 完整 Mock 数据
 * 预填充所有 AI 模块的输出，无需 API Key 即可体验全流程
 */ __turbopack_context__.s([
    "DEMO_DIAGNOSIS",
    ()=>DEMO_DIAGNOSIS,
    "DEMO_IMPROVEMENT_PLAN",
    ()=>DEMO_IMPROVEMENT_PLAN,
    "DEMO_INTERVIEW",
    ()=>DEMO_INTERVIEW,
    "DEMO_JOB_ANALYSIS",
    ()=>DEMO_JOB_ANALYSIS,
    "DEMO_MATCH_REPORT",
    ()=>DEMO_MATCH_REPORT,
    "DEMO_REPORT",
    ()=>DEMO_REPORT,
    "DEMO_RESUME_OPTIMIZATION",
    ()=>DEMO_RESUME_OPTIMIZATION,
    "DEMO_TRANSLATIONS",
    ()=>DEMO_TRANSLATIONS
]);
const DEMO_DIAGNOSIS = {
    studentType: "低经验但具备运营潜力型学生",
    summary: "李同学虽无正式实习经历，但在社团运营、课程调研和创业比赛中展现了用户洞察、内容创作和数据分析的底层能力。这些经历虽分散，但均指向「用户运营」方向的核心能力。建议以运营助理/用户运营为突破口，通过能力包装和针对性准备，实现从校园经历到职场能力的转化。",
    coreStrengths: [
        "用户洞察能力：通过社团运营和问卷调研，具备基础的用户需求理解能力",
        "内容创作能力：公众号排版、活动海报文案，有内容运营的基本素养",
        "数据整理能力：问卷收集与结果整理，具备数据驱动的意识",
        "沟通协作能力：课程小组合作和社团活动锻炼了团队协作能力",
        "学习适应能力：自学剪映、设计工具，展现了主动学习的意愿"
    ],
    mainWeaknesses: [
        "缺乏正式职场实习经验，对工作流程和职业规范认知不足",
        "项目经历较浅，缺少可量化的成果和完整的项目闭环",
        "对目标岗位的具体要求了解不够深入",
        "面试经验不足，容易紧张，表达缺乏结构化"
    ],
    recommendedRoles: [
        {
            role: "用户运营助理",
            reason: "社团运营、问卷调研和客户沟通经历直接匹配用户运营的核心能力要求",
            fitScore: 82,
            priority: "recommended"
        },
        {
            role: "新媒体运营",
            reason: "公众号排版和内容创作经验可直接迁移至新媒体运营岗位",
            fitScore: 78,
            priority: "recommended"
        },
        {
            role: "产品助理",
            reason: "创业比赛经历中的需求分析和产品设计思维，适合产品方向入门",
            fitScore: 65,
            priority: "challenge"
        }
    ],
    careerAdvice: "建议优先投递用户运营/运营助理岗位，利用社团运营和调研经历包装简历。在投递前重点准备：1) 用 STAR 法则重新梳理每段经历；2) 学习用户运营的基础知识框架；3) 准备 2-3 个可量化成果的案例。"
};
const DEMO_TRANSLATIONS = [
    {
        rawExperience: "大二时在学校新媒体社团做过宣传，负责公众号推文排版和活动海报文案。",
        abilityTags: [
            "内容运营",
            "视觉设计",
            "信息传达"
        ],
        businessLanguage: "负责校园新媒体平台的内容运营工作，独立完成推文排版和视觉设计，通过优化内容呈现形式提升信息传达效果。",
        resumeBullet: "负责校园公众号内容运营，独立完成推文排版与视觉设计，累计产出 20+ 篇推文，协助社团活动宣传覆盖全校 3000+ 学生",
        interviewQuestions: [
            "你在做公众号排版时，如何决定一篇文章的排版风格？",
            "你写的推文中，阅读量最高的是哪篇？你觉得为什么它效果好？",
            "如果一篇推文的打开率很低，你会从哪些方面分析原因？"
        ],
        authenticityNote: "表述基于真实社团经历，「20+ 篇推文」和「覆盖 3000+ 学生」需根据实际情况调整数字"
    },
    {
        rawExperience: "市场调研课程中，小组做过一个关于校园二手交易需求的问卷调查，我负责收集问卷和整理结果。",
        abilityTags: [
            "用户调研",
            "数据分析",
            "需求洞察"
        ],
        businessLanguage: "参与用户需求调研项目，负责问卷设计优化、数据收集和结果分析，通过定量数据挖掘用户核心需求，输出调研报告供团队决策参考。",
        resumeBullet: "参与校园二手交易需求调研项目，负责问卷发放与数据回收（有效样本 200+ 份），运用 Excel 进行数据清洗与交叉分析，输出调研报告辅助团队产品决策",
        interviewQuestions: [
            "你在这次调研中发现了什么让你意外的用户需求？",
            "问卷回收后你是怎么整理和分析数据的？用了什么工具？",
            "如果现在让你重新设计这个调研，你会做哪些改进？"
        ],
        authenticityNote: "核心经历真实，「200+ 有效样本」需根据实际回收量调整，分析方法可适当补充"
    },
    {
        rawExperience: "寒假在奶茶店做过兼职，负责点单、收银、客户沟通。",
        abilityTags: [
            "客户服务",
            "需求理解",
            "沟通表达"
        ],
        businessLanguage: "在餐饮服务场景中直接面对终端用户，通过高效的沟通和需求理解提升客户满意度，积累了用户服务和即时反馈处理的实战经验。",
        resumeBullet: "寒假期间在餐饮门店担任服务岗位，直接服务日均 100+ 位顾客，通过主动沟通和快速响应客户需求，获得店长好评并延长兼职周期",
        interviewQuestions: [
            "在奶茶店工作时，遇到过最棘手的客户投诉是什么？你怎么处理的？",
            "你觉得这段经历锻炼了你什么能力？和运营岗位有什么关系？",
            "如果让你用运营思维来提升这家奶茶店的生意，你会怎么做？"
        ],
        authenticityNote: "经历真实，「日均 100+ 位顾客」需根据门店实际客流调整"
    },
    {
        rawExperience: "参加过一次创新创业比赛，但没有获奖，项目是校园闲置物品交换平台。",
        abilityTags: [
            "产品思维",
            "项目管理",
            "需求分析"
        ],
        businessLanguage: "参与创新项目从 0 到 1 的全过程，负责用户需求分析和产品方案设计，通过用户访谈和竞品分析定义产品核心功能，锻炼了产品思维和项目推进能力。",
        resumeBullet: "参与校园闲置物品交换平台创业项目（4 人团队），负责前期用户需求调研和竞品分析，访谈 15+ 位目标用户，输出产品需求文档和功能优先级清单",
        interviewQuestions: [
            "这个项目最终没有获奖，你觉得主要原因是什么？",
            "如果现在让你重新做这个项目，你会做哪些不同的决策？",
            "你在项目中负责的需求分析，具体是怎么做的？"
        ],
        authenticityNote: "项目经历真实，虽未获奖但完整过程有价值。重点讲述过程而非结果"
    },
    {
        rawExperience: "英语四级，熟悉 Excel、PPT，会使用剪映和基础设计工具。",
        abilityTags: [
            "工具技能",
            "数据处理",
            "视觉设计"
        ],
        businessLanguage: "具备办公软件和设计工具的实操能力，能够独立完成数据处理、演示文稿制作和基础视觉设计，满足运营岗位的工具使用要求。",
        resumeBullet: "技能：Excel（数据透视表、VLOOKUP）、PPT（商务演示设计）、剪映（视频剪辑）、Canva/创客贴（海报设计）；英语四级（CET-4）",
        interviewQuestions: [
            "你用 Excel 做过的最复杂的数据处理是什么？",
            "如果让你用 PPT 给领导做一份运营数据周报，你会怎么设计？",
            "你平时用剪映做什么类型的内容？"
        ],
        authenticityNote: "工具技能真实可验证，面试中可能被要求现场演示"
    }
];
const DEMO_JOB_ANALYSIS = {
    jobTitle: "用户运营实习生",
    hardRequirements: [
        "本科及以上在读，专业不限",
        "具备良好的沟通表达能力和执行力",
        "熟悉 Excel、PPT、问卷工具"
    ],
    softRequirements: [
        "有社团、活动运营、新媒体运营经验",
        "对互联网产品和用户增长感兴趣"
    ],
    bonusPoints: [
        "有数据分析经验或 SQL 基础",
        "有内容创作或社群运营经验",
        "了解用户增长方法论"
    ],
    coreAbilities: [
        {
            ability: "用户沟通与需求理解",
            importance: "高"
        },
        {
            ability: "数据收集与整理分析",
            importance: "高"
        },
        {
            ability: "活动策划与执行",
            importance: "中高"
        },
        {
            ability: "内容创作与发布",
            importance: "中"
        },
        {
            ability: "跨团队协作",
            importance: "中"
        }
    ],
    hiddenExpectations: [
        "希望候选人能快速上手，减少培训成本",
        "对数据敏感，能从数据中发现用户行为规律",
        "有一定的抗压能力，能适应快节奏的工作",
        "有主动思考的习惯，不只是执行"
    ]
};
const DEMO_MATCH_REPORT = {
    overallMatchScore: 72,
    matchLevel: "较为匹配",
    dimensionScores: [
        {
            dimension: "沟通表达",
            score: 80,
            reason: "社团宣传和客户服务经历直接锻炼了沟通能力"
        },
        {
            dimension: "数据能力",
            score: 70,
            reason: "问卷调研有数据分析基础，但缺少 SQL 等进阶技能"
        },
        {
            dimension: "运营经验",
            score: 68,
            reason: "有社团运营和内容创作经验，但非正式职场经验"
        },
        {
            dimension: "执行力",
            score: 75,
            reason: "兼职和比赛经历展现了较强的执行意愿"
        },
        {
            dimension: "行业认知",
            score: 55,
            reason: "对互联网运营的理解仍停留在表面，需深入学习"
        }
    ],
    advantages: [
        "社团新媒体运营经历与岗位要求高度相关",
        "问卷调研经验直接匹配用户调研和数据整理职责",
        "具备 Excel/PPT 等岗位必备工具技能",
        "客户服务经验有助于理解用户需求"
    ],
    gaps: [
        "缺乏正式互联网运营实习经验",
        "数据能力停留在 Excel 层面，缺少 SQL 和数据可视化经验",
        "对用户增长方法论了解不足",
        "没有可量化的运营成果案例"
    ],
    applicationStrategy: "建议在简历中重点突出社团运营和调研经历，用 STAR 法则包装为运营相关案例。投递前准备 2-3 个具体的数据化成果故事。面试时重点展示学习能力和用户思维，适当提及对用户增长的理解。",
    riskWarning: "竞争可能较激烈，建议同时投递中小公司积累面试经验。如被问到「为什么没有实习」，可从「一直在探索方向，现在明确了运营方向」的角度回答。"
};
const DEMO_RESUME_OPTIMIZATION = {
    resumeSummary: "基于用户运营实习生岗位要求，针对李同学的 5 段核心经历进行了可信优化。优化方向：1) 将校园经历转化为运营语言；2) 补充可量化数据；3) 建立经历与岗位能力的映射关系。所有优化均基于真实经历，不编造、不注水。",
    resumeOptimization: [
        {
            sourceExperience: "社团新媒体宣传经历",
            before: "在社团负责公众号排版和海报文案",
            after: "负责校园公众号内容运营，独立完成推文排版与视觉设计，累计产出 20+ 篇推文，协助社团活动宣传覆盖全校 3000+ 学生",
            targetAbility: [
                "内容运营",
                "用户触达",
                "视觉设计"
            ],
            verificationQuestions: [
                "你负责的公众号有多少粉丝？",
                "阅读量最高的一篇推文数据是多少？",
                "你是如何决定推文的选题和排版风格的？"
            ],
            riskLevel: "低",
            note: "经历真实可验证，量化数据需根据实际情况调整"
        },
        {
            sourceExperience: "校园二手交易调研",
            before: "课程小组做了问卷调查，负责收集问卷和整理结果",
            after: "参与校园二手交易需求调研项目，负责问卷发放与数据回收（有效样本 200+ 份），运用 Excel 进行数据清洗与交叉分析，输出调研报告辅助团队产品决策",
            targetAbility: [
                "用户调研",
                "数据分析",
                "需求洞察"
            ],
            verificationQuestions: [
                "问卷总共回收了多少份？有效问卷占比多少？",
                "你从数据中发现了什么关键洞察？",
                "调研结果如何影响了你们的产品决策？"
            ],
            riskLevel: "低",
            note: "数据量需根据实际调整，分析方法可适当补充描述"
        },
        {
            sourceExperience: "奶茶店兼职",
            before: "负责点单、收银、客户沟通",
            after: "在餐饮服务场景中直接面对终端用户，日均服务 100+ 位顾客，通过主动沟通和快速响应客户需求提升满意度，获得店长好评",
            targetAbility: [
                "客户服务",
                "需求理解",
                "沟通表达"
            ],
            verificationQuestions: [
                "日均客流量大概多少？高峰期怎么应对？",
                "遇到过最难处理的客户问题是什么？",
                "店长好评具体体现在哪里？"
            ],
            riskLevel: "中",
            note: "与运营岗位关联度需在简历中用「用户思维」角度重新包装"
        }
    ]
};
const DEMO_INTERVIEW = [
    {
        questionType: "自我介绍",
        mainQuestion: "请用 2 分钟做一个自我介绍，重点介绍你和用户运营相关的经历。",
        followUpQuestions: [
            "你觉得自己最大的优势是什么？",
            "为什么选择用户运营而不是其他方向？"
        ],
        answerStructure: "采用「背景 + 经历 + 能力 + 动机」结构：1) 一句话介绍自己；2) 挑 2 段最相关经历简述；3) 提炼核心能力；4) 表达对运营方向的热情。",
        sampleAnswer: "您好，我是李同学，市场营销专业大四学生。我对用户运营方向非常感兴趣，在校期间有两段相关经历：一是在学校新媒体社团负责公众号运营，独立完成推文排版和活动宣传；二是参与了一项校园二手交易需求的调研项目，负责问卷设计和数据分析。这两段经历让我积累了内容运营和用户调研的基础能力。我认为用户运营的核心是理解用户需求、提升用户体验，这正是我想要深入发展的方向。",
        scoreCriteria: [
            "逻辑清晰，结构化表达",
            "经历与岗位关联度高",
            "展现了对运营方向的理解和热情",
            "时间控制在 2 分钟内"
        ]
    },
    {
        questionType: "经历深挖",
        mainQuestion: "你提到在社团负责公众号运营，能具体说说你是怎么做的吗？",
        followUpQuestions: [
            "你写的推文中效果最好的是哪篇？数据怎么样？",
            "你是如何决定推文选题的？",
            "如果一篇推文的阅读量很低，你会怎么分析原因？"
        ],
        answerStructure: "用 STAR 法则回答：Situation（背景）→ Task（任务）→ Action（具体做了什么）→ Result（成果数据）。重点突出你的思考过程和数据意识。",
        sampleAnswer: "当时我加入了学校的新媒体社团，主要负责公众号的推文运营。我的工作流程是：首先根据社团活动和校园热点确定选题方向，然后搜集素材并撰写文案，最后完成排版和发布。印象最深的是一篇关于社团招新的推文，我在标题上用了疑问句式吸引点击，在内容上加入了往届成员的真实感受，最终阅读量达到了我们账号的平均水平的 2 倍。通过这次经验，我学到了标题和用户视角对阅读量的重要影响。",
        scoreCriteria: [
            "回答有结构，不散乱",
            "有具体的数据或案例支撑",
            "展现了反思和学习能力",
            "能体现用户思维"
        ]
    },
    {
        questionType: "情景题",
        mainQuestion: "假设你入职后，领导让你负责一个新社群的冷启动，你会怎么做？",
        followUpQuestions: [
            "你会从哪里找到第一批种子用户？",
            "社群建立后，如何提升用户活跃度？",
            "如果一周后群内几乎没人说话，你会怎么办？"
        ],
        answerStructure: "展现结构化思维：1) 明确目标和用户画像；2) 制定冷启动策略；3) 设计激活机制；4) 数据监控和迭代。即使没有经验，也要展现思考框架。",
        sampleAnswer: "我会分三步走：第一步，明确社群定位和目标用户画像，了解他们为什么需要这个社群；第二步，冷启动阶段我会从现有渠道（如公众号、APP弹窗、用户访谈）找到 50-100 位种子用户，用一对一邀请的方式建立初始信任；第三步，设计首周激活计划，比如每日话题讨论、新人福利、限时活动等，让用户形成参与习惯。同时我会关注每日活跃率和发言率，根据数据及时调整策略。",
        scoreCriteria: [
            "有清晰的框架和步骤",
            "考虑了用户视角",
            "有数据意识",
            "展现了执行力和主动性"
        ]
    },
    {
        questionType: "动机题",
        mainQuestion: "你为什么想做用户运营？你对这个岗位的理解是什么？",
        followUpQuestions: [
            "你觉得用户运营最重要的能力是什么？",
            "你最近关注的互联网产品有哪些？你觉得它们的用户运营做得怎么样？"
        ],
        answerStructure: "从「个人经历 → 岗位理解 → 能力匹配 → 职业规划」四个维度回答，展现真实的兴趣和思考。",
        sampleAnswer: "选择用户运营是因为我在社团和调研经历中发现，理解用户需求是一件非常有成就感的事情。我认为用户运营的核心是：通过数据和沟通理解用户，通过策略和活动提升用户价值。我理解的用户运营不只是拉新促活，更重要的是建立用户和产品之间的情感连接。我的社团运营和调研经历让我具备了用户洞察和数据分析的基础能力，虽然还需要在实践中快速学习，但我对这个方向充满热情。",
        scoreCriteria: [
            "动机真实，不空洞",
            "对岗位有基本理解",
            "能关联自身经历",
            "展现了学习意愿"
        ]
    }
];
const DEMO_IMPROVEMENT_PLAN = {
    targetRole: "用户运营助理",
    goal: "在 30 天内完成从「低经验学生」到「可投递候选人」的转变，补齐核心能力短板，准备好简历和面试",
    sevenDayPlan: [
        "Day 1-2：学习用户运营基础框架（AARRR 模型、用户生命周期），阅读 3 篇运营干货文章",
        "Day 3-4：用 STAR 法则重新梳理 5 段经历，每段写成 100 字的简历版本",
        "Day 5：学习 Excel 数据透视表和 VLOOKUP 进阶用法，完成 1 个数据分析练习",
        "Day 6-7：注册 2-3 个招聘平台，浏览 20 个用户运营 JD，总结高频能力要求"
    ],
    fourteenDayPlan: [
        "Day 8-9：完成简历初稿，找 2 位朋友或老师 review 并修改",
        "Day 10-11：学习 SQL 基础（SELECT、WHERE、GROUP BY），在 LeetCode 或牛客完成 5 道练习题",
        "Day 12-13：准备自我介绍和 3 个高频面试问题的回答，对着镜子练习 3 遍",
        "Day 14：投递第一批简历（5-8 家），记录投递表"
    ],
    thirtyDayPlan: [
        "Day 15-17：复盘面试（如有），优化简历和面试回答",
        "Day 18-20：学习用户增长基础知识，关注 3 个优秀运营公众号",
        "Day 21-23：完成一个小型运营实践项目（如运营一个兴趣社群或小红书账号）",
        "Day 24-26：准备面试中可能遇到的情景题和案例分析",
        "Day 27-30：持续投递和面试，每周复盘投递数据和面试表现，迭代优化"
    ],
    recommendedOutputs: [
        "一份针对用户运营岗位的优化简历",
        "自我介绍 + 5 个高频面试问题的结构化回答",
        "一个有数据支撑的运营实践小项目（可写入简历）",
        "Excel 和 SQL 基础能力证明（可在线完成认证）",
        "投递记录表和面试复盘文档"
    ]
};
const DEMO_REPORT = `# 李同学 — AI 求职突围报告

## 一、个人画像

**学生类型**：低经验但具备运营潜力型学生
**学历**：普通本科 · 市场营销 · 大四
**目标岗位**：用户运营助理 / 新媒体运营

> 李同学虽无正式实习经历，但在社团运营、课程调研和创业比赛中展现了用户洞察、内容创作和数据分析的底层能力。这些经历虽分散，但均指向「用户运营」方向的核心能力。

---

## 二、核心能力雷达

| 维度 | 得分 | 说明 |
|------|------|------|
| 沟通表达 | 80 | 社团宣传和客户服务经历直接锻炼 |
| 数据能力 | 70 | 问卷调研有基础，缺 SQL 进阶 |
| 运营经验 | 68 | 有社团运营经验，非正式职场 |
| 执行力 | 75 | 兼职和比赛展现了执行意愿 |
| 行业认知 | 55 | 对互联网运营理解需深入 |

**综合匹配度**：72 分 — 较为匹配目标岗位

---

## 三、经历亮点提炼

1. **社团新媒体运营**：独立完成 20+ 篇推文，覆盖全校 3000+ 学生
2. **校园二手交易调研**：200+ 有效问卷，输出调研报告辅助决策
3. **奶茶店兼职**：日均服务 100+ 位客户，锻炼沟通和需求理解
4. **创业比赛**：从 0 到 1 参与产品设计，访谈 15+ 位用户

---

## 四、核心差距与补齐建议

### 差距项
- 缺乏正式互联网实习经验
- 数据能力停留在 Excel 层面
- 对用户增长方法论了解不足

### 30 天行动路线

**第 1 周**：学习运营框架 + STAR 法则梳理经历 + 技能提升
**第 2 周**：完成简历 + 学习 SQL 基础 + 准备面试 + 开始投递
**第 3-4 周**：运营实践项目 + 持续投递面试 + 复盘迭代

---

## 五、面试准备清单

- [ ] 自我介绍（2 分钟版）
- [ ] 5 段经历的 STAR 故事
- [ ] 3 个情景题的回答框架
- [ ] 动机题和职业规划
- [ ] 反问面试官的问题

---

*本报告由逆袭Offer AI 生成，基于李同学的真实经历和目标岗位分析。*
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/lib/api/career-flows.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "careerFlowsApi",
    ()=>careerFlowsApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/api/client.ts [app-client] (ecmascript)");
;
const careerFlowsApi = {
    async list () {
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get("/career-flows");
        return result.flows;
    },
    async create (input) {
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post("/career-flows", input);
        return result.flow;
    },
    async get (id) {
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get(`/career-flows/${id}`);
        return result.flow;
    },
    async update (id, input) {
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].patch(`/career-flows/${id}`, input);
        return result.flow;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/lib/api/users.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usersApi",
    ()=>usersApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/api/client.ts [app-client] (ecmascript)");
;
const usersApi = {
    async getProfile () {
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get("/users/me/profile");
        return result.profile;
    },
    async saveProfile (profile) {
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].put("/users/me/profile", {
            name: profile.name,
            schoolType: profile.schoolType,
            major: profile.major,
            grade: profile.grade,
            targetCities: profile.targetCities,
            targetRoles: profile.targetRoles,
            educationBackground: profile.educationBackground,
            rawExperiences: profile.rawExperiences,
            skills: profile.skills,
            weaknesses: profile.weaknesses
        });
        return result.profile;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/contexts/JobFlowContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "JobFlowProvider",
    ()=>JobFlowProvider,
    "useJobFlow",
    ()=>useJobFlow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$utils$2f$ai$2d$results$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/utils/ai-results.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$data$2f$demo$2d$case$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/data/demo-case.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$data$2f$demo$2d$results$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/data/demo-results.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$career$2d$flows$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/api/career-flows.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$users$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/api/users.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const DRAFT_STEP_KEY = "nixi-job-flow-ui-draft-step";
const INITIAL_STATE = {
    activeRunId: null,
    currentStep: "profile",
    completedSteps: [],
    studentProfile: null,
    careerDiagnosis: null,
    experienceTranslations: null,
    jobDescription: null,
    jobAnalysis: null,
    matchReport: null,
    resumeOptimization: null,
    interviewSimulation: null,
    improvementPlan: null,
    isLoading: false,
    error: null
};
function deriveCompletedSteps(state) {
    const steps = [];
    if (state.studentProfile) steps.push("profile");
    if (state.careerDiagnosis) steps.push("diagnosis");
    if (state.experienceTranslations) steps.push("translation");
    if (state.jobAnalysis) steps.push("job");
    if (state.matchReport) steps.push("match");
    if (state.resumeOptimization) steps.push("resume");
    if (state.interviewSimulation) steps.push("interview");
    if (state.improvementPlan) steps.push("plan");
    if (steps.length >= 5) steps.push("report");
    return steps;
}
const CORE_STEPS = [
    "profile",
    "diagnosis",
    "translation",
    "resume",
    "interview",
    "plan"
];
function isFlowUnlocked(state) {
    return CORE_STEPS.every((step)=>state.completedSteps.includes(step));
}
function withDerivedSteps(state) {
    const interviewSimulation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$utils$2f$ai$2d$results$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeInterviewSimulations"])(state.interviewSimulation);
    const normalized = {
        ...state,
        careerDiagnosis: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$utils$2f$ai$2d$results$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeCareerDiagnosis"])(state.careerDiagnosis),
        jobAnalysis: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$utils$2f$ai$2d$results$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeJobAnalysis"])(state.jobAnalysis),
        matchReport: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$utils$2f$ai$2d$results$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeMatchReport"])(state.matchReport),
        interviewSimulation: interviewSimulation.length ? interviewSimulation : null,
        improvementPlan: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$utils$2f$ai$2d$results$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeImprovementPlan"])(state.improvementPlan)
    };
    return {
        ...normalized,
        completedSteps: deriveCompletedSteps(normalized)
    };
}
function isFlowStep(value) {
    return value === "profile" || value === "diagnosis" || value === "translation" || value === "job" || value === "match" || value === "resume" || value === "interview" || value === "plan" || value === "report";
}
function getInitialState() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const storedStep = localStorage.getItem(DRAFT_STEP_KEY);
    return isFlowStep(storedStep) ? {
        ...INITIAL_STATE,
        currentStep: storedStep
    } : INITIAL_STATE;
}
function reducer(state, action) {
    let next;
    switch(action.type){
        case "SET_RUN_ID":
            return {
                ...state,
                activeRunId: action.payload
            };
        case "SET_PROFILE":
            next = {
                ...state,
                studentProfile: action.payload
            };
            break;
        case "SET_DIAGNOSIS":
            next = {
                ...state,
                careerDiagnosis: action.payload
            };
            break;
        case "SET_TRANSLATIONS":
            next = {
                ...state,
                experienceTranslations: action.payload
            };
            break;
        case "SET_JOB_DESCRIPTION":
            next = {
                ...state,
                jobDescription: action.payload
            };
            break;
        case "SET_JOB_ANALYSIS":
            next = {
                ...state,
                jobAnalysis: action.payload
            };
            break;
        case "SET_MATCH_REPORT":
            next = {
                ...state,
                matchReport: action.payload
            };
            break;
        case "SET_RESUME_OPTIMIZATION":
            next = {
                ...state,
                resumeOptimization: action.payload
            };
            break;
        case "SET_INTERVIEW":
            next = {
                ...state,
                interviewSimulation: action.payload
            };
            break;
        case "SET_IMPROVEMENT_PLAN":
            next = {
                ...state,
                improvementPlan: action.payload
            };
            break;
        case "SET_STEP":
            return {
                ...state,
                currentStep: action.payload
            };
        case "SET_LOADING":
            return {
                ...state,
                isLoading: action.payload
            };
        case "SET_ERROR":
            return {
                ...state,
                error: action.payload
            };
        case "LOAD_SAMPLE":
            next = {
                ...INITIAL_STATE,
                studentProfile: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$data$2f$demo$2d$case$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEMO_STUDENT_PROFILE"],
                careerDiagnosis: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$data$2f$demo$2d$results$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEMO_DIAGNOSIS"],
                experienceTranslations: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$data$2f$demo$2d$results$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEMO_TRANSLATIONS"],
                jobDescription: "用户运营实习生",
                jobAnalysis: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$data$2f$demo$2d$results$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEMO_JOB_ANALYSIS"],
                matchReport: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$data$2f$demo$2d$results$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEMO_MATCH_REPORT"],
                resumeOptimization: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$data$2f$demo$2d$results$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEMO_RESUME_OPTIMIZATION"],
                interviewSimulation: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$data$2f$demo$2d$results$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEMO_INTERVIEW"],
                improvementPlan: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$data$2f$demo$2d$results$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEMO_IMPROVEMENT_PLAN"]
            };
            break;
        case "RESET":
            return INITIAL_STATE;
        default:
            return state;
    }
    return withDerivedSteps(next);
}
const JobFlowContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function applyResultToState(base, item) {
    switch(item.step){
        case "diagnosis":
            return withDerivedSteps({
                ...base,
                careerDiagnosis: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$utils$2f$ai$2d$results$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeCareerDiagnosis"])(item.result)
            });
        case "translation":
            return withDerivedSteps({
                ...base,
                experienceTranslations: Array.isArray(item.result) ? item.result : null
            });
        case "job":
            return withDerivedSteps({
                ...base,
                jobAnalysis: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$utils$2f$ai$2d$results$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeJobAnalysis"])(item.result)
            });
        case "match":
            return withDerivedSteps({
                ...base,
                matchReport: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$utils$2f$ai$2d$results$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeMatchReport"])(item.result)
            });
        case "resume":
            return withDerivedSteps({
                ...base,
                resumeOptimization: item.result
            });
        case "interview":
            {
                const normalized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$utils$2f$ai$2d$results$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeInterviewSimulations"])(item.result);
                return withDerivedSteps({
                    ...base,
                    interviewSimulation: normalized.length ? normalized : null
                });
            }
        case "plan":
            return withDerivedSteps({
                ...base,
                improvementPlan: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$utils$2f$ai$2d$results$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeImprovementPlan"])(item.result)
            });
        default:
            return base;
    }
}
function JobFlowProvider({ children }) {
    _s();
    const [state, dispatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducer"])(reducer, INITIAL_STATE, getInitialState);
    const restoreFromBackend = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "JobFlowProvider.useCallback[restoreFromBackend]": async ()=>{
            dispatch({
                type: "SET_LOADING",
                payload: true
            });
            dispatch({
                type: "SET_ERROR",
                payload: null
            });
            try {
                const [profile, flows] = await Promise.all([
                    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$users$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usersApi"].getProfile(),
                    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$career$2d$flows$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["careerFlowsApi"].list()
                ]);
                const latestFlow = flows[0] ?? null;
                let restored = withDerivedSteps({
                    ...INITIAL_STATE,
                    activeRunId: latestFlow?.id ?? null,
                    currentStep: latestFlow?.currentStep ?? "profile",
                    studentProfile: profile,
                    jobDescription: latestFlow?.jobDescription ?? null
                });
                if (latestFlow) {
                    const detail = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$career$2d$flows$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["careerFlowsApi"].get(latestFlow.id);
                    restored = detail.results.reduce(applyResultToState, restored);
                }
                dispatch({
                    type: "RESET"
                });
                dispatch({
                    type: "SET_RUN_ID",
                    payload: restored.activeRunId
                });
                if (restored.studentProfile) dispatch({
                    type: "SET_PROFILE",
                    payload: restored.studentProfile
                });
                if (restored.jobDescription) dispatch({
                    type: "SET_JOB_DESCRIPTION",
                    payload: restored.jobDescription
                });
                if (restored.careerDiagnosis) dispatch({
                    type: "SET_DIAGNOSIS",
                    payload: restored.careerDiagnosis
                });
                if (restored.experienceTranslations) dispatch({
                    type: "SET_TRANSLATIONS",
                    payload: restored.experienceTranslations
                });
                if (restored.jobAnalysis) dispatch({
                    type: "SET_JOB_ANALYSIS",
                    payload: restored.jobAnalysis
                });
                if (restored.matchReport) dispatch({
                    type: "SET_MATCH_REPORT",
                    payload: restored.matchReport
                });
                if (restored.resumeOptimization) dispatch({
                    type: "SET_RESUME_OPTIMIZATION",
                    payload: restored.resumeOptimization
                });
                if (restored.interviewSimulation) dispatch({
                    type: "SET_INTERVIEW",
                    payload: restored.interviewSimulation
                });
                if (restored.improvementPlan) dispatch({
                    type: "SET_IMPROVEMENT_PLAN",
                    payload: restored.improvementPlan
                });
                dispatch({
                    type: "SET_STEP",
                    payload: restored.currentStep
                });
            } catch (err) {
                dispatch({
                    type: "SET_ERROR",
                    payload: err instanceof Error ? err.message : "流程数据恢复失败"
                });
            } finally{
                dispatch({
                    type: "SET_LOADING",
                    payload: false
                });
            }
        }
    }["JobFlowProvider.useCallback[restoreFromBackend]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "JobFlowProvider.useEffect": ()=>{
            restoreFromBackend();
        }
    }["JobFlowProvider.useEffect"], [
        restoreFromBackend
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "JobFlowProvider.useEffect": ()=>{
            try {
                localStorage.setItem(DRAFT_STEP_KEY, state.currentStep);
            } catch  {
            // UI 偏好写入失败不影响主流程。
            }
        }
    }["JobFlowProvider.useEffect"], [
        state.currentStep
    ]);
    const ensureActiveRun = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "JobFlowProvider.useCallback[ensureActiveRun]": async (targetRole, jobDescription)=>{
            if (state.activeRunId) return state.activeRunId;
            const flow = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$career$2d$flows$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["careerFlowsApi"].create({
                targetRole: targetRole ?? state.studentProfile?.targetRoles[0] ?? null,
                jobDescription: jobDescription ?? state.jobDescription,
                currentStep: state.currentStep,
                status: "running"
            });
            dispatch({
                type: "SET_RUN_ID",
                payload: flow.id
            });
            return flow.id;
        }
    }["JobFlowProvider.useCallback[ensureActiveRun]"], [
        state.activeRunId,
        state.currentStep,
        state.jobDescription,
        state.studentProfile
    ]);
    function resetFlow() {
        dispatch({
            type: "RESET"
        });
        try {
            localStorage.removeItem(DRAFT_STEP_KEY);
        } catch  {
        // ignore
        }
    }
    function loadSampleData() {
        dispatch({
            type: "LOAD_SAMPLE"
        });
    }
    function canAccessStep(step) {
        if (isFlowUnlocked(state)) return true;
        const completed = state.completedSteps;
        switch(step){
            case "profile":
                return true;
            case "diagnosis":
                return completed.includes("profile");
            case "translation":
                return completed.includes("diagnosis");
            case "job":
                return completed.includes("translation");
            case "match":
                return completed.includes("diagnosis");
            case "resume":
                return completed.includes("translation");
            case "interview":
                return completed.includes("resume");
            case "plan":
                return completed.includes("interview");
            case "report":
                return completed.length >= 5;
            default:
                return false;
        }
    }
    function getCompletionPercentage() {
        return Math.round(state.completedSteps.length / 9 * 100);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(JobFlowContext.Provider, {
        value: {
            state,
            dispatch,
            resetFlow,
            loadSampleData,
            restoreFromBackend,
            ensureActiveRun,
            canAccessStep,
            getCompletionPercentage
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/frontend/src/contexts/JobFlowContext.tsx",
        lineNumber: 305,
        columnNumber: 5
    }, this);
}
_s(JobFlowProvider, "VfshBXnJSHoL3dKzy90lOdsJYO0=");
_c = JobFlowProvider;
function useJobFlow() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(JobFlowContext);
    if (!ctx) throw new Error("useJobFlow must be used within JobFlowProvider");
    return ctx;
}
_s1(useJobFlow, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "JobFlowProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/types/resume-builder.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// 基本信息
__turbopack_context__.s([
    "DEFAULT_GLOBAL_SETTINGS",
    ()=>DEFAULT_GLOBAL_SETTINGS,
    "DEFAULT_RESUME_SECTIONS",
    ()=>DEFAULT_RESUME_SECTIONS
]);
const DEFAULT_RESUME_SECTIONS = [
    {
        id: 'basic',
        title: '基本信息',
        icon: 'user',
        enabled: true,
        order: 0
    },
    {
        id: 'education',
        title: '教育经历',
        icon: 'flag',
        enabled: true,
        order: 1
    },
    {
        id: 'experience',
        title: '实习/工作经历',
        icon: 'briefcase',
        enabled: true,
        order: 2
    },
    {
        id: 'projects',
        title: '项目经历',
        icon: 'rocket',
        enabled: true,
        order: 3
    },
    {
        id: 'skills',
        title: '专业技能',
        icon: 'lightning',
        enabled: true,
        order: 4
    },
    {
        id: 'selfEvaluation',
        title: '自我评价',
        icon: 'chat',
        enabled: false,
        order: 5
    }
];
const DEFAULT_GLOBAL_SETTINGS = {
    themeColor: '#6366F1',
    fontFamily: 'Inter, Noto Sans SC, sans-serif',
    baseFontSize: 14,
    pagePadding: 40,
    sectionSpacing: 16,
    lineHeight: 1.5
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/types/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$types$2f$resume$2d$builder$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/types/resume-builder.ts [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/lib/api/resumes.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fromBackendResume",
    ()=>fromBackendResume,
    "resumesApi",
    ()=>resumesApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/api/client.ts [app-client] (ecmascript)");
;
function isResumeBuilderData(value) {
    return typeof value === "object" && value !== null && "basic" in value && "sections" in value;
}
function fromBackendResume(resume) {
    if (!isResumeBuilderData(resume.content)) return null;
    return {
        ...resume.content,
        id: resume.id,
        title: resume.title,
        templateId: resume.templateId,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt
    };
}
function toSavePayload(resume, sourceRunId) {
    return {
        title: resume.title,
        templateId: resume.templateId,
        theme: resume.globalSettings,
        content: resume,
        sourceRunId: sourceRunId ?? null
    };
}
const resumesApi = {
    async list () {
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get("/resumes");
        return result.resumes.map(fromBackendResume).filter((item)=>item !== null);
    },
    async create (resume, sourceRunId) {
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post("/resumes", toSavePayload(resume, sourceRunId));
        return fromBackendResume(result.resume) ?? resume;
    },
    async update (resume, sourceRunId) {
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].patch(`/resumes/${resume.id}`, toSavePayload(resume, sourceRunId));
        return fromBackendResume(result.resume) ?? resume;
    },
    async duplicate (id) {
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post(`/resumes/${id}/duplicate`);
        return fromBackendResume(result.resume);
    },
    async createVersion (id) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post(`/resumes/${id}/versions`);
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/contexts/ResumeBuilderContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ResumeBuilderProvider",
    ()=>ResumeBuilderProvider,
    "useResumeBuilder",
    ()=>useResumeBuilder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/src/types/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$types$2f$resume$2d$builder$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/types/resume-builder.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$resumes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/api/resumes.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
const STORAGE_KEY = "nixi-resume-builder-ui";
const INITIAL_STATE = {
    resumes: {},
    activeResumeId: null,
    activeSection: "basic"
};
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
function createEmptyResume(templateId, title) {
    const now = new Date().toISOString();
    return {
        id: generateId(),
        title: title || "未命名简历",
        createdAt: now,
        updatedAt: now,
        templateId,
        basic: {
            name: "",
            title: "",
            email: "",
            phone: "",
            location: "",
            photo: undefined,
            customFields: []
        },
        education: [],
        experience: [],
        projects: [],
        skills: "",
        selfEvaluation: "",
        sections: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$types$2f$resume$2d$builder$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_RESUME_SECTIONS"].map((s)=>({
                ...s
            })),
        globalSettings: {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$types$2f$resume$2d$builder$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_GLOBAL_SETTINGS"]
        }
    };
}
function withTimestamp(resume) {
    return {
        ...resume,
        updatedAt: new Date().toISOString()
    };
}
function updateActiveResume(state, updater) {
    const { activeResumeId, resumes } = state;
    if (!activeResumeId || !resumes[activeResumeId]) return state;
    return {
        ...state,
        resumes: {
            ...resumes,
            [activeResumeId]: withTimestamp(updater(resumes[activeResumeId]))
        }
    };
}
function reducer(state, action) {
    switch(action.type){
        case "CREATE_RESUME":
            {
                const resume = createEmptyResume(action.payload.templateId, action.payload.title);
                return {
                    ...state,
                    resumes: {
                        ...state.resumes,
                        [resume.id]: resume
                    },
                    activeResumeId: resume.id,
                    activeSection: "basic"
                };
            }
        case "LOAD_RESUMES":
            {
                const resumes = Object.fromEntries(action.payload.map((resume)=>[
                        resume.id,
                        resume
                    ]));
                return {
                    ...state,
                    resumes,
                    activeResumeId: state.activeResumeId && resumes[state.activeResumeId] ? state.activeResumeId : action.payload[0]?.id ?? null
                };
            }
        case "DELETE_RESUME":
            {
                const { [action.payload]: _, ...rest } = state.resumes;
                return {
                    ...state,
                    resumes: rest,
                    activeResumeId: state.activeResumeId === action.payload ? null : state.activeResumeId
                };
            }
        case "DUPLICATE_RESUME":
            {
                const source = state.resumes[action.payload];
                if (!source) return state;
                const now = new Date().toISOString();
                const copy = {
                    ...JSON.parse(JSON.stringify(source)),
                    id: generateId(),
                    title: `${source.title}（副本）`,
                    createdAt: now,
                    updatedAt: now
                };
                return {
                    ...state,
                    resumes: {
                        ...state.resumes,
                        [copy.id]: copy
                    }
                };
            }
        case "SET_ACTIVE_RESUME":
            return {
                ...state,
                activeResumeId: action.payload
            };
        case "SET_ACTIVE_SECTION":
            return {
                ...state,
                activeSection: action.payload
            };
        case "UPDATE_TITLE":
            return updateActiveResume(state, (r)=>({
                    ...r,
                    title: action.payload
                }));
        case "UPDATE_BASIC":
            return updateActiveResume(state, (r)=>({
                    ...r,
                    basic: {
                        ...r.basic,
                        ...action.payload
                    }
                }));
        case "ADD_EDUCATION":
            return updateActiveResume(state, (r)=>({
                    ...r,
                    education: [
                        ...r.education,
                        action.payload
                    ]
                }));
        case "UPDATE_EDUCATION":
            return updateActiveResume(state, (r)=>({
                    ...r,
                    education: r.education.map((e)=>e.id === action.payload.id ? {
                            ...e,
                            ...action.payload.data
                        } : e)
                }));
        case "DELETE_EDUCATION":
            return updateActiveResume(state, (r)=>({
                    ...r,
                    education: r.education.filter((e)=>e.id !== action.payload)
                }));
        case "ADD_EXPERIENCE":
            return updateActiveResume(state, (r)=>({
                    ...r,
                    experience: [
                        ...r.experience,
                        action.payload
                    ]
                }));
        case "UPDATE_EXPERIENCE":
            return updateActiveResume(state, (r)=>({
                    ...r,
                    experience: r.experience.map((e)=>e.id === action.payload.id ? {
                            ...e,
                            ...action.payload.data
                        } : e)
                }));
        case "DELETE_EXPERIENCE":
            return updateActiveResume(state, (r)=>({
                    ...r,
                    experience: r.experience.filter((e)=>e.id !== action.payload)
                }));
        case "ADD_PROJECT":
            return updateActiveResume(state, (r)=>({
                    ...r,
                    projects: [
                        ...r.projects,
                        action.payload
                    ]
                }));
        case "UPDATE_PROJECT":
            return updateActiveResume(state, (r)=>({
                    ...r,
                    projects: r.projects.map((p)=>p.id === action.payload.id ? {
                            ...p,
                            ...action.payload.data
                        } : p)
                }));
        case "DELETE_PROJECT":
            return updateActiveResume(state, (r)=>({
                    ...r,
                    projects: r.projects.filter((p)=>p.id !== action.payload)
                }));
        case "UPDATE_SKILLS":
            return updateActiveResume(state, (r)=>({
                    ...r,
                    skills: action.payload
                }));
        case "UPDATE_SELF_EVALUATION":
            return updateActiveResume(state, (r)=>({
                    ...r,
                    selfEvaluation: action.payload
                }));
        case "REORDER_SECTIONS":
            return updateActiveResume(state, (r)=>({
                    ...r,
                    sections: action.payload
                }));
        case "TOGGLE_SECTION":
            return updateActiveResume(state, (r)=>({
                    ...r,
                    sections: r.sections.map((s)=>s.id === action.payload ? {
                            ...s,
                            enabled: !s.enabled
                        } : s)
                }));
        case "UPDATE_SETTINGS":
            return updateActiveResume(state, (r)=>({
                    ...r,
                    globalSettings: {
                        ...r.globalSettings,
                        ...action.payload
                    }
                }));
        case "SET_TEMPLATE":
            return updateActiveResume(state, (r)=>({
                    ...r,
                    templateId: action.payload
                }));
        case "LOAD_FROM_AI":
            {
                const resume = action.payload;
                return {
                    ...state,
                    resumes: {
                        ...state.resumes,
                        [resume.id]: resume
                    },
                    activeResumeId: resume.id,
                    activeSection: "basic"
                };
            }
        default:
            return state;
    }
}
// 只从 localStorage 加载 UI 偏好，不再持久化简历正文。
function loadState() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            return {
                ...INITIAL_STATE,
                activeResumeId: parsed.activeResumeId ?? null,
                activeSection: parsed.activeSection ?? "basic"
            };
        }
    } catch  {
    // ignore
    }
    return INITIAL_STATE;
}
const ResumeBuilderContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function ResumeBuilderProvider({ children }) {
    _s();
    const [state, dispatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducer"])(reducer, INITIAL_STATE, loadState);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const lastSavedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])("");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ResumeBuilderProvider.useEffect": ()=>{
            async function loadResumes() {
                try {
                    const resumes = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$resumes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resumesApi"].list();
                    dispatch({
                        type: "LOAD_RESUMES",
                        payload: resumes
                    });
                } catch  {
                // 未登录或后端不可用时保持本地空状态，避免阻塞页面渲染。
                } finally{
                    setIsLoading(false);
                }
            }
            loadResumes();
        }
    }["ResumeBuilderProvider.useEffect"], []);
    // localStorage 只保存当前编辑位置，不保存简历内容。
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ResumeBuilderProvider.useEffect": ()=>{
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify({
                    activeResumeId: state.activeResumeId,
                    activeSection: state.activeSection
                }));
            } catch  {
            // ignore
            }
        }
    }["ResumeBuilderProvider.useEffect"], [
        state.activeResumeId,
        state.activeSection
    ]);
    const activeResume = state.activeResumeId ? state.resumes[state.activeResumeId] ?? null : null;
    // 编辑状态防抖保存到后端，刷新页面后以数据库为准恢复。
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ResumeBuilderProvider.useEffect": ()=>{
            if (isLoading || !activeResume) return;
            const serialized = JSON.stringify(activeResume);
            if (serialized === lastSavedRef.current) return;
            const timer = setTimeout({
                "ResumeBuilderProvider.useEffect.timer": ()=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$resumes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resumesApi"].update(activeResume).then({
                        "ResumeBuilderProvider.useEffect.timer": (saved)=>{
                            lastSavedRef.current = JSON.stringify(saved);
                        }
                    }["ResumeBuilderProvider.useEffect.timer"]).catch({
                        "ResumeBuilderProvider.useEffect.timer": ()=>{
                        // 后端保存失败时保留当前编辑态，用户下一次修改会再次触发保存。
                        }
                    }["ResumeBuilderProvider.useEffect.timer"]);
                }
            }["ResumeBuilderProvider.useEffect.timer"], 1500);
            return ({
                "ResumeBuilderProvider.useEffect": ()=>clearTimeout(timer)
            })["ResumeBuilderProvider.useEffect"];
        }
    }["ResumeBuilderProvider.useEffect"], [
        activeResume,
        isLoading
    ]);
    const createResume = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ResumeBuilderProvider.useCallback[createResume]": async (templateId, title)=>{
            const resume = createEmptyResume(templateId, title);
            const saved = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$resumes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resumesApi"].create(resume);
            dispatch({
                type: "LOAD_FROM_AI",
                payload: saved
            });
            return saved.id;
        }
    }["ResumeBuilderProvider.useCallback[createResume]"], []);
    const deleteResume = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ResumeBuilderProvider.useCallback[deleteResume]": (id)=>{
            dispatch({
                type: "DELETE_RESUME",
                payload: id
            });
        }
    }["ResumeBuilderProvider.useCallback[deleteResume]"], []);
    const duplicateResume = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ResumeBuilderProvider.useCallback[duplicateResume]": async (id)=>{
            const duplicated = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2f$resumes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resumesApi"].duplicate(id);
            if (duplicated) {
                dispatch({
                    type: "LOAD_FROM_AI",
                    payload: duplicated
                });
                return duplicated.id;
            }
            dispatch({
                type: "DUPLICATE_RESUME",
                payload: id
            });
            return null;
        }
    }["ResumeBuilderProvider.useCallback[duplicateResume]"], []);
    const setActiveResume = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ResumeBuilderProvider.useCallback[setActiveResume]": (id)=>{
            dispatch({
                type: "SET_ACTIVE_RESUME",
                payload: id
            });
        }
    }["ResumeBuilderProvider.useCallback[setActiveResume]"], []);
    const setActiveSection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ResumeBuilderProvider.useCallback[setActiveSection]": (sectionId)=>{
            dispatch({
                type: "SET_ACTIVE_SECTION",
                payload: sectionId
            });
        }
    }["ResumeBuilderProvider.useCallback[setActiveSection]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ResumeBuilderContext.Provider, {
        value: {
            state,
            dispatch,
            activeResume,
            isLoading,
            createResume,
            deleteResume,
            duplicateResume,
            setActiveResume,
            setActiveSection
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/frontend/src/contexts/ResumeBuilderContext.tsx",
        lineNumber: 383,
        columnNumber: 5
    }, this);
}
_s(ResumeBuilderProvider, "7NKTzgi1yJEU0QOvVwgh6GBgLm0=");
_c = ResumeBuilderProvider;
function useResumeBuilder() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ResumeBuilderContext);
    if (!ctx) throw new Error("useResumeBuilder must be used within ResumeBuilderProvider");
    return ctx;
}
_s1(useResumeBuilder, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "ResumeBuilderProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/components/ui/Icon.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Icon — 统一图标组件
 * 基于 iconfont SVG 符号，通过 <use> 引用 IconSprite 中的定义
 * 替代项目中所有 emoji 图标
 */ /** 所有可用图标名称 */ __turbopack_context__.s([
    "default",
    ()=>Icon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function Icon({ name, size = "1em", className = "", color, ariaLabel }) {
    const sizeStyle = typeof size === "number" ? `${size}px` : size;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: `icon ${className}`,
        width: sizeStyle,
        height: sizeStyle,
        fill: color,
        "aria-hidden": !ariaLabel,
        "aria-label": ariaLabel,
        role: ariaLabel ? "img" : "presentation",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("use", {
            href: `#icon-${name}`
        }, void 0, false, {
            fileName: "[project]/frontend/src/components/ui/Icon.tsx",
            lineNumber: 71,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/src/components/ui/Icon.tsx",
        lineNumber: 62,
        columnNumber: 5
    }, this);
}
_c = Icon;
var _c;
__turbopack_context__.k.register(_c, "Icon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/components/ErrorBoundary.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ErrorBoundary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ui$2f$Icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/components/ui/Icon.tsx [app-client] (ecmascript)");
"use client";
;
;
;
class ErrorBoundary extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Component"] {
    constructor(props){
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error
        };
    }
    componentDidCatch(error, errorInfo) {
        console.error("[ErrorBoundary] 捕获到错误:", error, errorInfo);
    }
    handleReload = ()=>{
        window.location.reload();
    };
    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "error-fallback",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "error-fallback__container",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "error-fallback__icon",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ui$2f$Icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                name: "triangle-warning",
                                size: "3rem"
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/components/ErrorBoundary.tsx",
                                lineNumber: 46,
                                columnNumber: 51
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/frontend/src/components/ErrorBoundary.tsx",
                            lineNumber: 46,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "error-fallback__title",
                            children: "页面出现了问题"
                        }, void 0, false, {
                            fileName: "[project]/frontend/src/components/ErrorBoundary.tsx",
                            lineNumber: 47,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "error-fallback__message",
                            children: "抱歉，页面加载时遇到了意外错误。请尝试刷新页面或返回上一页。"
                        }, void 0, false, {
                            fileName: "[project]/frontend/src/components/ErrorBoundary.tsx",
                            lineNumber: 48,
                            columnNumber: 13
                        }, this),
                        ("TURBOPACK compile-time value", "development") === "development" && this.state.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                            className: "error-fallback__details",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                    children: "错误详情（开发模式）"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/src/components/ErrorBoundary.tsx",
                                    lineNumber: 53,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                    className: "error-fallback__stack",
                                    children: [
                                        this.state.error.message,
                                        "\n\n",
                                        this.state.error.stack
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/src/components/ErrorBoundary.tsx",
                                    lineNumber: 54,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/src/components/ErrorBoundary.tsx",
                            lineNumber: 52,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "error-fallback__actions",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn btn--primary",
                                onClick: this.handleReload,
                                children: "重试"
                            }, void 0, false, {
                                fileName: "[project]/frontend/src/components/ErrorBoundary.tsx",
                                lineNumber: 62,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/frontend/src/components/ErrorBoundary.tsx",
                            lineNumber: 61,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/src/components/ErrorBoundary.tsx",
                    lineNumber: 45,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/frontend/src/components/ErrorBoundary.tsx",
                lineNumber: 44,
                columnNumber: 9
            }, this);
        }
        return this.props.children;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/app/providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/contexts/ThemeContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$contexts$2f$AIContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/contexts/AIContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$contexts$2f$JobFlowContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/contexts/JobFlowContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$contexts$2f$ResumeBuilderContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/contexts/ResumeBuilderContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ErrorBoundary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/components/ErrorBoundary.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
function Providers({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$components$2f$ErrorBoundary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$contexts$2f$AIContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AIProvider"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$contexts$2f$JobFlowContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JobFlowProvider"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$contexts$2f$ResumeBuilderContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResumeBuilderProvider"], {
                            children: children
                        }, void 0, false, {
                            fileName: "[project]/frontend/src/app/providers.tsx",
                            lineNumber: 19,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/frontend/src/app/providers.tsx",
                        lineNumber: 18,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/frontend/src/app/providers.tsx",
                    lineNumber: 17,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/frontend/src/app/providers.tsx",
                lineNumber: 16,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/frontend/src/app/providers.tsx",
            lineNumber: 15,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/src/app/providers.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_c = Providers;
var _c;
__turbopack_context__.k.register(_c, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=frontend_src_0~pvxc2._.js.map