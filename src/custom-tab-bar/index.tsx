import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { configTabManager, TabConfig } from '../utils/configTabManager'
import './index.scss'

interface CustomTabBarState {
  selected: number
  tabs: TabConfig[]
}

export default class CustomTabBar extends Component<{}, CustomTabBarState> {

  constructor(props) {
    super(props)
    this.state = {
      selected: 0,
      tabs: []
    }
  }

  componentDidMount() {
    this.updateTabBar()
  }

  componentDidShow() {
    this.updateTabBar()
  }

  updateTabBar = () => {
    const enabledTabs = configTabManager.getEnabledTabs()
    const currentPages = Taro.getCurrentPages()
    const currentPage = currentPages[currentPages.length - 1]
    const currentRoute = currentPage?.route || ''

    console.log('=== TabBar更新调试 ===')
    console.log('当前页面路由:', currentRoute)
    console.log('启用的Tab配置:', enabledTabs.map(tab => ({ pagePath: tab.pagePath, text: tab.text })))

    // 找到当前页面对应的Tab索引
    let selected = 0
    enabledTabs.forEach((tab, index) => {
      console.log(`检查Tab ${index}: ${tab.pagePath} === ${currentRoute} ?`, tab.pagePath === currentRoute)
      if (currentRoute === tab.pagePath) {
        selected = index
        console.log(`匹配成功，选中索引: ${index}`)
      }
    })

    console.log('最终选中索引:', selected)
    console.log('=== TabBar更新完成 ===')

    this.setState({
      tabs: enabledTabs,
      selected
    })
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
    const { tabs, selected } = this.state

    if (tabs.length === 0) {
      return null
    }

    return (
      <View className='custom-tab-bar'>
        <View className='tab-bar-border'></View>
        <View className='tab-bar-container'>
          {tabs.map((tab, index) => (
            <View
              key={tab.id}
              className={`tab-bar-item ${selected === index ? 'tab-bar-item--active' : ''}`}
              onClick={() => this.switchTab(tab, index)}
            >
              <View className='tab-bar-item__icon-wrapper'>
                <View className={`tab-bar-item__icon ${selected === index ? 'tab-bar-item__icon--active' : ''}`}>
                  {selected === index ? tab.selectedIcon : tab.icon}
                </View>
              </View>
              <Text className={`tab-bar-item__text ${selected === index ? 'tab-bar-item__text--active' : ''}`}>
                {tab.text}
              </Text>
            </View>
          ))}
        </View>
      </View>
    )
  }

}