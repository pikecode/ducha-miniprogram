import { Component } from 'react'
import { View, Text, Button, Image, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { apiClient } from '../../utils/api'
import { API_CONFIG } from '../../utils/config'
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
      // 默认使用用户名登录
      loginMode: 'username',

      // 微信授权相关
      userInfo: {},
      hasUserInfo: false,
      canIUseGetUserProfile: Boolean(Taro.getUserProfile),
      phoneNumber: '',
      hasPhoneNumber: false,
      phoneEncryptedData: null,

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

    // 暂时不加载验证码
    // this.loadCaptcha()
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
      // 先调用API获取验证码key
      const response = await apiClient.getCaptcha()

      if (response.success && response.data) {
        // 如果API返回了image和key，使用API返回的数据
        this.setState({
          captchaImage: response.data.image,
          captchaKey: response.data.key
        })
        console.log('获取验证码成功:', response.data)
      } else {
        // 如果API不返回JSON，直接使用图片URL
        const timestamp = new Date().getTime()
        const captchaUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CAPTCHA}?t=${timestamp}`

        this.setState({
          captchaImage: captchaUrl,
          captchaKey: timestamp.toString()
        })
        console.log('使用图片URL:', captchaUrl)
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
        captcha: captchaCode
        // 先不传captchaKey，看看后端是否需要
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

      if (response.success && response.data) {
        const { token, userInfo } = response.data

        // 保存token和用户信息
        await Taro.setStorageSync('token', token)
        await Taro.setStorageSync('userInfo', userInfo)

        console.log('登录成功，保存用户信息：', userInfo)

        // 调用任务列表接口
        try {
          console.log('正在获取任务列表...')
          const taskResponse = await apiClient.getTaskLiveList()
          console.log('任务列表响应:', taskResponse)

          if (taskResponse.success && taskResponse.data) {
            console.log('任务列表获取成功:', taskResponse.data)
            // 可以将任务列表保存到存储中
            await Taro.setStorageSync('taskList', taskResponse.data)
          } else {
            console.warn('任务列表获取失败:', taskResponse.message)
          }
        } catch (taskError) {
          console.error('获取任务列表失败:', taskError)
          // 不阻断登录流程，只记录错误
        }

        this.setState({
          currentStep: 4,
          userInfo: {
            avatarUrl: userInfo.avatar || '',
            nickName: userInfo.nickname || userInfo.username
          },
          phoneNumber: userInfo.phone || ''
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
    const { isLogging, username } = this.state

    return (
      <View className='login'>
        <View className='login-content'>
          <Input
            className='username-input'
            placeholder='请输入用户名'
            value={username}
            onInput={this.handleUsernameInput}
          />

          <Button
            className='login-btn'
            onClick={this.performUsernameLogin}
            disabled={isLogging || !username}
          >
            {isLogging ? '正在登录...' : '登录'}
          </Button>
        </View>
      </View>
    )
  }
}