import { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { apiClient, type TabBarItem } from '../utils/api'
import { configTabManager, TabConfig } from '../utils/configTabManager'
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
    await this.loadTabBarConfig()
    this.updateTabBar()
  }

  componentDidShow() {
    this.updateTabBar()
  }

  // 加载TabBar配置
  loadTabBarConfig = async () => {

    this.useDefaultTabConfig()
  }

  // 使用默认TabBar配置
  useDefaultTabConfig = () => {
    const enabledTabs = configTabManager.getEnabledTabs()
    // 转换为TabBarItem格式
    const tabBarItems: TabBarItem[] = enabledTabs.map(tab => ({
      id: tab.id,
      pagePath: tab.pagePath,
      text: tab.text,
      icon: tab.icon,
      activeIcon: tab.selectedIcon,
      order: tab.order
    }))

    this.setState({
      tabs: tabBarItems,
      useServerConfig: false,
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

    this.setState({ selected })
  }

  switchTab = (tab: any, index: number) => {
    const url = `/${tab.pagePath}`

    Taro.switchTab({
      url
    }).then(() => {
      this.setState({
        selected: index
      })
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
                  {useServerConfig && iconUrl ? (
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