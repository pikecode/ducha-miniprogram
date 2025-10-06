import { Component } from 'react'

/**
 * TabBar页面基类
 * 统一处理TabBar相关的生命周期和方法
 */
export default class BaseTabPage<P = {}, S = {}> extends Component<P, S> {

  componentDidShow() {
    // 更新自定义TabBar
    this.updateCustomTabBar()
  }

  /**
   * 更新自定义TabBar状态
   * 所有TabBar页面都需要在componentDidShow中调用
   */
  updateCustomTabBar = () => {
    console.log('BaseTabPage updateCustomTabBar called')

    // 直接调用全局TabBar实例
    const customTabBar = (getApp() as any).globalData?.customTabBar
    if (customTabBar && customTabBar.updateTabBar) {
      console.log('Calling global customTabBar.updateTabBar()')
      customTabBar.updateTabBar()
    } else {
      console.log('Global customTabBar not found')
    }
  }
}