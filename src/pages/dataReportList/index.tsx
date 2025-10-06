import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { apiClient, DataReportItem } from '../../utils/api'
import './index.scss'

interface DataReportListState {
  reports: DataReportItem[]
  loading: boolean
}

export default class DataReportList extends Component<{}, DataReportListState> {

  constructor(props) {
    super(props)
    this.state = {
      reports: [],
      loading: false
    }
  }

  componentDidMount () {
    Taro.setNavigationBarTitle({
      title: '数据上报'
    })
    this.loadDataReportList()
  }

  componentDidShow() {
    // 更新自定义TabBar
    this.updateCustomTabBar()
  }

  updateCustomTabBar = () => {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().updateTabBar()
    }
  }

  // 加载数据上报列表
  loadDataReportList = async () => {
    this.setState({ loading: true })

    try {

      const response = await apiClient.getDataReportList('zkzbtby')

      if (response.success && response.data) {
        this.setState({
          reports: response.data,
          loading: false
        })

      } else {

        Taro.showToast({
          title: response.message || '获取列表失败',
          icon: 'none'
        })
        this.setState({ loading: false })
      }
    } catch (error) {
      console.error('获取数据上报列表失败:', error)
      Taro.showToast({
        title: '网络错误，请重试',
        icon: 'none'
      })
      this.setState({ loading: false })
    }
  }

  handleReportClick = (report: DataReportItem) => {


    // 跳转到详情页，传递相关参数
    Taro.navigateTo({
      url: `/pages/dataReportDetail/index?id=${report.id}&appkey=${report.appkey}&title=${encodeURIComponent(report.pageName)}&pageType=${report.pageType}`
    })
  }

  render () {
    const { reports, loading } = this.state

    if (loading) {
      return (
        <View className='data-report-list'>
          <View className='loading'>
            <Text>正在加载数据上报列表...</Text>
          </View>
        </View>
      )
    }

    return (
      <View className='data-report-list'>
        {reports.length === 0 ? (
          <View className='empty'>
            <Text>暂无数据上报任务</Text>
          </View>
        ) : (
          reports.map(report => (
            <View
              key={report.id}
              className='report-item'
              onClick={() => this.handleReportClick(report)}
            >
              <Text className='report-title'>{report.pageName}</Text>
              <View className='report-meta'>
                {report.createTime && (
                  <Text className='report-time'>
                    创建时间：{report.createTime}
                  </Text>
                )}
              </View>
            </View>
          ))
        )}
      </View>
    )
  }
}