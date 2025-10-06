/**
 * 统一的日志工具
 * 在生产环境中禁用console.log和console.warn，只保留console.error
 */

const isDev = process.env.NODE_ENV === 'development'

export const logger = {
  /**
   * 开发环境日志，生产环境禁用
   */
  log: isDev ? console.log : () => {},

  /**
   * 开发环境警告，生产环境禁用
   */
  warn: isDev ? console.warn : () => {},

  /**
   * 错误日志，所有环境都保留
   */
  error: console.error,

  /**
   * 调试日志，仅开发环境
   */
  debug: isDev ? console.debug : () => {},

  /**
   * 信息日志，仅开发环境
   */
  info: isDev ? console.info : () => {}
}

export default logger