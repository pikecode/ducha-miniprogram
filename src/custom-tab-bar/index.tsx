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
    this.updateTabBar()
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
    // 延迟更新，确保页面已经完全显示
    setTimeout(() => {
      this.updateTabBar()
    }, 50)
  }

  // 加载TabBar配置
  loadTabBarConfig = async () => {

    this.useDefaultTabConfig()
  }

  // 使用默认TabBar配置
  useDefaultTabConfig = () => {
    const enabledTabs = configTabManager.getEnabledTabs()
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

    this.setState({
      tabs: tabBarItems,
      useServerConfig: hasServerIcon,
      loading: false
    })

  }

  updateTabBar = () => {
    if (this.state.loading) {
      return
    }

    const currentPages = Taro.getCurrentPages()
    const currentPage = currentPages[currentPages.length - 1]
    const currentRoute = currentPage?.route || ''

    // 非TabBar页面不需要更新
    const isTabPage = this.state.tabs.some(tab => tab.pagePath === currentRoute)
    if (!isTabPage) {
      return
    }

    // 找到当前页面对应的Tab索引
    let selected = 0
    this.state.tabs.forEach((tab, index) => {
      if (currentRoute === tab.pagePath) {
        selected = index
      }
    })

    // 只有当选中状态发生变化时才更新
    if (this.state.selected !== selected) {
      this.setState({ selected }, () => {
        // 状态更新后强制重新渲染
        this.forceUpdate()
      })
    }
  }

  switchTab = (tab: any, index: number) => {
    const url = `/${tab.pagePath}`

    // 立即更新选中状态
    this.setState({
      selected: index
    }, () => {
      // 状态更新后强制重新渲染
      this.forceUpdate()
    })

    Taro.switchTab({
      url
    }).catch((error) => {
      console.error('切换Tab失败:', error)
      // 如果切换失败，恢复之前的状态
      this.updateTabBar()
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