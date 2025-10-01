import { Component } from 'react'
import { View, Text, Input, Button, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { apiClient, BatchInfo, PatientInfo } from '../../utils/api'
import Breadcrumb from '../../components/Breadcrumb'
import PatientCard from '../../components/PatientCard'
import './index.scss'

interface PatientListState {
  taskTitle: string
  taskId: string
  scoreDict: string
  keyword: string
  selectedBatch: string
  batchList: Array<{
    id: string
    name: string
  }>
  batchLoading: boolean
  patientLoading: boolean
  patientList: PatientInfo[]
}

export default class PatientList extends Component<{}, PatientListState> {

  constructor(props) {
    super(props)
    this.state = {
      taskTitle: '',
      taskId: '',
      scoreDict: '',
      keyword: '',
      selectedBatch: '',
      batchList: [],
      batchLoading: false,
      patientLoading: false,
      patientList: []
    }
  }

  componentDidMount() {
    // 获取路由参数
    const params = Taro.getCurrentInstance().router?.params
    console.log('病例列表页面参数:', params)

    if (params) {
      const taskTitle = decodeURIComponent(params.title || '')
      const taskId = params.taskId || ''
      const scoreDict = decodeURIComponent(params.scoreDict || '')

      console.log('设置taskId:', taskId, 'taskTitle:', taskTitle, 'scoreDict:', scoreDict)

      this.setState({
        taskTitle,
        taskId,
        scoreDict
      }, () => {
        // 在setState回调中加载批次列表，批次列表加载完成后会自动加载病例列表
        this.loadBatchList()
      })
    }

    // 监听添加病例成功的事件
    Taro.eventCenter.on('refreshPatientList', this.handleRefreshPatientList)

    Taro.setNavigationBarTitle({
      title: '病例列表'
    })
  }

  componentWillUnmount() {
    // 取消事件监听
    Taro.eventCenter.off('refreshPatientList', this.handleRefreshPatientList)
  }

  // 刷新病例列表
  handleRefreshPatientList = () => {
    console.log('收到刷新病例列表事件')
    this.loadPatientList()
  }

  // 加载批次列表
  loadBatchList = async () => {
    const { taskId } = this.state
    if (!taskId) {
      console.warn('缺少任务ID，无法加载批次列表')
      return
    }

    this.setState({ batchLoading: true })

    try {
      console.log('正在获取批次列表...', { planId: taskId })
      const response = await apiClient.getBatchList({
        planId: taskId
      })

      console.log('批次列表响应:', response)

      if (response.success && response.data) {
        const batchList = response.data.map(batch => ({
          id: batch.id,
          name: batch.batchName
        }))

        // 默认选中第一个批次
        const selectedBatch = batchList.length > 0 ? batchList[0].id : ''

        this.setState({
          batchList,
          selectedBatch,
          batchLoading: false
        }, () => {
          // 批次选择后加载病例列表
          if (selectedBatch) {
            this.loadPatientList()
          }
        })
        console.log('批次列表获取成功:', batchList)
      } else {
        console.warn('批次列表获取失败:', response.message)
        this.setState({ batchLoading: false })
      }
    } catch (error) {
      console.error('获取批次列表失败:', error)
      this.setState({ batchLoading: false })
    }
  }

  // 加载病例列表
  loadPatientList = async () => {
    const { taskId, selectedBatch, keyword } = this.state
    if (!taskId || !selectedBatch) {
      console.warn('缺少任务ID或批次ID，无法加载病例列表')
      return
    }

    this.setState({ patientLoading: true })

    try {
      const params = {
        planId: taskId,
        batchId: selectedBatch,
        key: keyword || ''
      }

      console.log('正在获取病例列表...', params)
      const response = await apiClient.getPatientList(params)

      console.log('病例列表响应:', response)

      if (response.success && response.data) {
        this.setState({
          patientList: response.data,
          patientLoading: false
        })
        console.log('病例列表获取成功:', response.data)
      } else {
        console.warn('病例列表获取失败:', response.message)
        Taro.showToast({
          title: response.message || '获取病例列表失败',
          icon: 'none'
        })
        this.setState({ patientLoading: false })
      }
    } catch (error) {
      console.error('获取病例列表失败:', error)
      Taro.showToast({
        title: '网络错误，请重试',
        icon: 'none'
      })
      this.setState({ patientLoading: false })
    }
  }

  // 搜索功能
  handleSearch = (e) => {
    const keyword = e.detail.value
    this.setState({ keyword }, () => {
      this.loadPatientList()
    })
  }

  // 批次选择
  handleBatchChange = (e) => {
    const selectedBatch = this.state.batchList[e.detail.value].id
    this.setState({ selectedBatch }, () => {
      this.loadPatientList()
    })
  }

  // 添加病历
  handleAddPatient = () => {
    const { taskId, taskTitle, selectedBatch } = this.state
    Taro.navigateTo({
      url: `/pages/patientAdd/index?taskId=${taskId}&title=${encodeURIComponent(taskTitle)}&batchId=${selectedBatch}`
    })
  }

  // 批次操作
  handleBatchAction = () => {
    Taro.showToast({
      title: '批次操作功能开发中',
      icon: 'none'
    })
  }

  // 点击病例
  handlePatientClick = (patient: any) => {
    const { scoreDict, taskId, taskTitle } = this.state
    console.log('点击病例:', patient, 'scoreDict:', scoreDict)

    // 跳转到统一的病历详情页面，根据scoreDict参数决定显示评级还是打分模式
    Taro.navigateTo({
      url: `/pages/patientDetail/index?id=${patient.id}&name=${encodeURIComponent(patient.patientName)}&scoreDict=${encodeURIComponent(scoreDict || '')}&taskId=${taskId}&taskTitle=${encodeURIComponent(taskTitle)}`
    })
  }

  render() {
    const { taskTitle, keyword, patientList, selectedBatch, batchList, batchLoading } = this.state

    return (
      <View className='patient-list'>
        {/* 面包屑导航 */}
        <Breadcrumb
          items={[
            { name: '督查', path: '/pages/qualityControl/index' },
            { name: taskTitle }
          ]}
        />

        {/* 顶部操作栏 */}
        <View className='header-actions'>
          <View className='action-row'>
            {/* 批次选择器 */}
            <Picker
              mode='selector'
              range={batchList}
              rangeKey='name'
              value={batchList.findIndex(batch => batch.id === selectedBatch)}
              onChange={this.handleBatchChange}
              disabled={batchLoading}
            >
              <View className='batch-selector'>
                <Text className='batch-text'>
                  {batchLoading ? '加载中...' : batchList.find(batch => batch.id === selectedBatch)?.name}
                </Text>
                <Text className='batch-arrow'>▼</Text>
              </View>
            </Picker>

            {/* 搜索框 */}
            <View className='search-box'>
              <Input
                className='search-input'
                placeholder='请输入搜索关键字'
                value={keyword}
                onInput={this.handleSearch}
              />
            </View>

            <Button className='add-btn' onClick={this.handleAddPatient}>
              添加病历
            </Button>
          </View>
        </View>

        {/* 病例列表 */}
        <View className='patients'>
          {patientList.length === 0 ? (
            <View className='empty'>
              <Text>暂无病例数据</Text>
            </View>
          ) : (
            patientList.map(patient => (
              <PatientCard
                key={patient.id}
                patient={patient}
                className={`list-item status-${patient.status}`}
                onClick={() => this.handlePatientClick(patient)}
              />
            ))
          )}
        </View>

      </View>
    )
  }
}