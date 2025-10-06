import Taro from '@tarojs/taro'
import { API_CONFIG, REQUEST_TIMEOUT } from './config'
import { authManager } from './auth'

// 存储验证码session
let captchaSessionId: string | null = null

// 从cookie字符串中提取JSESSIONID
function extractSessionId(cookieString: string): string | null {
  const match = cookieString.match(/JSESSIONID=([^;]+)/)
  return match ? match[1] : null
}

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

// 批次信息数据
interface BatchInfo {
  id: string
  batchName: string
  planId: string
  createTime: string
  status: number
}

// 批次列表请求参数
interface BatchListParams {
  planId: string
}

// 批次列表响应数据
interface BatchListResponseData {
  data: BatchInfo[]
  errCode: number
  exception: any
  message: string | null
  pageInfo: any
  success: boolean
  warnings: any
}

// 病例信息数据
interface PatientInfo {
  id: string
  emrNo: string
  patientName: string
  patientAge: number | null
  patientSex: string | null
  patientSexName: string | null
  departmentId: string
  departmentName: string
  doctorName: string
  diagnose: string | null
  status: string
  batchId: string
  batchName: string | null
  medicalRecordNo: string | null
  createBy: string
  createTime: string | null
  updateBy: string | null
  updateTime: string | null
  inspectPlanId: string
  inspectEMRResults: any[]
  inspectItems: InspectItem[]
  evidenceNum: any
  evidences: any
  insufficient: any
  itemLevel: any
  recommend: any
  scope: any
  dataIndex: any
}

// 病例列表请求参数
interface PatientListParams {
  batchId: string
  key?: string
  planId: string
}

// 病例列表响应数据
interface PatientListResponseData {
  data: PatientInfo[]
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

    // 构建请求头，包含验证码session（如果存在）
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...headers
    }

    // 如果存在验证码session且没有手动设置Cookie，则自动添加
    if (captchaSessionId && !requestHeaders['Cookie']) {
      requestHeaders['Cookie'] = `JSESSIONID=${captchaSessionId}`
    }

    try {

      const response = await Taro.request({
        url: fullUrl,
        method,
        data,
        header: requestHeaders,
        timeout: REQUEST_TIMEOUT
      })



      // 检查响应头中是否有新的session，如果有则更新
      const setCookieHeader = response.header['set-cookie'] || response.header['Set-Cookie']
      if (setCookieHeader) {
        if (Array.isArray(setCookieHeader)) {
          for (const cookie of setCookieHeader) {
            const sessionId = extractSessionId(cookie)
            if (sessionId && sessionId !== captchaSessionId) {

              captchaSessionId = sessionId
              break
            }
          }
        } else {
          const sessionId = extractSessionId(setCookieHeader)
          if (sessionId && sessionId !== captchaSessionId) {

            captchaSessionId = sessionId
          }
        }
      }

      // 检查HTTP状态码
      if (response.statusCode !== 200) {
        // 尝试解析错误信息
        let errorMessage = `HTTP错误: ${response.statusCode}`
        if (response.data && typeof response.data === 'object') {
          if (response.data.message) {
            errorMessage += ` - ${response.data.message}`
          } else if (response.data.error) {
            errorMessage += ` - ${response.data.error}`
          }
        } else if (response.data && typeof response.data === 'string') {
          errorMessage += ` - ${response.data}`
        }

        // 401未授权，清除token并跳转登录
        if (response.statusCode === 401) {

          authManager.logout()
          Taro.reLaunch({
            url: '/pages/login/index'
          })
        }

        // 404错误特殊处理（接口不存在）
        if (response.statusCode === 404) {
          errorMessage = `接口不存在(404): ${fullUrl.split('/').pop()}`
        }

        throw new Error(errorMessage)
      }

      const result = response.data as ApiResponse<T>

      // 从响应头中获取authorization
      const authorization = response.header?.authorization || response.header?.Authorization

      // 检查业务状态码
      if (!result.success && result.code !== 200) {
        // 如果是认证相关错误，也清除token
        if (result.code === 401 || result.code === 403) {

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

      // 404错误不显示Toast提示，其他错误正常显示
      if (!error.message || !error.message.includes('404')) {
        Taro.showToast({
          title: error.message || '网络请求失败',
          icon: 'none',
          duration: 2000
        })
      }

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






    // 通用request方法会自动处理验证码session
    const response = await this.request<LoginResponseData>(
      API_CONFIG.ENDPOINTS.LOGIN,
      'POST',
      params
    )





    return response
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


    // 生成时间戳作为key
    const timestamp = new Date().getTime().toString()
    const fullUrl = `${this.baseURL}${API_CONFIG.ENDPOINTS.CAPTCHA}?t=${timestamp}`

    try {


      // 获取当前token以确保session一致性
      const token = authManager.getToken()

      const response = await Taro.request({
        url: fullUrl,
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        timeout: REQUEST_TIMEOUT,
        responseType: 'arraybuffer' // 获取图片数据
      })

      // 提取并保存JSESSIONID
      const setCookieHeader = response.header['set-cookie'] || response.header['Set-Cookie']


      if (setCookieHeader) {
        if (Array.isArray(setCookieHeader)) {
          // 处理cookie数组
          for (const cookie of setCookieHeader) {
            const sessionId = extractSessionId(cookie)
            if (sessionId) {
              captchaSessionId = sessionId

              break
            }
          }
        } else {
          // 处理单个cookie字符串
          const sessionId = extractSessionId(setCookieHeader)
          if (sessionId) {
            captchaSessionId = sessionId

          }
        }
      }



      // 检查HTTP状态码
      if (response.statusCode !== 200) {
        throw new Error(`HTTP错误: ${response.statusCode}`)
      }

      // 确保session ID被正确保存
      if (!captchaSessionId) {

      }

      // 将图片数据转换为base64，避免Image组件再次请求
      let imageBase64 = ''
      if (response.data) {
        try {
          // 在小程序中转换arraybuffer为base64
          const base64 = Taro.arrayBufferToBase64(response.data)
          imageBase64 = `data:image/png;base64,${base64}`

        } catch (e) {

          imageBase64 = fullUrl
        }
      } else {

        imageBase64 = fullUrl
      }

      return {
        success: true,
        code: 200,
        message: '获取验证码成功',
        data: {
          image: imageBase64, // 使用base64避免二次请求
          key: timestamp
        }
      }

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

  // 获取批次列表接口
  async getBatchList(params: BatchListParams): Promise<ApiResponse<BatchListResponseData>> {
    const url = `${API_CONFIG.ENDPOINTS.BATCH_LIST}/${params.planId}`

    return this.request<BatchListResponseData>(
      url,
      'GET'
    )
  }

  // 获取病例列表接口
  async getPatientList(params: PatientListParams): Promise<ApiResponse<PatientListResponseData>> {
    // 构建查询参数，所有参数都是必填
    const queryParams = new URLSearchParams()
    queryParams.append('planId', params.planId)
    queryParams.append('batchId', params.batchId!)
    queryParams.append('key', params.key || '')

    const url = `${API_CONFIG.ENDPOINTS.PATIENT_LIST}?${queryParams.toString()}`

    return this.request<PatientListResponseData>(
      url,
      'GET'
    )
  }

  // 获取字典详情接口
  async getDictDetail(key: string): Promise<ApiResponse<DictDetailResponseData>> {
    const url = `${API_CONFIG.ENDPOINTS.DICT_DETAIL}?key=${key}`

    return this.request<DictDetailResponseData>(
      url,
      'GET'
    )
  }

  // 获取数据归属周期字典
  async getDataDateDict(): Promise<ApiResponse<DictDetailResponseData>> {


    const response = await this.request<DictDetailResponseData>(
      `${API_CONFIG.ENDPOINTS.DICT_DETAIL}?key=DataDate`,
      'GET'
    )


    return response
  }

  // 获取数据年度字典
  async getDataYearDict(): Promise<ApiResponse<DictDetailResponseData>> {


    const response = await this.request<DictDetailResponseData>(
      `${API_CONFIG.ENDPOINTS.DICT_DETAIL}?key=DataYear`,
      'GET'
    )


    return response
  }

  // 获取指标详情
  async getIndicatorDetail(code: string): Promise<ApiResponse<IndicatorDetailResponseData>> {


    const response = await this.request<IndicatorDetailResponseData>(
      `/api/v1/indicator/detail/getbycode?code=${code}`,
      'GET'
    )


    return response
  }

  // 添加病例接口
  async addPatient(params: PatientAddParams): Promise<ApiResponse<PatientAddResponseData>> {
    return this.request<PatientAddResponseData>(
      API_CONFIG.ENDPOINTS.PATIENT_ADD,
      'POST',
      params
    )
  }

  // 获取病例详情接口
  async getPatientDetail(emrId: string): Promise<ApiResponse<PatientDetailResponseData>> {
    return this.request<PatientDetailResponseData>(
      `/api/v1/inspect/emr/get?emrId=${emrId}`,
      'GET'
    )
  }

  // 删除图片证据接口
  async archiveEvidence(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(
      `/api/v1/inspect/item/evidence/archive/${id}`,
      'POST'
    )
  }

  // 获取督查计划详情接口
  async getInspectPlanDetail(planId: string): Promise<ApiResponse<any>> {
    return this.request<any>(
      `/api/v1/inspect/plan/get/${planId}`,
      'GET'
    )
  }

  // 获取督查项目列表接口（病例）
  async getInspectItemList(planId: string): Promise<ApiResponse<InspectItemListResponseData>> {
    return this.request<InspectItemListResponseData>(
      `/api/v1/inspect/item/list/live/${planId}`,
      'GET'
    )
  }

  // 获取部门督查项目列表接口
  async getDepartmentInspectItemList(planId: string, departmentId: string): Promise<ApiResponse<InspectItemListResponseData>> {
    return this.request<InspectItemListResponseData>(
      `/api/v1/inspect/item/score/list/${planId}/${departmentId}`,
      'GET'
    )
  }

  // 保存督查结果接口（病例）
  async saveInspectResults(params: InspectResultSaveParams): Promise<ApiResponse<InspectResultSaveResponseData>> {



    const response = await this.request<InspectResultSaveResponseData>(
      '/api/v1/inspect/emr/result/updateList',
      'POST',
      params
    )


    return response
  }

  // 保存部门督查结果接口
  async saveDepartmentInspectResults(params: DepartmentInspectResultItem[]): Promise<ApiResponse<InspectResultSaveResponseData>> {



    const response = await this.request<InspectResultSaveResponseData>(
      '/api/v1/inspect/item/score/updateMulti',
      'POST',
      params
    )


    return response
  }

  // 更新病例整体存在不足接口
  async updateEmrInsufficient(params: { batchId: string, insufficient: string, id: string }): Promise<ApiResponse<any>> {









    const response = await this.request<any>(
      '/api/v1/inspect/emr/result/updateEmrInsufficient',
      'POST',
      params
    )







    return response
  }

  // 获取数据上报列表
  async getDataReportList(pageType: string = 'zkzbtby'): Promise<ApiResponse<DataReportItem[]>> {



    const response = await this.request<DataReportItem[]>(
      `/api/v1/pageurl/settings/list?pageType=${pageType}`,
      'GET'
    )


    return response
  }

  // 获取填报任务列表
  async getTaskInfoList(taskType: string): Promise<ApiResponse<TaskInfoItem[]>> {



    const response = await this.request<TaskInfoItem[]>(
      `/api/v1/taskInfo/listTaskInfosByuser?taskType=${taskType}`,
      'GET'
    )


    return response
  }

  // 获取数据列表
  async getDataList(appkey: string, pageNo: number = 1, pageSize: number = 10): Promise<ApiResponse<DataListItem[]>> {



    const response = await this.request<DataListItem[]>(
      `/api/v1/data/${appkey}/list?pageNo=${pageNo}&pageSize=${pageSize}`,
      'GET'
    )


    return response
  }

  // 获取表单详情
  async getFormDetail(taskType: string, id: string): Promise<ApiResponse<any>> {


    const response = await this.request<any>(
      `/api/v1/data/${taskType}/detail?id=${id}`,
      'GET'
    )


    return response
  }

  // 保存表单数据
  async saveFormData(taskType: string, formData: any): Promise<ApiResponse<any>> {



    const response = await this.request<any>(
      `/api/v1/data/${taskType}/add`,
      'POST',
      formData
    )


    return response
  }

  // 更新表单数据
  async updateFormData(taskType: string, formData: any): Promise<ApiResponse<any>> {



    const response = await this.request<any>(
      `/api/v1/data/${taskType}/update`,
      'POST',
      formData
    )


    return response
  }

  // 检查数据是否已填写
  async checkDataFill(appkey: string, dataDateId: string): Promise<ApiResponse<boolean>> {


    const response = await this.request<boolean>(
      `/api/v1/data/${appkey}/checkfill?dataDateId=${dataDateId}`,
      'GET'
    )


    return response
  }

  // 提审数据
  async submitDataForReview(taskType: string, id: string): Promise<ApiResponse<any>> {


    const response = await this.request<any>(
      `/api/v1/data/${taskType}/submit/${id}`,
      'POST'
    )


    return response
  }

  // 获取审批记录列表
  async getFlowRecordList(dataId: string): Promise<ApiResponse<FlowRecordItem[]>> {


    const response = await this.request<FlowRecordItem[]>(
      `/api/v1/flow/record/list?dataId=${dataId}`,
      'GET'
    )


    return response
  }

  // 获取首页配置
  async getHomeConfig(): Promise<ApiResponse<HomeConfigResponseData>> {


    const response = await this.request<HomeConfigResponseData>(
      '/api/v1/config/home',
      'GET'
    )


    return response
  }

  // 文件上传接口
  async uploadFile(filePath: string): Promise<UploadFileResponseData> {
    const fullUrl = `${this.baseURL}/api/v1/upload/v2/upload`

    try {



      const response = await Taro.uploadFile({
        url: fullUrl,
        filePath: filePath,
        name: 'file',
        formData: {
          categoryId: 'inspect'
        },
        header: authManager.getAuthHeaders(),
        timeout: 60000 // 60秒超时
      })



      if (response.statusCode !== 200) {
        throw new Error(`HTTP错误: ${response.statusCode}`)
      }

      const result = JSON.parse(response.data) as UploadFileResponseData
      return result
    } catch (error) {
      console.error('文件上传失败:', error)
      throw error
    }
  }

  // 创建证据接口（病例）
  async createEvidence(params: CreateEvidenceParams): Promise<ApiResponse<CreateEvidenceResponseData>> {



    const response = await this.request<CreateEvidenceResponseData>(
      '/api/v1/inspect/item/evidence/create',
      'POST',
      params
    )


    return response
  }

  // 创建证据接口（部门）
  async createDepartmentEvidence(params: CreateDepartmentEvidenceParams): Promise<ApiResponse<CreateEvidenceResponseData>> {



    const response = await this.request<CreateEvidenceResponseData>(
      '/api/v1/inspect/item/evidence/create',
      'POST',
      params
    )


    return response
  }

  // 获取证据列表接口（病例）
  async getEvidenceList(itemId: string, emrId: string): Promise<ApiResponse<EvidenceListResponseData>> {


    const response = await this.request<EvidenceListResponseData>(
      `/api/v1/inspect/item/evidence/list/Emr/${itemId}/${emrId}`,
      'GET'
    )


    return response
  }

  // 获取证据列表接口（部门）
  async getDepartmentEvidenceList(itemId: string): Promise<ApiResponse<EvidenceListResponseData>> {


    const response = await this.request<EvidenceListResponseData>(
      `/api/v1/inspect/item/evidence/list/${itemId}`,
      'GET'
    )


    return response
  }

  // 获取小程序配置
  async getMiniProgramConfig(): Promise<ApiResponse<any>> {
    return this.request<any>(
      '/api/v1/sys/config/category/miniprogram',
      'GET'
    )
  }

  // 设置请求头（用于设置token等）
  setAuthToken(authorization: string) {
    // 使用authManager管理token
    authManager.setToken(authorization)

  }
}

// 导出API客户端实例
export const apiClient = new ApiClient()

// 导出session管理函数
export const getCaptchaSessionId = () => captchaSessionId
export const clearCaptchaSession = () => {

  captchaSessionId = null
}
export const setCaptchaSessionId = (sessionId: string) => {

  captchaSessionId = sessionId
}

// 字典项数据
interface DictItem {
  createBy: string
  createTime: string
  dataIndex: any
  deleteFlag: any
  dictKey: string
  enableFlag: any
  id: string
  listId: string
  permission: any
  status: any
  updateBy: string
  updateTime: string
  valueCode: string
  valueDesc: any
  valueNameCn: string
  valueNameEn: string
  version: any
}

// 字典详情响应数据
interface DictDetailResponseData {
  data: DictItem[]
  errCode: number
  message: string | null
  pageInfo: any
  success: boolean
  warnings: any
}

// 添加病例请求参数
interface PatientAddParams {
  batchId: string
  batchName?: string
  createBy?: string
  createTime?: string
  dataIndex?: number
  departmentId: string
  departmentName: string
  diagnose: string
  doctorName: string
  emrNo: string
  inspectPlanId: string
  insufficient?: string
  itemLevel?: string
  medicalRecordNo?: string
  patientAge: number
  patientName: string
  patientSex: string
  patientSexName: string
  recommend?: string
  scope?: number
  status?: string
  updateBy?: string
  updateTime?: string
}

// 添加病例响应数据
interface PatientAddResponseData {
  id: string
  message?: string
}

// 病例详情请求参数
interface PatientDetailParams {
  emrId: string
}

// 督查结果数据
interface InspectEMRResult {
  createBy: string
  createTime: string
  expertUserId: string
  expertUserName: string
  id: string
  inspectEMRInfoId: string
  inspectItemCode: string | null
  inspectItemId: string
  inspectItemName: string
  inspectPlanId: string
  insufficient: string
  itemLevel: string
  itemLevelName: string
  itemLevelValue: any
  permission: any
  recommend: string | null
  scope: number
  status: string
  updateBy: string
  updateTime: string
}

// 病例详情响应数据
interface PatientDetailResponseData {
  data: PatientInfo & {
    inspectEMRResults: InspectEMRResult[]
  }
  errCode: number
  exception: any
  message: string | null
  pageInfo: any
  success: boolean
  warnings: any
}

// 督查项目信息数据
interface InspectItem {
  id: string
  itemName: string
  itemCode?: string
  itemScore: number
  score: number
  remarks?: string | null
  status: string
  planId?: string
  createTime?: string
  updateTime?: string | null
  checkMode?: string
  dataIndex?: number
  flowCode?: string
  flowStatus?: string
  isFolder?: string
  fileCount?: number
  passCount?: number
  rejectCount?: number
  evidences?: any[]
  itemuserId?: string
  // 部门督查接口返回的额外字段
  batchId?: string
  itemId?: string
  comment?: string | null
  createBy?: string
  creater?: string
  createrUserId?: string
  departmentId?: string
  level?: string | null
  levelName?: string | null
  needImproved?: string | null
  permission?: any
  problem?: string | null
  scoreRate?: any
  suggestion?: string | null
  updateBy?: string | null
}

// 督查项目列表请求参数
interface InspectItemListParams {
  planId: string
}

// 督查项目列表响应数据
interface InspectItemListResponseData {
  data: InspectItem[]
  errCode: number
  exception: any
  message: string | null
  pageInfo: any
  success: boolean
  warnings: any
}

// 数据上报列表项
interface DataReportItem {
  id: string
  appkey: string
  pageName: string
  pageType: string
  departmentId: string | null
  orgId: string | null
  modelId: string
  status: string
  createBy: string | null
  createTime: string | null
  updateBy: string | null
  updateTime: string | null
  permission: any
}

// 填报任务列表项
interface TaskInfoItem {
  id: string
  taskName: string
  taskType: string
  taskStartdate: string
  taskEnddate: string
  taskNote: string
  taskUrl: string | null
  status: number
  orgId: string
  createBy: string
  createTime: string
  updateBy: string
  updateTime: string
  remarks: string | null
  permission: any
}

// 督查结果保存项目数据
interface InspectResultItem {
  createBy?: string
  createTime?: string
  expertUserId?: string
  expertUserName?: string
  id?: string
  inspectEmrInfoId: string     // 病案ID
  inspectItemId: string        // 督查要点ID
  inspectPlanId: string        // 督查计划ID
  insufficient?: string        // 存在的不足
  itemLevel?: string
  recommend?: string
  scope?: number               // 评分
  status?: number
  updateBy?: string
  updateTime?: string
}

// 部门督查结果保存项目数据
interface DepartmentInspectResultItem {
  id?: string
  batchId: string
  comment?: string
  itemId: string
  itemScore?: number
  itemuserId?: string
  level?: string
  levelName?: string
  needImproved?: string
  problem?: string
  score?: number
  suggestion?: string
}

// 督查结果保存请求参数
interface InspectResultSaveParams extends Array<InspectResultItem> {}

// 督查结果保存响应数据
interface InspectResultSaveResponseData {
  data: any
  errCode: number
  exception: any
  message: string | null
  pageInfo: any
  success: boolean
  warnings: any
}

// 文件上传响应数据
interface UploadFileResponseData {
  data: {
    autoCheckStatus: string
    categoryId: string
    createBy: string
    createTime: string
    currentHistoryId: string
    dataStatus: string
    datasetBatchId: string
    datasetDocumentId: string
    deleteFlag: number
    enableFlag: number
    fileName: string
    fileSize: number
    fileUrl: string
    fullFileName: string
    id: string
    needModifyStatus: string
    orgId: string
    permission: number
    status: number
    syncStatus: string
    updateBy: string
    updateTime: string
    version: number
  }
  errCode: number
  message: string
  pageInfo: {
    countTotal: boolean
    pageNo: number
    pageSize: number
    total: number
  }
  success: boolean
  warnings: string[]
}

// 创建证据请求参数（病例）
interface CreateEvidenceParams {
  batchId: string
  departmentId: string
  emrId: string
  fileId: string
  improveId?: string
  itemId: string
  orgId: string
  planId: string
}

// 创建证据请求参数（部门）
interface CreateDepartmentEvidenceParams {
  batchId: string
  departmentId: string
  fileId: string
  itemId: string
  orgId: string
  planId: string
}

// 创建证据响应数据
interface CreateEvidenceResponseData {
  data: any
  errCode: number
  message: string
  pageInfo: any
  success: boolean
  warnings: any
}

// 证据列表项数据
interface EvidenceItem {
  batchId: string
  createBy: string
  createTime: string
  departmentId: string
  departmentName: string
  emrId: string
  fileId: string
  fileName: string
  fileUrl: string
  flowStatus: string
  id: string
  improveId: string
  itemId: string
  permission: number
  status: string
  updateBy: string
  updateTime: string
  userName: string
}

// 证据列表响应数据
interface EvidenceListResponseData {
  data: EvidenceItem[]
  errCode: number
  exception: any
  message: string | null
  pageInfo: any
  success: boolean
  warnings: any
}

// 数据列表项
interface DataListItem {
  id: string
  createTime: string
  updateTime?: string | null
  createBy: string
  updateBy?: string | null
  userName: string
  userId: string
  departmentId: string
  departmentName: string
  orgId: string
  dataDate: string
  data_date?: string  // 后端接口新增字段，待后端添加
  dataDateId: string
  dataStatus: string
  status: string
  taskId: string
  recordStatus?: string | null
  remarks?: string | null
  // 其他动态字段，以t开头的数据字段
  [key: string]: any
}

// 数据列表响应数据
interface DataListResponseData {
  data: DataListItem[]
  errCode: number
  message: string | null
  pageInfo: PageInfo
  success: boolean
  warnings: any
}

// 指标详情数据
interface IndicatorDetail {
  calculatorSQL: string | null
  caliber: string
  categoryId: string
  code: string
  createBy: string
  createTime: string
  dataCheckRule: string | null
  dataIndex: number
  dataLen: string | null
  dataType: string | null
  define: string
  deleteFlag: string | null
  enableFlag: string | null
  evaluate: string | null
  explain: string
  folderId: string | null
  id: string
  inspectionMethod: string | null
  maxValue: string | null
  minValue: string | null
  name: string
  optmethod: string | null
  orgId: string
  permission: string | null
  reasonAbleMax: string | null
  reasonAbleMin: string | null
  responsibleDepartment: string | null
  significance: string
  sourceId: string | null
  status: string | null
  updateBy: string
  updateTime: string
  version: string | null
  viewId: string | null
  vizId: string | null
}

// 指标详情响应数据
interface IndicatorDetailResponseData {
  data: IndicatorDetail
  errCode: number
  exception: any
  message: string | null
  pageInfo: any
  success: boolean
  warnings: any
}

// 审批操作选项
interface FlowRecordOpt {
  approveDate: string | null
  approveOpt: string | null
  approveStatus: string
  approverId: string
  approverName: string
  createBy: string | null
  createTime: string | null
  hisStatus: string | null
  id: string | null
  instanceId: string
  permission: any
  recordId: string
  updateBy: string | null
  updateTime: string | null
}

// 审批记录详情
interface FlowRecordDetail {
  createBy: string
  createTime: string
  dataId: string
  definitionId: string
  flowRecordOpts: FlowRecordOpt[]
  id: string
  instanceId: string
  nodeCode: string | null
  nodeName: string
  nodeOpername: string
  recordStatus: string
  recordStatusName: string
  remarks: string | null
  updateBy: string | null
  updateTime: string | null
}

// 流程实例
interface FlowInstance {
  createBy: string
  createTime: string
  dataId: string
  dataKey: string | null
  definitionId: string
  flowStatus: string
  hisStatus: string
  id: string
  orgId: string | null
  permission: any
  status: string
  updateBy: string | null
  updateTime: string | null
}

// 审批记录项数据
interface FlowRecordItem {
  hisStatus: string
  instance: FlowInstance
  recordDetails: FlowRecordDetail[]
}

// 首页配置 - 快捷操作
interface QuickAction {
  id: string
  name: string
  subtitle?: string
  icon: string
  activeIcon: string
  path: string
  color: string
  order: number
}

// 首页配置 - TabBar项
interface TabBarItem {
  id: string
  pagePath: string
  text: string
  icon: string
  activeIcon: string
  order: number
}

// 首页配置响应数据
interface HomeConfigResponseData {
  backgroundImage: string        // 背景图片URL
  quickActions: QuickAction[]     // 快捷操作列表
  tabBarItems: TabBarItem[]       // TabBar配置
  appName: string                 // 应用名称
  logoUrl: string | null          // Logo URL
}

// 导出类型
export type { OAuthLoginParams, LoginParams, LoginXParams, LoginResponseData, DecryptPhoneParams, DecryptPhoneResponseData, TaskLiveListParams, TaskLiveListItem, TaskLiveListResponseData, BatchInfo, BatchListParams, BatchListResponseData, PatientInfo, PatientListParams, PatientListResponseData, DepartmentInfo, DepartmentListParams, DepartmentListResponseData, PageInfo, ApiResponse, DictItem, DictDetailResponseData, PatientAddParams, PatientAddResponseData, PatientDetailParams, PatientDetailResponseData, InspectItem, InspectItemListParams, InspectItemListResponseData, InspectResultItem, InspectResultSaveParams, InspectResultSaveResponseData, DepartmentInspectResultItem, InspectEMRResult, UploadFileResponseData, CreateEvidenceParams, CreateDepartmentEvidenceParams, CreateEvidenceResponseData, EvidenceItem, EvidenceListResponseData, DataReportItem, TaskInfoItem, DataListItem, DataListResponseData, IndicatorDetail, IndicatorDetailResponseData, FlowRecordItem, FlowRecordDetail, FlowRecordOpt, FlowInstance, QuickAction, TabBarItem, HomeConfigResponseData }