import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

interface DataReportListState {
  reports: ReportItem[]
}

interface ReportItem {
  id: string
  title: string
  date: string
  status: 'draft' | 'submitted'
  timeRange: string
}

export default class DataReportList extends Component<{}, DataReportListState> {

  constructor(props) {
    super(props)
    this.state = {
      reports: [
        {
          id: '1',
          title: '口腔医疗质量数据上报（年度）',
          date: '口腔年度数据上报的具体描述等要求描述，详细描述，只显示3行，超过的截断…',
          status: 'draft',
          timeRange: '2025.9.9~2025.9.31'
        },
        {
          id: '2',
          title: '口腔医疗质量数据上报（月度）',
          date: '口腔年度数据上报的具体描述等要求描述，详细描述，只显示3行，超过的截断…',
          status: 'draft',
          timeRange: '2025.9.9~2025.9.31'
        }
      ]
    }
  }

  componentDidMount () {
    Taro.setNavigationBarTitle({
      title: '数据上报'
    })
  }

  handleReportClick = (report: ReportItem) => {
    console.log('点击报表:', report)
    Taro.navigateTo({
      url: `/pages/dataReportDetail/index?title=${encodeURIComponent(report.title)}&description=${encodeURIComponent(report.date)}&timeRange=${encodeURIComponent(report.timeRange)}`
    })
  }

  render () {
    const { reports } = this.state

    return (
      <View className='data-report-list'>
        {reports.map(report => (
          <View
            key={report.id}
            className='report-item'
            onClick={() => this.handleReportClick(report)}
          >
            <Text className='report-title'>{report.title}</Text>
            <Text className='report-date'>{report.date}</Text>
          </View>
        ))}
      </View>
    )
  }
}