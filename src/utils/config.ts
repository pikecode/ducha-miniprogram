// API配置
export const API_CONFIG = {
  // 接口域名
  BASE_URL: 'https://bi.hskj.cc',

  // 接口路径
  ENDPOINTS: {
    // 手机号授权登录接口
    OAUTH_LOGIN: '/api/v1/users/oauthlogin',
    // 用户名密码登录接口
    LOGIN: '/api/v1/users/login',
    // 用户名登录接口
    LOGIN_X: '/api/v1/users/loginx',
    // 验证码接口
    CAPTCHA: '/api/v1/users/captcha',
    // 解密手机号接口
    DECRYPT_PHONE: '/api/v1/users/decryptphone',
    // 督查列表接口
    TASK_LIVE_LIST: '/api/v1/inspect/plan/task/livelist',
    // 部门列表接口
    DEPARTMENT_LIST: '/api/v1/departmentinfo/listDepartmentInfos',
    // 批次列表接口
    BATCH_LIST: '/api/v1/inspect/plan/batch/list',
    // 病例列表接口
    PATIENT_LIST: '/api/v1/inspect/emr/searchlistfilldata',
    // 字典详情接口
    DICT_DETAIL: '/api/v1/dict/detail/key',
    // 添加病例接口
    PATIENT_ADD: '/api/v1/inspect/emr/add'
  },

  // 渠道标识
  CHANNEL: 'miniprogram'
}

// 请求超时时间
export const REQUEST_TIMEOUT = 10000