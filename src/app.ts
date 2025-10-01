import { Component } from 'react'
import Taro from '@tarojs/taro'
import { configTabManager } from './utils/configTabManager'
import './app.scss'

class App extends Component {

  onLaunch() {
    console.log('App launched.')

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

      console.log('初始化基于配置文件的TabBar')
      console.log('配置统计:', configStats)
      console.log('启用的Tab:', enabledTabs)

      if (enabledTabs.length === 0) {
        console.warn('没有启用的Tab，请检查配置文件')
        return
      }

      // 验证配置
      const validation = configTabManager.validateConfig()
      if (!validation.valid) {
        console.warn('Tab配置验证失败:', validation.errors)
      }

      // 设置TabBar样式
      Taro.setTabBarStyle({
        color: tabStyle.color,
        selectedColor: tabStyle.selectedColor,
        backgroundColor: tabStyle.backgroundColor,
        borderStyle: tabStyle.borderStyle
      })

      console.log('TabBar初始化完成，使用自定义TabBar')

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