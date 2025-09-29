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
    // 验证码接口
    CAPTCHA: '/api/v1/users/captcha'
  },

  // 渠道标识
  CHANNEL: 'miniprogram'
}

// 请求超时时间
export const REQUEST_TIMEOUT = 10000