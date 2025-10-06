import { apiClient } from './base'
import type { ApiResponse } from './base'

// 验证码响应数据
export interface CaptchaResponseData {
  image: string  // base64图片
  key: string    // 验证码key
}

// 手机号授权登录请求参数
export interface OAuthLoginParams {
  username: string    // 手机号
  code: string        // 登录凭证
  channel: string     // 渠道标识：miniprogram
}

// 用户名密码登录请求参数
export interface LoginParams {
  username: string    // 用户名
  password: string    // 密码
  captcha: string     // 验证码
  captchaKey?: string // 验证码key（时间戳）
}

// 用户名登录请求参数
export interface LoginXParams {
  username: string    // 用户名
}

// 登录响应数据
export interface LoginResponseData {
  token?: string
  userInfo?: {
    id: string
    username: string
    nickname: string
    avatar: string
    phone: string
  }
  // 新增字段以支持直接返回用户信息的情况
  areaCity?: string | null
  areaCityname?: string | null
  areaDistrict?: string | null
  areaDistrictname?: string | null
  areaProvince?: string | null
  areaProvincename?: string | null
  avatar?: string
  departmentAddress?: string | null
  departmentAddsuboper?: string | null
  departmentAddsubopermoblie?: string | null
  departmentId?: string
  departmentLevel?: string | null
  departmentName?: string
  departmentQcoper?: string | null
  departmentQcopermobile?: string | null
  description?: string | null
  email?: string
  id?: string
  isFolder?: number
  isMain?: string | null
  mobile?: string
  name?: string
  orgOwner?: boolean
  userType?: string
  username?: string
}

// 解密手机号请求参数
export interface DecryptPhoneParams {
  code: string           // 微信登录凭证
  encryptedData: string  // 加密数据
  iv: string            // 解密向量
}

// 解密手机号响应数据
export interface DecryptPhoneResponseData {
  phoneNumber: string    // 解密后的手机号
}

// 存储验证码session
let captchaSessionId: string | null = null

// 从cookie字符串中提取JSESSIONID
function extractSessionId(cookieString: string): string | null {
  const match = cookieString.match(/JSESSIONID=([^;]+)/)
  return match ? match[1] : null
}

/**
 * 认证相关API
 */
export class AuthApi {
  /**
   * 获取验证码
   */
  async getCaptcha(): Promise<ApiResponse<CaptchaResponseData>> {
    const response = await apiClient.get<CaptchaResponseData>('/auth/captcha')

    // 保存验证码session
    if (response.success && response.data) {
      captchaSessionId = response.data.key
    }

    return response
  }

  /**
   * 用户名密码登录
   */
  async login(params: LoginParams): Promise<ApiResponse<LoginResponseData>> {
    return apiClient.post<LoginResponseData>('/auth/login', params)
  }

  /**
   * 用户名登录（临时接口）
   */
  async loginX(params: LoginXParams): Promise<ApiResponse<LoginResponseData>> {
    return apiClient.post<LoginResponseData>('/auth/loginX', params)
  }

  /**
   * 手机号授权登录
   */
  async oauthLogin(params: OAuthLoginParams): Promise<ApiResponse<LoginResponseData>> {
    return apiClient.post<LoginResponseData>('/auth/oauth-login', params)
  }

  /**
   * 解密手机号
   */
  async decryptPhone(params: DecryptPhoneParams): Promise<ApiResponse<DecryptPhoneResponseData>> {
    return apiClient.post<DecryptPhoneResponseData>('/auth/decrypt-phone', params)
  }

  /**
   * 获取验证码session ID
   */
  getCaptchaSessionId(): string | null {
    return captchaSessionId
  }
}

// 导出实例
export const authApi = new AuthApi()
export default authApi

// 导出工具函数
export { extractSessionId }