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

    console.log('自定义TabBar更新，当前页面:', currentRoute)
    console.log('启用的Tab:', enabledTabs)
    console.log('配置统计:', configTabManager.getConfigStats())

    // 找到当前页面对应的Tab索引
    let selected = 0
    enabledTabs.forEach((tab, index) => {
      if (currentRoute === tab.pagePath) {
        selected = index
      }
    })

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