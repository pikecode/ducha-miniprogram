import { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { getUserInfo, getPhoneNumber, requireLogin, clearLoginInfo } from '../../utils/auth'
import './index.scss'

interface IndexState {
  userInfo: any
  phoneNumber: string
}

export default class Index extends Component<{}, IndexState> {

  constructor(props) {
    super(props)
    this.state = {
      userInfo: {},
      phoneNumber: ''
    }
  }

  componentDidMount() {
    // 检查登录状态
    if (requireLogin()) {
      this.loadUserInfo()
    }
  }

  // 加载用户信息
  loadUserInfo = () => {
    const userInfo = getUserInfo()
    const phoneNumber = getPhoneNumber()

    this.setState({
      userInfo,
      phoneNumber
    })
  }

  handleDataReport = () => {
    Taro.navigateTo({
      url: '/pages/dataReport/index'
    })
  }

  handleQualityControl = () => {
    Taro.navigateTo({
      url: '/pages/qualityControl/index'
    })
  }

  // 退出登录
  handleLogout = () => {
    Taro.showModal({
      title: '确认退出',
      content: '您确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          clearLoginInfo()
          Taro.showToast({
            title: '已退出登录',
            icon: 'success'
          })
          setTimeout(() => {
            Taro.reLaunch({
              url: '/pages/login/index'
            })
          }, 1500)
        }
      }
    })
  }

  render () {
    return (
      <View className='index'>
        {/* 顶部轮播图区域 */}
        <View className='banner'>
          <Image
            className='banner-image'
            src='https://via.placeholder.com/750x400/4a90e2/ffffff?text=督查小程序'
            mode='aspectFill'
          />
          {/* 用户信息覆盖层 */}
          <View className='user-overlay'>
            <View className='user-info-header'>
              <View className='user-avatar-section'>
                <Image
                  className='user-avatar'
                  src={this.state.userInfo.avatarUrl || 'https://via.placeholder.com/80x80/cccccc/ffffff?text=👤'}
                  mode='aspectFill'
                />
                <View className='user-details'>
                  <Text className='user-name'>{this.state.userInfo.nickName || '用户'}</Text>
                  <Text className='user-phone'>{this.state.phoneNumber || ''}</Text>
                </View>
              </View>
              <View className='logout-btn' onClick={this.handleLogout}>
                <Text className='logout-text'>退出</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 功能入口区域 */}
        <View className='function-area'>
          <View className='function-item' onClick={this.handleDataReport}>
            <View className='function-icon'>
              <View className='icon-chart'></View>
            </View>
            <View className='function-content'>
              <Text className='function-title'>数据上报</Text>
              <Text className='function-desc'>口腔科质控数据填报、审核分析</Text>
            </View>
          </View>

          <View className='function-item' onClick={this.handleQualityControl}>
            <View className='function-icon'>
              <View className='icon-check'></View>
            </View>
            <View className='function-content'>
              <Text className='function-title'>质控督查</Text>
              <Text className='function-desc'>质控专家现场督查、评估工具</Text>
            </View>
          </View>
        </View>

      </View>
    )
  }
}