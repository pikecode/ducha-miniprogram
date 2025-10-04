import { Component } from 'react'
import { View, Text, Button, Image, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { apiClient } from '../../utils/api'
import { API_CONFIG } from '../../utils/config'
import { authManager } from '../../utils/auth'
import './index.scss'

interface LoginState {
  // 登录模式：'oauth' | 'password' | 'username'
  loginMode: 'oauth' | 'password' | 'username'

  // 微信授权相关
  userInfo: any
  hasUserInfo: boolean
  canIUseGetUserProfile: boolean
  phoneNumber: string
  hasPhoneNumber: boolean
  phoneEncryptedData: any    // 手机号加密数据
  inputPhoneNumber: string   // 用户输入的手机号（添加缺失字段）

  // 用户名密码登录相关
  username: string           // 用户名
  password: string           // 密码
  captchaCode: string        // 验证码
  captchaImage: string       // 验证码图片
  captchaKey: string         // 验证码key

  // 公共状态
  isLogging: boolean         // 是否正在登录
  currentStep: number        // 当前步骤
}

export default class Login extends Component<{}, LoginState> {

  constructor(props) {
    super(props)
    this.state = {
      // 默认使用密码登录模式
      loginMode: 'password',

      // 微信授权相关
      userInfo: {},
      hasUserInfo: false,
      canIUseGetUserProfile: Boolean(Taro.getUserProfile),
      phoneNumber: '',
      hasPhoneNumber: false,
      phoneEncryptedData: null,
      inputPhoneNumber: '',

      // 用户名密码登录相关
      username: '',
      password: '',
      captchaCode: '',
      captchaImage: '',
      captchaKey: '',

      // 公共状态
      isLogging: false,
      currentStep: 1
    }
  }

  componentDidMount() {
    Taro.setNavigationBarTitle({
      title: '登录'
    })

    // 检查是否已登录
    this.checkLoginStatus()

    // 默认使用密码登录，需要立即加载验证码
    if (this.state.loginMode === 'password') {
      this.loadCaptcha()
    }
  }

  // 检查登录状态
  checkLoginStatus = () => {
    const userInfo = Taro.getStorageSync('userInfo')
    const phoneNumber = Taro.getStorageSync('phoneNumber')

    if (userInfo && phoneNumber) {
      // 已登录，直接跳转到首页
      Taro.reLaunch({
        url: '/pages/index/index'
      })
    }
  }


  // 获取手机号并立即登录
  getPhoneNumber = async (e) => {
    console.log('获取手机号回调', e)

    if (!e.detail.code) {
      Taro.showToast({
        title: '手机号授权失败',
        icon: 'none'
      })
      return
    }

    this.setState({ isLogging: true })

    try {
      Taro.showLoading({
        title: '正在登录...'
      })

      // 获取fresh的微信登录凭证
      const loginRes = await new Promise<Taro.login.SuccessCallbackResult>((resolve, reject) => {
        Taro.login({
          success: resolve,
          fail: reject
        })
      })

      if (!loginRes.code) {
        throw new Error('获取登录凭证失败')
      }

      console.log('获取到新的登录凭证：', loginRes.code)
      console.log('手机号授权数据：', e.detail)

      // 先解密手机号
      const decryptParams = {
        code: loginRes.code,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }

      console.log('解密参数:', decryptParams)

      const decryptResponse = await apiClient.decryptPhone(decryptParams)

      console.log('解密响应:', decryptResponse)

      if (!decryptResponse.success || !decryptResponse.data?.phoneNumber) {
        throw new Error('获取手机号失败')
      }

      const phoneNumber = decryptResponse.data.phoneNumber
      console.log('解密后的手机号:', phoneNumber)

      // 调用登录接口
      const loginParams = {
        username: phoneNumber, // 真实手机号
        code: loginRes.code, // 微信登录凭证
        channel: API_CONFIG.CHANNEL
      }

      console.log('登录参数:', loginParams)

      const response = await apiClient.oauthLogin(loginParams)

      console.log('登录响应:', response)

      if (response.success && response.data) {
        const { token, userInfo } = response.data

        // 保存token和用户信息
        await Taro.setStorageSync('token', token)
        await Taro.setStorageSync('userInfo', userInfo)

        console.log('登录成功，保存用户信息：', userInfo)

        this.setState({
          currentStep: 4,
          userInfo: {
            avatarUrl: userInfo.avatar || this.state.userInfo.avatarUrl,
            nickName: userInfo.nickname || userInfo.username
          },
          phoneNumber: userInfo.phone
        })

        Taro.showToast({
          title: '登录成功',
          icon: 'success'
        })

        // 延迟跳转到首页
        setTimeout(() => {
          Taro.switchTab({
            url: '/pages/index/index'
          })
        }, 2000)

      } else {
        throw new Error(response.message || '登录失败')
      }

    } catch (error) {
      console.error('登录失败:', error)
      Taro.showToast({
        title: error.message || '登录失败',
        icon: 'none'
      })
    } finally {
      Taro.hideLoading()
      this.setState({ isLogging: false })
    }
  }

  // 执行登录
  performLogin = async () => {
    const { phoneEncryptedData, userInfo } = this.state

    if (!phoneEncryptedData) {
      Taro.showToast({
        title: '请先完成手机号验证',
        icon: 'none'
      })
      return
    }

    this.setState({ isLogging: true })

    try {
      Taro.showLoading({
        title: '正在登录...'
      })

      // 重新获取fresh的登录凭证
      const loginRes = await new Promise<Taro.login.SuccessCallbackResult>((resolve, reject) => {
        Taro.login({
          success: resolve,
          fail: reject
        })
      })

      if (!loginRes.code) {
        throw new Error('获取登录凭证失败')
      }

      console.log('获取到新的登录凭证：', loginRes.code)

      // 调用登录接口
      const loginParams = {
        username: this.state.inputPhoneNumber, // 用户输入的手机号
        code: loginRes.code, // 新的登录凭证
        channel: API_CONFIG.CHANNEL
      }

      console.log('登录参数:', loginParams)

      const response = await apiClient.oauthLogin(loginParams)

      console.log('登录响应:', response)

      if (response.success) {
        // 登录成功
        const { token, userInfo: serverUserInfo } = response.data

        // 保存登录信息
        Taro.setStorageSync('token', token)
        Taro.setStorageSync('userInfo', {
          ...userInfo,
          ...serverUserInfo
        })
        Taro.setStorageSync('phoneNumber', serverUserInfo.phone)

        // 设置API客户端token
        apiClient.setAuthToken(token)

        this.setState({
          phoneNumber: serverUserInfo.phone,
          hasPhoneNumber: true,
          currentStep: 4
        })

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
      console.error('登录失败:', error)
      Taro.hideLoading()
      Taro.showToast({
        title: error.message || '登录失败',
        icon: 'none'
      })
    } finally {
      this.setState({ isLogging: false })
    }
  }

  // 手机号输入处理
  handlePhoneInput = (e) => {
    this.setState({
      inputPhoneNumber: e.detail.value
    })
  }

  // 验证手机号格式
  validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^1[3-9]\d{9}$/
    return phoneRegex.test(phone)
  }

  // 确认手机号，进入下一步
  handlePhoneConfirm = () => {
    const { inputPhoneNumber } = this.state

    if (!inputPhoneNumber) {
      Taro.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    }

    if (!this.validatePhoneNumber(inputPhoneNumber)) {
      Taro.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    }

    // 进入手机号验证步骤
    this.setState({
      currentStep: 3
    })
  }

  // 获取微信登录凭证
  handleWechatLogin = () => {
    Taro.login({
      success: (loginRes) => {
        console.log('微信登录成功', loginRes)
        if (loginRes.code) {
          console.log('微信登录成功，获取到登录凭证')

          Taro.showToast({
            title: '获取登录凭证成功',
            icon: 'success'
          })

          // 进入用户信息授权步骤
          this.setState({
            currentStep: 1.5
          })
        }
      },
      fail: (err) => {
        console.log('微信登录失败', err)
        Taro.showToast({
          title: '登录失败',
          icon: 'none'
        })
      }
    })
  }

  // 获取用户信息授权
  handleGetUserProfile = () => {
    if (this.state.canIUseGetUserProfile) {
      Taro.getUserProfile({
        desc: '用于完善会员资料',
        success: (profileRes) => {
          console.log('获取用户信息成功', profileRes)
          this.setState({
            userInfo: profileRes.userInfo,
            hasUserInfo: true
          })

          // 保存用户信息
          Taro.setStorageSync('userInfo', profileRes.userInfo)

          Taro.showToast({
            title: '授权成功',
            icon: 'success'
          })

          // 进入下一步：输入手机号
          this.setState({
            currentStep: 2
          })
        },
        fail: (profileErr) => {
          console.log('获取用户信息失败', profileErr)
          Taro.showToast({
            title: '授权失败',
            icon: 'none'
          })
        }
      })
    } else {
      // 兼容旧版本
      Taro.getUserInfo({
        success: (profileRes) => {
          console.log('获取用户信息成功', profileRes)
          this.setState({
            userInfo: profileRes.userInfo,
            hasUserInfo: true,
            currentStep: 2
          })
          Taro.setStorageSync('userInfo', profileRes.userInfo)
        }
      })
    }
  }

  // 切换登录模式
  switchLoginMode = () => {
    let newMode: 'oauth' | 'password' | 'username'
    if (this.state.loginMode === 'username') {
      newMode = 'oauth'
    } else if (this.state.loginMode === 'oauth') {
      newMode = 'password'
    } else {
      newMode = 'username'
    }

    this.setState({
      loginMode: newMode,
      currentStep: 1,
      // 重置状态
      username: '',
      password: '',
      captchaCode: '',
      phoneEncryptedData: null,
      userInfo: {},
      hasUserInfo: false
    })

    // 如果切换到密码登录，获取验证码
    if (newMode === 'password') {
      this.loadCaptcha()
    }
  }

  // 获取验证码
  loadCaptcha = async () => {
    try {
      console.log('开始获取验证码')
      const response = await apiClient.getCaptcha()

      if (response.success && response.data) {
        this.setState({
          captchaImage: response.data.image,
          captchaKey: response.data.key || new Date().getTime().toString()
        })
        console.log('获取验证码成功:', response.data)
      } else {
        throw new Error(response.message || '获取验证码失败')
      }
    } catch (error) {
      console.error('获取验证码失败:', error)

      // 出错时使用图片URL作为fallback
      const timestamp = new Date().getTime()
      const captchaUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CAPTCHA}?t=${timestamp}`

      this.setState({
        captchaImage: captchaUrl,
        captchaKey: timestamp.toString()
      })
      console.log('错误回退，使用图片URL:', captchaUrl)
    }
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
    this.setState({
      captchaCode: e.detail.value
    })
  }

  // 用户名密码登录
  performPasswordLogin = async () => {
    const { username, password, captchaCode, captchaKey } = this.state

    if (!username || !password || !captchaCode) {
      Taro.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }

    this.setState({ isLogging: true })

    try {
      Taro.showLoading({
        title: '正在登录...'
      })

      const loginParams = {
        username,
        password,
        captcha: captchaCode,
        captchaKey // 包含验证码key
      }

      console.log('密码登录参数:', loginParams)

      const response = await apiClient.login(loginParams)

      console.log('密码登录响应:', response)

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

        this.setState({
          phoneNumber: userInfo.phone,
          hasPhoneNumber: true,
          currentStep: 4,
          userInfo: {
            avatarUrl: userInfo.avatar,
            nickName: userInfo.nickname
          }
        })

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
      Taro.showToast({
        title: error.message || '登录失败',
        icon: 'none'
      })
      // 重新加载验证码
      this.loadCaptcha()
    } finally {
      this.setState({ isLogging: false })
    }
  }

  // 用户名登录
  performUsernameLogin = async () => {
    const { username } = this.state

    if (!username) {
      Taro.showToast({
        title: '请输入用户名',
        icon: 'none'
      })
      return
    }

    this.setState({ isLogging: true })

    try {
      Taro.showLoading({
        title: '正在登录...'
      })

      const loginParams = {
        username
      }

      console.log('用户名登录参数:', loginParams)

      const response = await apiClient.loginX(loginParams)

      console.log('登录响应:', response)

      if (response.success) {
        // 从响应头中获取token
        const authorization = response.authorization || response.data?.token
        const userInfo = response.data?.userInfo || response.data

        if (!authorization) {
          throw new Error('未获取到登录token')
        }

        console.log('获取到authorization:', authorization)

        // 使用authManager管理token
        authManager.setToken(authorization)
        await Taro.setStorageSync('userInfo', userInfo)

        console.log('登录成功，保存用户信息：', userInfo)

        // 设置登录成功状态
        this.setState({
          currentStep: 4,
          userInfo: {
            avatarUrl: userInfo.avatar || '',
            nickName: userInfo.nickname || userInfo.username
          },
          phoneNumber: userInfo.phone || '',
          isLogging: false
        })

        // 隐藏loading
        Taro.hideLoading()

        Taro.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1500
        })

        // 延迟跳转到首页
        setTimeout(() => {
          Taro.switchTab({
            url: '/pages/index/index'
          })
        }, 1500)

      } else {
        throw new Error(response.message || '登录失败')
      }

    } catch (error) {
      console.error('用户名登录失败:', error)
      Taro.showToast({
        title: error.message || '登录失败',
        icon: 'none'
      })
    } finally {
      Taro.hideLoading()
      this.setState({ isLogging: false })
    }
  }

  render() {
    const { loginMode, isLogging, username, password, captchaCode, captchaImage } = this.state

    // 获取当前登录模式的标题
    const getModeTitle = () => {
      switch (loginMode) {
        case 'username': return '用户名登录'
        case 'password': return '用户名密码登录'
        case 'oauth': return '微信授权登录'
        default: return '登录'
      }
    }

    // 获取切换按钮文字
    const getSwitchText = () => {
      switch (loginMode) {
        case 'username': return '切换到密码登录'
        case 'password': return '切换到微信登录'
        case 'oauth': return '切换到用户名登录'
        default: return '切换登录方式'
      }
    }

    return (
      <View className='login'>
        <View className='login-content'>
          <Text className='login-title'>{getModeTitle()}</Text>

          {/* 用户名登录模式 */}
          {loginMode === 'username' && (
            <View className='form-section'>
              <Input
                className='username-input'
                placeholder='请输入用户名'
                value={username}
                onInput={this.handleUsernameInput}
              />

              <Button
                className={`login-btn ${isLogging ? 'loading' : ''}`}
                onClick={this.performUsernameLogin}
                disabled={isLogging || !username}
              >
                {isLogging && <View className='loading-spinner'></View>}
                <Text className='btn-text'>{isLogging ? '正在登录...' : '登录'}</Text>
              </Button>
            </View>
          )}

          {/* 用户名密码登录模式 */}
          {loginMode === 'password' && (
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
                type='password'
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
                  onClick={this.loadCaptcha}
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
          )}

          {/* 微信授权登录模式 */}
          {loginMode === 'oauth' && (
            <View className='form-section'>
              <Button
                className='wechat-login-btn'
                openType='getPhoneNumber'
                onGetPhoneNumber={this.getPhoneNumber}
                disabled={isLogging}
              >
                微信授权登录
              </Button>
            </View>
          )}

          {/* 切换登录方式按钮 */}
          <View className='switch-section'>
            <Text className='switch-btn' onClick={this.switchLoginMode}>
              {getSwitchText()}
            </Text>
          </View>
        </View>
      </View>
    )
  }
}