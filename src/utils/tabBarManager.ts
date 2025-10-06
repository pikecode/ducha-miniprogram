import Taro from '@tarojs/taro'

/**
 * TabBar状态管理器
 * 用于解决自定义TabBar状态同步问题
 */
class TabBarManager {
  private currentSelectedIndex: number = 0

  /**
   * 设置当前选中的Tab索引
   */
  setSelectedIndex(index: number) {
    this.currentSelectedIndex = index

  }

  /**
   * 获取当前选中的Tab索引
   */
  getSelectedIndex(): number {
    return this.currentSelectedIndex
  }

  /**
   * 根据页面路径设置选中索引
   */
  setSelectedByPath(pagePath: string) {
    const tabBarPages = [
      'pages/index/index',
      'pages/dataReportList/index',
      'pages/qualityControl/index',
      'pages/oralAI/index'
    ]

    const index = tabBarPages.findIndex(path =>
      pagePath === path || pagePath === `/${path}` || pagePath.endsWith(path)
    )

    if (index >= 0) {
      this.setSelectedIndex(index)
      return index
    }

    return -1
  }

  /**
   * 强制更新所有TabBar实例
   */
  forceUpdateAllTabBars() {
    try {
      const currentPages = Taro.getCurrentPages()
      currentPages.forEach(page => {
        if (typeof page.getTabBar === 'function') {
          const tabBar = page.getTabBar()
          if (tabBar) {
            // 直接设置TabBar的selected状态
            tabBar.setState({ selected: this.currentSelectedIndex })

          }
        }
      })
    } catch (error) {
      console.error('TabBarManager: 更新TabBar失败', error)
    }
  }
}

export const tabBarManager = new TabBarManager()