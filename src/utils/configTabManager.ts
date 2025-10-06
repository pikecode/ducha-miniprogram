import tabConfigData from '../config/tabConfig.json'
import Taro from '@tarojs/taro'

export interface TabConfig {
  id: string
  pagePath: string
  text: string
  icon: string
  selectedIcon: string
  enabled: boolean
  order: number
}

export interface TabStyle {
  color: string
  selectedColor: string
  backgroundColor: string
  borderStyle: string
}

/**
 * 基于配置文件的Tab管理器
 */
class ConfigTabManager {
  private config = tabConfigData

  /**
   * 获取Tab样式配置
   */
  getTabStyle(): TabStyle {
    return this.config.config.style
  }

  /**
   * 获取所有Tab配置
   */
  getAllTabs(): TabConfig[] {
    return this.config.config.tabs
  }

  /**
   * 获取启用的Tab列表
   */
  getEnabledTabs(): TabConfig[] {
    return this.config.config.tabs
      .filter(tab => tab.enabled)
      .sort((a, b) => a.order - b.order)
  }

  /**
   * 根据ID获取Tab配置
   */
  getTabById(id: string): TabConfig | undefined {
    return this.config.config.tabs.find(tab => tab.id === id)
  }

  /**
   * 根据页面路径获取Tab配置
   */
  getTabByPath(pagePath: string): TabConfig | undefined {
    return this.config.config.tabs.find(tab => tab.pagePath === pagePath)
  }


  /**
   * 验证Tab配置有效性
   */
  validateConfig(): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    const enabledTabs = this.getEnabledTabs()

    if (enabledTabs.length === 0) {
      errors.push('没有启用的Tab')
    }

    if (enabledTabs.length > 5) {
      errors.push('启用的Tab数量超过5个（小程序限制）')
    }

    // 检查页面路径唯一性
    const paths = enabledTabs.map(tab => tab.pagePath)
    const duplicatePaths = paths.filter((path, index) => paths.indexOf(path) !== index)
    if (duplicatePaths.length > 0) {
      errors.push(`重复的页面路径: ${duplicatePaths.join(', ')}`)
    }

    // 检查ID唯一性
    const ids = enabledTabs.map(tab => tab.id)
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index)
    if (duplicateIds.length > 0) {
      errors.push(`重复的Tab ID: ${duplicateIds.join(', ')}`)
    }

    // 检查顺序连续性
    const orders = enabledTabs.map(tab => tab.order).sort((a, b) => a - b)
    for (let i = 1; i < orders.length; i++) {
      if (orders[i] - orders[i - 1] > 5) {
        errors.push('Tab顺序间隔过大，建议重新排序')
        break
      }
    }

    return { valid: errors.length === 0, errors }
  }

  /**
   * 获取配置统计信息
   */
  getConfigStats() {
    const allTabs = this.getAllTabs()
    const enabledTabs = this.getEnabledTabs()

    return {
      version: this.config.version,
      lastUpdated: this.config.lastUpdated,
      totalTabs: allTabs.length,
      enabledTabs: enabledTabs.length,
      environment: process.env.NODE_ENV
    }
  }

  /**
   * 开发模式：动态修改Tab状态（仅开发环境）
   */
  devToggleTab(tabId: string): boolean {
    if (process.env.NODE_ENV !== 'development') {

      return false
    }

    const tab = this.getTabById(tabId)
    if (!tab) {
      console.error(`Tab ${tabId} 不存在`)
      return false
    }

    // 注意：这只是临时修改，不会持久化
    tab.enabled = !tab.enabled

    return true
  }

  /**
   * 获取配置文件路径（用于文档说明）
   */
  getConfigPath(): string {
    return 'src/config/tabConfig.json'
  }
}

// 导出单例
export const configTabManager = new ConfigTabManager()