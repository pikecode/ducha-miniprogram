import { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { authManager } from '../../utils/auth'
import './index.scss'

interface IndexState {
  userInfo: any
  currentTime: string
  quickActions: Array<{
    id: string
    name: string
    icon: string
    path: string
    color: string
  }>
}

export default class Index extends Component<{}, IndexState> {

  private timer: any = null

  constructor(props) {
    super(props)
    this.state = {
      userInfo: null,
      currentTime: '',
      quickActions: [
        {
          id: '1',
          name: '数据上报',
          icon: '📊',
          path: '/pages/dataReportList/index',
          color: '#ff6b6b'
        },
        {
          id: '2',
          name: '质控督查',
          icon: '🔍',
          path: '/pages/qualityControl/index',
          color: '#4ecdc4'
        },
        {
          id: '3',
          name: '口腔AI',
          icon: '🦷',
          path: '/pages/oralAI/index',
          color: '#45b7d1'
        }
      ]
    }
  }

  componentDidMount() {
    Taro.setNavigationBarTitle({
      title: '首页'
    })

    // 获取用户信息
    const userInfo = Taro.getStorageSync('userInfo')
    this.setState({ userInfo })

    // 设置当前时间
    this.updateTime()
    this.timer = setInterval(() => {
      this.updateTime()
    }, 1000)
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

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }

  updateTime = () => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString('zh-CN', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    })
    this.setState({ currentTime: timeStr })
  }

  handleQuickAction = (action: any) => {
    console.log('快捷操作:', action)
    Taro.switchTab({
      url: action.path
    })
  }

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

  render () {
    const { userInfo, currentTime, quickActions } = this.state

    return (
      <View className='index'>
        {/* 顶部用户信息卡片 */}
        <View className='user-card'>
          <View className='user-info'>
            <View className='avatar'>
              <Text className='avatar-text'>
                {userInfo?.nickname?.[0] || userInfo?.username?.[0] || '用'}
              </Text>
            </View>
            <View className='user-details'>
              <Text className='greeting'>{this.getGreeting()}</Text>
              <Text className='username'>
                {userInfo?.nickname || userInfo?.username || '督查用户'}
              </Text>
            </View>
          </View>
          <View className='time-info'>
            <Text className='current-time'>{currentTime}</Text>
            <Text className='current-date'>
              {new Date().toLocaleDateString('zh-CN', {
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>
        </View>

        {/* 快捷操作区域 */}
        <View className='quick-actions'>
          <Text className='section-title'>快捷操作</Text>
          <View className='actions-grid'>
            {quickActions.map(action => (
              <View
                key={action.id}
                className='action-item'
                onClick={() => this.handleQuickAction(action)}
              >
                <View className='action-icon' style={{ backgroundColor: action.color }}>
                  <Text className='icon-text'>{action.icon}</Text>
                </View>
                <Text className='action-name'>{action.name}</Text>
              </View>
            ))}
          </View>
        </View>

      </View>
    )
  }
}