import apiConfigData from '../config/apiConfig.json'

/**
 * 简化的API配置管理器
 */
class ApiConfigManager {
  private config = apiConfigData

  /**
   * 获取组织ID
   */
  getOrgId(): string {
    return this.config.config.orgId
  }

  /**
   * 获取督查任务列表接口的组织ID
   */
  getTaskListOrgId(): string {
    return this.getOrgId()
  }

  /**
   * 获取配置统计信息
   */
  getConfigStats() {
    return {
      version: this.config.version,
      lastUpdated: this.config.lastUpdated,
      orgId: this.config.config.orgId,
      description: this.config.config.description
    }
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

  }
}

// 导出单例
export const apiConfigManager = new ApiConfigManager()