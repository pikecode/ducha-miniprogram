import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

interface QualityControlState {
  reports: ReportItem[]
}

interface ReportItem {
  id: string
  title: string
  date: string
  status: 'draft' | 'submitted'
  timeRange: string
}

export default class QualityControl extends Component<{}, QualityControlState> {

  constructor(props) {
    super(props)
    this.state = {
      reports: [
        {
          id: '1',
          title: '三级查房制度督查',
          date: '三级查房制度督查的具体要求、描述，执行时间，仅显示前3行，后面的截断…',
          status: 'draft',
          timeRange: '时间：2025.9.9~2025.9.31'
        },
        {
          id: '2',
          title: '月度质量安全会议督查',
          date: '三级查房制度督查的具体要求、描述，执行时间，仅显示前3行，后面的截断…',
          status: 'draft',
          timeRange: '时间：2025.9.9~2025.9.31'
        },
        {
          id: '3',
          title: '三级查房制度督查',
          date: '三级查房制度督查的具体要求、描述，执行时间，仅显示前3行，后面的截断…',
          status: 'draft',
          timeRange: '时间：2025.9.9~2025.9.31'
        }
      ]
    }
  }

  componentDidMount () {
    Taro.setNavigationBarTitle({
      title: '督查'
    })
  }

  handleReportClick = (report: ReportItem) => {
    console.log('点击报表:', report)
    Taro.navigateTo({
      url: `/pages/qualityDetail/index?title=${encodeURIComponent(report.title)}&description=${encodeURIComponent(report.date)}&timeRange=${encodeURIComponent(report.timeRange)}`
    })
  }

  render () {
    const { reports } = this.state

    return (
      <View className='quality-control'>
        {reports.map(report => (
          <View
            key={report.id}
            className='report-item'
            onClick={() => this.handleReportClick(report)}
          >
            <Text className='report-title'>{report.title}</Text>
            <Text className='report-desc'>{report.date}</Text>
            <Text className='report-time'>{report.timeRange}</Text>
          </View>
        ))}
      </View>
    )
  }
}