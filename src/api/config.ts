import { apiClient } from './base'
import type { ApiResponse } from './base'

// 配置项
export interface ConfigItem {
  key: string
  name: string
  value: string
}

// TabBar项
export interface TabBarItem {
  id: string
  pagePath: string
  text: string
  icon: string
  activeIcon: string
  order: number
}

// 快捷操作项
export interface QuickAction {
  id: string
  name: string
  subtitle: string
  icon: string
  activeIcon: string
  path: string
  color: string
  order: number
}

// 首页配置响应数据
export interface HomeConfigResponseData {
  quickActions: QuickAction[]
  backgroundImage: string
}

/**
 * 配置相关API
 */
export class ConfigApi {
  /**
   * 获取小程序配置
   */
  async getMiniProgramConfig(): Promise<ApiResponse<ConfigItem[]>> {
    return apiClient.get<ConfigItem[]>('/api/v1/sys/config/category/miniprogram')
  }

  /**
   * 获取首页配置
   */
  async getHomeConfig(): Promise<ApiResponse<HomeConfigResponseData>> {
    return apiClient.get<HomeConfigResponseData>('/config/home')
  }

  /**
   * 获取TabBar配置
   */
  async getTabBarConfig(): Promise<ApiResponse<TabBarItem[]>> {
    return apiClient.get<TabBarItem[]>('/config/tabbar')
  }
}

// 导出实例
export const configApi = new ConfigApi()
export default configApi