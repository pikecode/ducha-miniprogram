# 📋 API配置管理使用指南

## 🎯 概述

通过配置文件 `src/config/apiConfig.json` 来管理API接口的参数配置，特别是督查接口的 `orgId` 参数，便于不同环境和组织的灵活配置。

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
    "organizationSettings": {
      "defaultOrgId": "b3140ef6c8344abb9544b3f836b27332",
      "description": "默认组织ID，用于督查任务列表等接口"
    },
    "endpoints": {
      "taskLiveList": {
        "url": "/api/v1/inspect/plan/task/livelist",
        "orgIdRequired": true,
        "description": "督查任务列表接口"
      }
    },
    "environments": {
      "development": {
        "orgId": "b3140ef6c8344abb9544b3f836b27332",
        "debug": true
      },
      "production": {
        "orgId": "b3140ef6c8344abb9544b3f836b27332",
        "debug": false
      }
    }
  }
}
```

### 配置字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `organizationSettings.defaultOrgId` | string | 默认组织ID |
| `endpoints.*.orgIdRequired` | boolean | 端点是否需要组织ID |
| `environments.*.orgId` | string | 环境特定的组织ID |
| `environments.*.debug` | boolean | 是否开启调试模式 |

## 🔧 使用方式

### 1. 修改组织ID
```json
{
  "environments": {
    "development": {
      "orgId": "your_dev_org_id_here",
      "debug": true
    },
    "production": {
      "orgId": "your_prod_org_id_here",
      "debug": false
    }
  }
}
```

### 2. 代码中使用
```typescript
import { apiConfigManager } from '@/utils/apiConfigManager'

// 获取当前环境的组织ID
const orgId = apiConfigManager.getTaskListOrgId()

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
- `getOrgId()` - 获取当前环境组织ID
- `getDefaultOrgId()` - 获取默认组织ID
- `getTaskListOrgId()` - 获取督查列表专用组织ID
- `getCurrentEnvironmentConfig()` - 获取当前环境配置

### 配置验证
- `validateOrgId(orgId)` - 验证组织ID格式
- `isOrgIdRequired(endpoint)` - 检查端点是否需要组织ID

### 调试功能
- `debugInfo()` - 输出调试信息（仅调试模式）
- `getConfigStats()` - 获取配置统计信息

### 开发辅助
- `devSetOrgId(orgId)` - 开发环境动态设置组织ID

## 🔍 调试和验证

### 1. 控制台日志
开发环境下会输出调试信息：
```
API配置调试信息: {
  version: "1.0.0",
  currentEnvironment: "development",
  currentOrgId: "b3140ef6c8344abb9544b3f836b27332",
  debugMode: true
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

// 开发环境测试不同组织ID
apiConfigManager.devSetOrgId('test_org_id_123456789012345678901234')
```

## 📝 配置更新流程

### 1. 修改组织ID
```json
// 编辑 src/config/apiConfig.json
{
  "environments": {
    "production": {
      "orgId": "new_production_org_id_here"
    }
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

### 场景1：多组织部署
```json
// 不同客户使用不同组织ID
{
  "environments": {
    "production": {
      "orgId": "customer_a_org_id"  // 客户A的组织ID
    }
  }
}
```

### 场景2：测试环境隔离
```json
// 开发和生产使用不同组织
{
  "environments": {
    "development": {
      "orgId": "test_org_id_for_development"
    },
    "production": {
      "orgId": "real_production_org_id"
    }
  }
}
```

### 场景3：组织ID格式验证
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

### 2. 环境配置
- 开发环境：`NODE_ENV=development`
- 生产环境：`NODE_ENV=production`
- 配置会自动根据环境加载

### 3. 配置生效
- 修改配置文件后需要重新编译
- 开发环境的动态设置仅临时有效

## 🚀 扩展建议

### 1. 添加新的端点配置
```json
{
  "endpoints": {
    "newEndpoint": {
      "url": "/api/v1/new/endpoint",
      "orgIdRequired": true,
      "description": "新端点描述"
    }
  }
}
```

### 2. 支持更多参数
可以扩展配置支持其他API参数：
- 超时配置
- 重试次数
- 缓存策略

### 3. 多租户支持
可以扩展为支持多租户的组织ID映射。

现在督查页面的 `orgId` 参数已经完全配置化，可以通过修改配置文件轻松切换不同的组织！🎉