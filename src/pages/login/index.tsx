import { Component } from 'react'
import { View, Text, Button, Image, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { apiClient } from '../../utils/api'
import { API_CONFIG } from '../../utils/config'
import './index.scss'

interface LoginState {
  // 登录模式：'oauth' | 'password'
  loginMode: 'oauth' | 'password'

  // 微信授权相关
  userInfo: any
  hasUserInfo: boolean
  canIUseGetUserProfile: boolean
  phoneNumber: string
  hasPhoneNumber: boolean
  phoneEncryptedData: any    // 手机号加密数据
  inputPhoneNumber: string   // 用户输入的手机号

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
      // 默认使用微信授权登录
      loginMode: 'oauth',

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


  // 获取手机号
  getPhoneNumber = (e) => {
    console.log('获取手机号回调', e)

    if (e.detail.code) {
      // 保存手机号加密数据
      this.setState({
        phoneEncryptedData: {
          code: e.detail.code,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        }
      })

      Taro.showToast({
        title: '手机号授权成功',
        icon: 'success'
      })

      // 开始登录流程
      this.performLogin()

    } else {
      Taro.showToast({
        title: '手机号授权失败',
        icon: 'none'
      })
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
    const newMode = this.state.loginMode === 'oauth' ? 'password' : 'oauth'
    this.setState({
      loginMode: newMode,
      currentStep: 1,
      // 重置状态
      username: '',
      password: '',
      captchaCode: '',
      inputPhoneNumber: '',
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
      const response = await apiClient.getCaptcha()
      if (response.success) {
        this.setState({
          captchaImage: response.data.image,
          captchaKey: response.data.key
        })
      }
    } catch (error) {
      console.error('获取验证码失败:', error)
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
        captcha: captchaCode
      }

      console.log('密码登录参数:', loginParams)

      const response = await apiClient.login(loginParams)

      console.log('密码登录响应:', response)

      if (response.success) {
        // 登录成功
        const { token, userInfo: serverUserInfo } = response.data

        // 保存登录信息
        Taro.setStorageSync('token', token)
        Taro.setStorageSync('userInfo', serverUserInfo)
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

  render() {
    const {
      loginMode,
      userInfo,
      currentStep,
      inputPhoneNumber,
      isLogging,
      username,
      password,
      captchaCode,
      captchaImage
    } = this.state

    return (
      <View className='login'>
        <View className='login-header'>
          <View className='logo'>
            <Text className='logo-icon'>🦷</Text>
          </View>
          <Text className='app-name'>督查小程序</Text>
          <Text className='app-desc'>口腔质控专业平台</Text>
        </View>

        <View className='login-content'>
          {/* 登录模式切换按钮 */}
          {currentStep === 1 && (
            <View className='mode-switch'>
              <Button
                className='switch-btn'
                onClick={this.switchLoginMode}
              >
                {loginMode === 'oauth' ? '改用账号登录' : '改用微信登录'}
              </Button>
            </View>
          )}

          {/* 微信授权登录模式 */}
          {loginMode === 'oauth' && (
            <>
              {/* 步骤1：获取登录凭证 */}
              {currentStep === 1 && (
                <View className='auth-section'>
                  <View className='auth-info'>
                    <Text className='auth-title'>微信登录</Text>
                    <Text className='auth-desc'>
                      获取登录凭证，开始登录流程
                    </Text>
                  </View>
                  <Button
                    className='auth-btn wechat-btn'
                    onClick={this.handleWechatLogin}
                  >
                    <Text className='btn-icon'>🔑</Text>
                    获取登录凭证
                  </Button>
                </View>
              )}

              {/* 步骤1.5：用户信息授权 */}
              {currentStep === 1.5 && (
                <View className='auth-section'>
                  <View className='auth-info'>
                    <Text className='auth-title'>授权用户信息</Text>
                    <Text className='auth-desc'>
                      获取您的微信头像、昵称等基本信息，用于个性化服务
                    </Text>
                  </View>
                  <Button
                    className='auth-btn wechat-btn'
                    onClick={this.handleGetUserProfile}
                  >
                    <Text className='btn-icon'>👤</Text>
                    授权用户信息
                  </Button>
                </View>
              )}

            {/* 步骤2：输入手机号 */}
            {currentStep === 2 && (
              <View className='auth-section'>
                <View className='user-info'>
                  <Image
                    className='avatar'
                    src={userInfo.avatarUrl}
                    mode='aspectFill'
                  />
                  <Text className='nickname'>{userInfo.nickName}</Text>
                </View>

                <View className='auth-info'>
                  <Text className='auth-title'>输入手机号</Text>
                  <Text className='auth-desc'>
                    请输入您的手机号，用于账号验证和安全登录
                  </Text>
                </View>

                <View className='phone-input-section'>
                  <Input
                    className='phone-input'
                    type='number'
                    placeholder='请输入手机号'
                    maxlength={11}
                    value={inputPhoneNumber}
                    onInput={this.handlePhoneInput}
                  />
                  <Button
                    className='auth-btn confirm-btn'
                    onClick={this.handlePhoneConfirm}
                    disabled={!inputPhoneNumber}
                  >
                    下一步
                  </Button>
                </View>
              </View>
            )}

            {/* 步骤3：手机号验证 */}
            {currentStep === 3 && (
              <View className='auth-section'>
                <View className='user-info'>
                  <Image
                    className='avatar'
                    src={userInfo.avatarUrl}
                    mode='aspectFill'
                  />
                  <Text className='nickname'>{userInfo.nickName}</Text>
                  <Text className='phone-display'>手机号：{inputPhoneNumber}</Text>
                </View>

                <View className='auth-info'>
                  <Text className='auth-title'>手机号验证</Text>
                  <Text className='auth-desc'>
                    需要验证您的手机号以确保账号安全
                  </Text>
                </View>

                <Button
                  className='auth-btn phone-btn'
                  openType='getPhoneNumber'
                  onGetPhoneNumber={this.getPhoneNumber}
                  disabled={isLogging}
                >
                  <Text className='btn-icon'>📱</Text>
                  {isLogging ? '正在登录...' : '验证手机号'}
                </Button>
              </View>
            )}
          </>
        )}

        {/* 用户名密码登录模式 */}
        {loginMode === 'password' && currentStep === 1 && (
            <View className='password-login'>
              <View className='auth-info'>
                <Text className='auth-title'>账号登录</Text>
                <Text className='auth-desc'>
                  使用用户名和密码登录系统
                </Text>
              </View>

              <View className='form-section'>
                <Input
                  className='form-input'
                  placeholder='请输入用户名'
                  value={username}
                  onInput={this.handleUsernameInput}
                />

                <Input
                  className='form-input'
                  type='password'
                  placeholder='请输入密码'
                  value={password}
                  onInput={this.handlePasswordInput}
                />

                <View className='captcha-section'>
                  <Input
                    className='captcha-input'
                    placeholder='请输入验证码'
                    value={captchaCode}
                    maxlength={4}
                    onInput={this.handleCaptchaInput}
                  />
                  <Image
                    className='captcha-image'
                    src={captchaImage}
                    mode='aspectFit'
                    onClick={this.loadCaptcha}
                  />
                </View>

                <Button
                  className='auth-btn login-btn'
                  onClick={this.performPasswordLogin}
                  disabled={isLogging || !username || !password || !captchaCode}
                >
                  {isLogging ? '正在登录...' : '登录'}
                </Button>
              </View>
            </View>
          )}

        {/* 登录完成（通用） */}
          {currentStep === 4 && (
            <View className='success-section'>
              <View className='user-info'>
                <Image
                  className='avatar'
                  src={userInfo.avatarUrl}
                  mode='aspectFill'
                />
                <Text className='nickname'>{userInfo.nickName}</Text>
                <Text className='phone-display'>手机号：{this.state.phoneNumber}</Text>
              </View>
              <View className='success-icon'>✅</View>
              <Text className='success-text'>登录成功，正在进入应用...</Text>
            </View>
          )}
        </View>

        <View className='login-footer'>
          <Text className='privacy-text'>
            登录即表示同意《用户协议》和《隐私政策》
          </Text>
        </View>
      </View>
    )
  }
}