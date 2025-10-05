import { Component } from 'react'
import { View, Text, Button, Image, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { apiClient, getCaptchaSessionId } from '../../utils/api'
import { authManager } from '../../utils/auth'
import { base64Encode } from '../../utils/crypto'
import './index.scss'

interface LoginState {
  // 用户名密码登录相关
  username: string           // 用户名
  password: string           // 密码
  captchaCode: string        // 验证码
  captchaImage: string       // 验证码图片
  captchaKey: string         // 验证码key

  // 公共状态
  isLogging: boolean         // 是否正在登录
}

export default class Login extends Component<{}, LoginState> {

  constructor(props) {
    super(props)
    this.state = {
      // 用户名密码登录相关
      username: '',
      password: '',
      captchaCode: '',
      captchaImage: '',
      captchaKey: '',

      // 公共状态
      isLogging: false
    }
  }

  componentDidMount() {
    Taro.setNavigationBarTitle({
      title: '登录'
    })

    // 检查是否已登录
    this.checkLoginStatus()

    // 加载验证码
    this.loadCaptcha()
  }

  // 检查登录状态
  checkLoginStatus = () => {
    const userInfo = Taro.getStorageSync('userInfo')
    const token = authManager.getToken()

    if (userInfo && token) {
      // 已登录，直接跳转到首页
      Taro.reLaunch({
        url: '/pages/index/index'
      })
    }
  }


  // 获取验证码
  loadCaptcha = async () => {
    try {
      console.log('开始获取验证码')

      // 直接通过API调用获取验证码，这会保存session
      const response = await apiClient.getCaptcha()
      console.log('验证码API响应:', response)

      if (response.success && response.data) {
        this.setState({
          captchaImage: response.data.image,
          captchaKey: response.data.key
        })

        // 检查session是否已保存
        const sessionId = getCaptchaSessionId()
        console.log('验证码获取成功，Session ID:', sessionId)

        console.log('验证码设置成功:', {
          url: response.data.image,
          key: response.data.key,
          sessionId: sessionId
        })
      } else {
        throw new Error('验证码获取失败')
      }

    } catch (error) {
      console.error('获取验证码失败:', error)

      // 显示错误提示，设置错误占位图片避免额外请求
      this.setState({
        captchaImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTIwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjNGNEY2IiBzdHJva2U9IiNEMUQ1REIiLz4KPHR3eHQgeD0iNjAiIHk9IjMwIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOUNBM0FGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCI+6L+c5Yqg5aSx6LSlPC90ZXh0Pgo8L3N2Zz4=',
        captchaKey: ''
      })

      Taro.showToast({
        title: '验证码加载失败，请重试',
        icon: 'none',
        duration: 2000
      })
    }
  }

  // 手动刷新验证码
  refreshCaptcha = () => {
    console.log('手动刷新验证码')
    this.loadCaptcha()
  }

  // 用户名输入处理
  handleUsernameInput = (e) => {
    this.setState({
      username: e.detail.value
    })
  }

  // 密码输入处理
  handlePasswordInput = (e) => {
    this.setState({
      password: e.detail.value
    })
  }

  // 验证码输入处理
  handleCaptchaInput = (e) => {
    const captchaValue = e.detail.value
    console.log('验证码输入变化:', captchaValue)
    this.setState({
      captchaCode: captchaValue
    })
  }

  // 用户名密码登录
  performPasswordLogin = async () => {
    const { username, password, captchaCode, captchaKey } = this.state

    console.log('=== 密码登录调试信息 ===')
    console.log('用户名:', username)
    console.log('密码原文:', password)
    console.log('验证码:', captchaCode)
    console.log('验证码长度:', captchaCode ? captchaCode.length : 0)
    console.log('验证码Key:', captchaKey)
    console.log('验证码图片URL:', this.state.captchaImage)
    console.log('当前验证码Session ID:', getCaptchaSessionId())

    if (!username || !password || !captchaCode) {
      Taro.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }

    // 验证码长度检查
    if (captchaCode.length < 3) {
      Taro.showToast({
        title: '验证码长度不够，请重新输入',
        icon: 'none'
      })
      return
    }

    this.setState({ isLogging: true })

    try {
      Taro.showLoading({
        title: '正在登录...'
      })

      // 使用base64加密密码
      const encryptedPassword = base64Encode(password)
      console.log('密码加密前:', password)
      console.log('密码加密后:', encryptedPassword)

      const loginParams = {
        username,
        password: encryptedPassword,  // 使用加密后的密码
        captcha: captchaCode.trim() // 去除验证码前后空格
      }

      console.log('密码登录参数:', loginParams)
      console.log('完整登录参数JSON:', JSON.stringify(loginParams, null, 2))

      const response = await apiClient.login(loginParams)

      console.log('密码登录响应:', response)
      console.log('完整登录响应JSON:', JSON.stringify(response, null, 2))

      if (response.success && response.data) {
        // 处理新的API返回格式
        const userData = response.data

        // 保存登录信息 - 适配新的返回格式
        const userInfo = {
          id: userData.id,
          username: userData.username,
          nickname: userData.name || userData.username,
          avatar: userData.avatar,
          phone: userData.mobile || '',
          departmentId: userData.departmentId,
          departmentName: userData.departmentName,
          email: userData.email
        }

        // 使用authManager管理token（可能在响应头中）
        const authorization = response.authorization
        if (authorization) {
          authManager.setToken(authorization)
        }

        Taro.setStorageSync('userInfo', userInfo)
        Taro.setStorageSync('phoneNumber', userInfo.phone)

        Taro.hideLoading()
        Taro.showToast({
          title: '登录成功',
          icon: 'success'
        })

        // 跳转到首页
        setTimeout(() => {
          Taro.reLaunch({
            url: '/pages/index/index'
          })
        }, 1500)

      } else {
        throw new Error(response.message || '登录失败')
      }

    } catch (error) {
      console.error('密码登录失败:', error)
      Taro.hideLoading()

      const errorMessage = error.message || '登录失败'
      Taro.showToast({
        title: errorMessage,
        icon: 'none'
      })

      // 只有在验证码相关错误时才重新加载验证码
      if (errorMessage.includes('验证码') || errorMessage.includes('captcha')) {
        console.log('检测到验证码错误，重新加载验证码')
        this.loadCaptcha()
      } else {
        console.log('非验证码错误，不重新加载验证码:', errorMessage)
      }
    } finally {
      this.setState({ isLogging: false })
    }
  }


  render() {
    const { isLogging, username, password, captchaCode, captchaImage } = this.state

    return (
      <View className='login'>
        <View className='login-content'>
          <Text className='login-title'>用户名密码登录</Text>

          <View className='form-section'>
            <Input
              className='form-input'
              placeholder='请输入用户名'
              value={username}
              onInput={this.handleUsernameInput}
            />

            <Input
              className='form-input'
              placeholder='请输入密码'
              password
              value={password}
              onInput={this.handlePasswordInput}
            />

            <View className='captcha-section'>
              <Input
                className='captcha-input'
                placeholder='请输入验证码'
                value={captchaCode}
                onInput={this.handleCaptchaInput}
              />
              <Image
                className='captcha-image'
                src={captchaImage}
                onClick={this.refreshCaptcha}
              />
            </View>

            <Button
              className={`login-btn ${isLogging ? 'loading' : ''}`}
              onClick={this.performPasswordLogin}
              disabled={isLogging || !username || !password || !captchaCode}
            >
              {isLogging && <View className='loading-spinner'></View>}
              <Text className='btn-text'>{isLogging ? '正在登录...' : '登录'}</Text>
            </Button>
          </View>
        </View>
      </View>
    )
  }
}