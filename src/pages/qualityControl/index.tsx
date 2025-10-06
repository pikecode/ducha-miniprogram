import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { apiClient, TaskLiveListItem } from '../../utils/api'
import { apiConfigManager } from '../../utils/apiConfigManager'
import './index.scss'

interface QualityControlState {
  taskList: TaskLiveListItem[]
  loading: boolean
}

export default class QualityControl extends Component<{}, QualityControlState> {

  constructor(props) {
    super(props)
    this.state = {
      taskList: [],
      loading: false
    }
  }

  componentDidMount () {

    Taro.setNavigationBarTitle({
      title: '督查'
    })

    this.loadTaskList()

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

  // 加载督查列表
  loadTaskList = async () => {

    this.setState({ loading: true })

    try {

      const orgId = apiConfigManager.getTaskListOrgId()



      // 输出配置调试信息

      apiConfigManager.debugInfo()




      const response = await apiClient.getTaskLiveList({
        orgId
      })



      if (response.success && response.data) {
        this.setState({
          taskList: response.data,
          loading: false
        })

      } else {

        Taro.showToast({
          title: response.message || '获取督查列表失败',
          icon: 'none'
        })
        this.setState({ loading: false })
      }
    } catch (error) {
      console.error('=== API请求异常 ===')
      console.error('错误类型:', typeof error)
      console.error('错误信息:', error)
      console.error('错误堆栈:', error?.stack)
      Taro.showToast({
        title: '网络错误，请重试',
        icon: 'none'
      })
      this.setState({ loading: false })
    }
  }

  handleTaskClick = (task: TaskLiveListItem) => {



    // 根据planType字段判断跳转类型
    if (task.planType === '0') {

      // planType="1"：现场督查（病历督查），跳转到病历列表页面
      Taro.navigateTo({
        url: `/pages/patientList/index?taskId=${task.id}&title=${encodeURIComponent(task.planName)}&scoreDict=${encodeURIComponent(task.scoreDict || '')}`
      })
    } else if (task.planType === '1') {

      // planType="0"：线上督查（部门督查），跳转到部门列表页面
      Taro.navigateTo({
        url: `/pages/departmentList/index?taskId=${task.id}&title=${encodeURIComponent(task.planName)}`
      })
    } else {

      // 其他情况，跳转到督查详情页面
      Taro.navigateTo({
        url: `/pages/qualityDetail/index?id=${task.id}&title=${encodeURIComponent(task.planName)}&description=${encodeURIComponent(task.remarks || '')}&timeRange=${encodeURIComponent(`时间：${task.startTime.split(' ')[0]}~${task.endTime.split(' ')[0]}`)}`
      })
    }
  }

  // 格式化时间范围
  formatTimeRange = (startTime: string, endTime: string): string => {
    const start = startTime.split(' ')[0]
    const end = endTime.split(' ')[0]
    return `时间：${start}~${end}`
  }

  // 判断督查类型
  getTaskType = (task: TaskLiveListItem): { type: 'medical' | 'department', label: string, color: string } => {
    // 优先根据planType字段判断类型
    if (task.planType === '0') {
      return {
        type: 'medical',
        label: '病历督查',
        color: '#ff6b6b'
      }
    } else if (task.planType === '1') {
      return {
        type: 'department',
        label: '部门督查',
        color: '#4ecdc4'
      }
    }

    // 如果planType不明确，则根据名称关键词判断类型
    const planName = task.planName.toLowerCase()
    const batchName = task.batchName.toLowerCase()

    if (planName.includes('病历') || planName.includes('病案') || planName.includes('医疗') ||
        batchName.includes('病历') || batchName.includes('病案') || batchName.includes('医疗')) {
      return {
        type: 'medical',
        label: '病历督查',
        color: '#ff6b6b'
      }
    } else {
      return {
        type: 'department',
        label: '部门督查',
        color: '#4ecdc4'
      }
    }
  }


  render () {
    const { taskList, loading } = this.state

    if (loading) {
      return (
        <View className='quality-control'>
          <View className='loading'>
            <Text>正在加载督查列表...</Text>
          </View>
        </View>
      )
    }

    return (
      <View className='quality-control'>
        {taskList.length === 0 ? (
          <View className='empty'>
            <Text>暂无督查任务</Text>
          </View>
        ) : (
          taskList.map(task => {
            const taskType = this.getTaskType(task)
            return (
              <View
                key={task.id}
                className='report-item'
                onClick={() => this.handleTaskClick(task)}
              >
                <View className='report-header'>
                  <Text className='report-title'>{task.planName}</Text>
                  <View className='task-type-tag' style={{ backgroundColor: taskType.color }}>
                    <Text className='task-type-text'>{taskType.label}</Text>
                  </View>
                </View>
                <Text className='report-desc'>{task.remarks || '无描述信息'}</Text>
                <Text className='report-time'>{this.formatTimeRange(task.startTime, task.endTime)}</Text>
                <Text className='report-status'>
                  部门：{task.departmentName} | 状态：{task.flowStatus === '1' ? '进行中' : '已完成'}
                </Text>
              </View>
            )
          })
        )}
      </View>
    )
  }
}