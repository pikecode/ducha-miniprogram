import { Component } from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Breadcrumb from '../../components/Breadcrumb'
import './index.scss'

interface QualityDetailState {
  title: string
  description: string
  timeRange: string
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
}

export default class QualityDetail extends Component<{}, QualityDetailState> {

  constructor(props) {
    super(props)
    this.state = {
      title: '',
      description: '',
      timeRange: '',
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
          diagnosis: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
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
          diagnosis: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
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
          diagnosis: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
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
          diagnosis: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
          status: 'normal'
        }
      ]
    }
  }

  componentDidMount() {
    // 获取路由参数
    const params = Taro.getCurrentInstance().router?.params
    if (params) {
      this.setState({
        title: decodeURIComponent(params.title || ''),
        description: decodeURIComponent(params.description || ''),
        timeRange: decodeURIComponent(params.timeRange || '')
      })
    }

    Taro.setNavigationBarTitle({
      title: '填报任务'
    })
  }

  handleAddPatient = () => {
    Taro.navigateTo({
      url: '/pages/patientAdd/index'
    })
  }

  handleBatchAction = () => {
    Taro.showToast({
      title: '批次操作功能开发中',
      icon: 'none'
    })
  }

  handleSearch = (e) => {
    this.setState({ keyword: e.detail.value })
  }

  handlePatientClick = (patient: any) => {
    Taro.navigateTo({
      url: '/pages/patientDetail/index'
    })
  }

  render() {
    const { keyword, patientList } = this.state

    return (
      <View className='quality-detail'>
        {/* 面包屑导航 */}
        <Breadcrumb
          items={[
            { name: '督查', path: '/pages/qualityControl/index' },
            { name: '督查详情' }
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
            <input
              className='search-input'
              placeholder='请输入搜索关键字'
              value={keyword}
              onInput={this.handleSearch}
            />
          </View>
        </View>

        {/* 病历列表 */}
        <View className='patient-list'>
          {patientList.map(patient => (
            <View
              key={patient.id}
              className={`patient-item ${patient.status}`}
              onClick={() => this.handlePatientClick(patient)}
            >
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
          ))}
        </View>
      </View>
    )
  }
}