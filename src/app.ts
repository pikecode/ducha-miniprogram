import { Component } from 'react'
import Taro from '@tarojs/taro'
import { configTabManager } from './utils/configTabManager'
import './app.scss'

class App extends Component {

  onLaunch() {


    // 初始化动态Tab配置
    this.initDynamicTabBar()
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

  componentDidShow() {}

  componentDidHide() {}

  // this.props.children 是将要会渲染的页面
  render() {
    return this.props.children
  }
}

export default App