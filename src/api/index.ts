// 导出基础API客户端
export { apiClient, BaseApiClient } from './base'
export type { ApiResponse, RequestConfig } from './base'

// 导出认证API
export { authApi, extractSessionId } from './auth'
export type {
  CaptchaResponseData,
  LoginParams,
  LoginXParams,
  OAuthLoginParams,
  LoginResponseData,
  DecryptPhoneParams,
  DecryptPhoneResponseData
} from './auth'

// 导出配置API
export { configApi } from './config'
export type {
  ConfigItem,
  TabBarItem,
  QuickAction,
  HomeConfigResponseData
} from './config'

// 兼容性导出 - 保持原有导入方式工作
export const apiClientLegacy = {
  // 认证相关
  getCaptcha: () => authApi.getCaptcha(),
  login: (params: any) => authApi.login(params),
  loginX: (params: any) => authApi.loginX(params),
  oauthLogin: (params: any) => authApi.oauthLogin(params),
  decryptPhone: (params: any) => authApi.decryptPhone(params),

  // 配置相关
  getMiniProgramConfig: () => configApi.getMiniProgramConfig(),
  getHomeConfig: () => configApi.getHomeConfig(),
  getTabBarConfig: () => configApi.getTabBarConfig(),
}

// 兼容性函数导出
export const getCaptchaSessionId = () => authApi.getCaptchaSessionId()

// 默认导出保持向后兼容
export default apiClientLegacy