import Taro from '@tarojs/taro'

// Token管理类
class AuthManager {
  private static instance: AuthManager
  private token: string | null = null

  private constructor() {
    // 初始化时从存储中读取token
    this.loadTokenFromStorage()
  }

  // 单例模式
  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager()
    }
    return AuthManager.instance
  }

  // 从存储中加载token
  private loadTokenFromStorage(): void {
    try {
      this.token = Taro.getStorageSync('token') || null
    } catch (error) {
      console.error('读取token失败:', error)
      this.token = null
    }
  }

  // 设置token
  setToken(authorization: string): void {
    try {
      // 如果authorization包含Bearer前缀，则提取纯token
      let cleanToken = authorization
      if (authorization && authorization.startsWith('Bearer ')) {
        cleanToken = authorization.substring(7)
      }

      this.token = cleanToken

      // 保存到本地存储
      Taro.setStorageSync('token', cleanToken)


    } catch (error) {
      console.error('保存token失败:', error)
      throw new Error('Token保存失败')
    }
  }

  // 获取token
  getToken(): string | null {
    return this.token
  }

  // 获取完整的Authorization头
  getAuthorizationHeader(): string | null {
    return this.token ? `Bearer ${this.token}` : null
  }

  // 获取请求头对象
  getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {}
    const authHeader = this.getAuthorizationHeader()
    if (authHeader) {
      headers.Authorization = authHeader
    }
    return headers
  }

  // 检查是否已登录
  isAuthenticated(): boolean {
    return !!this.token
  }

  // 清除token
  clearToken(): void {
    try {
      this.token = null
      Taro.removeStorageSync('token')

    } catch (error) {
      console.error('清除token失败:', error)
    }
  }

  // 登出
  logout(): void {
    this.clearToken()
    // 清除其他用户信息
    try {
      Taro.removeStorageSync('userInfo')
      Taro.removeStorageSync('phoneNumber')
      Taro.removeStorageSync('taskList')

    } catch (error) {
      console.error('登出失败:', error)
    }
  }

  // 验证token格式
  private isValidTokenFormat(token: string): boolean {
    // JWT token基本格式验证（三部分，用.分隔）
    return token && token.split('.').length === 3
  }

  // 检查token是否有效
  validateToken(): boolean {
    if (!this.token) {
      return false
    }

    return this.isValidTokenFormat(this.token)
  }
}

// 导出单例实例
export const authManager = AuthManager.getInstance()

// 检查用户是否已登录
export const checkLoginStatus = (): boolean => {
  const userInfo = Taro.getStorageSync('userInfo')
  const token = authManager.getToken()

  return !!(userInfo && token && authManager.validateToken())
}

// 获取用户信息
export const getUserInfo = () => {
  return Taro.getStorageSync('userInfo')
}

// 获取手机号
export const getPhoneNumber = (): string => {
  return Taro.getStorageSync('phoneNumber')
}

// 获取登录token
export const getToken = (): string => {
  return authManager.getToken() || ''
}

// 清除登录信息
export const clearLoginInfo = () => {
  authManager.logout()
}

// 跳转到登录页
export const navigateToLogin = () => {
  Taro.reLaunch({
    url: '/pages/login/index'
  })
}

// 检查登录状态，未登录则跳转
export const requireLogin = (): boolean => {
  if (!checkLoginStatus()) {
    navigateToLogin()
    return false
  }
  return true
}