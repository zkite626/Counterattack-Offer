# 10 — 状态管理文档

## 10.1 架构概览

使用 React Context + useReducer，分为四个独立 Context：

```
Providers 嵌套顺序:
  ThemeProvider        ← 主题状态
    AuthProvider       ← 认证状态
      AIProvider       ← AI模型配置
        JobFlowProvider ← 求职流程数据
```

---

## 10.2 ThemeContext

### State

```typescript
interface ThemeState {
  theme: 'light' | 'dark' | 'system';
  resolved: 'light' | 'dark';
}
```

### Actions

| Action | 说明 |
|--------|------|
| `SET_THEME` | 设置主题模式 |

### 持久化

- 存储位置：`localStorage('nixi-theme')`
- 初始化：读取 localStorage → 默认 `'system'`
- 副作用：设置 `document.documentElement.setAttribute('data-theme', resolved)`

---

## 10.3 AuthContext

### State

```typescript
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
```

### Actions

| Action | 说明 |
|--------|------|
| `LOGIN_SUCCESS` | 登录成功，存入用户信息 |
| `LOGOUT` | 登出，清空用户 |
| `SET_LOADING` | 设置加载状态 |
| `UPDATE_USER` | 更新用户信息 |

### 初始化

组件挂载时调用 `GET /api/auth/me` 验证当前 Cookie 中的 Token。

### 暴露方法

```typescript
interface AuthContextValue {
  state: AuthState;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}
```

---

## 10.4 AIContext

### State

```typescript
interface AIState {
  models: AIModelConfig[];      // 所有模型配置
  activeModelId: string | null; // 当前激活模型ID
  isTestingConnection: boolean;
}
```

### Actions

| Action | 说明 |
|--------|------|
| `ADD_MODEL` | 添加模型 |
| `UPDATE_MODEL` | 更新模型配置 |
| `REMOVE_MODEL` | 删除模型 |
| `SET_ACTIVE` | 设置激活模型 |
| `LOAD_MODELS` | 从localStorage加载 |
| `SET_TESTING` | 连接测试状态 |

### 持久化

- 存储位置：`localStorage('nixi-ai-models')`
- API Key 加密存储
- 初始化：加载 localStorage → 合并内置模型

### 暴露方法

```typescript
interface AIContextValue {
  state: AIState;
  activeModel: AIModelConfig | null;
  addModel: (config: Omit<AIModelConfig, 'id' | 'createdAt'>) => void;
  updateModel: (id: string, config: Partial<AIModelConfig>) => void;
  removeModel: (id: string) => void;
  setActiveModel: (id: string) => void;
  testConnection: (id: string) => Promise<boolean>;
  getModelConfig: () => { baseUrl: string; model: string; apiKey: string } | null;
}
```

---

## 10.5 JobFlowContext

### State

见 `types/index.ts` 中的 `JobFlowState`。

### Actions

见 `types/index.ts` 中的 `JobFlowAction`。

### 持久化

- 存储位置：`localStorage('nixi-job-flow')`
- 每次 dispatch 后自动保存
- 页面刷新恢复

### 暴露方法

```typescript
interface JobFlowContextValue {
  state: JobFlowState;
  dispatch: Dispatch<JobFlowAction>;
  // 便捷方法
  loadDemoCase: () => void;
  resetFlow: () => void;
  canAccessStep: (step: FlowStep) => boolean;
  getCompletionPercentage: () => number;
}
```

### 步骤解锁逻辑

```typescript
function canAccessStep(state: JobFlowState, step: FlowStep): boolean {
  switch (step) {
    case 'profile': return true;
    case 'diagnosis': return state.studentProfile !== null;
    case 'translation': return state.careerDiagnosis !== null;
    case 'job': return true; // 独立可用
    case 'match': return state.careerDiagnosis !== null && state.jobAnalysis !== null;
    case 'resume': return state.matchReport !== null;
    case 'interview': return state.resumeOptimization !== null;
    case 'plan': return state.matchReport !== null;
    case 'report': return state.completedSteps.length >= 5;
    default: return false;
  }
}
```

---

## 10.6 Hooks

### useAuth

```typescript
function useAuth(): AuthContextValue;
// 用法：const { state, login, logout } = useAuth();
```

### useAI

```typescript
function useAI(): AIContextValue;
// 用法：const { activeModel, getModelConfig } = useAI();
```

### useTheme

```typescript
function useTheme(): { theme: Theme; setTheme: (t: Theme) => void };
```

### useJobFlow

```typescript
function useJobFlow(): JobFlowContextValue;
// 用法：const { state, dispatch, canAccessStep } = useJobFlow();
```

---

## 10.7 数据流示例

```
用户点击"生成AI画像"
  → 检查 canAccessStep('diagnosis') → true
  → dispatch({ type: 'SET_LOADING', payload: true })
  → const modelConfig = getModelConfig()
  → fetch('/api/ai/diagnose', { body: { studentProfile, modelConfig } })
  → 收到响应
  → dispatch({ type: 'SET_DIAGNOSIS', payload: data })
  → dispatch({ type: 'SET_STEP', payload: 'diagnosis' })
  → localStorage 自动持久化
  → 页面显示诊断结果
```
