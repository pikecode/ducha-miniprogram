import { Component, PropsWithChildren } from 'react'
import Taro from '@tarojs/taro'
import './app.scss'

class App extends Component<PropsWithChildren> {

  componentDidMount () {
    // this.checkLoginStatus()
  }

  componentDidShow () {}

  componentDidHide () {}

  // 检查登录状态
  checkLoginStatus = () => {
    const userInfo = Taro.getStorageSync('userInfo')
    const phoneNumber = Taro.getStorageSync('phoneNumber')

    // 获取当前页面路径
    const pages = Taro.getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const currentRoute = currentPage?.route || ''

    // 如果未登录且不在登录页面，跳转到登录页
    if ((!userInfo || !phoneNumber) && currentRoute !== 'pages/login/index') {

      Taro.reLaunch({
        url: '/pages/login/index'
      })
    }
  }

  render () {
    // this.props.children 是将要会渲染的页面
    return this.props.children
  }
}

export default App