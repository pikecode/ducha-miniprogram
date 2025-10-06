import { Component } from 'react'
import { View, Text, Input, Button, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { apiClient, DictItem, DepartmentInfo, PatientAddParams } from '../../utils/api'
import Breadcrumb from '../../components/Breadcrumb'
import './index.scss'

interface PatientAddState {
  taskTitle: string
  taskId: string
  batchId: string
  patientNo: string
  medicalRecordNo: string
  patientName: string
  gender: string
  genderId: string
  age: string
  department: string
  departmentId: string
  doctor: string
  diagnosis: string
  genderList: DictItem[]
  departmentList: DepartmentInfo[]
  genderLoading: boolean
  departmentLoading: boolean
  submitting: boolean
}

export default class PatientAdd extends Component<{}, PatientAddState> {

  constructor(props) {
    super(props)
    this.state = {
      taskTitle: '',
      taskId: '',
      batchId: '',
      patientNo: '',
      medicalRecordNo: '',
      patientName: '',
      gender: '',
      genderId: '',
      age: '',
      department: '',
      departmentId: '',
      doctor: '',
      diagnosis: '',
      genderList: [],
      departmentList: [],
      genderLoading: false,
      departmentLoading: false,
      submitting: false
    }
  }

  componentDidMount() {
    // 获取路由参数
    const params = Taro.getCurrentInstance().router?.params


    if (params) {
      const taskTitle = decodeURIComponent(params.title || '')
      const taskId = params.taskId || ''
      const batchId = params.batchId || ''

      this.setState({
        taskTitle,
        taskId,
        batchId
      })
    }

    // 加载性别和部门数据
    this.loadGenderList()
    this.loadDepartmentList()

    Taro.setNavigationBarTitle({
      title: '添加病案'
    })
  }

  // 加载性别列表
  loadGenderList = async () => {
    this.setState({ genderLoading: true })

    try {

      const response = await apiClient.getDictDetail('emrSex')



      if (response.success && response.data) {
        this.setState({
          genderList: response.data,
          genderLoading: false
        })

      } else {

        this.setState({ genderLoading: false })
      }
    } catch (error) {
      console.error('获取性别字典失败:', error)
      this.setState({ genderLoading: false })
    }
  }

  // 加载部门列表
  loadDepartmentList = async () => {
    this.setState({ departmentLoading: true })

    try {

      const response = await apiClient.getDepartmentList({ isfolder: true })



      if (response.success && response.data) {
        this.setState({
          departmentList: response.data,
          departmentLoading: false
        })

      } else {

        this.setState({ departmentLoading: false })
      }
    } catch (error) {
      console.error('获取部门列表失败:', error)
      this.setState({ departmentLoading: false })
    }
  }

  handlePatientNoChange = (e) => {
    this.setState({ patientNo: e.detail.value })
  }

  handleMedicalRecordNoChange = (e) => {
    this.setState({ medicalRecordNo: e.detail.value })
  }

  handlePatientNameChange = (e) => {
    this.setState({ patientName: e.detail.value })
  }

  handleGenderChange = (e) => {
    const selectedGender = this.state.genderList[e.detail.value]
    this.setState({
      gender: selectedGender?.valueNameCn || '',
      genderId: selectedGender?.id || ''
    })
  }

  handleAgeChange = (e) => {
    this.setState({ age: e.detail.value })
  }

  handleDepartmentChange = (e) => {
    const selectedDepartment = this.state.departmentList[e.detail.value]
    this.setState({
      department: selectedDepartment?.departmentName || '',
      departmentId: selectedDepartment?.id || ''
    })
  }

  handleDoctorChange = (e) => {
    this.setState({ doctor: e.detail.value })
  }

  handleDiagnosisChange = (e) => {
    this.setState({ diagnosis: e.detail.value })
  }

  handleSubmit = async () => {
    const { taskId, batchId, patientNo, medicalRecordNo, patientName, gender, genderId, age, department, departmentId, doctor, diagnosis } = this.state

    // 基本验证
    if (!patientNo) {
      Taro.showToast({
        title: '请输入病案号',
        icon: 'none'
      })
      return
    }

    if (!patientName) {
      Taro.showToast({
        title: '请输入患者姓名',
        icon: 'none'
      })
      return
    }


    if (!departmentId) {
      Taro.showToast({
        title: '请选择部门',
        icon: 'none'
      })
      return
    }

    this.setState({ submitting: true })

    try {
      const params: PatientAddParams = {
        inspectPlanId: taskId,
        batchId: batchId,
        emrNo: patientNo,
        medicalRecordNo: medicalRecordNo,
        patientName: patientName,
        patientAge: parseInt(age) || 0,
        patientSex: genderId || '',
        patientSexName: gender || '',
        departmentId: departmentId,
        departmentName: department,
        doctorName: doctor,
        diagnose: diagnosis,
        status: '1'
      }


      const response = await apiClient.addPatient(params)



      if (response.success) {
        Taro.showToast({
          title: '保存成功',
          icon: 'success'
        })

        setTimeout(() => {
          Taro.navigateBack({
            success: () => {
              // 通知上一页刷新数据
              Taro.eventCenter.trigger('refreshPatientList')
            }
          })
        }, 1500)
      } else {
        Taro.showToast({
          title: response.message || '保存失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('添加病例失败:', error)
      Taro.showToast({
        title: '网络错误，请重试',
        icon: 'none'
      })
    } finally {
      this.setState({ submitting: false })
    }
  }

  render() {
    const { taskTitle, taskId, patientNo, medicalRecordNo, patientName, gender, age, department, doctor, diagnosis, genderList, departmentList, genderLoading, departmentLoading, submitting } = this.state

    return (
      <View className='patient-add'>
        {/* 面包屑导航 */}
        <Breadcrumb
          items={[
            { name: '督查', path: '/pages/qualityControl/index' },
            { name: '病例列表', path: `/pages/patientList/index?taskId=${taskId}&title=${encodeURIComponent(taskTitle)}` },
            { name: taskTitle }
          ]}
        />

        {/* 页面标题 */}
        <View className='page-title'>
          <Text className='title-text'>添加病案</Text>
        </View>

        <View className='form-content'>
          <View className='form-item'>
            <Text className='form-label'>部门：</Text>
            <Picker
              mode='selector'
              range={departmentList}
              rangeKey='departmentName'
              onChange={this.handleDepartmentChange}
              disabled={departmentLoading}
            >
              <View className='form-picker'>
                <Text className={department ? 'picker-text' : 'picker-placeholder'}>
                  {departmentLoading ? '加载中...' : (department || '请选择')}
                </Text>
              </View>
            </Picker>
          </View>

          <View className='form-item'>
            <Text className='form-label'>医疗组：</Text>
            <Input
              className='form-input'
              placeholder='请输入'
              value={doctor}
              onInput={this.handleDoctorChange}
            />
          </View>

          <View className='form-item required'>
            <Text className='form-label'>病案号：</Text>
            <Input
              className='form-input'
              placeholder='请输入'
              value={patientNo}
              onInput={this.handlePatientNoChange}
            />
          </View>

          <View className='form-item'>
            <Text className='form-label'>病历号：</Text>
            <Input
              className='form-input'
              placeholder='请输入'
              value={medicalRecordNo}
              onInput={this.handleMedicalRecordNoChange}
            />
          </View>

          <View className='form-item'>
            <Text className='form-label'>患者姓名：</Text>
            <Input
              className='form-input'
              placeholder='请输入'
              value={patientName}
              onInput={this.handlePatientNameChange}
            />
          </View>

          <View className='form-item'>
            <Text className='form-label'>患者年龄：</Text>
            <Input
              className='form-input'
              placeholder='请输入'
              type='number'
              value={age}
              onInput={this.handleAgeChange}
            />
          </View>

          <View className='form-item'>
            <Text className='form-label'>患者性别：</Text>
            <Picker
              mode='selector'
              range={genderList}
              rangeKey='valueNameCn'
              onChange={this.handleGenderChange}
              disabled={genderLoading}
            >
              <View className='form-picker'>
                <Text className={gender ? 'picker-text' : 'picker-placeholder'}>
                  {genderLoading ? '加载中...' : (gender || '请选择')}
                </Text>
              </View>
            </Picker>
          </View>

          <View className='form-item'>
            <Text className='form-label'>主要诊断：</Text>
            <Input
              className='form-input'
              placeholder='请输入'
              value={diagnosis}
              onInput={this.handleDiagnosisChange}
            />
          </View>

          {/* 保存按钮 */}
          <View className='form-actions'>
            <Button
              className='save-btn'
              onClick={this.handleSubmit}
              disabled={submitting}
            >
              {submitting ? '保存中...' : '保存'}
            </Button>
          </View>
        </View>
      </View>
    )
  }
}