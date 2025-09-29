import Taro from '@tarojs/taro'
import { API_CONFIG, REQUEST_TIMEOUT } from './config'

// 接口响应类型
interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success: boolean
}

// 手机号授权登录请求参数
interface OAuthLoginParams {
  username: string    // 手机号
  code: string        // 登录凭证
  channel: string     // 渠道标识：miniprogram
}

// 用户名密码登录请求参数
interface LoginParams {
  username: string    // 用户名
  password: string    // 密码
  captcha: string     // 验证码
}

// 登录响应数据
interface LoginResponseData {
  token: string
  userInfo: {
    id: string
    username: string
    nickname: string
    avatar: string
    phone: string
  }
}

// 解密手机号请求参数
interface DecryptPhoneParams {
  code: string           // 微信登录凭证
  encryptedData: string  // 加密数据
  iv: string            // 解密向量
}

// 解密手机号响应数据
interface DecryptPhoneResponseData {
  phoneNumber: string    // 解密后的手机号
}

// 封装请求方法
class ApiClient {

  private baseURL: string

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL
  }

  // 通用请求方法
  private async request<T>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {

    const fullUrl = `${this.baseURL}${url}`

    try {
      console.log('发起请求:', {
        url: fullUrl,
        method,
        data,
        headers
      })

      const response = await Taro.request({
        url: fullUrl,
        method,
        data,
        header: {
          'Content-Type': 'application/json',
          ...headers
        },
        timeout: REQUEST_TIMEOUT
      })

      console.log('接口响应:', response)

      // 检查HTTP状态码
      if (response.statusCode !== 200) {
        throw new Error(`HTTP错误: ${response.statusCode}`)
      }

      const result = response.data as ApiResponse<T>

      // 检查业务状态码
      if (!result.success && result.code !== 200) {
        throw new Error(result.message || '请求失败')
      }

      return result

    } catch (error) {
      console.error('接口请求失败:', error)

      // 显示错误提示
      Taro.showToast({
        title: error.message || '网络请求失败',
        icon: 'none',
        duration: 2000
      })

      throw error
    }
  }

  // 手机号授权登录接口
  async oauthLogin(params: OAuthLoginParams): Promise<ApiResponse<LoginResponseData>> {
    return this.request<LoginResponseData>(
      API_CONFIG.ENDPOINTS.OAUTH_LOGIN,
      'POST',
      params
    )
  }

  // 用户名密码登录接口
  async login(params: LoginParams): Promise<ApiResponse<LoginResponseData>> {
    return this.request<LoginResponseData>(
      API_CONFIG.ENDPOINTS.LOGIN,
      'POST',
      params
    )
  }

  // 获取验证码接口
  async getCaptcha(): Promise<ApiResponse<{ image: string, key: string }>> {
    return this.request<{ image: string, key: string }>(
      API_CONFIG.ENDPOINTS.CAPTCHA,
      'GET'
    )
  }

  // 解密手机号接口
  async decryptPhone(params: DecryptPhoneParams): Promise<ApiResponse<DecryptPhoneResponseData>> {
    return this.request<DecryptPhoneResponseData>(
      API_CONFIG.ENDPOINTS.DECRYPT_PHONE,
      'POST',
      params
    )
  }

  // 设置请求头（用于设置token等）
  setAuthToken(token: string) {
    // 可以在这里设置全局token
    console.log('设置认证token:', token)
  }
}

// 导出API客户端实例
export const apiClient = new ApiClient()

// 导出类型
export type { OAuthLoginParams, LoginParams, LoginResponseData, DecryptPhoneParams, DecryptPhoneResponseData, ApiResponse }