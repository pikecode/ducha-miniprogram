import { Component } from 'react'
import { View, Text, Textarea, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { apiClient, InspectItem, InspectResultItem, DictItem, DepartmentInspectResultItem, CreateDepartmentEvidenceParams, EvidenceItem } from '../../utils/api'
import apiConfig from '../../config/apiConfig.json'
import Breadcrumb from '../../components/Breadcrumb'
import InspectItemCard from '../../components/InspectItemCard'
import ImageViewer from '../../components/ImageViewer'
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
  // 图片查看器相关
  imageViewerVisible: boolean
  currentEvidenceList: EvidenceItem[]
  evidenceLoading: boolean
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
      overallInsufficient: '',
      // 图片查看器相关
      imageViewerVisible: false,
      currentEvidenceList: [],
      evidenceLoading: false
    }
  }

  componentDidMount() {
    // 获取路由参数
    const params = Taro.getCurrentInstance().router?.params


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

  // 初始化表单状态
  initializeFormState = (inspectItems: InspectItem[]) => {
    const questions: Array<{
      id: string
      title: string
      type: 'radio' | 'input'
      options?: string[]
      value?: string
      inputValue?: string
      scoreValue?: string
    }> = []

    const scores: Record<string, string> = {}

    inspectItems.forEach(item => {
      // 如果有评级数据，添加到questions中
      if (item.levelName) {
        questions.push({
          id: item.id,
          title: item.itemName,
          type: 'radio',
          value: item.levelName
        })
      }

      // 如果有备注数据，添加到questions中
      if (item.comment) {
        const existingIndex = questions.findIndex(q => q.id === item.id)
        if (existingIndex >= 0) {
          questions[existingIndex].inputValue = item.comment
        } else {
          questions.push({
            id: item.id,
            title: item.itemName,
            type: 'input',
            inputValue: item.comment
          })
        }
      }

      // 如果有评分数据，添加到scores中
      if (item.score !== undefined && item.score !== null) {
        scores[item.id] = item.score.toString()
      }
    })

    this.setState({
      questions,
      scores
    })


  }

  // 加载督查项目列表
  loadInspectItems = async (planId: string, departmentId: string) => {
    if (!planId || !departmentId) {

      return
    }

    this.setState({ itemsLoading: true })

    try {

      const response = await apiClient.getDepartmentInspectItemList(planId, departmentId)



      if (response.success && response.data) {
        const inspectItems = response.data || []

        // 初始化表单状态，根据已有的数据设置
        this.initializeFormState(inspectItems)

        this.setState({
          inspectItems: inspectItems,
          itemsLoading: false
        })


      } else {

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

      const response = await apiClient.getDictDetail('emrResult')



      if (response.success && response.data) {
        this.setState({
          evaluationOptions: response.data || [],
          optionsLoading: false
        })

      } else {

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

  // 处理图片上传
  handleUploadImage = async (itemId: string) => {
    const { taskId, departmentId, inspectItems } = this.state

    // 根据itemId找到对应的督查项目
    const currentItem = inspectItems.find(item => item.id === itemId)

    try {
      // 选择图片
      const res = await Taro.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera']
      })

      if (res.tempFiles && res.tempFiles.length > 0) {
        const file = res.tempFiles[0]

        // 显示加载提示
        Taro.showLoading({
          title: '上传中...'
        })

        // 上传文件
        const uploadResponse = await apiClient.uploadFile(file.tempFilePath)



        if (uploadResponse.success && uploadResponse.data) {
          // 检查fileId字段，可能在data中或直接在响应中
          const fileId = uploadResponse.data.fileId || uploadResponse.data.id || uploadResponse.fileId

          if (fileId) {
            // 创建证据记录
            const evidenceParams: CreateDepartmentEvidenceParams = {
              batchId: currentItem?.batchId || taskId, // 使用接口返回的batchId
              departmentId: departmentId,
              fileId: fileId,
              itemId: currentItem?.itemId || itemId, // 使用接口返回的itemId
              orgId: apiConfig.config.orgId,
              planId: taskId
            }

            const evidenceResponse = await apiClient.createDepartmentEvidence(evidenceParams)

            if (evidenceResponse.success) {
              Taro.hideLoading()
              Taro.showToast({
                title: '上传成功',
                icon: 'success'
              })

              // 刷新督查项目列表，更新照片数量
              this.refreshInspectItems()
            } else {
              throw new Error(evidenceResponse.message || '创建证据记录失败')
            }
          } else {
            throw new Error('上传响应中缺少文件ID')
          }
        } else {
          throw new Error(uploadResponse.message || '文件上传失败')
        }
      }
    } catch (error) {
      Taro.hideLoading()
      console.error('图片上传失败:', error)
      Taro.showToast({
        title: error.message || '上传失败',
        icon: 'none'
      })
    }
  }

  // 处理查看图片
  handleViewImages = async (itemId: string) => {
    const { inspectItems } = this.state

    // 根据itemId找到对应的督查项目
    const currentItem = inspectItems.find(item => item.id === itemId)
    const actualItemId = currentItem?.itemId || itemId

    // 先打开图片查看器，显示加载状态
    this.setState({
      imageViewerVisible: true,
      evidenceLoading: true,
      currentEvidenceList: []
    })

    try {
      // 获取图片列表，使用正确的itemId
      const response = await apiClient.getDepartmentEvidenceList(actualItemId)



      if (response.success && response.data) {
        // 直接使用 response.data，不是 response.data.data
        const evidences: EvidenceItem[] = response.data || []

        // 构造图片URL
        const evidencesWithUrl = evidences.map(evidence => ({
          ...evidence,
          fileUrl: evidence.fileUrl || `https://bi.hskj.cc/api/v1/file/download/${evidence.fileId}`
        }))

        this.setState({
          currentEvidenceList: evidencesWithUrl,
          evidenceLoading: false
        })
      } else {

        this.setState({
          currentEvidenceList: [],
          evidenceLoading: false
        })
      }
    } catch (error) {
      console.error('获取图片列表失败:', error)
      this.setState({
        currentEvidenceList: [],
        evidenceLoading: false
      })
    }
  }

  // 关闭图片查看器
  handleCloseImageViewer = () => {
    this.setState({
      imageViewerVisible: false,
      currentEvidenceList: []
    })
  }

  // 删除图片
  handleDeleteEvidence = async (evidenceId: string) => {
    try {
      const response = await apiClient.archiveEvidence(evidenceId)
      if (response.success) {
        Taro.showToast({
          title: '删除成功',
          icon: 'success'
        })

        // 重新加载图片列表
        const updatedList = this.state.currentEvidenceList.filter(item => item.id !== evidenceId)
        this.setState({
          currentEvidenceList: updatedList
        })

        // 如果没有图片了，关闭查看器
        if (updatedList.length === 0) {
          this.handleCloseImageViewer()
        }

        // 刷新督查项目列表，更新照片数量
        this.refreshInspectItems()
      } else {
        throw new Error(response.message || '删除失败')
      }
    } catch (error) {
      console.error('删除图片失败:', error)
      Taro.showToast({
        title: error.message || '删除失败',
        icon: 'none'
      })
    }
  }

  // 刷新督查项目列表
  refreshInspectItems = async () => {
    const { taskId, departmentId } = this.state
    if (!taskId || !departmentId) return

    try {
      const response = await apiClient.getDepartmentInspectItemList(taskId, departmentId)
      if (response.success && response.data) {
        this.setState({
          inspectItems: response.data || []
        })
      }
    } catch (error) {
      console.error('刷新督查项目列表失败:', error)
    }
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
        id: item.id,
        batchId: item.batchId || taskId, // 使用接口返回的batchId，fallback到taskId
        itemId: item.itemId || item.id, // 使用接口返回的itemId，fallback到id
        itemuserId: item.itemuserId || undefined
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




    if (saveData.length === 0) {
      Taro.showToast({
        title: '请至少完成一项督查',
        icon: 'none'
      })
      return
    }

    try {


      // 保存部门督查项目结果
      const response = await apiClient.saveDepartmentInspectResults(saveData)

      if (response.success) {

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
                onUploadImage={() => this.handleUploadImage(item.id)}
                onViewImages={() => this.handleViewImages(item.id)}
                getSelectedValue={this.getSelectedValue}
                getRemarkValue={this.getRemarkValue}
                getScoreValue={this.getScoreValue}
              />
            ))
          )}
        </View>

        {/* 整体存在不足输入 */}
        {/* <View className='overall-insufficient-section'>
          <Text className='overall-insufficient-label'>存在不足</Text>
          <Textarea
            className='overall-insufficient-input'
            placeholder='请输入内容'
            value={this.state.overallInsufficient}
            onInput={this.handleOverallInsufficientChange}
            autoHeight
          />
        </View> */}

        {/* 保存按钮 */}
        <View className='save-section'>
          <Button className='save-btn' onClick={this.handleSaveAndReturn}>
            保存并返回
          </Button>
        </View>

        {/* 图片查看器 */}
        <ImageViewer
          visible={this.state.imageViewerVisible}
          evidenceList={this.state.currentEvidenceList}
          loading={this.state.evidenceLoading}
          onClose={this.handleCloseImageViewer}
          onDelete={this.handleDeleteEvidence}
        />
      </View>
    )
  }
}