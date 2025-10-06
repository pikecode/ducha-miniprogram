import Taro from '@tarojs/taro'
import { API_CONFIG, REQUEST_TIMEOUT } from '../utils/config'
import { authManager } from '../utils/auth'
import { logger } from '../utils/logger'

// 接口响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success: boolean
  authorization?: string  // 响应头中的authorization
}

// 请求配置类型
export interface RequestConfig {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: Record<string, string>
  timeout?: number
}

/**
 * 基础API客户端类
 */
export class BaseApiClient {
  private baseURL: string
  private timeout: number

  constructor(baseURL: string = API_CONFIG.BASE_URL, timeout: number = REQUEST_TIMEOUT) {
    this.baseURL = baseURL
    this.timeout = timeout
  }

  /**
   * 获取默认请求头
   */
  private getDefaultHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    const token = authManager.getToken()
    if (token) {
      headers['Authorization'] = token
    }

    return headers
  }

  /**
   * 处理响应数据
   */
  private handleResponse<T>(response: any): ApiResponse<T> {
    const { statusCode, data, header } = response

    if (statusCode !== 200) {
      throw new Error(`请求失败: HTTP ${statusCode}`)
    }

    // 处理可能的字符串响应
    let responseData = data
    if (typeof data === 'string') {
      try {
        responseData = JSON.parse(data)
      } catch (e) {
        throw new Error('响应数据格式错误')
      }
    }

    // 统一响应格式
    const result: ApiResponse<T> = {
      code: responseData.code || 0,
      message: responseData.message || '',
      data: responseData.data,
      success: responseData.code === 0 || responseData.success === true
    }

    // 处理authorization头
    if (header && (header.authorization || header.Authorization)) {
      result.authorization = header.authorization || header.Authorization
    }

    return result
  }

  /**
   * 发送请求
   */
  async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    const {
      url,
      method,
      data,
      header = {},
      timeout = this.timeout
    } = config

    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`
    const headers = { ...this.getDefaultHeaders(), ...header }

    try {
      logger.log(`[API] ${method} ${fullURL}`, data)

      const response = await Taro.request({
        url: fullURL,
        method,
        data,
        header: headers,
        timeout
      })

      const result = this.handleResponse<T>(response)

      if (!result.success) {
        logger.error(`[API] 请求失败: ${result.message}`)
        throw new Error(result.message)
      }

      logger.log(`[API] 请求成功`, result)
      return result

    } catch (error) {
      logger.error(`[API] 请求异常: ${error.message}`)
      throw error
    }
  }

  /**
   * GET请求
   */
  async get<T = any>(url: string, params?: any, header?: Record<string, string>): Promise<ApiResponse<T>> {
    let fullURL = url
    if (params) {
      const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&')
      fullURL += (url.includes('?') ? '&' : '?') + queryString
    }

    return this.request<T>({
      url: fullURL,
      method: 'GET',
      header
    })
  }

  /**
   * POST请求
   */
  async post<T = any>(url: string, data?: any, header?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'POST',
      data,
      header
    })
  }

  /**
   * PUT请求
   */
  async put<T = any>(url: string, data?: any, header?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'PUT',
      data,
      header
    })
  }

  /**
   * DELETE请求
   */
  async delete<T = any>(url: string, header?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'DELETE',
      header
    })
  }
}

// 导出默认实例
export const apiClient = new BaseApiClient()
export default apiClient