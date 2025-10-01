import { Component } from 'react'
import { View, Text, Input, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Breadcrumb from '../../components/Breadcrumb'
import './index.scss'

interface PatientListState {
  taskTitle: string
  taskId: string
  keyword: string
  patientList: Array<{
    id: string
    patientNo: string
    name: string
    age: number
    gender: string
    department: string
    doctor: string
    diagnosis: string
    status: 'added' | 'normal'
  }>
  filteredPatients: Array<{
    id: string
    patientNo: string
    name: string
    age: number
    gender: string
    department: string
    doctor: string
    diagnosis: string
    status: 'added' | 'normal'
  }>
}

export default class PatientList extends Component<{}, PatientListState> {

  constructor(props) {
    super(props)
    this.state = {
      taskTitle: '',
      taskId: '',
      keyword: '',
      patientList: [
        {
          id: '1',
          patientNo: '3235576',
          name: '张三',
          age: 36,
          gender: '男',
          department: '呼吸内科',
          doctor: '李医生',
          diagnosis: 'xxxxxxxxxxxxxxxxxxxxxxxxx',
          status: 'added'
        },
        {
          id: '2',
          patientNo: '3235576',
          name: '张三',
          age: 36,
          gender: '男',
          department: '呼吸内科',
          doctor: '李医生',
          diagnosis: 'xxxxxxxxxxxxxxxxxxxxxxxxx',
          status: 'added'
        },
        {
          id: '3',
          patientNo: '3235576',
          name: '张三',
          age: 36,
          gender: '男',
          department: '呼吸内科',
          doctor: '李医生',
          diagnosis: 'xxxxxxxxxxxxxxxxxxxxxxxxx',
          status: 'normal'
        },
        {
          id: '4',
          patientNo: '3235576',
          name: '张三',
          age: 36,
          gender: '男',
          department: '呼吸内科',
          doctor: '李医生',
          diagnosis: 'xxxxxxxxxxxxxxxxxxxxxxxxx',
          status: 'normal'
        }
      ],
      filteredPatients: []
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
      title: '病例列表'
    })

    // 初始化过滤列表
    this.setState({ filteredPatients: this.state.patientList })
  }

  // 搜索功能
  handleSearch = (e) => {
    const keyword = e.detail.value
    this.setState({ keyword })

    const { patientList } = this.state
    if (!keyword) {
      this.setState({ filteredPatients: patientList })
      return
    }

    const filtered = patientList.filter(patient =>
      patient.name.includes(keyword) ||
      patient.patientNo.includes(keyword) ||
      patient.department.includes(keyword) ||
      patient.doctor.includes(keyword)
    )

    this.setState({ filteredPatients: filtered })
  }

  // 添加病历
  handleAddPatient = () => {
    Taro.navigateTo({
      url: '/pages/patientAdd/index'
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
    console.log('点击病例:', patient)
    Taro.navigateTo({
      url: `/pages/patientDetail/index?id=${patient.id}&name=${encodeURIComponent(patient.name)}`
    })
  }

  render() {
    const { taskTitle, keyword, filteredPatients } = this.state

    return (
      <View className='patient-list'>
        {/* 面包屑导航 */}
        <Breadcrumb
          items={[
            { name: '首页', path: '/pages/index/index' },
            { name: '质控督查', path: '/pages/qualityControl/index' },
            { name: taskTitle },
            { name: '病例列表' }
          ]}
        />

        {/* 顶部操作栏 */}
        <View className='header-actions'>
          <Button className='add-btn' onClick={this.handleAddPatient}>
            添加病历
          </Button>
          <Button className='batch-btn' onClick={this.handleBatchAction}>
            批次
          </Button>
          <View className='search-box'>
            <Input
              className='search-input'
              placeholder='请输入搜索关键字'
              value={keyword}
              onInput={this.handleSearch}
            />
          </View>
        </View>

        {/* 病例列表 */}
        <View className='patients'>
          {filteredPatients.length === 0 ? (
            <View className='empty'>
              <Text>暂无病例数据</Text>
            </View>
          ) : (
            filteredPatients.map(patient => (
              <View
                key={patient.id}
                className={`patient-item ${patient.status}`}
                onClick={() => this.handlePatientClick(patient)}
              >
                <View className='patient-indicator'></View>
                <View className='patient-content'>
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
                  <View className='patient-row diagnosis-row'>
                    <Text className='patient-label'>诊断：</Text>
                    <Text className='patient-value diagnosis'>{patient.diagnosis}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* 统计信息 */}
        {filteredPatients.length > 0 && (
          <View className='summary'>
            <Text className='summary-text'>
              共 {filteredPatients.length} 例病例，
              已添加 {filteredPatients.filter(p => p.status === 'added').length} 例，
              普通 {filteredPatients.filter(p => p.status === 'normal').length} 例
            </Text>
          </View>
        )}
      </View>
    )
  }
}