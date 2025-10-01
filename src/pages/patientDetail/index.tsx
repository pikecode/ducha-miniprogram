import { Component } from 'react'
import { View, Text, Button, Radio, RadioGroup, Input, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Breadcrumb from '../../components/Breadcrumb'
import './index.scss'

interface PatientDetailState {
  patientId: string
  patientName: string
  scoreDict: string
  taskTitle: string
  taskId: string
  isEvaluationMode: boolean
  patient: {
    patientNo: string
    name: string
    age: number
    gender: string
    department: string
    doctor: string
    diagnosis: string
  }
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
      patient: {
        patientNo: '3235576',
        name: '张三',
        age: 36,
        gender: '男',
        department: '呼吸内科',
        doctor: '李医生',
        diagnosis: 'XXXXXXXXXXXXXXXXXXXXXXXXX'
      },
      questions: [
        {
          id: '1',
          title: '1、组长查房3次/周',
          type: 'radio',
          options: ['符合', '不符合', '不涉及'],
          value: '',
          inputValue: '',
          imageCount: 5
        },
        {
          id: '2',
          title: '2、医师陪同查房',
          type: 'radio',
          options: ['符合', '不符合', '不涉及'],
          value: '',
          inputValue: '',
          imageCount: 5
        }
      ],
      scores: {},
      remarks: {}
    }
  }

  componentDidMount() {
    // 获取路由参数
    const params = Taro.getCurrentInstance().router?.params
    console.log('病历详情页面参数:', params)

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

  handleRadioChange = (questionId: string, e) => {
    const { questions } = this.state
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId) {
        return { ...q, value: e.detail.value }
      }
      return q
    })
    this.setState({ questions: updatedQuestions })
  }

  handleInputChange = (questionId: string, e) => {
    const { questions } = this.state
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId) {
        return { ...q, inputValue: e.detail.value }
      }
      return q
    })
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

  handleUploadImage = (questionId: string) => {
    Taro.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        Taro.showToast({
          title: '上传功能开发中',
          icon: 'none'
        })
      }
    })
  }

  handleSaveAndReturn = () => {
    const { isEvaluationMode, questions, scores, remarks, patientId } = this.state

    if (isEvaluationMode) {
      console.log('保存评级:', {
        patientId,
        evaluations: questions.reduce((acc, q) => ({ ...acc, [q.id]: q.value }), {}),
        remarks: questions.reduce((acc, q) => ({ ...acc, [q.id]: q.inputValue }), {})
      })
    } else {
      console.log('保存评分:', {
        patientId,
        scores,
        remarks
      })
    }

    Taro.showToast({
      title: '保存成功',
      icon: 'success'
    })
    setTimeout(() => {
      Taro.navigateBack()
    }, 1500)
  }

  render() {
    const { patient, questions, isEvaluationMode, patientName, taskTitle, taskId, scoreDict } = this.state

    // 模拟评级/打分项目数据
    const items = [
      { key: 'item1', title: '组长查房3次/周', score: '', hasUpload: true },
      { key: 'item2', title: '医师陪同查房', score: isEvaluationMode ? '' : '8分', hasUpload: true },
      { key: 'item3', title: '术前24小时主刀查房', score: isEvaluationMode ? '' : '8分', hasUpload: true }
    ]

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
        <View className='patient-info'>
          <View className='patient-indicator'></View>
          <View className='patient-content'>
            <View className='patient-row'>
              <Text className='patient-label'>病例号：</Text>
              <Text className='patient-value'>{patient.patientNo}</Text>
              <Text className='patient-label'>姓名：</Text>
              <Text className='patient-value'>{patientName || patient.name}</Text>
            </View>
            <View className='patient-row'>
              <Text className='patient-label'>年龄：</Text>
              <Text className='patient-value'>{patient.age}</Text>
              <Text className='patient-label'>性别：</Text>
              <Text className='patient-value'>{patient.gender}</Text>
            </View>
            <View className='patient-row'>
              <Text className='patient-label'>科室：</Text>
              <Text className='patient-value'>{patient.department}</Text>
              <Text className='patient-label'>医生：</Text>
              <Text className='patient-value'>{patient.doctor}</Text>
            </View>
            <View className='patient-row diagnosis-row'>
              <Text className='patient-label'>诊断：</Text>
              <Text className='patient-value diagnosis'>{patient.diagnosis}</Text>
            </View>
          </View>
        </View>

        {/* 评级/打分列表 */}
        <View className={isEvaluationMode ? 'evaluation-list' : 'score-list'}>
          {items.map((item, index) => (
            <View key={item.key} className={isEvaluationMode ? 'evaluation-item' : 'score-item'}>
              <View className='item-header'>
                <Text className='item-title'>{index + 1}、{item.title}</Text>
                <View className='right-section'>
                  {!isEvaluationMode && item.score && (
                    <Text className='item-score'>{item.score}</Text>
                  )}
                  {item.hasUpload && (
                    <Text className={isEvaluationMode ? 'upload-text' : 'upload-text'}>
                      {isEvaluationMode ? '上传 照片 (5)' : '照片 (5)'}
                    </Text>
                  )}
                </View>
              </View>

              {isEvaluationMode ? (
                // 评级模式：显示单选按钮
                <View className='evaluation-options'>
                  <RadioGroup
                    onChange={(e) => this.handleRadioChange(item.key, e)}
                  >
                    <View className='radio-item'>
                      <Radio value='符合' checked={questions.find(q => q.id === item.key)?.value === '符合'}>
                        符合
                      </Radio>
                    </View>
                    <View className='radio-item'>
                      <Radio value='不符合' checked={questions.find(q => q.id === item.key)?.value === '不符合'}>
                        不符合
                      </Radio>
                    </View>
                    <View className='radio-item'>
                      <Radio value='不涉及' checked={questions.find(q => q.id === item.key)?.value === '不涉及'}>
                        不涉及
                      </Radio>
                    </View>
                    <View className='radio-item'>
                      <Radio value='存在不足' checked={questions.find(q => q.id === item.key)?.value === '存在不足'}>
                        存在不足
                      </Radio>
                    </View>
                  </RadioGroup>

                  <Input
                    className='remark-input'
                    placeholder='请输入'
                    value={questions.find(q => q.id === item.key)?.inputValue || ''}
                    onInput={(e) => this.handleInputChange(item.key, e)}
                  />
                </View>
              ) : (
                // 打分模式：显示评分输入框（如果没有分数）
                !item.score && (
                  <View className='score-input-section'>
                    <View className='score-row'>
                      <Text className='score-label'>评分</Text>
                      <Input
                        className='score-input'
                        placeholder='请输入'
                        type='number'
                        value={this.state.scores[item.key] || ''}
                        onInput={(e) => this.handleScoreChange(item.key, e.detail.value)}
                      />
                    </View>
                    <View className='remark-row'>
                      <Text className='remark-label'>存在不足</Text>
                      <Input
                        className='remark-input'
                        placeholder='请输入'
                        value={this.state.remarks[item.key] || ''}
                        onInput={(e) => this.handleRemarkChange(item.key, e.detail.value)}
                      />
                    </View>
                  </View>
                )
              )}
            </View>
          ))}
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