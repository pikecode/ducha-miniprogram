import { Component } from 'react'
import Taro from '@tarojs/taro'
import { configTabManager } from './utils/configTabManager'
import { apiClient } from './utils/api'
import './app.scss'

class App extends Component {

  onLaunch() {
    // 加载小程序配置
    this.loadMiniProgramConfig()

    // 初始化动态Tab配置
    this.initDynamicTabBar()
  }

  /**
   * 加载小程序配置
   */
  async loadMiniProgramConfig() {
    try {
      const response = await apiClient.getMiniProgramConfig()

      if (response.success && response.data) {
        // 将配置保存到本地存储
        Taro.setStorageSync('miniProgramConfig', response.data)
      }
    } catch (error) {
      console.error('加载小程序配置失败:', error)
      // 配置加载失败不影响小程序启动，静默处理
    }
  }

  /**
   * 初始化动态TabBar配置
   */
  initDynamicTabBar() {
    try {
      const enabledTabs = configTabManager.getEnabledTabs()
      const tabStyle = configTabManager.getTabStyle()
      const configStats = configTabManager.getConfigStats()





      if (enabledTabs.length === 0) {

        return
      }

      // 验证配置
      const validation = configTabManager.validateConfig()
      if (!validation.valid) {

      }

      // 自定义TabBar不需要调用setTabBarStyle API
      // TabBar样式已通过CSS自定义实现



    } catch (error) {
      console.error('初始化动态TabBar失败:', error)
    }
  }

  /**
   * 更新TabBar配置（供其他页面调用）
   */
  static updateTabBar() {
    const app = Taro.getApp()
    if (app && app.initDynamicTabBar) {
      app.initDynamicTabBar()
    }
  }

  /**
   * 获取小程序配置（供其他地方调用）
   */
  static getMiniProgramConfig() {
    return Taro.getStorageSync('miniProgramConfig') || {}
  }

  componentDidShow() {}

  componentDidHide() {}

  // this.props.children 是将要会渲染的页面
  render() {
    return this.props.children
  }
}

export default App