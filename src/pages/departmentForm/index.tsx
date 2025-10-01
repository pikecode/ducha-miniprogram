import { Component } from 'react'
import { View, Text, Input, Button, Radio, RadioGroup, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Breadcrumb from '../../components/Breadcrumb'
import './index.scss'

interface DepartmentFormState {
  taskTitle: string
  departmentName: string
  departmentId: string
  formItems: Array<{
    id: string
    title: string
    type: 'radio' | 'input' | 'upload'
    required: boolean
    options?: Array<{ label: string, value: string }>
    value: any
    photos?: Array<{ id: string, url: string }>
    maxPhotos?: number
  }>
}

export default class DepartmentForm extends Component<{}, DepartmentFormState> {

  constructor(props) {
    super(props)
    this.state = {
      taskTitle: '',
      departmentName: '',
      departmentId: '',
      formItems: [
        {
          id: '1',
          title: '组长查房3次/周',
          type: 'radio',
          required: true,
          options: [
            { label: '符合', value: 'comply' },
            { label: '不符合', value: 'non_comply' },
            { label: '不涉及', value: 'not_applicable' },
            { label: '存在不足', value: 'insufficient' }
          ],
          value: '',
          photos: [],
          maxPhotos: 5
        },
        {
          id: '2',
          title: '医师随时查房',
          type: 'radio',
          required: true,
          options: [
            { label: '符合', value: 'comply' },
            { label: '不符合', value: 'non_comply' },
            { label: '不涉及', value: 'not_applicable' },
            { label: '存在不足', value: 'insufficient' }
          ],
          value: '',
          photos: [],
          maxPhotos: 5
        }
      ]
    }
  }

  componentDidMount() {
    // 获取路由参数
    const params = Taro.getCurrentInstance().router?.params
    if (params) {
      this.setState({
        taskTitle: decodeURIComponent(params.title || ''),
        departmentName: decodeURIComponent(params.department || ''),
        departmentId: params.departmentId || ''
      })
    }

    Taro.setNavigationBarTitle({
      title: '部门信息录入'
    })
  }

  // 处理单选框变化
  handleRadioChange = (itemId: string, value: string) => {
    const { formItems } = this.state
    const updatedItems = formItems.map(item => {
      if (item.id === itemId) {
        return { ...item, value }
      }
      return item
    })
    this.setState({ formItems: updatedItems })
  }

  // 处理输入框变化
  handleInputChange = (itemId: string, value: string) => {
    const { formItems } = this.state
    const updatedItems = formItems.map(item => {
      if (item.id === itemId) {
        return { ...item, value }
      }
      return item
    })
    this.setState({ formItems: updatedItems })
  }

  // 上传照片
  handleUploadPhoto = (itemId: string) => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const { formItems } = this.state
        const updatedItems = formItems.map(item => {
          if (item.id === itemId) {
            const newPhoto = {
              id: Date.now().toString(),
              url: res.tempFilePaths[0]
            }
            return {
              ...item,
              photos: [...(item.photos || []), newPhoto]
            }
          }
          return item
        })
        this.setState({ formItems: updatedItems })
      }
    })
  }

  // 删除照片
  handleDeletePhoto = (itemId: string, photoId: string) => {
    const { formItems } = this.state
    const updatedItems = formItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          photos: (item.photos || []).filter(photo => photo.id !== photoId)
        }
      }
      return item
    })
    this.setState({ formItems: updatedItems })
  }

  // 保存并返回
  handleSaveAndReturn = () => {
    const { formItems } = this.state

    // 验证必填项
    const incompleteItems = formItems.filter(item =>
      item.required && (!item.value || item.value === '')
    )

    if (incompleteItems.length > 0) {
      Taro.showToast({
        title: '请完成所有必填项',
        icon: 'none'
      })
      return
    }

    Taro.showToast({
      title: '保存成功',
      icon: 'success'
    })

    // 返回上一页
    setTimeout(() => {
      Taro.navigateBack()
    }, 1500)
  }

  render() {
    const { taskTitle, departmentName, formItems } = this.state

    return (
      <View className='department-form'>
        {/* 面包屑导航 */}
        <Breadcrumb
          items={[
            { name: '首页', path: '/pages/index/index' },
            { name: '质控督查', path: '/pages/qualityControl/index' },
            { name: taskTitle },
            { name: '部门列表', path: '/pages/departmentList/index' },
            { name: departmentName }
          ]}
        />

        {/* 部门标题 */}
        <View className='department-header'>
          <View className='department-indicator'></View>
          <View className='department-title'>
            <Text className='label'>被督查部门：</Text>
            <Text className='name'>{departmentName}</Text>
          </View>
        </View>

        {/* 表单项列表 */}
        <View className='form-items'>
          {formItems.map((item, index) => (
            <View key={item.id} className='form-item'>
              <View className='item-header'>
                <Text className='item-title'>
                  {index + 1}. {item.title}
                </Text>
                <View className='item-actions'>
                  <Text className='upload-link' onClick={() => this.handleUploadPhoto(item.id)}>
                    上传
                  </Text>
                  <Text className='photo-count'>
                    照片 ({(item.photos || []).length})
                  </Text>
                </View>
              </View>

              <View className='item-content'>
                {item.type === 'radio' && (
                  <RadioGroup onChange={(e) => this.handleRadioChange(item.id, e.detail.value)}>
                    <View className='radio-options'>
                      {item.options?.map(option => (
                        <View key={option.value} className='radio-option'>
                          <Radio
                            value={option.value}
                            checked={item.value === option.value}
                            color='#007aff'
                          />
                          <Text className='radio-label'>{option.label}</Text>
                        </View>
                      ))}
                    </View>
                  </RadioGroup>
                )}

                {/* 输入框 */}
                <View className='input-section'>
                  <Input
                    className='form-input'
                    placeholder='请输入'
                    value={item.value}
                    onInput={(e) => this.handleInputChange(item.id, e.detail.value)}
                  />
                </View>

                {/* 照片展示 */}
                {(item.photos || []).length > 0 && (
                  <View className='photos-section'>
                    <View className='photos-grid'>
                      {item.photos?.map(photo => (
                        <View key={photo.id} className='photo-item'>
                          <Image className='photo-image' src={photo.url} mode='aspectFill' />
                          <View
                            className='photo-delete'
                            onClick={() => this.handleDeletePhoto(item.id, photo.id)}
                          >
                            ×
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* 提交按钮 */}
        <View className='submit-section'>
          <Button className='submit-btn' onClick={this.handleSaveAndReturn}>
            保存并返回
          </Button>
        </View>
      </View>
    )
  }
}