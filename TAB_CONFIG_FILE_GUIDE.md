# 📄 Tab配置文件使用指南

## 🎯 概述

通过配置文件 `src/config/tabConfig.json` 来管理底部Tab栏的显示内容、顺序和权限控制，无需UI界面，直接修改配置文件即可生效。

## 📁 配置文件结构

### 核心配置文件
```
src/config/tabConfig.json
```

### 管理器文件
```
src/utils/configTabManager.ts
```

## ⚙️ 配置文件详解

### 1. 基础结构
```json
{
  "version": "1.0.0",
  "description": "底部Tab栏配置文件",
  "lastUpdated": "2024-10-01",
  "config": {
    "style": { ... },
    "tabs": [ ... ]
  },
  "environments": { ... },
  "permissions": { ... }
}
```

### 2. Tab项配置
```json
{
  "id": "home",                    // Tab唯一标识
  "pagePath": "pages/index/index", // 页面路径
  "text": "首页",                  // 显示文本
  "icon": "🏠",                   // 默认图标
  "selectedIcon": "🏠",           // 选中图标
  "enabled": true,                // 是否启用
  "order": 1,                     // 显示顺序
  "roles": ["admin", "user", "guest"] // 允许访问的角色
}
```

### 3. 样式配置
```json
"style": {
  "color": "#999999",           // 默认文字颜色
  "selectedColor": "#007aff",   // 选中文字颜色
  "backgroundColor": "#ffffff", // 背景颜色
  "borderStyle": "black"        // 边框样式
}
```

### 4. 权限配置
```json
"permissions": {
  "roles": {
    "admin": {
      "name": "管理员",
      "description": "拥有所有权限",
      "allowedTabs": ["*"]
    },
    "user": {
      "name": "普通用户",
      "description": "基础功能权限",
      "allowedTabs": ["home", "dataReport", "qualityControl", "oralAI"]
    }
  }
}
```

## 🔧 常用操作

### 1. 启用/禁用Tab
修改Tab项的 `enabled` 字段：
```json
{
  "id": "department",
  "enabled": true,  // 改为 false 禁用
  // ...其他配置
}
```

### 2. 调整Tab顺序
修改Tab项的 `order` 字段：
```json
{
  "id": "oralAI",
  "order": 2,  // 数字越小越靠前
  // ...其他配置
}
```

### 3. 权限控制
修改Tab项的 `roles` 字段：
```json
{
  "id": "department",
  "roles": ["admin"],  // 仅管理员可见
  // ...其他配置
}
```

### 4. 修改图标
更换Tab的图标：
```json
{
  "id": "home",
  "icon": "🏡",        // 默认状态图标
  "selectedIcon": "🏠", // 选中状态图标
  // ...其他配置
}
```

## 🚀 配置示例

### 示例1：管理员看到所有Tab
用户角色为 `admin` 时，可以看到所有启用的Tab。

### 示例2：普通用户限制权限
```json
// 用户角色为 "user" 时，只能看到基础功能Tab
{
  "id": "department",
  "enabled": true,
  "roles": ["admin"]  // 普通用户看不到此Tab
}
```

### 示例3：开发环境显示所有Tab
```json
"environments": {
  "development": {
    "enableDebugTab": true,
    "showAllTabs": true  // 开发时显示所有Tab
  }
}
```

## 🔍 调试和验证

### 1. 控制台日志
启动时查看日志：
```
初始化基于配置文件的TabBar
配置统计: {version: "1.0.0", totalTabs: 6, enabledTabs: 4, userRole: "user"}
启用的Tab: [{id: "home", text: "首页"}, ...]
```

### 2. 配置验证
系统会自动验证配置：
- Tab数量不超过5个
- ID和页面路径唯一性
- 用户权限检查

### 3. 手动测试
在控制台执行：
```javascript
// 获取配置统计
console.log(configTabManager.getConfigStats())

// 获取当前用户可见Tab
console.log(configTabManager.getEnabledTabs())

// 切换用户角色测试
configTabManager.setUserRole('admin')
```

## 📋 预设配置方案

### 方案1：基础版（4个Tab）
- 首页、数据上报、督查、口腔AI
- 适合普通用户

### 方案2：完整版（6个Tab）
- 首页、数据上报、督查、口腔AI、部门管理、患者管理
- 适合管理员用户

### 方案3：精简版（3个Tab）
- 首页、数据上报、督查
- 适合访客用户

## ⚠️ 注意事项

### 1. 配置限制
- 最多支持5个Tab（小程序限制）
- Tab ID必须唯一
- 页面路径必须在 `app.config.ts` 中注册

### 2. 权限系统
- 用户角色从 `userInfo.role` 读取
- 默认角色为 `user`
- 管理员用户名为 `admin` 时自动设置为 `admin` 角色

### 3. 生效机制
- 配置修改后需要重新编译
- 用户角色变化需要重启应用

## 🔄 配置更新流程

1. **修改配置**：编辑 `src/config/tabConfig.json`
2. **验证配置**：检查JSON格式和字段完整性
3. **重新编译**：`npm run build:weapp`
4. **测试验证**：微信开发者工具中测试
5. **部署发布**：上传到正式环境

## 🛠️ 高级功能

### 1. 环境区分
开发环境和生产环境可以有不同的配置策略。

### 2. 动态权限
支持基于用户角色的动态Tab显示。

### 3. 配置版本管理
通过版本号追踪配置变更历史。

### 4. 统计分析
提供配置使用统计和分析功能。

现在你可以通过修改配置文件来完全控制Tab的显示、顺序和权限了！🎉