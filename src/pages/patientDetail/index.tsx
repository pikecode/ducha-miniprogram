import { Component } from 'react'
import { View, Text, Button, Radio, RadioGroup, Input, Image, Textarea } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { apiClient, PatientInfo, InspectItem, InspectResultItem, DictItem, InspectEMRResult, EvidenceItem } from '../../utils/api'
import apiConfig from '../../config/apiConfig.json'
import Breadcrumb from '../../components/Breadcrumb'
import PatientCard from '../../components/PatientCard'
import InspectItemCard from '../../components/InspectItemCard'
import ImageViewer from '../../components/ImageViewer'
import './index.scss'

interface PatientDetailState {
  patientId: string
  patientName: string
  scoreDict: string
  taskTitle: string
  taskId: string
  isEvaluationMode: boolean
  patient: PatientInfo | null
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
    imageCount?: number
    hasScore?: string
  }>
  scores: Record<string, string>
  remarks: Record<string, string>
  evaluationOptions: DictItem[]
  optionsLoading: boolean
  savedResults: Record<string, InspectEMRResult>
  overallInsufficient: string
  imageViewerVisible: boolean
  currentEvidenceList: EvidenceItem[]
  evidenceLoading: boolean
}

export default class PatientDetail extends Component<{}, PatientDetailState> {

  constructor(props) {
    super(props)
    this.state = {
      patientId: '',
      patientName: '',
      scoreDict: '',
      taskTitle: '',
      taskId: '',
      isEvaluationMode: false,
      patient: null,
      loading: false,
      inspectItems: [],
      itemsLoading: false,
      questions: [],
      scores: {},
      remarks: {},
      evaluationOptions: [],
      optionsLoading: false,
      savedResults: {},
      overallInsufficient: '',
      imageViewerVisible: false,
      currentEvidenceList: [],
      evidenceLoading: false
    }
  }

  componentDidMount() {
    // 获取路由参数
    const params = Taro.getCurrentInstance().router?.params


    if (params) {
      const patientId = params.id || ''
      const patientName = decodeURIComponent(params.name || '')
      const scoreDict = decodeURIComponent(params.scoreDict || '')
      const taskTitle = decodeURIComponent(params.taskTitle || '')
      const taskId = params.taskId || ''

      // 根据scoreDict判断是评级模式还是打分模式
      const isEvaluationMode = scoreDict && scoreDict.trim() !== ''

      this.setState({
        patientId,
        patientName,
        scoreDict,
        taskTitle,
        taskId,
        isEvaluationMode
      }, () => {
        // 加载病例详情数据（包含督查项目列表）
        this.loadPatientDetail(patientId)
        // 如果是评级模式，加载评级选项
        if (isEvaluationMode) {
          this.loadEvaluationOptions()
        }
      })

      // 设置页面标题
      Taro.setNavigationBarTitle({
        title: isEvaluationMode ? '病例评级' : '病例打分'
      })
    } else {
      Taro.setNavigationBarTitle({
        title: '病历详情'
      })
    }
  }

  // 加载病例详情
  loadPatientDetail = async (emrId: string) => {
    if (!emrId) {

      return
    }

    this.setState({ loading: true })

    try {

      const response = await apiClient.getPatientDetail(emrId)



      if (response.success && response.data) {
        // 处理已保存的督查结果
        const savedResults: Record<string, InspectEMRResult> = {}
        if (response.data.inspectEMRResults) {
          response.data.inspectEMRResults.forEach(result => {
            savedResults[result.inspectItemId] = result
          })
        }

        this.setState({
          patient: response.data,
          inspectItems: response.data.inspectItems || [],
          savedResults,
          overallInsufficient: response.data.insufficient || '',
          loading: false,
          itemsLoading: false
        })



      } else {

        Taro.showToast({
          title: response.message || '获取病例详情失败',
          icon: 'none'
        })
        this.setState({ loading: false, itemsLoading: false })
      }
    } catch (error) {
      console.error('获取病例详情失败:', error)
      Taro.showToast({
        title: '网络错误，请重试',
        icon: 'none'
      })
      this.setState({ loading: false, itemsLoading: false })
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

  // 处理备注输入
  handleRemarkChange = (itemKey: string, value: string) => {
    this.setState(prevState => ({
      remarks: {
        ...prevState.remarks,
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

  handleUploadImage = async (itemId: string) => {
    const { patient, taskId } = this.state

    if (!patient?.batchId || !patient?.departmentId || !taskId) {
      Taro.showToast({
        title: '缺少必要参数',
        icon: 'none'
      })
      return
    }

    try {
      // 选择图片
      const chooseResult = await Taro.chooseImage({
        count: 9,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera']
      })

      if (chooseResult.tempFilePaths.length === 0) {
        return
      }

      Taro.showLoading({
        title: '上传中...'
      })

      // 逐个上传文件
      for (const filePath of chooseResult.tempFilePaths) {
        try {
          // 上传文件
          const uploadResult = await apiClient.uploadFile(filePath)

          if (uploadResult.success && uploadResult.data?.id) {
            // 创建证据
            const evidenceParams = {
              batchId: patient.batchId,
              departmentId: patient.departmentId,
              emrId: this.state.patientId,
              fileId: uploadResult.data.id,
              itemId: itemId,
              orgId: apiConfig.config.orgId,
              planId: taskId
            }

            const evidenceResult = await apiClient.createEvidence(evidenceParams)

            if (!evidenceResult.success) {

              Taro.showToast({
                title: `创建证据失败: ${evidenceResult.message}`,
                icon: 'none'
              })
            }
          } else {

            Taro.showToast({
              title: `上传失败: ${uploadResult.message}`,
              icon: 'none'
            })
          }
        } catch (error) {
          console.error('上传或创建证据失败:', error)
          Taro.showToast({
            title: '上传失败，请重试',
            icon: 'none'
          })
        }
      }

      Taro.hideLoading()
      Taro.showToast({
        title: '上传完成',
        icon: 'success'
      })

      // 重新加载病例详情以获取最新的文件数量
      this.loadPatientDetail(this.state.patientId)

    } catch (error) {
      Taro.hideLoading()
      console.error('选择图片失败:', error)
      if (error.errMsg && !error.errMsg.includes('cancel')) {
        Taro.showToast({
          title: '选择图片失败',
          icon: 'none'
        })
      }
    }
  }

  // 查看图片
  handleViewImages = async (itemId: string) => {
    this.setState({
      imageViewerVisible: true,
      evidenceLoading: true,
      currentEvidenceList: []
    })

    try {
      const response = await apiClient.getEvidenceList(itemId, this.state.patientId)

      if (response.success && response.data) {
        this.setState({
          currentEvidenceList: response.data || [],
          evidenceLoading: false
        })
      } else {

        this.setState({
          currentEvidenceList: [],
          evidenceLoading: false
        })
        Taro.showToast({
          title: response.message || '获取图片失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('获取证据列表失败:', error)
      this.setState({
        currentEvidenceList: [],
        evidenceLoading: false
      })
      Taro.showToast({
        title: '网络错误，请重试',
        icon: 'none'
      })
    }
  }

  // 关闭图片查看器
  handleCloseImageViewer = () => {
    this.setState({
      imageViewerVisible: false,
      currentEvidenceList: [],
      evidenceLoading: false
    })
  }

  // 删除图片证据
  handleDeleteEvidence = async (evidenceId: string) => {
    try {
      Taro.showLoading({ title: '删除中...' })

      const response = await apiClient.archiveEvidence(evidenceId)

      if (response.success) {
        Taro.hideLoading()
        Taro.showToast({
          title: '删除成功',
          icon: 'success'
        })

        // 从当前证据列表中移除已删除的证据
        this.setState(prevState => ({
          currentEvidenceList: prevState.currentEvidenceList.filter(item => item.id !== evidenceId)
        }))

        // 重新加载病例详情以更新文件数量
        this.loadPatientDetail(this.state.patientId)
      } else {
        Taro.hideLoading()
        Taro.showToast({
          title: response.message || '删除失败',
          icon: 'none'
        })
      }
    } catch (error) {
      Taro.hideLoading()
      console.error('删除图片证据失败:', error)
      Taro.showToast({
        title: '网络错误，请重试',
        icon: 'none'
      })
    }
  }

  handleSaveAndReturn = async () => {
    const { isEvaluationMode, inspectItems, scores, remarks, patientId, taskId, overallInsufficient, patient } = this.state

    if (!patientId || !taskId) {
      Taro.showToast({
        title: '缺少必要参数',
        icon: 'none'
      })
      return
    }

    // 构建保存数据
    const saveData: InspectResultItem[] = inspectItems.map(item => {
      const resultItem: InspectResultItem = {
        inspectEmrInfoId: patientId,
        inspectItemId: item.id,
        inspectPlanId: taskId,
        status: 1
      }

      if (isEvaluationMode) {
        // 评级模式：获取选择的评级值
        const selectedValue = this.getSelectedValue(item.id)
        if (selectedValue) {
          // 根据选中的值名称找到对应的选项ID
          const selectedOption = this.state.evaluationOptions.find(option => option.valueNameCn === selectedValue)
          if (selectedOption) {
            resultItem.itemLevel = selectedOption.id
          }

          if (selectedValue !== '符合') {
            resultItem.insufficient = selectedValue
          }
        }

        // 获取备注
        const remark = this.getRemarkValue(item.id)
        if (remark) {
          resultItem.insufficient = remark
        }
      } else {
        // 打分模式：设置评分和不足描述
        const score = scores[item.id]
        if (score !== undefined && score !== '') {
          resultItem.scope = parseFloat(score)
        }

        const remark = this.getRemarkValue(item.id)
        if (remark) {
          resultItem.insufficient = remark
        }
      }

      return resultItem
    }).filter(item => {
      // 过滤掉没有任何修改的项目
      const hasSelection = item.itemLevel // 评级模式有选择
      const hasScore = item.scope !== undefined && item.scope !== null // 打分模式有评分
      const hasRemark = item.insufficient && item.insufficient.trim() !== '' // 有备注

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


      // 保存督查项目结果
      const response = await apiClient.saveInspectResults(saveData)

      if (response.success) {
        // 如果有整体存在不足内容，保存整体存在不足
        if (overallInsufficient && overallInsufficient.trim() !== '' && patient?.batchId) {
          try {







            const updateParams = {
              batchId: patient.batchId,
              insufficient: overallInsufficient.trim(),
              id: patientId
            }


            const insufficientResponse = await apiClient.updateEmrInsufficient(updateParams)

            if (!insufficientResponse.success) {

            }
          } catch (insufficientError) {
            console.error('保存整体存在不足失败:', insufficientError)
          }
        }

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

  // 获取评级选择值
  getSelectedValue = (itemId: string): string => {
    const { questions, savedResults } = this.state
    const question = questions.find(q => q.id === itemId)
    if (question?.value !== undefined) {
      return question.value
    }
    // 如果没有用户选择，返回已保存的结果
    const savedResult = savedResults[itemId]
    return savedResult?.itemLevelName || ''
  }

  // 获取备注值
  getRemarkValue = (itemId: string): string => {
    const { questions, savedResults } = this.state
    const question = questions.find(q => q.id === itemId)
    if (question?.inputValue !== undefined) {
      return question.inputValue
    }
    // 如果没有用户输入，返回已保存的备注
    const savedResult = savedResults[itemId]
    return savedResult?.insufficient || ''
  }

  // 获取评分值
  getScoreValue = (itemId: string): string => {
    const { scores, savedResults } = this.state
    if (scores.hasOwnProperty(itemId)) {
      return scores[itemId]
    }
    // 如果没有用户输入，返回已保存的评分
    const savedResult = savedResults[itemId]
    return savedResult?.scope ? savedResult.scope.toString() : ''
  }

  render() {
    const { patient, questions, isEvaluationMode, patientName, taskTitle, taskId, scoreDict, loading, inspectItems, itemsLoading, evaluationOptions, optionsLoading } = this.state

    return (
      <View className='patient-detail'>
        {/* 面包屑导航 */}
        <Breadcrumb
          items={[
            { name: '督查', path: '/pages/qualityControl/index' },
            { name: '病例列表', path: `/pages/patientList/index?taskId=${taskId}&title=${encodeURIComponent(taskTitle)}&scoreDict=${encodeURIComponent(scoreDict || '')}` },
            { name: isEvaluationMode ? '病例评级' : '病例打分' }
          ]}
        />

        {/* 患者信息 */}
        <PatientCard
          patient={patient}
          loading={loading}
          className="detail-info"
        />

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
                savedResult={this.state.savedResults[item.id]}
                onRadioChange={this.handleRadioChange}
                onInputChange={this.handleInputChange}
                onScoreChange={this.handleScoreChange}
                onUploadImage={this.handleUploadImage}
                onViewImages={this.handleViewImages}
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