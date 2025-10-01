import { Component } from 'react'
import { View, Text, RadioGroup, Radio, Input, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Breadcrumb from '../../components/Breadcrumb'
import './index.scss'

interface PatientEvaluationState {
  patientId: string
  patientName: string
  scoreDict: string
  taskTitle: string
  taskId: string
  evaluations: Record<string, string>
  remarks: Record<string, string>
}

export default class PatientEvaluation extends Component<{}, PatientEvaluationState> {

  constructor(props) {
    super(props)
    this.state = {
      patientId: '',
      patientName: '',
      scoreDict: '',
      taskTitle: '',
      taskId: '',
      evaluations: {},
      remarks: {}
    }
  }

  componentDidMount() {
    // 获取路由参数
    const params = Taro.getCurrentInstance().router?.params
    console.log('病例评级页面参数:', params)

    if (params) {
      const patientId = params.id || ''
      const patientName = decodeURIComponent(params.name || '')
      const scoreDict = decodeURIComponent(params.scoreDict || '')
      const taskTitle = decodeURIComponent(params.taskTitle || '')
      const taskId = params.taskId || ''

      this.setState({
        patientId,
        patientName,
        scoreDict,
        taskTitle,
        taskId
      })
    }

    Taro.setNavigationBarTitle({
      title: '病例评级'
    })
  }

  // 处理评级选择
  handleEvaluationChange = (itemKey: string, value: string) => {
    this.setState(prevState => ({
      evaluations: {
        ...prevState.evaluations,
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

  // 保存并返回
  handleSave = () => {
    console.log('保存评级:', {
      patientId: this.state.patientId,
      evaluations: this.state.evaluations,
      remarks: this.state.remarks
    })

    Taro.showToast({
      title: '保存成功',
      icon: 'success'
    })

    setTimeout(() => {
      Taro.navigateBack()
    }, 1500)
  }

  render() {
    const { patientName, taskTitle, taskId, scoreDict } = this.state

    // 模拟评级项目
    const evaluationItems = [
      { key: 'item1', title: '组织查房3次/周', hasUpload: true },
      { key: 'item2', title: '医师问诊查房', hasUpload: true }
    ]

    return (
      <View className='patient-evaluation'>
        {/* 面包屑导航 */}
        <Breadcrumb
          items={[
            { name: '督查', path: '/pages/qualityControl/index' },
            { name: '病例列表', path: `/pages/patientList/index?taskId=${taskId}&title=${encodeURIComponent(taskTitle)}&scoreDict=${encodeURIComponent(scoreDict)}` },
            { name: '病例评级' }
          ]}
        />

        {/* 患者信息 */}
        <View className='patient-info'>
          <View className='patient-indicator'></View>
          <View className='patient-content'>
            <View className='patient-row'>
              <Text className='patient-label'>病例号：</Text>
              <Text className='patient-value'>32355576</Text>
              <Text className='patient-label'>姓名：</Text>
              <Text className='patient-value'>{patientName}</Text>
            </View>
            <View className='patient-row'>
              <Text className='patient-label'>年龄：</Text>
              <Text className='patient-value'>36</Text>
              <Text className='patient-label'>性别：</Text>
              <Text className='patient-value'>男</Text>
            </View>
            <View className='patient-row'>
              <Text className='patient-label'>科室：</Text>
              <Text className='patient-value'>呼吸内科</Text>
              <Text className='patient-label'>医生：</Text>
              <Text className='patient-value'>李医生</Text>
            </View>
            <View className='patient-row diagnosis-row'>
              <Text className='patient-label'>诊断：</Text>
              <Text className='patient-value diagnosis'>XXXXXXXXXXXXXXXXXXXXXXXX</Text>
            </View>
          </View>
        </View>

        {/* 评级项目 */}
        <View className='evaluation-list'>
          {evaluationItems.map((item, index) => (
            <View key={item.key} className='evaluation-item'>
              <View className='item-header'>
                <Text className='item-title'>{index + 1}、{item.title}</Text>
                {item.hasUpload && (
                  <View className='upload-section'>
                    <Text className='upload-text'>上传 照片 (5)</Text>
                  </View>
                )}
              </View>

              <View className='evaluation-options'>
                <RadioGroup
                  onChange={(e) => this.handleEvaluationChange(item.key, e.detail.value)}
                >
                  <View className='radio-item'>
                    <Radio value='符合' checked={this.state.evaluations[item.key] === '符合'}>
                      符合
                    </Radio>
                  </View>
                  <View className='radio-item'>
                    <Radio value='不符合' checked={this.state.evaluations[item.key] === '不符合'}>
                      不符合
                    </Radio>
                  </View>
                  <View className='radio-item'>
                    <Radio value='不涉及' checked={this.state.evaluations[item.key] === '不涉及'}>
                      不涉及
                    </Radio>
                  </View>
                  <View className='radio-item'>
                    <Radio value='存在不足' checked={this.state.evaluations[item.key] === '存在不足'}>
                      存在不足
                    </Radio>
                  </View>
                </RadioGroup>

                <Input
                  className='remark-input'
                  placeholder='请输入'
                  value={this.state.remarks[item.key] || ''}
                  onInput={(e) => this.handleRemarkChange(item.key, e.detail.value)}
                />
              </View>
            </View>
          ))}
        </View>

        {/* 保存按钮 */}
        <View className='save-section'>
          <Button className='save-btn' onClick={this.handleSave}>
            保存并返回
          </Button>
        </View>
      </View>
    )
  }
}