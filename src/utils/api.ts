import Taro from '@tarojs/taro'
import { API_CONFIG, REQUEST_TIMEOUT } from './config'

// 接口响应类型
interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success: boolean
}

// 登录请求参数
interface LoginParams {
  username: string    // 手机号
  captcha: string     // 小程序登录的code
  cryptoCode: string  // 手机号加密数据
  channel: string     // 渠道标识：miniprogram
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

  // 登录接口
  async login(params: LoginParams): Promise<ApiResponse<LoginResponseData>> {
    return this.request<LoginResponseData>(
      API_CONFIG.ENDPOINTS.OAUTH_LOGIN,
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
export type { LoginParams, LoginResponseData, ApiResponse }