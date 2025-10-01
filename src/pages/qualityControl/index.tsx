import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { apiClient, TaskLiveListItem } from '../../utils/api'
import { apiConfigManager } from '../../utils/apiConfigManager'
import './index.scss'

interface QualityControlState {
  taskList: TaskLiveListItem[]
  filteredTaskList: TaskLiveListItem[]
  loading: boolean
  currentFilter: 'all' | 'medical' | 'department'
}

export default class QualityControl extends Component<{}, QualityControlState> {

  constructor(props) {
    super(props)
    this.state = {
      taskList: [],
      filteredTaskList: [],
      loading: false,
      currentFilter: 'all'
    }
  }

  componentDidMount () {
    console.log('督查页面 componentDidMount 执行')
    Taro.setNavigationBarTitle({
      title: '督查'
    })
    console.log('准备调用 loadTaskList')
    this.loadTaskList()
    console.log('loadTaskList 调用完成')
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
    console.log('=== loadTaskList 开始执行 ===')
    this.setState({ loading: true })

    try {
      console.log('1. 获取 orgId...')
      const orgId = apiConfigManager.getTaskListOrgId()
      console.log('2. orgId 获取成功:', { orgId })
      console.log('3. 开始请求API:', new Date().toLocaleTimeString())

      // 输出配置调试信息
      console.log('4. 输出配置调试信息...')
      apiConfigManager.debugInfo()

      console.log('5. 检查 apiClient:', apiClient)
      console.log('6. 检查 getTaskLiveList 方法:', typeof apiClient.getTaskLiveList)
      console.log('7. 调用 apiClient.getTaskLiveList...')
      const response = await apiClient.getTaskLiveList({
        orgId
      })

      console.log('8. 督查列表响应:', response)

      if (response.success && response.data) {
        this.setState({
          taskList: response.data,
          filteredTaskList: response.data,
          loading: false
        })
        console.log('督查列表获取成功:', response.data)
      } else {
        console.warn('督查列表获取失败:', response.message)
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
    console.log('点击督查任务:', task)
    console.log('planType:', task.planType, '类型:', typeof task.planType)

    // 根据planType字段判断跳转类型
    if (task.planType === '0') {
      console.log('跳转到病历列表页面')
      // planType="1"：现场督查（病历督查），跳转到病历列表页面
      Taro.navigateTo({
        url: `/pages/patientList/index?taskId=${task.id}&title=${encodeURIComponent(task.planName)}`
      })
    } else if (task.planType === '1') {
      console.log('跳转到部门列表页面')
      // planType="0"：线上督查（部门督查），跳转到部门列表页面
      Taro.navigateTo({
        url: `/pages/departmentList/index?taskId=${task.id}&title=${encodeURIComponent(task.planName)}`
      })
    } else {
      console.log('跳转到督查详情页面，planType未识别:', task.planType)
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
    if (task.planType === '1') {
      return {
        type: 'medical',
        label: '现场督查(病历)',
        color: '#ff6b6b'
      }
    } else if (task.planType === '0') {
      return {
        type: 'department',
        label: '线上督查(部门)',
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
        label: '现场督查',
        color: '#ff6b6b'
      }
    } else {
      return {
        type: 'department',
        label: '线上督查',
        color: '#4ecdc4'
      }
    }
  }

  // 筛选督查列表
  filterTasks = (filter: 'all' | 'medical' | 'department') => {
    const { taskList } = this.state
    let filteredList = taskList

    if (filter === 'medical') {
      filteredList = taskList.filter(task => this.getTaskType(task).type === 'medical')
    } else if (filter === 'department') {
      filteredList = taskList.filter(task => this.getTaskType(task).type === 'department')
    }

    this.setState({
      filteredTaskList: filteredList,
      currentFilter: filter
    })
  }

  render () {
    const { filteredTaskList, loading, currentFilter } = this.state

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
        {/* 筛选按钮 */}
        <View className='filter-tabs'>
          <View
            className={`filter-tab ${currentFilter === 'all' ? 'active' : ''}`}
            onClick={() => this.filterTasks('all')}
          >
            <Text>全部</Text>
          </View>
          <View
            className={`filter-tab ${currentFilter === 'medical' ? 'active' : ''}`}
            onClick={() => this.filterTasks('medical')}
          >
            <Text>现场督查</Text>
          </View>
          <View
            className={`filter-tab ${currentFilter === 'department' ? 'active' : ''}`}
            onClick={() => this.filterTasks('department')}
          >
            <Text>线上督查</Text>
          </View>
        </View>

        {filteredTaskList.length === 0 ? (
          <View className='empty'>
            <Text>暂无督查任务</Text>
          </View>
        ) : (
          filteredTaskList.map(task => {
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