import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { apiClient, DepartmentInfo } from '../../utils/api'
import Breadcrumb from '../../components/Breadcrumb'
import './index.scss'

interface DepartmentListState {
  taskTitle: string
  taskId: string
  departments: DepartmentInfo[]
  loading: boolean
}

export default class DepartmentList extends Component<{}, DepartmentListState> {

  constructor(props) {
    super(props)
    this.state = {
      taskTitle: '',
      taskId: '',
      departments: [],
      loading: false
    }
  }

  componentDidMount() {
    // 获取路由参数
    const params = Taro.getCurrentInstance().router?.params
    if (params) {
      this.setState({
        taskTitle: decodeURIComponent(params.title || ''),
        taskId: params.taskId || ''
      })
    }

    Taro.setNavigationBarTitle({
      title: '部门列表'
    })

    // 加载部门列表
    this.loadDepartmentList()
  }

  // 加载部门列表
  loadDepartmentList = async () => {
    this.setState({ loading: true })

    try {
      console.log('正在获取部门列表...')
      const response = await apiClient.getDepartmentList({
        isfolder: false
      })

      console.log('部门列表响应:', response)

      if (response.success && response.data && response.data.data) {
        this.setState({
          departments: response.data.data,
          loading: false
        })
        console.log('部门列表获取成功:', response.data.data)
      } else {
        console.warn('部门列表获取失败:', response.message)
        Taro.showToast({
          title: response.message || '获取部门列表失败',
          icon: 'none'
        })
        this.setState({ loading: false })
      }
    } catch (error) {
      console.error('获取部门列表失败:', error)
      Taro.showToast({
        title: '网络错误，请重试',
        icon: 'none'
      })
      this.setState({ loading: false })
    }
  }

  // 获取状态文本和样式（基于部门status字段）
  getStatusInfo = (status: number) => {
    switch (status) {
      case 1:
        return { text: '启用', className: 'completed' }
      case 0:
        return { text: '禁用', className: 'pending' }
      default:
        return { text: '未知', className: 'pending' }
    }
  }

  // 点击部门
  handleDepartmentClick = (department: DepartmentInfo) => {
    console.log('点击部门:', department)
    // 跳转到部门信息录入页面
    Taro.navigateTo({
      url: `/pages/departmentForm/index?title=${encodeURIComponent(this.state.taskTitle)}&department=${encodeURIComponent(department.departmentName)}&departmentId=${department.departmentId}`
    })
  }

  render() {
    const { taskTitle, departments, loading } = this.state

    if (loading) {
      return (
        <View className='department-list'>
          <View className='loading'>
            <Text>正在加载部门列表...</Text>
          </View>
        </View>
      )
    }

    return (
      <View className='department-list'>
        {/* 面包屑导航 */}
        <Breadcrumb
          items={[
            { name: '首页', path: '/pages/index/index' },
            { name: '质控督查', path: '/pages/qualityControl/index' },
            { name: taskTitle },
            { name: '部门列表' }
          ]}
        />

        {/* 标题 */}
        <View className='page-header'>
          <Text className='page-title'>{taskTitle}</Text>
          <Text className='page-subtitle'>被督查部门列表</Text>
        </View>

        {/* 部门列表 */}
        {departments.length === 0 ? (
          <View className='empty'>
            <Text>暂无部门数据</Text>
          </View>
        ) : (
          <View className='departments'>
            {departments.map(department => {
              const statusInfo = this.getStatusInfo(department.status)
              return (
                <View
                  key={department.id}
                  className='department-item'
                  onClick={() => this.handleDepartmentClick(department)}
                >
                  <View className='department-content'>
                    <View className='department-info'>
                      <Text className='department-name'>{department.departmentName}</Text>
                      <Text className='department-desc'>
                        {department.fullName || '被督查部门'}
                      </Text>
                      {department.departmentCode && (
                        <Text className='department-code'>编码：{department.departmentCode}</Text>
                      )}
                    </View>
                    <View className={`department-status ${statusInfo.className}`}>
                      <Text className='status-text'>{statusInfo.text}</Text>
                    </View>
                  </View>
                  <View className='department-indicator'></View>
                </View>
              )
            })}
          </View>
        )}

        {/* 统计信息 */}
        {departments.length > 0 && (
          <View className='summary'>
            <Text className='summary-text'>
              共 {departments.length} 个部门，
              启用 {departments.filter(d => d.status === 1).length} 个，
              禁用 {departments.filter(d => d.status === 0).length} 个
            </Text>
          </View>
        )}
      </View>
    )
  }
}