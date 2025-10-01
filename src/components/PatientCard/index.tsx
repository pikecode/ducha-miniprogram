import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { PatientInfo } from '../../utils/api'
import './index.scss'

interface PatientCardProps {
  patient: PatientInfo | null
  loading?: boolean
  onClick?: () => void
  showIndicator?: boolean
  className?: string
}

export default class PatientCard extends Component<PatientCardProps> {

  render() {
    const { patient, loading = false, onClick, showIndicator = true, className = '' } = this.props

    const renderPatientInfo = () => {
      if (loading) {
        return <View className='loading-text'>加载中...</View>
      }

      if (!patient) {
        return <View className='error-text'>暂无患者信息</View>
      }

      // 统一使用紧凑布局，确保所有场景下样式一致
      return (
        <>
          <View className='patient-row'>
            <Text className='patient-label'>病例号：</Text>
            <Text className='patient-value'>{patient.emrNo}</Text>
            <Text className='patient-label'>姓名：</Text>
            <Text className='patient-value'>{patient.patientName}</Text>
          </View>
          <View className='patient-row'>
            <Text className='patient-label'>年龄：</Text>
            <Text className='patient-value'>{patient.patientAge || '-'}</Text>
            <Text className='patient-label'>性别：</Text>
            <Text className='patient-value'>{patient.patientSexName || '-'}</Text>
          </View>
          <View className='patient-row'>
            <Text className='patient-label'>科室：</Text>
            <Text className='patient-value'>{patient.departmentName}</Text>
            <Text className='patient-label'>医生：</Text>
            <Text className='patient-value'>{patient.doctorName}</Text>
          </View>
          <View className='patient-row diagnosis-row'>
            <Text className='patient-label'>诊断：</Text>
            <Text className='patient-value diagnosis'>{patient.diagnose}</Text>
          </View>
        </>
      )
    }

    return (
      <View
        className={`patient-card ${className}`}
        onClick={onClick}
      >
        {showIndicator && <View className='patient-indicator'></View>}
        <View className='patient-content'>
          {renderPatientInfo()}
        </View>
      </View>
    )
  }
}