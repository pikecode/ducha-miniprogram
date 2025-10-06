import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { apiClient } from '../../utils/api'
import Breadcrumb from '../../components/Breadcrumb'
import './index.scss'

interface DepartmentListState {
  taskTitle: string
  taskId: string
  planDetail: any
  planLoading: boolean
}

export default class DepartmentList extends Component<{}, DepartmentListState> {

  constructor(props) {
    super(props)
    this.state = {
      taskTitle: '',
      taskId: '',
      planDetail: null,
      planLoading: false
    }
  }

  componentDidMount() {
    // 获取路由参数
    const params = Taro.getCurrentInstance().router?.params
    if (params) {
      const taskId = params.taskId || ''
      this.setState({
        taskTitle: decodeURIComponent(params.title || ''),
        taskId: taskId
      }, () => {
        // 在设置taskId后再调用接口
        if (taskId) {
          this.loadPlanDetail(taskId)
        }
      })
    }

    Taro.setNavigationBarTitle({
      title: '部门列表'
    })
  }

  // 点击部门
  handleDepartmentClick = (departmentId: string, departmentName: string) => {
    const { taskId, taskTitle, planDetail } = this.state



    if (!taskId) {
      Taro.showToast({
        title: '缺少任务ID',
        icon: 'none'
      })
      return
    }

    // 根据scoreDict判断跳转类型，逻辑与病例处理相同
    const scoreDict = planDetail?.scoreDict || ''
    const isEvaluationMode = scoreDict && scoreDict.trim() !== ''

    // 跳转到部门督查详情页面（统一的评级/打分页面）
    const targetPage = '/pages/departmentDetail/index'
    const url = `${targetPage}?id=${departmentId}&name=${encodeURIComponent(departmentName)}&taskId=${taskId}&taskTitle=${encodeURIComponent(taskTitle)}&scoreDict=${encodeURIComponent(scoreDict)}`

    Taro.navigateTo({
      url: url
    })
  }

  // 加载督查计划详情
  loadPlanDetail = async (planId: string) => {
    this.setState({ planLoading: true })

    try {

      const response = await apiClient.getInspectPlanDetail(planId)



      if (response.success && response.data) {
        this.setState({
          planDetail: response.data,
          planLoading: false
        })

      } else {

        this.setState({ planLoading: false })
      }
    } catch (error) {
      console.error('获取督查计划详情失败:', error)
      this.setState({ planLoading: false })
    }
  }

  render() {
    const { taskTitle, planDetail, planLoading } = this.state

    return (
      <View className='department-list'>
        {/* 面包屑导航 */}
        <Breadcrumb
          items={[
            { name: '督查', path: '/pages/qualityControl/index' },
            { name: taskTitle }
          ]}
        />


        {/* 被督查部门列表 */}
        {planLoading ? (
          <View className='loading'>
            <Text>加载中...</Text>
          </View>
        ) : planDetail && planDetail.execDepartmentName && planDetail.execDepartmentName.length > 0 ? (
          <View className='department-list-content'>
            {planDetail.execDepartmentName.map((departmentName: string, index: number) => {
              const departmentId = planDetail.execDepartmentId[index]
              return (
                <View
                  key={departmentId || index}
                  className='department-item'
                  onClick={() => this.handleDepartmentClick(departmentId, departmentName)}
                >
                  <View className='department-indicator'></View>
                  <View className='department-content'>
                    <Text className='department-label'>被督查部门：</Text>
                    <Text className='department-name'>{departmentName}</Text>
                  </View>
                </View>
              )
            })}
          </View>
        ) : (
          <View className='empty'>
            <Text>暂无被督查部门数据</Text>
          </View>
        )}
      </View>
    )
  }
}