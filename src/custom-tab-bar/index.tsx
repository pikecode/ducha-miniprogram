import { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { apiClient, type TabBarItem } from '../utils/api'
import { configTabManager, TabConfig } from '../utils/configTabManager'
import { getTabBarMainConfig, getTabBarDataConfig, getTabBarInspectConfig, getTabBarAiConfig, ensureConfigLoaded } from '../utils/miniProgramConfig'
import './index.scss'

interface CustomTabBarState {
  selected: number
  tabs: TabBarItem[]
  loading: boolean
  useServerConfig: boolean
}

export default class CustomTabBar extends Component<{}, CustomTabBarState> {

  constructor(props) {
    super(props)
    this.state = {
      selected: 0,
      tabs: [],
      loading: true,
      useServerConfig: false
    }
  }

  async componentDidMount() {
    // 加载小程序配置
    await this.loadMiniProgramConfig()
    await this.loadTabBarConfig()
    // updateTabBar在setState的callback中调用
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

  componentDidShow() {
    this.updateTabBar()
  }

  // 加载TabBar配置
  loadTabBarConfig = async () => {
    console.log('loadTabBarConfig called')
    this.useDefaultTabConfig()
  }

  // 使用默认TabBar配置
  useDefaultTabConfig = () => {
    console.log('useDefaultTabConfig called')
    const enabledTabs = configTabManager.getEnabledTabs()
    console.log('enabledTabs:', enabledTabs)
    const mainConfig = getTabBarMainConfig()
    const dataConfig = getTabBarDataConfig()
    const inspectConfig = getTabBarInspectConfig()
    const aiConfig = getTabBarAiConfig()


    // 获取Tab配置的函数
    const getTabConfig = (pagePath: string) => {
      switch (pagePath) {
        case 'pages/index/index':
          return mainConfig
        case 'pages/dataReportList/index':
          return dataConfig
        case 'pages/qualityControl/index':
          return inspectConfig
        case 'pages/oralAI/index':
          return aiConfig
        default:
          return null
      }
    }

    // 转换为TabBarItem格式
    const tabBarItems: TabBarItem[] = enabledTabs.map(tab => {
      const serverConfig = getTabConfig(tab.pagePath)

      // 如果有服务器配置且配置显示，使用服务器配置
      if (serverConfig && serverConfig.show) {
        return {
          id: tab.id,
          pagePath: tab.pagePath,
          text: serverConfig.name,
          icon: serverConfig.unactivePicUrl || tab.icon,
          activeIcon: serverConfig.activePicUrl || tab.selectedIcon,
          order: tab.order
        }
      }

      return {
        id: tab.id,
        pagePath: tab.pagePath,
        text: tab.text,
        icon: tab.icon,
        activeIcon: tab.selectedIcon,
        order: tab.order
      }
    }).filter(tab => {
      const serverConfig = getTabConfig(tab.pagePath)
      // 如果有服务器配置且配置不显示，则过滤掉
      if (serverConfig && !serverConfig.show) {
        return false
      }
      return true
    })

    // 检查是否有服务器配置的图标（需要是HTTP URL）
    const hasServerIcon = tabBarItems.some(tab => {
      const serverConfig = getTabConfig(tab.pagePath)
      return serverConfig && (
        (serverConfig.activePicUrl && serverConfig.activePicUrl.startsWith('http')) ||
        (serverConfig.unactivePicUrl && serverConfig.unactivePicUrl.startsWith('http'))
      )
    })

    console.log('Setting tabs:', tabBarItems)
    console.log('Setting loading to false')

    this.setState({
      tabs: tabBarItems,
      useServerConfig: hasServerIcon,
      loading: false
    }, () => {
      // setState完成后再调用updateTabBar
      console.log('setState completed, now calling updateTabBar')
      this.updateTabBar()
    })

  }

  updateTabBar = () => {
    console.log('=== updateTabBar called ===')
    console.log('Current state:', {
      loading: this.state.loading,
      tabsLength: this.state.tabs.length,
      tabs: this.state.tabs
    })

    if (this.state.loading || this.state.tabs.length === 0) {
      console.log('TabBar updateTabBar: EARLY RETURN - loading:', this.state.loading, 'tabs length:', this.state.tabs.length)
      return
    }

    const currentPages = Taro.getCurrentPages()
    const currentPage = currentPages[currentPages.length - 1]
    const currentRoute = currentPage?.route || ''

    console.log('TabBar updateTabBar - Current Route:', currentRoute)
    console.log('TabBar updateTabBar - Available Tabs:', this.state.tabs.map(tab => tab.pagePath))

    // 找到当前页面对应的Tab索引
    let selected = 0
    this.state.tabs.forEach((tab, index) => {
      console.log(`TabBar - Comparing route "${currentRoute}" with tab "${tab.pagePath}"`)
      // 支持多种路径格式的匹配
      if (currentRoute === tab.pagePath ||
          currentRoute === `/${tab.pagePath}` ||
          `/${currentRoute}` === `/${tab.pagePath}`) {
        selected = index
        console.log(`TabBar - Match found! Selected index: ${index}`)
      }
    })

    console.log('TabBar - Final selected:', selected, 'Previous:', this.state.selected)
    this.setState({ selected })
  }

  switchTab = (tab: any, index: number) => {
    const url = `/${tab.pagePath}`

    Taro.switchTab({
      url
    }).catch((error) => {
      console.error('切换Tab失败:', error)
    })
  }

  render() {
    const { tabs, selected, loading, useServerConfig } = this.state

    if (loading || tabs.length === 0) {
      return null
    }

    return (
      <View className='custom-tab-bar'>
        <View className='tab-bar-border'></View>
        <View className='tab-bar-container'>
          {tabs.map((tab, index) => {
            const isActive = selected === index
            const iconUrl = isActive ? tab.activeIcon : tab.icon

            return (
              <View
                key={tab.id}
                className={`tab-bar-item ${isActive ? 'tab-bar-item--active' : ''}`}
                onClick={() => this.switchTab(tab, index)}
              >
                <View className='tab-bar-item__icon-wrapper'>
                  {iconUrl && iconUrl.startsWith('http') ? (
                    <Image
                      className={`tab-bar-item__icon-img ${isActive ? 'tab-bar-item__icon-img--active' : ''}`}
                      src={iconUrl}
                      mode='aspectFit'
                    />
                  ) : (
                    <View className={`tab-bar-item__icon ${isActive ? 'tab-bar-item__icon--active' : ''}`}>
                      {iconUrl}
                    </View>
                  )}
                </View>
                <Text className={`tab-bar-item__text ${isActive ? 'tab-bar-item__text--active' : ''}`}>
                  {tab.text}
                </Text>
              </View>
            )
          })}
        </View>
      </View>
    )
  }

}