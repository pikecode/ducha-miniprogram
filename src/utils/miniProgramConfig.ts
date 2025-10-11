/**
 * 小程序配置管理工具
 */
import Taro from '@tarojs/taro'
import { configApi } from '../api/config'

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
 * 全局配置加载状态管理
 */
let isLoadingConfig = false
let configLoadPromise: Promise<void> | null = null

/**
 * 确保配置已加载（单例模式，避免重复请求）
 */
export const ensureConfigLoaded = async (): Promise<void> => {
  // 如果配置已加载，直接返回
  if (isConfigLoaded()) {
    return Promise.resolve()
  }

  // 如果正在加载配置，返回现有的Promise
  if (isLoadingConfig && configLoadPromise) {
    return configLoadPromise
  }

  // 开始加载配置
  isLoadingConfig = true
  configLoadPromise = loadMiniProgramConfig()

  try {
    await configLoadPromise
  } finally {
    isLoadingConfig = false
    configLoadPromise = null
  }
}

/**
 * 加载小程序配置（内部函数）
 */
const loadMiniProgramConfig = async (): Promise<void> => {
  try {
    const response = await configApi.getMiniProgramConfig()
    if (response.success && response.data) {
      Taro.setStorageSync('miniProgramConfig', { data: response.data })
    }
  } catch (error) {
    console.error('加载小程序配置失败:', error)
    throw error
  }
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

/**
 * 获取TabBar首页相关配置
 */
export const getTabBarMainConfig = () => {
  return {
    activePicUrl: getConfigValue('bar_main_active_pic_url', ''),
    unactivePicUrl: getConfigValue('bar_main_unactive_pic_url', ''),
    name: getConfigValue('bar_main_name', '首页'),
    show: getConfigValue('bar_main_show', 'false') === 'true'
  }
}

/**
 * 获取TabBar数据上报相关配置
 */
export const getTabBarDataConfig = () => {
  return {
    activePicUrl: getConfigValue('bar_data_active_pic_url', ''),
    unactivePicUrl: getConfigValue('bar_data_unactive_pic_url', ''),
    name: getConfigValue('bar_data_name', '数据上报'),
    show: getConfigValue('bar_data_show', 'false') === 'true'
  }
}

/**
 * 获取TabBar督查相关配置
 */
export const getTabBarInspectConfig = () => {
  return {
    activePicUrl: getConfigValue('bar_inspect_active_pic_url', ''),
    unactivePicUrl: getConfigValue('bar_inspect_unactive_pic_url', ''),
    name: getConfigValue('bar_inspect_name', '督查'),
    show: getConfigValue('bar_inspect_show', 'false') === 'true'
  }
}

/**
 * 获取TabBar AI相关配置
 */
export const getTabBarAiConfig = () => {
  return {
    activePicUrl: getConfigValue('bar_ai_active_piic_url', ''), // 注意这里是piic，API中的拼写错误
    unactivePicUrl: getConfigValue('bar_ai_unactive_pic_url', ''),
    name: getConfigValue('bar_ai_name', 'AI'),
    show: getConfigValue('bar_ai_show', 'false') === 'true'
  }
}

/**
 * 获取AI API配置
 */
export const getAiApiConfig = () => {
  return {
    apiUrl: getConfigValue('ai_api_url', 'https://try.hskj.cc/v1/chat-messages'),
    appKey: getConfigValue('ai_appkey', 'app-wX0U1dahPIYHfrMNRmXLUg6n')
  }
}

/**
 * 获取首页数据上报导航配置
 */
export const getNavDataConfig = () => {
  return {
    picUrl: getConfigValue('nav_data_pic_url', ''),
    name: getConfigValue('nav_data_name', '数据上报'),
    desc: getConfigValue('nav_data_desc', '统计数据填报')
  }
}

/**
 * 获取首页质控督查导航配置
 */
export const getNavInspectConfig = () => {
  return {
    picUrl: getConfigValue('nav_inspect_pic_url', ''),
    name: getConfigValue('nav_inspect_name', '质控督查'),
    desc: getConfigValue('nav_inspect_desc', '质量控制管理')
  }
}

export default {
  getMiniProgramConfig,
  getConfigArray,
  getConfigValue,
  isConfigLoaded,
  ensureConfigLoaded,
  getSystemName,
  getLogoUrl,
  getMainPicUrl,
  getTabBarMainConfig,
  getTabBarDataConfig,
  getTabBarInspectConfig,
  getTabBarAiConfig,
  getAiApiConfig,
  getNavDataConfig,
  getNavInspectConfig
}