import { Component } from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { apiClient, TaskInfoItem, DataListItem } from '../../utils/api'
import Breadcrumb from '../../components/Breadcrumb'
import './index.scss'

interface DataReportDetailState {
  id: string
  appkey: string
  title: string
  pageType: string
  activeTab: 'task' | 'data'
  taskList: TaskInfoItem[]
  dataList: DataListItem[]
  loading: boolean
  dataLoading: boolean
}

export default class DataReportDetail extends Component<{}, DataReportDetailState> {

  constructor(props) {
    super(props)
    this.state = {
      id: '',
      appkey: '',
      title: '',
      pageType: '',
      activeTab: 'task',
      taskList: [],
      dataList: [],
      loading: false,
      dataLoading: false
    }
  }

  componentDidMount() {
    // 获取路由参数
    const params = Taro.getCurrentInstance().router?.params
    if (params) {
      this.setState({
        id: params.id || '',
        appkey: params.appkey || '',
        title: decodeURIComponent(params.title || ''),
        pageType: params.pageType || ''
      })

      // 使用传递的标题设置导航栏
      const title = decodeURIComponent(params.title || '填报任务')
      Taro.setNavigationBarTitle({
        title: title
      })

      this.setState({
        id: params.id,
        appkey: params.appkey,
        title: decodeURIComponent(params.title || ''),
        pageType: params.pageType
      })

      // 加载填报任务列表
      if (params.appkey) {
        this.loadTaskList(params.appkey)
      }
    } else {
      Taro.setNavigationBarTitle({
        title: '填报任务'
      })
    }

    // 监听数据更新事件
    Taro.eventCenter.on('dataListRefresh', this.handleDataListRefresh)
  }

  componentWillUnmount() {
    // 移除事件监听
    Taro.eventCenter.off('dataListRefresh', this.handleDataListRefresh)
  }

  // 处理数据列表刷新
  handleDataListRefresh = () => {

    // 如果当前在数据列表tab且已经加载过数据，则重新加载
    if (this.state.activeTab === 'data' && this.state.appkey) {
      this.loadDataList(this.state.appkey)
    }
  }

  // 加载填报任务列表
  loadTaskList = async (taskType: string) => {
    this.setState({ loading: true })

    try {

      const response = await apiClient.getTaskInfoList(taskType)

      if (response.success && response.data) {
        this.setState({
          taskList: response.data,
          loading: false
        })

      } else {

        Taro.showToast({
          title: response.message || '获取任务列表失败',
          icon: 'none'
        })
        this.setState({ loading: false })
      }
    } catch (error) {
      console.error('获取填报任务列表失败:', error)
      Taro.showToast({
        title: '网络错误，请重试',
        icon: 'none'
      })
      this.setState({ loading: false })
    }
  }

  // 加载数据列表
  loadDataList = async (appkey: string) => {
    this.setState({ dataLoading: true })

    try {

      const response = await apiClient.getDataList(appkey)

      if (response.success && response.data) {
        this.setState({
          dataList: response.data || [],
          dataLoading: false
        })

      } else {

        Taro.showToast({
          title: response.message || '获取数据列表失败',
          icon: 'none'
        })
        this.setState({ dataLoading: false })
      }
    } catch (error) {
      console.error('获取数据列表失败:', error)
      Taro.showToast({
        title: '网络错误，请重试',
        icon: 'none'
      })
      this.setState({ dataLoading: false })
    }
  }

  handleTabChange = (tab: 'task' | 'data') => {
    this.setState({ activeTab: tab })

    // 如果切换到数据列表Tab，则加载数据
    if (tab === 'data' && this.state.appkey) {
      this.loadDataList(this.state.appkey)
    }
  }

  handleGoToReport = () => {
    const { appkey, title } = this.state


    // 可以根据appkey来决定跳转到不同的填报页面
    Taro.showToast({
      title: `将跳转到${title}填报页面`,
      icon: 'none'
    })
  }

  handleTaskItemClick = (task: TaskInfoItem) => {


    // 跳转到表单页面
    Taro.navigateTo({
      url: `/pages/dataForm/index?taskType=${this.state.appkey}&taskId=${task.id}&title=${encodeURIComponent(task.taskName)}`
    })
  }

  handleDataItemClick = (dataItem: DataListItem) => {


    // 跳转到表单页面（编辑模式）
    Taro.navigateTo({
      url: `/pages/dataForm/index?taskType=${this.state.appkey}&dataId=${dataItem.id}&mode=edit&title=${encodeURIComponent(dataItem.dataDate || '编辑数据')}`
    })
  }


  render() {
    const { title, appkey, pageType, activeTab, taskList, dataList, loading, dataLoading } = this.state

    return (
      <View className='data-report-detail'>
        {/* 面包屑导航 */}
        <Breadcrumb
          items={[
            { name: '数据上报', path: '/pages/dataReportList/index' },
            { name: title || '填报任务' }
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
            <View className='task-list-container'>
              {loading ? (
                <View className='loading-state'>
                  <Text>正在加载填报任务...</Text>
                </View>
              ) : taskList.length === 0 ? (
                <View className='empty-state'>
                  <Text>暂无填报任务</Text>
                </View>
              ) : (
                <View className='task-list'>
                  {taskList.map(task => (
                    <View key={task.id} className='task-card'>
                      <View className='task-card-header'>
                        <Text className='task-card-title'>{task.taskName}</Text>
                        <Button
                          className='task-card-btn'
                          onClick={() => this.handleTaskItemClick(task)}
                        >
                          去填报
                        </Button>
                      </View>
                      {task.taskNote && (
                        <Text className='task-card-desc'>
                          {task.taskNote}
                        </Text>
                      )}
                      <Text className='task-card-time'>
                        时间：{task.taskStartdate.split(' ')[0]}~{task.taskEnddate.split(' ')[0]}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ) : (
            <View className='data-list-container'>
              <View className='data-header'>
                <Text className='data-header-text'>已填报数据</Text>
              </View>
              {dataLoading ? (
                <View className='loading-state'>
                  <Text>正在加载数据列表...</Text>
                </View>
              ) : dataList.length === 0 ? (
                <View className='empty-state'>
                  <Text>暂无已填报数据</Text>
                </View>
              ) : (
                <View className='data-list'>
                  {dataList.map(item => (
                    <View
                      key={item.id}
                      className='data-card'
                      onClick={() => this.handleDataItemClick(item)}
                    >
                      <View className='data-card-header'>
                        <Text className='data-card-title'>
                          {item.data_date || item.dataDate || `数据记录${item.id.slice(-8)}`}
                        </Text>
                      </View>
                      <View className='data-card-content'>
                        <Text className='data-card-department'>
                          部门：{item.departmentName}
                        </Text>
                        {item.remarks && (
                          <Text className='data-card-remarks'>
                            备注：{item.remarks}
                          </Text>
                        )}
                      </View>
                      <View className='data-card-footer'>
                        <Text className='data-card-time'>
                          创建时间：{item.createTime ? item.createTime.slice(0, 16) : ''}
                        </Text>
                        <Text className='data-card-author'>
                          创建人：{item.userName || item.createBy}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    )
  }
}