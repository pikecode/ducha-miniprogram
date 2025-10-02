import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

interface BreadcrumbProps {
  items: Array<{
    name: string
    path?: string
  }>
}

export default class Breadcrumb extends Component<BreadcrumbProps> {

  handleNavigate = (path?: string) => {
    if (path) {
      // TabBar页面需要使用switchTab
      if (path === '/pages/qualityControl/index' || path === '/pages/dataReportList/index') {
        Taro.switchTab({
          url: path
        })
      } else {
        Taro.navigateTo({
          url: path
        })
      }
    }
  }

  render() {
    const { items } = this.props

    return (
      <View className='breadcrumb'>
        {items.map((item, index) => (
          <View key={index} className='breadcrumb-item'>
            {item.path ? (
              <Text
                className='breadcrumb-link'
                onClick={() => this.handleNavigate(item.path)}
              >
                {item.name}
              </Text>
            ) : (
              <Text className={`breadcrumb-text ${index === items.length - 1 ? 'breadcrumb-last' : ''}`}>
                {item.name}
              </Text>
            )}
            {index < items.length - 1 && (
              <Text className='breadcrumb-separator'>/</Text>
            )}
          </View>
        ))}
      </View>
    )
  }
}