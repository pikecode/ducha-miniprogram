import { Component } from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { requireLogin } from '../../utils/auth'
import './index.scss'

export default class DataReport extends Component {

  componentDidMount () {
    // 检查登录状态
    if (!requireLogin()) {
      return
    }

    Taro.setNavigationBarTitle({
      title: '数据上报'
    })
  }

  handleBack = () => {
    Taro.navigateBack()
  }

  render () {
    return (
      <View className='data-report'>
        <View className='header'>
          <Text className='title'>口腔科质控数据上报</Text>
          <Text className='subtitle'>请填写相关数据信息</Text>
        </View>

        <View className='content'>
          <View className='section'>
            <Text className='section-title'>基础数据填报</Text>
            <View className='card-list'>
              <View className='card'>
                <Text className='card-title'>患者信息统计</Text>
                <Text className='card-desc'>门诊量、住院量等基础数据</Text>
                <Button className='card-btn' size='mini'>立即填报</Button>
              </View>
              <View className='card'>
                <Text className='card-title'>医疗质量指标</Text>
                <Text className='card-desc'>治疗成功率、并发症率等</Text>
                <Button className='card-btn' size='mini'>立即填报</Button>
              </View>
              <View className='card'>
                <Text className='card-title'>设备使用情况</Text>
                <Text className='card-desc'>设备利用率、维护记录等</Text>
                <Button className='card-btn' size='mini'>立即填报</Button>
              </View>
            </View>
          </View>

          <View className='section'>
            <Text className='section-title'>数据审核分析</Text>
            <View className='analysis-area'>
              <View className='stat-item'>
                <Text className='stat-number'>85%</Text>
                <Text className='stat-label'>数据完整率</Text>
              </View>
              <View className='stat-item'>
                <Text className='stat-number'>12</Text>
                <Text className='stat-label'>待审核项目</Text>
              </View>
              <View className='stat-item'>
                <Text className='stat-number'>3</Text>
                <Text className='stat-label'>异常数据</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}