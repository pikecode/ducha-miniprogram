/**
 * 小程序配置管理工具
 */
import Taro from '@tarojs/taro'

/**
 * 获取小程序配置
 */
export const getMiniProgramConfig = () => {
  return Taro.getStorageSync('miniProgramConfig') || {}
}

/**
 * 获取指定配置项
 * @param key 配置项的键
 * @param defaultValue 默认值
 */
export const getConfigValue = (key: string, defaultValue: any = null) => {
  const config = getMiniProgramConfig()
  return config[key] || defaultValue
}

/**
 * 检查配置是否已加载
 */
export const isConfigLoaded = () => {
  const config = getMiniProgramConfig()
  return Object.keys(config).length > 0
}

export default {
  getMiniProgramConfig,
  getConfigValue,
  isConfigLoaded
}