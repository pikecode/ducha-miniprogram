import { Component } from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Breadcrumb from '../../components/Breadcrumb'
import './index.scss'

interface DataReportDetailState {
  title: string
  description: string
  timeRange: string
  activeTab: 'task' | 'data'
  dataList: Array<{
    id: string
    month: string
  }>
}

export default class DataReportDetail extends Component<{}, DataReportDetailState> {

  constructor(props) {
    super(props)
    this.state = {
      title: '',
      description: '',
      timeRange: '',
      activeTab: 'task',
      dataList: [
        { id: '1', month: '2025年8月' },
        { id: '2', month: '2025年7月' },
        { id: '3', month: '2025年6月' }
      ]
    }
  }

  componentDidMount() {
    // 获取路由参数
    const params = Taro.getCurrentInstance().router?.params
    if (params) {
      this.setState({
        title: decodeURIComponent(params.title || ''),
        description: decodeURIComponent(params.description || ''),
        timeRange: decodeURIComponent(params.timeRange || '')
      })
    }

    Taro.setNavigationBarTitle({
      title: '填报任务'
    })
  }

  handleTabChange = (tab: 'task' | 'data') => {
    this.setState({ activeTab: tab })
  }

  handleGoToReport = () => {
    Taro.showToast({
      title: '去填报功能开发中',
      icon: 'none'
    })
  }

  handleDataItemClick = (item: any) => {
    Taro.showToast({
      title: `点击了${item.month}`,
      icon: 'none'
    })
  }

  render() {
    const { title, description, timeRange, activeTab, dataList } = this.state

    return (
      <View className='data-report-detail'>
        {/* 面包屑导航 */}
        <Breadcrumb
          items={[
            { name: '数据上报', path: '/pages/dataReportList/index' },
            { name: '填报任务' }
          ]}
        />

        {/* 顶部Tab */}
        <View className='tabs'>
          <View
            className={`tab-item ${activeTab === 'task' ? 'active' : ''}`}
            onClick={() => this.handleTabChange('task')}
          >
            <Text className='tab-text'>填报任务</Text>
          </View>
          <View
            className={`tab-item ${activeTab === 'data' ? 'active' : ''}`}
            onClick={() => this.handleTabChange('data')}
          >
            <Text className='tab-text'>数据列表</Text>
          </View>
        </View>

        {/* 内容区域 */}
        <View className='content'>
          {activeTab === 'task' ? (
            <View className='detail-card'>
              <Text className='detail-title'>{title}</Text>
              <Text className='detail-desc'>{description}</Text>
              <Text className='detail-time'>时间：{timeRange}</Text>
              <Button className='report-btn' onClick={this.handleGoToReport}>
                去填报
              </Button>
            </View>
          ) : (
            <View className='data-list-container'>
              <View className='data-header'>
                <Text className='data-header-text'>已填报数据</Text>
              </View>
              <View className='data-list'>
                {dataList.map(item => (
                  <View
                    key={item.id}
                    className='data-item'
                    onClick={() => this.handleDataItemClick(item)}
                  >
                    <Text className='data-item-text'>{item.month}</Text>
                    <View className='data-item-arrow'>›</View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    )
  }
}