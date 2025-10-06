/**
 * 小程序配置管理工具
 */
import Taro from '@tarojs/taro'

/**
 * 配置项接口
 */
interface ConfigItem {
  key: string
  name: string
  value: string
}

/**
 * 获取小程序配置原始数据
 */
export const getMiniProgramConfig = () => {
  return Taro.getStorageSync('miniProgramConfig') || {}
}

/**
 * 获取配置数组
 */
export const getConfigArray = (): ConfigItem[] => {
  const config = getMiniProgramConfig()
  return config.data || []
}

/**
 * 获取指定配置项的值
 * @param key 配置项的键
 * @param defaultValue 默认值
 */
export const getConfigValue = (key: string, defaultValue: string = ''): string => {
  const configArray = getConfigArray()
  const configItem = configArray.find(item => item.key === key)
  return configItem ? configItem.value : defaultValue
}

/**
 * 检查配置是否已加载
 */
export const isConfigLoaded = () => {
  const configArray = getConfigArray()
  return configArray.length > 0
}

/**
 * 获取系统名称
 */
export const getSystemName = () => {
  return getConfigValue('system_name', '督查小程序')
}

/**
 * 获取Logo地址
 */
export const getLogoUrl = () => {
  return getConfigValue('logo_url', '')
}

/**
 * 获取首页主图地址
 */
export const getMainPicUrl = () => {
  return getConfigValue('main_pic_url', '')
}

export default {
  getMiniProgramConfig,
  getConfigArray,
  getConfigValue,
  isConfigLoaded,
  getSystemName,
  getLogoUrl,
  getMainPicUrl
}