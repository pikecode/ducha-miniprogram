import { Component } from 'react'
import { View, Text, Input, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Breadcrumb from '../../components/Breadcrumb'
import './index.scss'

interface PatientScoreState {
  patientId: string
  patientName: string
  taskTitle: string
  taskId: string
  scores: Record<string, string>
  remarks: Record<string, string>
}

export default class PatientScore extends Component<{}, PatientScoreState> {

  constructor(props) {
    super(props)
    this.state = {
      patientId: '',
      patientName: '',
      taskTitle: '',
      taskId: '',
      scores: {},
      remarks: {}
    }
  }

  componentDidMount() {
    // 获取路由参数
    const params = Taro.getCurrentInstance().router?.params


    if (params) {
      const patientId = params.id || ''
      const patientName = decodeURIComponent(params.name || '')
      const taskTitle = decodeURIComponent(params.taskTitle || '')
      const taskId = params.taskId || ''

      this.setState({
        patientId,
        patientName,
        taskTitle,
        taskId
      })
    }

    Taro.setNavigationBarTitle({
      title: '病例打分'
    })
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

  // 保存并返回
  handleSave = () => {

      patientId: this.state.patientId,
      scores: this.state.scores,
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
    const { patientName, taskTitle, taskId } = this.state

    // 模拟打分项目
    const scoreItems = [
      { key: 'item1', title: '单长查房3次/周', score: '', hasUpload: true },
      { key: 'item3', title: '术前24小时主刀查房', score: '8分', hasUpload: true },
      { key: 'item4', title: '第四个督查要点', score: '8分', hasUpload: true }
    ]

    return (
      <View className='patient-score'>
        {/* 面包屑导航 */}
        <Breadcrumb
          items={[
            { name: '督查', path: '/pages/qualityControl/index' },
            { name: '病例列表', path: `/pages/patientList/index?taskId=${taskId}&title=${encodeURIComponent(taskTitle)}&scoreDict=` },
            { name: '病例打分' }
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

        {/* 打分项目 */}
        <View className='score-list'>
          {scoreItems.map((item, index) => (
            <View key={item.key} className='score-item'>
              <View className='item-header'>
                <Text className='item-title'>{index + 1}、{item.title}</Text>
                <View className='right-section'>
                  {item.score && (
                    <Text className='item-score'>{item.score}</Text>
                  )}
                  {item.hasUpload && (
                    <Text className='upload-text'>照片 (5)</Text>
                  )}
                </View>
              </View>

              {!item.score ? (
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
              ) : null}
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