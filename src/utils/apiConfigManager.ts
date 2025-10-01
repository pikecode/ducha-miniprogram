import apiConfigData from '../config/apiConfig.json'

export interface OrganizationSettings {
  defaultOrgId: string
  description: string
}

export interface EndpointConfig {
  url: string
  orgIdRequired: boolean
  description: string
}

export interface EnvironmentConfig {
  orgId: string
  debug: boolean
}

/**
 * API配置管理器
 */
class ApiConfigManager {
  private config = apiConfigData

  /**
   * 获取当前环境的组织ID
   */
  getOrgId(): string {
    const env = process.env.NODE_ENV === 'development' ? 'development' : 'production'
    return this.config.config.environments[env].orgId
  }

  /**
   * 获取默认组织ID
   */
  getDefaultOrgId(): string {
    return this.config.config.organizationSettings.defaultOrgId
  }

  /**
   * 获取组织设置
   */
  getOrganizationSettings(): OrganizationSettings {
    return this.config.config.organizationSettings
  }

  /**
   * 获取端点配置
   */
  getEndpointConfig(endpointName: string): EndpointConfig | undefined {
    return this.config.config.endpoints[endpointName]
  }

  /**
   * 获取督查任务列表接口的组织ID
   */
  getTaskListOrgId(): string {
    return this.getOrgId()
  }

  /**
   * 获取当前环境配置
   */
  getCurrentEnvironmentConfig(): EnvironmentConfig {
    const env = process.env.NODE_ENV === 'development' ? 'development' : 'production'
    return this.config.config.environments[env]
  }

  /**
   * 检查端点是否需要组织ID
   */
  isOrgIdRequired(endpointName: string): boolean {
    const endpoint = this.getEndpointConfig(endpointName)
    return endpoint?.orgIdRequired || false
  }

  /**
   * 获取配置统计信息
   */
  getConfigStats() {
    const currentEnv = process.env.NODE_ENV
    const currentConfig = this.getCurrentEnvironmentConfig()

    return {
      version: this.config.version,
      lastUpdated: this.config.lastUpdated,
      currentEnvironment: currentEnv,
      currentOrgId: currentConfig.orgId,
      debugMode: currentConfig.debug,
      endpointsCount: Object.keys(this.config.config.endpoints).length
    }
  }

  /**
   * 开发模式：动态设置组织ID（仅开发环境）
   */
  devSetOrgId(orgId: string): boolean {
    if (process.env.NODE_ENV !== 'development') {
      console.warn('组织ID设置仅在开发环境可用')
      return false
    }

    // 注意：这只是临时修改，不会持久化
    this.config.config.environments.development.orgId = orgId
    console.log(`开发环境组织ID已设置为: ${orgId}`)
    return true
  }

  /**
   * 验证组织ID格式
   */
  validateOrgId(orgId: string): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!orgId) {
      errors.push('组织ID不能为空')
    }

    if (typeof orgId !== 'string') {
      errors.push('组织ID必须是字符串')
    }

    if (orgId && orgId.length !== 32) {
      errors.push('组织ID长度应为32位')
    }

    if (orgId && !/^[a-f0-9]+$/.test(orgId)) {
      errors.push('组织ID格式不正确，应为32位十六进制字符串')
    }

    return { valid: errors.length === 0, errors }
  }

  /**
   * 获取配置文件路径（用于文档说明）
   */
  getConfigPath(): string {
    return 'src/config/apiConfig.json'
  }

  /**
   * 调试信息输出
   */
  debugInfo() {
    if (this.getCurrentEnvironmentConfig().debug) {
      console.log('API配置调试信息:', {
        ...this.getConfigStats(),
        organizationSettings: this.getOrganizationSettings(),
        endpoints: this.config.config.endpoints
      })
    }
  }
}

// 导出单例
export const apiConfigManager = new ApiConfigManager()