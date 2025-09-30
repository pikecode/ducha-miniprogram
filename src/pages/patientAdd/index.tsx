import { Component } from 'react'
import { View, Text, Input, Button, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Breadcrumb from '../../components/Breadcrumb'
import './index.scss'

interface PatientAddState {
  patientNo: string
  patientName: string
  gender: string
  age: string
  department: string
  doctor: string
  diagnosis: string
  genderRange: string[]
  departmentRange: string[]
}

export default class PatientAdd extends Component<{}, PatientAddState> {

  constructor(props) {
    super(props)
    this.state = {
      patientNo: '',
      patientName: '',
      gender: '',
      age: '',
      department: '',
      doctor: '',
      diagnosis: '',
      genderRange: ['男', '女'],
      departmentRange: ['呼吸内科', '心内科', '消化内科', '神经内科']
    }
  }

  componentDidMount() {
    Taro.setNavigationBarTitle({
      title: '添加病例'
    })
  }

  handlePatientNoChange = (e) => {
    this.setState({ patientNo: e.detail.value })
  }

  handlePatientNameChange = (e) => {
    this.setState({ patientName: e.detail.value })
  }

  handleGenderChange = (e) => {
    this.setState({ gender: this.state.genderRange[e.detail.value] })
  }

  handleAgeChange = (e) => {
    this.setState({ age: e.detail.value })
  }

  handleDepartmentChange = (e) => {
    this.setState({ department: this.state.departmentRange[e.detail.value] })
  }

  handleDoctorChange = (e) => {
    this.setState({ doctor: e.detail.value })
  }

  handleDiagnosisChange = (e) => {
    this.setState({ diagnosis: e.detail.value })
  }

  handleSubmit = () => {
    const { patientNo, patientName, gender, age, department, doctor, diagnosis } = this.state

    if (!patientNo) {
      Taro.showToast({
        title: '请输入病案号',
        icon: 'none'
      })
      return
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
    const { patientNo, patientName, gender, age, department, doctor, diagnosis, genderRange, departmentRange } = this.state

    return (
      <View className='patient-add'>
        {/* 面包屑导航 */}
        <Breadcrumb
          items={[
            { name: '督查', path: '/pages/qualityControl/index' },
            { name: '督查详情', path: '/pages/qualityDetail/index' },
            { name: '添加病例' }
          ]}
        />

        <View className='form-content'>
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
            <Text className='form-label'>患者姓名：</Text>
            <Input
              className='form-input'
              placeholder='请输入'
              value={patientName}
              onInput={this.handlePatientNameChange}
            />
          </View>

          <View className='form-item'>
            <Text className='form-label'>患者性别：</Text>
            <Picker
              mode='selector'
              range={genderRange}
              onChange={this.handleGenderChange}
            >
              <View className='form-picker'>
                <Text className={gender ? 'picker-text' : 'picker-placeholder'}>
                  {gender || '请选择'}
                </Text>
              </View>
            </Picker>
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
            <Text className='form-label'>部门：</Text>
            <Picker
              mode='selector'
              range={departmentRange}
              onChange={this.handleDepartmentChange}
            >
              <View className='form-picker'>
                <Text className={department ? 'picker-text' : 'picker-placeholder'}>
                  {department || '请选择'}
                </Text>
              </View>
            </Picker>
          </View>

          <View className='form-item'>
            <Text className='form-label'>主治医生：</Text>
            <Input
              className='form-input'
              placeholder='请输入'
              value={doctor}
              onInput={this.handleDoctorChange}
            />
          </View>

          <View className='form-item'>
            <Text className='form-label'>诊断：</Text>
            <Input
              className='form-input'
              placeholder='请输入'
              value={diagnosis}
              onInput={this.handleDiagnosisChange}
            />
          </View>
        </View>
      </View>
    )
  }
}