import { Component } from 'react'
import { View, Text, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { requireLogin } from '../../utils/auth'
import './index.scss'

export default class OralAI extends Component {

  componentDidMount () {
    // 检查登录状态
    if (!requireLogin()) {
      return
    }

    Taro.setNavigationBarTitle({
      title: '口腔AI'
    })
  }

  handleDiagnosis = () => {
    Taro.showToast({
      title: 'AI诊断功能开发中',
      icon: 'none'
    })
  }

  handleAnalysis = () => {
    Taro.showToast({
      title: 'AI分析功能开发中',
      icon: 'none'
    })
  }

  handleReport = () => {
    Taro.showToast({
      title: 'AI报告功能开发中',
      icon: 'none'
    })
  }

  render () {
    return (
      <View className='oral-ai'>
        <View className='header'>
          <View className='ai-logo'>
            <Text className='ai-icon'>🧠</Text>
            <Text className='ai-title'>智能口腔AI助手</Text>
          </View>
          <Text className='ai-subtitle'>AI驱动的口腔健康诊断与分析</Text>
        </View>

        <View className='content'>
          <View className='section'>
            <Text className='section-title'>AI诊断工具</Text>
            <View className='ai-tools'>
              <View className='tool-card' onClick={this.handleDiagnosis}>
                <View className='tool-icon diagnosis-icon'>
                  <Text className='icon-text'>🔍</Text>
                </View>
                <Text className='tool-name'>智能诊断</Text>
                <Text className='tool-desc'>基于图像识别的口腔疾病智能诊断</Text>
                <Button className='tool-action' size='mini'>开始诊断</Button>
              </View>

              <View className='tool-card' onClick={this.handleAnalysis}>
                <View className='tool-icon analysis-icon'>
                  <Text className='icon-text'>📊</Text>
                </View>
                <Text className='tool-name'>数据分析</Text>
                <Text className='tool-desc'>AI驱动的口腔健康数据深度分析</Text>
                <Button className='tool-action' size='mini'>查看分析</Button>
              </View>

              <View className='tool-card' onClick={this.handleReport}>
                <View className='tool-icon report-icon'>
                  <Text className='icon-text'>📋</Text>
                </View>
                <Text className='tool-name'>智能报告</Text>
                <Text className='tool-desc'>自动生成专业的口腔健康报告</Text>
                <Button className='tool-action' size='mini'>生成报告</Button>
              </View>
            </View>
          </View>

          <View className='section'>
            <Text className='section-title'>AI能力展示</Text>
            <View className='capabilities'>
              <View className='capability-item'>
                <View className='capability-number'>95%</View>
                <Text className='capability-label'>诊断准确率</Text>
              </View>
              <View className='capability-item'>
                <View className='capability-number'>1000+</View>
                <Text className='capability-label'>病例数据库</Text>
              </View>
              <View className='capability-item'>
                <View className='capability-number'>24/7</View>
                <Text className='capability-label'>在线服务</Text>
              </View>
            </View>
          </View>

          <View className='section'>
            <Text className='section-title'>最新功能</Text>
            <View className='feature-list'>
              <View className='feature-item'>
                <View className='feature-dot new'></View>
                <Text className='feature-text'>增强型图像识别算法</Text>
                <Text className='feature-tag'>NEW</Text>
              </View>
              <View className='feature-item'>
                <View className='feature-dot updated'></View>
                <Text className='feature-text'>多模态AI诊断系统</Text>
                <Text className='feature-tag'>UPDATED</Text>
              </View>
              <View className='feature-item'>
                <View className='feature-dot coming'></View>
                <Text className='feature-text'>个性化治疗方案推荐</Text>
                <Text className='feature-tag'>COMING</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}