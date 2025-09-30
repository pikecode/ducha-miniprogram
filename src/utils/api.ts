import Taro from '@tarojs/taro'
import { API_CONFIG, REQUEST_TIMEOUT } from './config'
import { authManager } from './auth'

// 接口响应类型
interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success: boolean
  authorization?: string  // 响应头中的authorization
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
  captchaKey?: string // 验证码key（时间戳）
}

// 用户名登录请求参数
interface LoginXParams {
  username: string    // 用户名
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

// 督查列表请求参数
interface TaskLiveListParams {
  cateId?: string
  endTime?: string
  flowStatus?: string
  orgId?: string
  planName?: string
  startTime?: string
}

// 督查列表项数据
interface TaskLiveListItem {
  approveCount: number | null
  batchEndTime: string
  batchId: string
  batchName: string
  batchStartTime: string
  cateId: string
  createBy: string
  createTime: string
  currentBatchId: string
  dataIndex: any
  departCount: number
  departmentId: string
  departmentName: string
  departmentNameList: any
  endTime: string
  execDepartments: any
  expertIds: any
  expertType: any
  finishedCount: number | null
  flowCode: string
  flowMode: any
  flowStatus: string
  id: string
  isDeploy: string
  itemCount: number
  itemUserCount: number
  linkId: any
  linkName: any
  linkType: any
  orgId: string
  permission: any
  planCode: any
  planName: string
  planType: string
  preBatchId: any
  progressCount: any
  rejectCount: number | null
  remarks: string | null
  scoreDict: string | null
  startTime: string
  status: string
  templateId: any
  updateBy: string
  updateTime: string
  userId: string
  userName: string
}

// 督查列表响应数据
interface TaskLiveListResponseData {
  data: TaskLiveListItem[]  // 督查列表
  errCode: number
  exception: any
  message: string | null
  pageInfo: any
  success: boolean
  warnings: any
}

// 部门信息数据
interface DepartmentInfo {
  createBy: string
  createTime: string
  departmentBrevitycode: string
  departmentCode: string
  departmentId: string
  departmentName: string
  fullName: string
  id: string
  isFolder: number
  parentId: string
  permission: number
  status: number
  treeSort: number
  updateBy: string
  updateTime: string
}

// 分页信息
interface PageInfo {
  countTotal: boolean
  pageNo: number
  pageSize: number
  total: number
}

// 部门列表请求参数
interface DepartmentListParams {
  isfolder?: boolean
}

// 部门列表响应数据
interface DepartmentListResponseData {
  data: DepartmentInfo[]
  errCode: number
  message: string
  pageInfo: PageInfo
  success: boolean
  warnings: string[]
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

    // 获取token
    const token = authManager.getToken()

    try {
      console.log('发起请求:', {
        url: fullUrl,
        method,
        data,
        headers,
        token: token ? '***' : 'null'
      })

      const response = await Taro.request({
        url: fullUrl,
        method,
        data,
        header: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          ...headers
        },
        timeout: REQUEST_TIMEOUT
      })

      console.log('接口响应:', response)

      // 检查HTTP状态码
      if (response.statusCode !== 200) {
        // 401未授权，清除token并跳转登录
        if (response.statusCode === 401) {
          console.log('Token已失效，清除认证信息')
          authManager.logout()
          Taro.reLaunch({
            url: '/pages/login/index'
          })
        }
        throw new Error(`HTTP错误: ${response.statusCode}`)
      }

      const result = response.data as ApiResponse<T>

      // 从响应头中获取authorization
      const authorization = response.header?.authorization || response.header?.Authorization

      // 检查业务状态码
      if (!result.success && result.code !== 200) {
        // 如果是认证相关错误，也清除token
        if (result.code === 401 || result.code === 403) {
          console.log('认证失败，清除认证信息')
          authManager.logout()
          Taro.reLaunch({
            url: '/pages/login/index'
          })
        }
        throw new Error(result.message || '请求失败')
      }

      // 返回结果，包含响应头中的authorization
      return {
        ...result,
        authorization
      }

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

  // 用户名登录接口
  async loginX(params: LoginXParams): Promise<ApiResponse<LoginResponseData>> {
    return this.request<LoginResponseData>(
      API_CONFIG.ENDPOINTS.LOGIN_X,
      'POST',
      params
    )
  }

  // 获取验证码接口
  async getCaptcha(): Promise<ApiResponse<{ image: string, key: string }>> {
    const fullUrl = `${this.baseURL}${API_CONFIG.ENDPOINTS.CAPTCHA}`

    try {
      console.log('获取验证码:', fullUrl)

      const response = await Taro.request({
        url: fullUrl,
        method: 'GET',
        timeout: REQUEST_TIMEOUT
      })

      console.log('验证码响应:', response)

      // 检查HTTP状态码
      if (response.statusCode !== 200) {
        throw new Error(`HTTP错误: ${response.statusCode}`)
      }

      // 如果返回的是JSON格式
      if (response.data && typeof response.data === 'object' && response.data.image) {
        return {
          success: true,
          code: 200,
          message: '获取验证码成功',
          data: response.data
        }
      }

      // 如果返回的是图片，抛出错误让调用方使用fallback
      throw new Error('返回格式不是JSON，使用图片URL')

    } catch (error) {
      console.error('获取验证码失败:', error)
      throw error
    }
  }

  // 解密手机号接口
  async decryptPhone(params: DecryptPhoneParams): Promise<ApiResponse<DecryptPhoneResponseData>> {
    return this.request<DecryptPhoneResponseData>(
      API_CONFIG.ENDPOINTS.DECRYPT_PHONE,
      'POST',
      params
    )
  }

  // 获取督查列表接口
  async getTaskLiveList(params?: TaskLiveListParams): Promise<ApiResponse<TaskLiveListResponseData>> {
    return this.request<TaskLiveListResponseData>(
      API_CONFIG.ENDPOINTS.TASK_LIVE_LIST,
      'POST',
      params
    )
  }

  // 获取部门列表接口
  async getDepartmentList(params?: DepartmentListParams): Promise<ApiResponse<DepartmentListResponseData>> {
    // 构建查询参数
    const queryParams = new URLSearchParams()
    if (params?.isfolder !== undefined) {
      queryParams.append('isfolder', params.isfolder.toString())
    }

    const url = queryParams.toString()
      ? `${API_CONFIG.ENDPOINTS.DEPARTMENT_LIST}?${queryParams.toString()}`
      : API_CONFIG.ENDPOINTS.DEPARTMENT_LIST

    return this.request<DepartmentListResponseData>(
      url,
      'GET'
    )
  }

  // 设置请求头（用于设置token等）
  setAuthToken(authorization: string) {
    // 使用authManager管理token
    authManager.setToken(authorization)
    console.log('设置认证token:', authorization ? '***' : 'null')
  }
}

// 导出API客户端实例
export const apiClient = new ApiClient()

// 导出类型
export type { OAuthLoginParams, LoginParams, LoginXParams, LoginResponseData, DecryptPhoneParams, DecryptPhoneResponseData, TaskLiveListParams, TaskLiveListItem, TaskLiveListResponseData, DepartmentInfo, DepartmentListParams, DepartmentListResponseData, PageInfo, ApiResponse }