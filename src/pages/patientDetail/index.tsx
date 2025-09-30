import { Component } from 'react'
import { View, Text, Button, Radio, RadioGroup, Input, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Breadcrumb from '../../components/Breadcrumb'
import './index.scss'

interface PatientDetailState {
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
    imageCount?: number
  }>
}

export default class PatientDetail extends Component<{}, PatientDetailState> {

  constructor(props) {
    super(props)
    this.state = {
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
      ]
    }
  }

  componentDidMount() {
    Taro.setNavigationBarTitle({
      title: '病历详情'
    })
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
    Taro.showToast({
      title: '保存成功',
      icon: 'success'
    })
    setTimeout(() => {
      Taro.navigateBack()
    }, 1500)
  }

  render() {
    const { patient, questions } = this.state

    return (
      <View className='patient-detail'>
        {/* 面包屑导航 */}
        <Breadcrumb
          items={[
            { name: '督查', path: '/pages/qualityControl/index' },
            { name: '督查详情', path: '/pages/qualityDetail/index' },
            { name: '病历详情' }
          ]}
        />

        {/* 患者信息卡片 */}
        <View className='patient-card'>
          <View className='patient-row'>
            <Text className='patient-label'>病例号：</Text>
            <Text className='patient-value'>{patient.patientNo}</Text>
            <Text className='patient-label'>姓名：</Text>
            <Text className='patient-value'>{patient.name}</Text>
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
          <View className='patient-row'>
            <Text className='patient-label'>诊断：</Text>
            <Text className='patient-value diagnosis'>{patient.diagnosis}</Text>
          </View>
        </View>

        {/* 问题列表 */}
        <View className='question-list'>
          {questions.map(question => (
            <View key={question.id} className='question-item'>
              <View className='question-header'>
                <Text className='question-title'>{question.title}</Text>
                <View className='upload-section'>
                  <Text
                    className='upload-link'
                    onClick={() => this.handleUploadImage(question.id)}
                  >
                    上传
                  </Text>
                  <Text className='photo-text'>照片 ({question.imageCount})</Text>
                </View>
              </View>

              {question.type === 'radio' && (
                <RadioGroup onChange={(e) => this.handleRadioChange(question.id, e)}>
                  <View className='radio-list'>
                    {question.options?.map(option => (
                      <View key={option} className='radio-item'>
                        <Radio value={option} checked={question.value === option} />
                        <Text className='radio-label'>{option}</Text>
                      </View>
                    ))}
                  </View>
                </RadioGroup>
              )}

              <View className='input-section'>
                <Text className='input-label'>存在不足</Text>
                <Input
                  className='question-input'
                  placeholder='请输入'
                  value={question.inputValue}
                  onInput={(e) => this.handleInputChange(question.id, e)}
                />
              </View>
            </View>
          ))}
        </View>

        {/* 底部按钮 */}
        <View className='footer-actions'>
          <Button className='save-btn' onClick={this.handleSaveAndReturn}>
            保存并返回
          </Button>
        </View>
      </View>
    )
  }
}