import Taro from '@tarojs/taro'

// 检查用户是否已登录
export const checkLoginStatus = (): boolean => {
  const userInfo = Taro.getStorageSync('userInfo')
  const phoneNumber = Taro.getStorageSync('phoneNumber')
  const token = Taro.getStorageSync('token')

  return !!(userInfo && phoneNumber && token)
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
  return Taro.getStorageSync('token')
}

// 清除登录信息
export const clearLoginInfo = () => {
  Taro.removeStorageSync('userInfo')
  Taro.removeStorageSync('phoneNumber')
  Taro.removeStorageSync('token')
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