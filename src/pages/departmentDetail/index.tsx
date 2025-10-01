import { Component } from 'react'
import { View, Text, Textarea, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { apiClient, InspectItem, InspectResultItem, DictItem, DepartmentInspectResultItem } from '../../utils/api'
import Breadcrumb from '../../components/Breadcrumb'
import InspectItemCard from '../../components/InspectItemCard'
import './index.scss'

interface DepartmentDetailState {
  departmentId: string
  departmentName: string
  scoreDict: string
  taskTitle: string
  taskId: string
  isEvaluationMode: boolean
  loading: boolean
  inspectItems: InspectItem[]
  itemsLoading: boolean
  questions: Array<{
    id: string
    title: string
    type: 'radio' | 'input'
    options?: string[]
    value?: string
    inputValue?: string
    scoreValue?: string
  }>
  scores: Record<string, string>
  remarks: Record<string, string>
  evaluationOptions: DictItem[]
  optionsLoading: boolean
  overallInsufficient: string
}

export default class DepartmentDetail extends Component<{}, DepartmentDetailState> {

  constructor(props) {
    super(props)
    this.state = {
      departmentId: '',
      departmentName: '',
      scoreDict: '',
      taskTitle: '',
      taskId: '',
      isEvaluationMode: false,
      loading: false,
      inspectItems: [],
      itemsLoading: false,
      questions: [],
      scores: {},
      remarks: {},
      evaluationOptions: [],
      optionsLoading: false,
      overallInsufficient: ''
    }
  }

  componentDidMount() {
    // 获取路由参数
    const params = Taro.getCurrentInstance().router?.params
    console.log('部门督查页面参数:', params)

    if (params) {
      const departmentId = params.id || ''
      const departmentName = decodeURIComponent(params.name || '')
      const scoreDict = decodeURIComponent(params.scoreDict || '')
      const taskTitle = decodeURIComponent(params.taskTitle || '')
      const taskId = params.taskId || ''

      // 根据scoreDict判断是评级模式还是打分模式
      const isEvaluationMode = scoreDict && scoreDict.trim() !== ''

      this.setState({
        departmentId,
        departmentName,
        scoreDict,
        taskTitle,
        taskId,
        isEvaluationMode
      }, () => {
        // 加载督查项目列表
        this.loadInspectItems(taskId, departmentId)
        // 如果是评级模式，加载评级选项
        if (isEvaluationMode) {
          this.loadEvaluationOptions()
        }
      })

      // 设置页面标题
      Taro.setNavigationBarTitle({
        title: isEvaluationMode ? '部门评级' : '部门打分'
      })
    } else {
      Taro.setNavigationBarTitle({
        title: '部门督查'
      })
    }
  }

  // 加载督查项目列表
  loadInspectItems = async (planId: string, departmentId: string) => {
    if (!planId || !departmentId) {
      console.warn('缺少计划ID或部门ID，无法加载督查项目', { planId, departmentId })
      return
    }

    this.setState({ itemsLoading: true })

    try {
      console.log('正在获取部门督查项目列表...', { planId, departmentId })
      const response = await apiClient.getDepartmentInspectItemList(planId, departmentId)

      console.log('部门督查项目响应:', response)

      if (response.success && response.data) {
        this.setState({
          inspectItems: response.data || [],
          itemsLoading: false
        })
        console.log('部门督查项目获取成功:', response.data)
      } else {
        console.warn('部门督查项目获取失败:', response.message)
        this.setState({ itemsLoading: false })
      }
    } catch (error) {
      console.error('获取部门督查项目失败:', error)
      this.setState({ itemsLoading: false })
    }
  }

  // 加载评级选项
  loadEvaluationOptions = async () => {
    this.setState({ optionsLoading: true })

    try {
      console.log('正在获取评级选项...')
      const response = await apiClient.getDictDetail('emrResult')

      console.log('评级选项响应:', response)

      if (response.success && response.data) {
        this.setState({
          evaluationOptions: response.data || [],
          optionsLoading: false
        })
        console.log('评级选项获取成功:', response.data)
      } else {
        console.warn('评级选项获取失败:', response.message)
        this.setState({ optionsLoading: false })
      }
    } catch (error) {
      console.error('获取评级选项失败:', error)
      this.setState({ optionsLoading: false })
    }
  }

  // 处理单选变化
  handleRadioChange = (itemId: string, value: string) => {
    const { questions } = this.state
    let updatedQuestions = [...questions]

    const existingIndex = updatedQuestions.findIndex(q => q.id === itemId)
    if (existingIndex >= 0) {
      updatedQuestions[existingIndex] = { ...updatedQuestions[existingIndex], value }
    } else {
      updatedQuestions.push({
        id: itemId,
        title: '',
        type: 'radio',
        value
      })
    }

    this.setState({ questions: updatedQuestions })
  }

  // 处理备注输入
  handleInputChange = (itemId: string, value: string) => {
    const { questions } = this.state
    let updatedQuestions = [...questions]

    const existingIndex = updatedQuestions.findIndex(q => q.id === itemId)
    if (existingIndex >= 0) {
      updatedQuestions[existingIndex] = { ...updatedQuestions[existingIndex], inputValue: value }
    } else {
      updatedQuestions.push({
        id: itemId,
        title: '',
        type: 'input',
        inputValue: value
      })
    }

    this.setState({ questions: updatedQuestions })
  }

  // 处理评分输入
  handleScoreChange = (itemKey: string, value: string) => {
    this.setState(prevState => ({
      scores: {
        ...prevState.scores,
        [itemKey]: value
      }
    }))
  }

  // 处理整体存在不足输入
  handleOverallInsufficientChange = (e) => {
    this.setState({
      overallInsufficient: e.detail.value
    })
  }

  // 获取评级选择值
  getSelectedValue = (itemId: string): string => {
    const { questions } = this.state
    const question = questions.find(q => q.id === itemId)
    return question?.value || ''
  }

  // 获取备注值
  getRemarkValue = (itemId: string): string => {
    const { questions } = this.state
    const question = questions.find(q => q.id === itemId)
    return question?.inputValue || ''
  }

  // 获取评分值
  getScoreValue = (itemId: string): string => {
    const { scores } = this.state
    return scores[itemId] || ''
  }

  // 保存并返回
  handleSaveAndReturn = async () => {
    const { isEvaluationMode, inspectItems, scores, departmentId, taskId, overallInsufficient } = this.state

    if (!departmentId || !taskId) {
      Taro.showToast({
        title: '缺少必要参数',
        icon: 'none'
      })
      return
    }

    // 构建保存数据
    const saveData: DepartmentInspectResultItem[] = inspectItems.map(item => {
      const resultItem: DepartmentInspectResultItem = {
        batchId: taskId,
        itemId: item.id
      }

      if (isEvaluationMode) {
        // 评级模式：获取选择的评级值
        const selectedValue = this.getSelectedValue(item.id)
        if (selectedValue) {
          // 根据选中的值名称找到对应的选项ID
          const selectedOption = this.state.evaluationOptions.find(option => option.valueNameCn === selectedValue)
          if (selectedOption) {
            resultItem.level = selectedOption.id
            resultItem.levelName = selectedValue
          }

          if (selectedValue !== '符合') {
            resultItem.needImproved = selectedValue
          }
        }

        // 获取备注
        const remark = this.getRemarkValue(item.id)
        if (remark) {
          resultItem.comment = remark
        }
      } else {
        // 打分模式：设置评分和不足描述
        const score = scores[item.id]
        if (score !== undefined && score !== '') {
          resultItem.score = parseFloat(score)
          resultItem.itemScore = parseFloat(score)
        }

        const remark = this.getRemarkValue(item.id)
        if (remark) {
          resultItem.problem = remark
        }
      }

      return resultItem
    }).filter(item => {
      // 过滤掉没有任何修改的项目
      const hasSelection = item.level // 评级模式有选择
      const hasScore = item.score !== undefined && item.score !== null // 打分模式有评分
      const hasRemark = (item.comment && item.comment.trim() !== '') || (item.problem && item.problem.trim() !== '') // 有备注

      return hasSelection || hasScore || hasRemark
    })

    console.log('保存数据筛选结果:', saveData)

    if (saveData.length === 0) {
      Taro.showToast({
        title: '请至少完成一项督查',
        icon: 'none'
      })
      return
    }

    try {
      console.log('保存督查结果:', saveData)

      // 保存部门督查项目结果
      const response = await apiClient.saveDepartmentInspectResults(saveData)

      if (response.success) {
        // TODO: 如果部门督查也需要保存整体存在不足，需要添加相应的API接口和逻辑

        Taro.showToast({
          title: '保存成功',
          icon: 'success'
        })
        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
      } else {
        Taro.showToast({
          title: response.message || '保存失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('保存督查结果失败:', error)
      Taro.showToast({
        title: '网络错误，请重试',
        icon: 'none'
      })
    }
  }

  render() {
    const { departmentName, isEvaluationMode, taskTitle, taskId, loading, inspectItems, itemsLoading, evaluationOptions, optionsLoading } = this.state

    return (
      <View className='department-detail'>
        {/* 面包屑导航 */}
        <Breadcrumb
          items={[
            { name: '督查', path: '/pages/qualityControl/index' },
            { name: '部门列表', path: `/pages/departmentList/index?taskId=${taskId}&title=${encodeURIComponent(taskTitle)}` },
            { name: isEvaluationMode ? '部门评级' : '部门打分' }
          ]}
        />

        {/* 部门信息 */}
        <View className='department-info'>
          <View className='department-indicator'></View>
          <View className='department-content'>
            <Text className='department-label'>被督查部门：</Text>
            <Text className='department-name'>{departmentName}</Text>
          </View>
        </View>

        {/* 评级/打分列表 */}
        <View className={isEvaluationMode ? 'evaluation-list' : 'score-list'}>
          {itemsLoading ? (
            <View className='loading-text'>加载督查项目中...</View>
          ) : inspectItems.length === 0 ? (
            <View className='empty-text'>暂无督查项目</View>
          ) : (
            inspectItems.map((item, index) => (
              <InspectItemCard
                key={item.id}
                item={item}
                index={index}
                isEvaluationMode={isEvaluationMode}
                evaluationOptions={evaluationOptions}
                optionsLoading={optionsLoading}
                savedResult={null}
                onRadioChange={this.handleRadioChange}
                onInputChange={this.handleInputChange}
                onScoreChange={this.handleScoreChange}
                onUploadImage={() => {}} // 部门督查暂不支持图片上传
                onViewImages={() => {}} // 部门督查暂不支持图片查看
                getSelectedValue={this.getSelectedValue}
                getRemarkValue={this.getRemarkValue}
                getScoreValue={this.getScoreValue}
              />
            ))
          )}
        </View>

        {/* 整体存在不足输入 */}
        <View className='overall-insufficient-section'>
          <Text className='overall-insufficient-label'>存在不足</Text>
          <Textarea
            className='overall-insufficient-input'
            placeholder='请输入内容'
            value={this.state.overallInsufficient}
            onInput={this.handleOverallInsufficientChange}
            autoHeight
          />
        </View>

        {/* 保存按钮 */}
        <View className='save-section'>
          <Button className='save-btn' onClick={this.handleSaveAndReturn}>
            保存并返回
          </Button>
        </View>
      </View>
    )
  }
}