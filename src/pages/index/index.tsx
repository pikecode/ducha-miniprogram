import { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { authManager } from '../../utils/auth'
import { apiClient, type HomeConfigResponseData, type QuickAction } from '../../utils/api'
import { getMainPicUrl, getNavDataConfig, getNavInspectConfig, ensureConfigLoaded } from '../../utils/miniProgramConfig'
import './index.scss'

interface IndexState {
  userInfo: any
  homeConfig: HomeConfigResponseData | null
  quickActions: QuickAction[]
  backgroundImage: string
  screenHeight: number
  loading: boolean
}

export default class Index extends Component<{}, IndexState> {

  constructor(props) {
    super(props)
    this.state = {
      userInfo: null,
      homeConfig: null,
      quickActions: [],
      backgroundImage: '',
      screenHeight: 0,
      loading: true
    }
  }

  async componentDidMount() {
    // 获取屏幕信息
    const systemInfo = await Taro.getSystemInfo()
    this.setState({ screenHeight: systemInfo.screenHeight })

    // 加载用户信息
    await this.loadUserInfo()

    // 加载小程序配置
    await this.loadMiniProgramConfig()

    // 加载首页配置
    await this.loadHomeConfig()
  }

  componentDidShow() {
    // 更新自定义TabBar
    this.updateCustomTabBar()
  }

  updateCustomTabBar = () => {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().updateTabBar()
    }
  }

  // 加载用户信息
  loadUserInfo = async () => {
    try {
      const userInfo = Taro.getStorageSync('userInfo')
      if (userInfo) {
        this.setState({ userInfo })
      }
    } catch (error) {
      console.error('加载用户信息失败:', error)
    }
  }

  // 加载小程序配置
  loadMiniProgramConfig = async () => {
    try {
      // 确保配置已加载（避免重复请求）
      await ensureConfigLoaded()
    } catch (error) {
      console.error('加载小程序配置失败:', error)
    }
  }

  // 加载首页配置
  loadHomeConfig = async () => {

    this.useDefaultConfig()
  }

  // 使用默认配置
  useDefaultConfig = () => {
    // 获取服务器配置
    const navDataConfig = getNavDataConfig()
    const navInspectConfig = getNavInspectConfig()

    const defaultQuickActions: QuickAction[] = [
      {
        id: '1',
        name: navDataConfig.name,
        subtitle: navDataConfig.desc,
        icon: navDataConfig.picUrl || '📊',
        activeIcon: navDataConfig.picUrl || '📊',
        path: '/pages/dataReportList/index',
        color: '#ff6b6b',
        order: 1
      },
      {
        id: '2',
        name: navInspectConfig.name,
        subtitle: navInspectConfig.desc,
        icon: navInspectConfig.picUrl || '🔍',
        activeIcon: navInspectConfig.picUrl || '🔍',
        path: '/pages/qualityControl/index',
        color: '#4ecdc4',
        order: 2
      }
    ]

    // 获取配置中的主图地址
    const mainPicUrl = getMainPicUrl()
    const defaultBackgroundImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImJnR3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNjY3ZWVhO3N0b3Atb3BhY2l0eToxIiAvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM3NjRiYTI7c3RvcC1vcGFjaXR5OjEiIC8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9InVybCgjYmdHcmFkaWVudCkiLz4KPHN2ZyB4PSI1MCIgeT0iNTAiIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8dGV4dCB4PSIxNTAiIHk9IjEwMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+CuedqeafpeaOp+WItuWwj+eoi+W6jwo8L3RleHQ+Cjx0ZXh0IHg9IjE1MCIgeT0iMTQwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC44KSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+CuivtuS9v+eUqOacjeWKoeWZqOmFjee9ruWbvueJhwo8L3RleHQ+Cjwvc3ZnPgo8L3N2Zz4=' // 默认背景图（SVG）

    this.setState({
      quickActions: defaultQuickActions,
      backgroundImage: mainPicUrl || defaultBackgroundImage,
      loading: false
    })
  }

  // 处理快捷操作
  handleQuickAction = (action: QuickAction) => {

    Taro.switchTab({
      url: action.path
    })
  }

  // 退出登录
  handleLogout = () => {
    Taro.showModal({
      title: '确认退出',
      content: '您确定要退出登录吗？',
      confirmText: '退出',
      cancelText: '取消',
      confirmColor: '#ff4757',
      success: (res) => {
        if (res.confirm) {
          // 使用authManager的logout方法
          authManager.logout()

          Taro.showToast({
            title: '已退出登录',
            icon: 'success',
            duration: 1500
          })

          // 跳转到登录页
          setTimeout(() => {
            Taro.reLaunch({
              url: '/pages/login/index'
            })
          }, 1500)
        }
      }
    })
  }

  // 获取问候语
  getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 6) return '深夜好'
    if (hour < 9) return '早上好'
    if (hour < 12) return '上午好'
    if (hour < 14) return '中午好'
    if (hour < 17) return '下午好'
    if (hour < 19) return '傍晚好'
    return '晚上好'
  }

  render() {
    const { userInfo, quickActions, backgroundImage, screenHeight, loading } = this.state

    if (loading) {
      return (
        <View className='index loading-state'>
          <Text className='loading-text'>加载中...</Text>
        </View>
      )
    }

    // 计算各部分高度
    const headerHeight = screenHeight * 0.5 // 恢复原来的比例
    const actionHeight = screenHeight * 0.25

    return (
      <View className='index'>
        {/* 顶部背景图片区域 */}
        <View
          className='header-section'
          style={{ height: `${headerHeight}px` }}
        >
          {/* 背景图片 */}
          <Image
            className='background-image'
            src={backgroundImage}
            mode='aspectFill'
          />

          {/* 遮罩层 */}
          <View className='header-overlay' />

          {/* 用户信息内容 */}
          <View className='header-content'>
          </View>
        </View>

        {/* 中部快捷操作区域 */}
        <View
          className='actions-section'
          style={{ height: `${actionHeight}px` }}
        >
          {/* 用户名和退出按钮 */}
          <View className='user-section'>
            <View className='user-details'>
              <Text className='username'>
                {userInfo?.nickname || userInfo?.username || '督查用户'}
              </Text>
              {userInfo?.phone && (
                <Text className='phone'>{userInfo.phone}</Text>
              )}
            </View>
            <View className='logout-btn' onClick={this.handleLogout}>
              <Text className='logout-text'>退出</Text>
            </View>
          </View>

          <View className='actions-container'>
            {quickActions.map(action => (
              <View
                key={action.id}
                className='action-item'
                onClick={() => this.handleQuickAction(action)}
              >
                <View className='action-icon-wrapper'>
                  {action.icon && action.icon.startsWith('http') ? (
                    <Image
                      className='action-icon-img'
                      src={action.icon}
                      mode='aspectFit'
                    />
                  ) : (
                    <Text className='action-icon-emoji'>{action.icon}</Text>
                  )}
                </View>
                <View className='action-text'>
                  <Text className='action-name'>{action.name}</Text>
                  <Text className='action-subtitle'>{action.subtitle}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 底部预留空间（为TabBar预留） */}
        <View className='footer-spacer' />
      </View>
    )
  }
}