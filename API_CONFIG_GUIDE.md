# 📋 API配置管理使用指南

## 🎯 概述

通过配置文件 `src/config/apiConfig.json` 来管理API接口的 `orgId` 参数，简单直接，便于修改。

## 📁 核心文件

```
src/config/apiConfig.json          # API配置文件
src/utils/apiConfigManager.ts      # API配置管理器
src/pages/qualityControl/index.tsx # 督查页面（已配置化）
```

## ⚙️ 配置文件结构

### 完整配置示例
```json
{
  "version": "1.0.0",
  "description": "API接口配置文件",
  "lastUpdated": "2024-10-01",
  "config": {
    "orgId": "b3140ef6c8344abb9544b3f836b27332",
    "description": "组织ID，用于督查任务列表等接口"
  }
}
```

### 配置字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `config.orgId` | string | 组织ID，32位十六进制字符串 |
| `config.description` | string | 配置说明 |

## 🔧 使用方式

### 1. 修改组织ID
直接编辑配置文件：
```json
{
  "config": {
    "orgId": "your_new_org_id_here",
    "description": "组织ID，用于督查任务列表等接口"
  }
}
```

### 2. 代码中使用
```typescript
import { apiConfigManager } from '@/utils/apiConfigManager'

// 获取组织ID
const orgId = apiConfigManager.getOrgId()

// 获取配置统计
const stats = apiConfigManager.getConfigStats()

// 验证组织ID格式
const validation = apiConfigManager.validateOrgId(orgId)
```

### 3. 督查页面应用
```typescript
// src/pages/qualityControl/index.tsx
const response = await apiClient.getTaskLiveList({
  orgId: apiConfigManager.getTaskListOrgId() // 从配置获取
})
```

## 🎛️ API配置管理器功能

### 基础功能
- `getOrgId()` - 获取组织ID
- `getTaskListOrgId()` - 获取督查列表专用组织ID
- `getConfigStats()` - 获取配置统计信息

### 配置验证
- `validateOrgId(orgId)` - 验证组织ID格式

### 调试功能
- `debugInfo()` - 输出调试信息

## 🔍 调试和验证

### 1. 控制台日志
会输出调试信息：
```
API配置信息: {
  version: "1.0.0",
  lastUpdated: "2024-10-01",
  orgId: "b3140ef6c8344abb9544b3f836b27332",
  description: "组织ID，用于督查任务列表等接口"
}
```

### 2. 配置验证
```javascript
// 验证组织ID格式
const validation = apiConfigManager.validateOrgId('your_org_id')
if (!validation.valid) {
  console.error('组织ID格式错误:', validation.errors)
}
```

### 3. 手动测试
在控制台执行：
```javascript
// 查看当前配置
console.log(apiConfigManager.getConfigStats())
```

## 📝 配置更新流程

### 1. 修改组织ID
```json
// 编辑 src/config/apiConfig.json
{
  "config": {
    "orgId": "your_new_org_id_here"
  }
}
```

### 2. 重新编译
```bash
npm run build:weapp
```

### 3. 验证生效
查看控制台日志确认新的组织ID已生效。

## 🎯 实际应用场景

### 场景1：切换组织
```json
// 更换为新的组织ID
{
  "config": {
    "orgId": "new_customer_org_id_32_chars_here"
  }
}
```

### 场景2：格式验证
```typescript
// 自动验证组织ID格式
const { valid, errors } = apiConfigManager.validateOrgId(newOrgId)
if (!valid) {
  throw new Error(`组织ID格式错误: ${errors.join(', ')}`)
}
```

## ⚠️ 注意事项

### 1. 组织ID格式要求
- 长度：32位
- 格式：十六进制字符串 (a-f0-9)
- 示例：`b3140ef6c8344abb9544b3f836b27332`

### 2. 配置生效
- 修改配置文件后需要重新编译
- 配置简单，只需要改一个字段

## 🚀 使用总结

现在督查页面的 `orgId` 参数已经完全配置化：

1. **简单配置**：只需修改 `apiConfig.json` 中的 `orgId` 字段
2. **立即生效**：重新编译后配置即可生效
3. **格式验证**：自动验证组织ID格式是否正确
4. **调试友好**：控制台可查看当前配置信息

通过修改配置文件就能轻松切换不同的组织！🎉