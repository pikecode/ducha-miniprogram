# Token管理系统设计与实现

## 系统架构

### 1. AuthManager 类 (src/utils/auth.ts)
- **单例模式**：确保全局只有一个token管理实例
- **自动加载**：初始化时从本地存储读取token
- **Bearer处理**：自动处理token的Bearer前缀
- **格式验证**：验证JWT token格式
- **清理机制**：提供logout清理所有认证信息

### 2. API客户端集成 (src/utils/api.ts)
- **自动注入**：每个请求自动添加Authorization头
- **失效处理**：401/403错误自动清除token并跳转登录
- **响应捕获**：从响应头捕获新的authorization token

### 3. 登录流程 (src/pages/login/index.tsx)
- **用户名登录**：调用 `/api/v1/users/loginx`
- **Token提取**：从响应头获取 `authorization: Bearer xxx`
- **统一管理**：使用authManager管理token生命周期

## 完整认证流程

### 登录流程
1. 用户输入用户名
2. 调用 `apiClient.loginX({username})`
3. 后端返回 `authorization: Bearer token` 在响应头
4. `authManager.setToken(authorization)` 处理token
5. 调用 `apiClient.getTaskLiveList({orgId})` 测试认证

### Token使用流程
1. API请求前：`authManager.getToken()` 获取存储的token
2. 添加请求头：`Authorization: Bearer ${token}`
3. 发送请求到各种接口（如任务列表接口）

### Token失效处理
1. 接收到401/403响应
2. `authManager.logout()` 清除所有认证信息
3. 自动跳转到登录页面

## 关键API

### authManager API
- `setToken(authorization)` - 设置token（自动处理Bearer前缀）
- `getToken()` - 获取纯token
- `getAuthorizationHeader()` - 获取完整Authorization头
- `isAuthenticated()` - 检查是否已登录
- `validateToken()` - 验证token格式
- `logout()` - 清除所有认证信息

### 使用示例
```typescript
// 登录成功后
authManager.setToken(response.authorization)

// API请求时（自动处理）
const token = authManager.getToken()
headers['Authorization'] = `Bearer ${token}`

// 检查登录状态
if (authManager.isAuthenticated()) {
  // 已登录
}

// 登出
authManager.logout()
```

## 安全特性
1. **Bearer前缀自动处理**：避免重复添加
2. **JWT格式验证**：基本的token格式检查
3. **自动失效处理**：401/403自动清理并跳转
4. **本地存储同步**：token变更自动同步到storage
5. **错误处理**：完整的错误捕获和处理机制