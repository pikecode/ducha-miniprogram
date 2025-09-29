import { Component } from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { requireLogin } from '../../utils/auth'
import './index.scss'

export default class QualityControl extends Component {

  componentDidMount () {
    // 检查登录状态
    if (!requireLogin()) {
      return
    }

    Taro.setNavigationBarTitle({
      title: '质控督查'
    })
  }

  handleBack = () => {
    Taro.navigateBack()
  }

  render () {
    return (
      <View className='quality-control'>
        <View className='header'>
          <Text className='title'>质控专家现场督查</Text>
          <Text className='subtitle'>评估工具与督查记录</Text>
        </View>

        <View className='content'>
          <View className='section'>
            <Text className='section-title'>督查工具</Text>
            <View className='tool-list'>
              <View className='tool-item'>
                <View className='tool-icon check-icon'></View>
                <View className='tool-content'>
                  <Text className='tool-title'>医疗质量评估</Text>
                  <Text className='tool-desc'>医疗服务质量标准化评估</Text>
                </View>
                <Button className='tool-btn' size='mini'>开始评估</Button>
              </View>
              <View className='tool-item'>
                <View className='tool-icon report-icon'></View>
                <View className='tool-content'>
                  <Text className='tool-title'>督查报告生成</Text>
                  <Text className='tool-desc'>自动生成督查报告和建议</Text>
                </View>
                <Button className='tool-btn' size='mini'>生成报告</Button>
              </View>
              <View className='tool-item'>
                <View className='tool-icon record-icon'></View>
                <View className='tool-content'>
                  <Text className='tool-title'>问题记录追踪</Text>
                  <Text className='tool-desc'>记录问题并跟踪整改情况</Text>
                </View>
                <Button className='tool-btn' size='mini'>查看记录</Button>
              </View>
            </View>
          </View>

          <View className='section'>
            <Text className='section-title'>督查进度</Text>
            <View className='progress-area'>
              <View className='progress-item'>
                <Text className='progress-title'>本月督查计划</Text>
                <View className='progress-bar'>
                  <View className='progress-fill' style='width: 70%'></View>
                </View>
                <Text className='progress-text'>7/10 已完成</Text>
              </View>
              <View className='progress-item'>
                <Text className='progress-title'>问题整改率</Text>
                <View className='progress-bar'>
                  <View className='progress-fill' style='width: 85%'></View>
                </View>
                <Text className='progress-text'>85% 整改完成</Text>
              </View>
            </View>
          </View>

          <View className='section'>
            <Text className='section-title'>最近督查记录</Text>
            <View className='record-list'>
              <View className='record-item'>
                <Text className='record-date'>2025-09-25</Text>
                <Text className='record-title'>口腔科医疗质量督查</Text>
                <Text className='record-status'>已完成</Text>
              </View>
              <View className='record-item'>
                <Text className='record-date'>2025-09-20</Text>
                <Text className='record-title'>设备安全检查</Text>
                <Text className='record-status'>待整改</Text>
              </View>
              <View className='record-item'>
                <Text className='record-date'>2025-09-15</Text>
                <Text className='record-title'>感染控制督查</Text>
                <Text className='record-status'>已完成</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}