import { Component } from 'react'
import { View, Text, Input, Button, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { apiClient, FlowRecordItem, FlowRecordDetail } from '../../utils/api'
import { getUserInfo } from '../../utils/auth'
import Breadcrumb from '../../components/Breadcrumb'
import apiConfig from '../../config/apiConfig.json'
import './index.scss'

interface FormField {
  key: string
  label: string
  type: 'input' | 'number' | 'select'
  value: string | number
  options?: Array<{ label: string, value: string }>
  disabled?: boolean
  group?: string
  groupIndex?: number
  hasHelp?: boolean  // 是否有说明图标
  saveValue?: string | number  // 保存时使用的值（用于计算字段）
}

interface FormGroup {
  title: string
  fields: FormField[]
  expanded?: boolean
}

interface DataFormState {
  taskType: string
  taskId: string
  dataId: string
  title: string
  isEdit: boolean
  isViewMode: boolean  // 新增：是否为查看模式
  formGroups: FormGroup[]
  loading: boolean
  departmentName: string
  dataDateOptions: Array<{ label: string, value: string }>
  dataDateLoading: boolean
  dataYearOptions: Array<{ label: string, value: string }>
  dataYearLoading: boolean
  showTooltip: boolean
  tooltipContent: {
    name: string
    define: string
    explain: string
    caliber: string
  } | null
  currentHelpField: string
  helpLoading: boolean
  // 单独管理数据归属周期字段
  dataDateField: FormField | null
  dataYearField: FormField | null
  // 数据填写状态检查
  checkingDataFill: boolean
  dataAlreadyFilled: boolean
  // 审批记录弹窗
  showReviewModal: boolean
  reviewRecords: FlowRecordItem[]
  reviewLoading: boolean
  // 数据状态控制
  dataStatus: string | null
}

export default class DataForm extends Component<{}, DataFormState> {

  constructor(props) {
    super(props)
    this.state = {
      taskType: '',
      taskId: '',
      dataId: '',
      title: '',
      isEdit: false,
      isViewMode: false,
      formGroups: [],
      loading: false,
      departmentName: '',
      dataDateOptions: [],
      dataDateLoading: false,
      dataYearOptions: [],
      dataYearLoading: false,
      showTooltip: false,
      tooltipContent: null,
      currentHelpField: '',
      helpLoading: false,
      dataDateField: null,
      dataYearField: null,
      checkingDataFill: false,
      dataAlreadyFilled: false,
      showReviewModal: false,
      reviewRecords: [],
      reviewLoading: false,
      dataStatus: null
    }
  }

  componentDidMount() {
    const params = Taro.getCurrentInstance().router?.params
    if (params) {
      const isEdit = params.dataId ? true : false
      const isViewMode = params.mode === 'view'
      const isEditMode = params.mode === 'edit'
      this.setState({
        taskType: params.taskType || '',
        taskId: params.taskId || '',
        dataId: params.dataId || '',
        title: decodeURIComponent(params.title || ''),
        isEdit: isEdit || isEditMode,
        isViewMode
      })

      // 设置导航栏标题
      let title = '填报数据'
      if (isViewMode) {
        title = '查看详情'
      } else if (isEdit || isEditMode) {
        title = '编辑数据'
      }
      Taro.setNavigationBarTitle({
        title: title
      })

      // 初始化表单字段
      this.initFormFields(params.taskType || '')

      // 根据表单类型加载字典数据，然后加载表单详情
      this.loadDictionariesAndFormData(params.taskType || '', params.dataId || '', isViewMode, isEdit || isEditMode)

      console.log('表单页接收参数:', {
        taskType: params.taskType,
        taskId: params.taskId,
        dataId: params.dataId,
        title: decodeURIComponent(params.title || ''),
        isEdit: isEdit || isEditMode,
        isViewMode,
        mode: params.mode
      })
    }
  }

  // 加载字典数据和表单数据
  loadDictionariesAndFormData = async (taskType: string, dataId: string, isViewMode: boolean, isEdit: boolean) => {
    // 查看模式下不需要加载字典数据，直接加载表单数据
    if (isViewMode && dataId) {
      await this.loadFormDetail(taskType, dataId)
      return
    }

    const promises = []

    // 如果是njkqkzkzzbyd表单，加载数据归属周期字典
    if (taskType === 'njkqkzkzzbyd') {
      promises.push(this.loadDataDateDict())
    }

    // 如果是njkqkzkzzbnd表单，加载数据年度字典
    if (taskType === 'njkqkzkzzbnd') {
      promises.push(this.loadDataYearDict())
    }

    try {
      // 等待所有字典数据加载完成
      await Promise.all(promises)

      // 使用回调函数确保状态已更新
      setTimeout(() => {
        // 字典加载完成后，重新初始化独立字段
        if (taskType === 'njkqkzkzzbyd') {
          const dataDateField: FormField = {
            key: 'dataDateId',
            label: '数据归属周期',
            type: 'select',
            value: '',
            options: this.state.dataDateOptions.length > 0
              ? this.state.dataDateOptions
              : [{ label: '暂无数据', value: '' }]
          }
          console.log('创建dataDateField:', dataDateField)
          console.log('当前dataDateOptions:', this.state.dataDateOptions)
          this.setState({ dataDateField }, () => {
            // 字段创建完成后加载表单数据
            if (isEdit && dataId) {
              this.loadFormDetail(taskType, dataId)
            }
          })
        } else if (taskType === 'njkqkzkzzbnd') {
          const dataYearField: FormField = {
            key: 'dataDateId',  // 修正字段名为 dataDateId
            label: '数据归属周期',
            type: 'select',
            value: '',
            options: this.state.dataYearOptions.length > 0
              ? this.state.dataYearOptions
              : [{ label: '暂无数据', value: '' }]
          }
          console.log('创建dataYearField:', dataYearField)
          console.log('当前dataYearOptions:', this.state.dataYearOptions)
          this.setState({ dataYearField }, () => {
            // 字段创建完成后加载表单数据
            if (isEdit && dataId) {
              this.loadFormDetail(taskType, dataId)
            }
          })
        } else {
          // 如果不需要独立字段，直接加载表单数据
          if (isEdit && dataId) {
            this.loadFormDetail(taskType, dataId)
          }
        }
      }, 100)
    } catch (error) {
      console.error('加载字典或表单数据失败:', error)
    }
  }

  // 加载表单详情数据
  loadFormDetail = async (taskType: string, dataId: string) => {
    this.setState({ loading: true })

    try {
      console.log('开始加载表单详情:', { taskType, dataId })
      const response = await apiClient.getFormDetail(taskType, dataId)

      if (response.success && response.data) {
        const formData = response.data
        console.log('表单详情数据:', formData)

        // 填充分组字段数据
        const { formGroups } = this.state

        // 定义所有百分比字段
        const calculatedPercentageFields = [
          't16Mzblsxhgl', 't21Xpgglsggzlsyl', 't23Ggcthgl', 't31Byhchl',
          't32Byhgcl', 't34Ycfgl', 't38Zjzljhxsfhl', 't40Zjylwjwcwzl',
          't42Gjgpl', 't44Zztxfqtll', 't45Zztzwyfsl'
        ]

        const directPercentageFields = [
          't17Cfhl', 't18Mzkjywcfbl', 't19Kqzlqxdjhl', 't24Rygglzhl',
          't49Rcyzdhfhl', 't50Ssqyzdhfhl', 't51Wjssqkjxyhl', 't52Zyhskjywsl',
          't53Blzyylcdzydhfhl', 't5410Ypzzfybl', 't5411Kjywzypfybl'
        ]

        const updatedGroups = formGroups.map(group => ({
          ...group,
          fields: group.fields.map(field => {
            if (formData[field.key] !== undefined) {
              // 如果是计算的百分比字段，需要转换显示格式（小数转百分比）
              if (calculatedPercentageFields.includes(field.key) && this.state.taskType === 'njkqkzkzzbyd') {
                const value = Number(formData[field.key]) || 0
                const displayValue = (value * 100).toFixed(2) + '%'
                return {
                  ...field,
                  value: displayValue,
                  saveValue: value
                }
              }

              // 如果是直接输入的百分比字段，需要从小数转换为百分比显示（0.02 → 2%）
              if (directPercentageFields.includes(field.key) && this.state.taskType === 'njkqkzkzzbyd') {
                const value = formData[field.key]

                if (typeof value === 'number') {
                  // 数据库存储的是小数，转换为百分比显示
                  const percentageValue = (value * 100).toFixed(2).replace(/\.?0+$/, '') // 移除尾随的0
                  return {
                    ...field,
                    value: percentageValue + '%'
                  }
                } else if (typeof value === 'string') {
                  // 如果已经是字符串格式且包含%，直接使用
                  if (value.includes('%')) {
                    return {
                      ...field,
                      value: value
                    }
                  } else if (value !== '' && !isNaN(Number(value))) {
                    // 如果是数字字符串，当作小数处理
                    const percentageValue = (Number(value) * 100).toFixed(2).replace(/\.?0+$/, '')
                    return {
                      ...field,
                      value: percentageValue + '%'
                    }
                  }
                }

                return {
                  ...field,
                  value: value
                }
              }

              return { ...field, value: formData[field.key] }
            }
            return field
          })
        }))

        // 填充独立字段数据
        let updatedDataDateField = this.state.dataDateField
        let updatedDataYearField = this.state.dataYearField

        if (updatedDataDateField && formData.dataDateId) {
          console.log('填充dataDateField，原值:', updatedDataDateField.value, '新值:', formData.dataDateId)
          updatedDataDateField = { ...updatedDataDateField, value: formData.dataDateId }
        }

        if (updatedDataYearField && formData.dataDateId) {
          console.log('填充dataYearField，原值:', updatedDataYearField.value, '新值:', formData.dataDateId)
          updatedDataYearField = { ...updatedDataYearField, value: formData.dataDateId }
        }

        this.setState({
          formGroups: updatedGroups,
          dataDateField: updatedDataDateField,
          dataYearField: updatedDataYearField,
          dataStatus: formData.dataStatus || null,
          loading: false
        }, () => {
          // 如果是njkqkzkzzbyd表单，加载完成后计算合格率
          if (this.state.taskType === 'njkqkzkzzbyd') {
            this.calculateAllRates()
          }
        })

        console.log('表单数据加载成功')
        console.log('当前数据状态 dataStatus:', formData.dataStatus)
        console.log('是否可以操作:', this.canPerformOperations())
        console.log('当前独立字段状态:', {
          dataDateField: updatedDataDateField,
          dataYearField: updatedDataYearField
        })
      } else {
        console.warn('表单详情获取失败:', response.message)
        this.setState({ loading: false })
        Taro.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('加载表单详情失败:', error)
      this.setState({ loading: false })
      Taro.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      })
    }
  }

  // 加载数据归属周期字典
  loadDataDateDict = async (): Promise<void> => {
    this.setState({ dataDateLoading: true })

    try {
      console.log('开始获取数据归属周期字典')
      const response = await apiClient.getDataDateDict()

      console.log('数据归属周期API完整响应:', response)

      if (response.success && response.data) {
        const options = response.data.map(item => ({
          label: item.valueNameCn,
          value: item.id  // 使用id作为value，而不是valueCode
        }))

        console.log('处理后的选项数据:', options)

        this.setState({
          dataDateOptions: options,
          dataDateLoading: false
        }, () => {
          // 只在非查看和编辑模式下重新初始化表单
          if (!this.state.isViewMode && !this.state.isEdit) {
            this.initFormFields(this.state.taskType)
          }
        })

        console.log('数据归属周期字典获取成功，选项数量:', options.length)
      } else {
        console.warn('数据归属周期字典获取失败:', response.message)
        this.setState({ dataDateLoading: false })
        throw new Error(response.message || '获取字典失败')
      }
    } catch (error) {
      console.error('获取数据归属周期字典失败:', error)
      this.setState({ dataDateLoading: false })
      throw error
    }
  }

  // 加载数据年度字典
  loadDataYearDict = async (): Promise<void> => {
    this.setState({ dataYearLoading: true })

    try {
      console.log('开始获取数据年度字典')
      const response = await apiClient.getDataYearDict()

      console.log('数据年度API完整响应:', response)

      if (response.success && response.data) {
        const options = response.data.map(item => ({
          label: item.valueNameCn,
          value: item.id  // 使用id作为value，而不是valueCode
        }))

        console.log('处理后的年度选项数据:', options)

        this.setState({
          dataYearOptions: options,
          dataYearLoading: false
        }, () => {
          // 只在非查看和编辑模式下重新初始化表单
          if (!this.state.isViewMode && !this.state.isEdit) {
            this.initFormFields(this.state.taskType)
          }
        })

        console.log('数据年度字典获取成功，选项数量:', options.length)
      } else {
        console.warn('数据年度字典获取失败:', response.message)
        this.setState({ dataYearLoading: false })
        throw new Error(response.message || '获取字典失败')
      }
    } catch (error) {
      console.error('获取数据年度字典失败:', error)
      this.setState({ dataYearLoading: false })
      throw error
    }
  }

  // 处理说明图标点击
  handleHelpClick = async (fieldKey: string, event: any) => {
    // 阻止事件冒泡
    event.stopPropagation()

    const code = fieldKey.toUpperCase()

    // 如果点击的是同一个字段且tooltip已显示，则隐藏
    if (this.state.currentHelpField === fieldKey && this.state.showTooltip) {
      this.setState({
        showTooltip: false,
        currentHelpField: '',
        tooltipContent: null
      })
      return
    }

    this.setState({
      helpLoading: true,
      showTooltip: true,
      tooltipContent: null,
      currentHelpField: fieldKey
    })

    try {
      console.log('获取指标详情，code:', code)
      const response = await apiClient.getIndicatorDetail(code)

      if (response.success && response.data) {
        this.setState({
          tooltipContent: {
            name: response.data.name || '暂无指标名称',
            define: response.data.define || '暂无定义',
            explain: response.data.explain || '暂无说明',
            caliber: response.data.caliber || '暂无口径'
          },
          helpLoading: false
        })
        console.log('指标详情获取成功:', response.data)
      } else {
        // 即使没有数据也显示默认内容
        this.setState({
          tooltipContent: {
            name: '暂无指标名称',
            define: '暂无定义',
            explain: '暂无说明',
            caliber: '暂无口径'
          },
          helpLoading: false
        })
        console.warn('指标详情获取失败:', response.message)
      }
    } catch (error) {
      console.error('获取指标详情失败:', error)
      // 发生错误时也显示默认内容
      this.setState({
        tooltipContent: {
          name: '暂无指标名称',
          define: '暂无定义',
          explain: '暂无说明',
          caliber: '暂无口径'
        },
        helpLoading: false
      })
    }
  }

  // 隐藏 tooltip
  handleHideTooltip = () => {
    this.setState({
      showTooltip: false,
      currentHelpField: '',
      tooltipContent: null
    })
  }

  // 初始化表单字段
  initFormFields = (taskType: string) => {
    // 默认表单字段 - 通用表单
    let groups: FormGroup[] = [
      {
        title: '基本信息',
        expanded: true,
        fields: [
          {
            key: 'tbr',
            label: '填报人',
            type: 'input',
            value: '',
            disabled: true,
            hasHelp: true
          },
          {
            key: 'tbrdh',
            label: '填报人电话',
            type: 'input',
            value: '',
            hasHelp: true
          },
          {
            key: 'bz',
            label: '备注',
            type: 'input',
            value: '',
            hasHelp: true
          }
        ]
      }
    ]

    if (taskType === 'njkqkzkzzbnd') {
      // 口腔科质控中心表单字段 - 按分组组织
      // 单独处理数据归属周期字段
      const dataYearField: FormField = {
        key: 'dataDateId',  // 修正字段名为 dataDateId
        label: '数据归属周期',
        type: 'select',
        value: '',
        options: this.state.dataYearLoading
          ? [{ label: '加载中...', value: '' }]
          : (this.state.dataYearOptions.length > 0
              ? this.state.dataYearOptions
              : [{ label: '暂无数据', value: '' }])
      }

      groups = [
        {
          title: '基本信息',
          expanded: true,
          fields: [
            {
              key: 't3Tbr',
              label: '填报人（联络人）',
              type: 'input',
              value: '',
              hasHelp: true
            },
            {
              key: 't4Tbrdh',
              label: '填报人电话',
              type: 'input',
              value: '',
              hasHelp: true
            },
            {
              key: 't5Ksfzj',
              label: '科室负责人',
              type: 'input',
              value: '',
              hasHelp: true
            }
          ]
        },
        {
          title: '目前已开展诊疗项目',
          expanded: false,
          fields: [
            {
              key: 't71Zgzl',
              label: '根管治疗术',
              type: 'select',
              value: '',
              options: [
                { label: '是', value: '1' },
                { label: '否', value: '0' }
              ],
              hasHelp: true
            },
            {
              key: 't72Dwmfzsyb',
              label: '低位埋伏阻生牙拔除',
              type: 'select',
              value: '',
              options: [
                { label: '是', value: '1' },
                { label: '否', value: '0' }
              ],
              hasHelp: true
            },
            {
              key: 't73Qkycsxjs',
              label: '全口义齿修复技术',
              type: 'select',
              value: '',
              options: [
                { label: '是', value: '1' },
                { label: '否', value: '0' }
              ],
              hasHelp: true
            },
            {
              key: 't74Chjxjzs',
              label: '错颌畸形矫治术',
              type: 'select',
              value: '',
              options: [
                { label: '是', value: '1' },
                { label: '否', value: '0' }
              ],
              hasHelp: true
            },
            {
              key: 't75Gxchjxjzs',
              label: '骨性错颌畸形矫治术',
              type: 'select',
              value: '',
              options: [
                { label: '是', value: '1' },
                { label: '否', value: '0' }
              ],
              hasHelp: true
            },
            {
              key: 't76Zztzrss',
              label: '种植体植入术',
              type: 'select',
              value: '',
              options: [
                { label: '是', value: '1' },
                { label: '否', value: '0' }
              ],
              hasHelp: true
            },
            {
              key: 't77Yyfbzs',
              label: '牙龈翻瓣术',
              type: 'select',
              value: '',
              options: [
                { label: '是', value: '1' },
                { label: '否', value: '0' }
              ],
              hasHelp: true
            },
            {
              key: 't78Yzgzs',
              label: '牙周刮治术',
              type: 'select',
              value: '',
              options: [
                { label: '是', value: '1' },
                { label: '否', value: '0' }
              ],
              hasHelp: true
            },
            {
              key: 't79Jwkz',
              label: '均未开展',
              type: 'select',
              value: '',
              options: [
                { label: '是', value: '1' },
                { label: '否', value: '0' }
              ],
              hasHelp: true
            }
          ]
        },
        {
          title: '科室基本情况',
          fields: [
            {
              key: 't8Ywszhyhz',
              label: '有无收治住院患者',
              type: 'select',
              value: '',
              options: [
                { label: '有', value: '有' },
                { label: '无', value: '无' }
              ],
              hasHelp: true
            },
            {
              key: 't9Kqkyys',
              label: '口腔科牙椅数（张）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't10Kqkcws',
              label: '口腔科床位数（张）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't11Kqkyss',
              label: '口腔科医师数（含助理医师）（人）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't12Kqkhss',
              label: '口腔科护士数（人）',
              type: 'number',
              value: 0,
              hasHelp: true
            }
          ]
        },
        {
          title: '口腔诊疗设备',
          fields: [
            {
              key: 't131Ggxxj',
              label: '根管显微镜（台）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't132Kqszsmy',
              label: '口腔数字扫描仪（台）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't133Kqjgzly',
              label: '口腔激光治疗仪（台）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't134Csgd',
              label: '超声骨刀（台）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't135Qjj',
              label: '全景机（台）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't136Kqzxschtj',
              label: '口腔锥形束 CT 机（台）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't137Kqszhymsb',
              label: '口腔数字化印模设备（台）',
              type: 'number',
              value: 0,
              hasHelp: true
            }
          ]
        }
      ]
      this.setState({ formGroups: groups, dataYearField })
    } else if (taskType === 'njkqkzkzzbyd') {
      // 口腔科质控督查表单字段 - 根据图片重新组织
      // 单独处理数据归属周期字段
      const dataDateField: FormField = {
        key: 'dataDateId',
        label: '数据归属周期',
        type: 'select',
        value: '',
        options: this.state.dataDateLoading
          ? [{ label: '加载中...', value: '' }]
          : (this.state.dataDateOptions.length > 0
              ? this.state.dataDateOptions
              : [{ label: '暂无数据', value: '' }])
      }

      groups = [
        {
          title: '基本信息',
          expanded: true,
          fields: [
            {
              key: 't14Mzhs',
              label: '门诊患者数（人）',
              type: 'number',
              value: 0,
              hasHelp: true
            }
          ]
        },
        {
          title: '门诊病历质量管理',
          expanded: false,
          fields: [
            {
              key: 't16Mzblhgfs',
              label: '抽查门诊病历合格份数（份）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't15Mzblccfs',
              label: '门诊病历抽查份数（份）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't16Mzblsxhgl',
              label: '门诊病历书写合格率（%）',
              type: 'input',
              value: '',
              disabled: true,
              hasHelp: true
            }
          ]
        },
        {
          title: '处方管理与抗菌药物使用',
          expanded: false,
          fields: [
            {
              key: 't17Cfhl',
              label: '处方合格率（%）',
              type: 'input',
              value: '',
              hasHelp: true
            },
            {
              key: 't18Mzkjywcfbl',
              label: '门诊患者抗菌药物处方比例（%）',
              type: 'input',
              value: '',
              hasHelp: true
            }
          ]
        },
        {
          title: '口腔诊疗器械消毒管理',
          expanded: false,
          fields: [
            {
              key: 't19Kqzlqxdjhl',
              label: '口腔诊疗器械消毒或灭菌合格率（%）',
              type: 'input',
              value: '',
              hasHelp: true
            }
          ]
        },
        {
          title: '根管治疗技术质量',
          expanded: false,
          fields: [
            {
              key: 't21Ggzlxpzgys',
              label: '根管治疗中橡皮障隔离术使用次数（次）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't20Ggzlbl',
              label: '根管治疗病例数（次）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't21Xpgglsggzlsyl',
              label: '橡皮障隔离术在根管治疗中的使用率（%）',
              type: 'input',
              value: '',
              disabled: true,
              hasHelp: true
            },
            {
              key: 't23Ggcthgrs',
              label: '根管充填合格人数（人）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't22Ggctrs',
              label: '根管充填人数（人）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't23Ggcthgl',
              label: '根管充填合格率（%）',
              type: 'input',
              value: '',
              disabled: true,
              hasHelp: true
            }
          ]
        },
        {
          title: '儿童口腔治疗',
          expanded: false,
          fields: [
            {
              key: 't24Rygglzhl',
              label: '乳牙根管治疗合格率（%）',
              type: 'input',
              value: '',
              hasHelp: true
            }
          ]
        },
        {
          title: '牙周疾病治疗',
          expanded: false,
          fields: [
            {
              key: 't25Yzylbl',
              label: '牙周炎治疗例数（例）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't26Yzylgmzpbl',
              label: '牙周炎根面平整例数（例）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't27Yjyzlbl',
              label: '牙龈炎治疗例数（例）',
              type: 'number',
              value: 0,
              hasHelp: true
            }
          ]
        },
        {
          title: '口腔粘膜疾病治疗',
          expanded: false,
          fields: [
            {
              key: 't28Kqbpszlbl',
              label: '口腔扁平苔藓治疗例数（例）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't29Kqbpshzlbl',
              label: '口腔扁平苔藓治疗好转例数（例）',
              type: 'number',
              value: 0,
              hasHelp: true
            }
          ]
        },
        {
          title: '拔牙手术并发症管理',
          expanded: false,
          fields: [
            {
              key: 't31Byhchrcs',
              label: '拔牙后出血人次数（人）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't30Byrcs',
              label: '拔牙人次数（人）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't31Byhchl',
              label: '拔牙术后出血率（%）',
              type: 'input',
              value: '',
              disabled: true,
              hasHelp: true
            },
            {
              key: 't32Byhgccrcs',
              label: '拔牙后干槽症人次数（人）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't32Byhgcl',
              label: '拔牙术后干槽率（%）',
              type: 'input',
              value: '',
              disabled: true,
              hasHelp: true
            }
          ]
        },
        {
          title: '义齿修复质量管理',
          expanded: false,
          fields: [
            {
              key: 't34Ycfgjs',
              label: '义齿返工件数（件）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't33Ycjjs',
              label: '义齿总件数（件）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't34Ycfgl',
              label: '义齿返工率（%）',
              type: 'input',
              value: '',
              disabled: true,
              hasHelp: true
            },
            {
              key: 't35Ycjyys',
              label: '义齿基牙预备数（颗）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't36Ycjyyshgs',
              label: '义齿基牙预备合格数（颗）',
              type: 'number',
              value: 0,
              hasHelp: true
            }
          ]
        },
        {
          title: '正畸治疗质量评估',
          expanded: false,
          fields: [
            {
              key: 't38Zjzljhxs',
              label: '正畸病例中治疗计划与实际符合例数（例）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't37Zjblbl',
              label: '正畸病例例数（例）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't38Zjzljhxsfhl',
              label: '正畸治疗计划与实际完成符合率（%）',
              type: 'input',
              value: '',
              disabled: true,
              hasHelp: true
            },
            {
              key: 't40Zjylwjwcbls',
              label: '抽查正畸医疗文件完整例数（例）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't39Zjylwjccbl',
              label: '正畸医疗文件抽查例数（例）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't40Zjylwjwcwzl',
              label: '正畸医疗文件完整率（%）',
              type: 'input',
              value: '',
              disabled: true,
              hasHelp: true
            }
          ]
        },
        {
          title: '医学影像质量管理',
          expanded: false,
          fields: [
            {
              key: 't42Gjpcypjjp',
              label: '根尖片抽样评价甲片例数（例）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't41Gjpcypjbl',
              label: '根尖片抽样评价例数（例）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't42Gjgpl',
              label: '牙片甲片率（%）',
              type: 'input',
              value: '',
              disabled: true,
              hasHelp: true
            }
          ]
        },
        {
          title: '种植体治疗管理',
          expanded: false,
          fields: [
            {
              key: 't44Xfqtlzztkks',
              label: '修复前脱落种植体颗数（颗）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't43Zzztkks',
              label: '植入种植体总颗数（颗）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't44Zztxfqtll',
              label: '种植体修复前脱落率（%）',
              type: 'input',
              value: '',
              disabled: true,
              hasHelp: true
            },
            {
              key: 't45Zztywfsbl',
              label: '种植体周围炎发生例数（例）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't45Zztzwyfsl',
              label: '种植体周围炎发生率（%）',
              type: 'input',
              value: '',
              disabled: true,
              hasHelp: true
            }
          ]
        },
        {
          title: '住院患者综合管理',
          expanded: false,
          fields: [
            {
              key: 't46Cyhs',
              label: '出院患者数（人）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't47Sshs',
              label: '手术患者数（人）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't48Shfjhzss',
              label: '术后非计划再手术例数（人）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't49Rcyzdhfhl',
              label: '入出院诊断符合率（%）',
              type: 'input',
              value: '',
              hasHelp: true
            },
            {
              key: 't50Ssqyzdhfhl',
              label: '手术前后诊断符合率（%）',
              type: 'input',
              value: '',
              hasHelp: true
            },
            {
              key: 't51Wjssqkjxyhl',
              label: '无菌手术切口甲级愈合率（%）',
              type: 'input',
              value: '',
              hasHelp: true
            },
            {
              key: 't52Zyhskjywsl',
              label: '住院患者抗菌药物使用率（%）',
              type: 'input',
              value: '',
              hasHelp: true
            },
            {
              key: 't53Blzyylcdzydhfhl',
              label: '病理诊断与临床诊断符合率（%）',
              type: 'input',
              value: '',
              hasHelp: true
            }
          ]
        },
        {
          title: '腮腺肿瘤专项质控指标',
          expanded: false,
          fields: [
            {
              key: 't541Cyhs',
              label: '腮腺肿瘤 - 出院患者数（人）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't542Ssqyzdhf',
              label: '腮腺肿瘤 - 手术前后诊断符合数（例）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't543Sqmzzyr',
              label: '腮腺肿瘤 - 术前平均住院日（天）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't544Pjzyts',
              label: '腮腺肿瘤 - 平均住院天数（天）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't545Cyzpylfy',
              label: '腮腺肿瘤 - 出院者平均医疗费用（元）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't546Rcyzdhf',
              label: '腮腺肿瘤 - 入出院诊断符合数（例）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't547Zyhzs',
              label: '腮腺肿瘤 - 治愈好转人数（人）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't548Xzlqqcs',
              label: '腮腺肿瘤 - 行肿瘤全切除术例数（例）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't549Shbfzfs',
              label: '腮腺肿瘤 - 术后并发症发生例数（例）',
              type: 'number',
              value: 0,
              hasHelp: true
            },
            {
              key: 't5410Ypzzfybl',
              label: '腮腺肿瘤 - 药品占总费用比例（%）',
              type: 'input',
              value: '',
              hasHelp: true
            },
            {
              key: 't5411Kjywzypfybl',
              label: '腮腺肿瘤 - 抗菌药物占药品费用比例（%）',
              type: 'input',
              value: '',
              hasHelp: true
            }
          ]
        }
      ]
      this.setState({ formGroups: groups, dataDateField })
    } else {
      this.setState({ formGroups: groups })
    }
  }

  // 检查数据填写状态
  checkDataFillStatus = async (dataDateId: string) => {
    if (!dataDateId || (this.state.taskType !== 'njkqkzkzzbnd' && this.state.taskType !== 'njkqkzkzzbyd')) {
      return
    }

    this.setState({ checkingDataFill: true })

    try {
      console.log('开始检查数据填写状态，taskType:', this.state.taskType, 'dataDateId:', dataDateId)
      const response = await apiClient.checkDataFill(this.state.taskType, dataDateId)

      if (response.success) {
        const alreadyFilled = response.data === true
        this.setState({
          dataAlreadyFilled: alreadyFilled,
          checkingDataFill: false
        })

        if (alreadyFilled) {
          Taro.showModal({
            title: '提示',
            content: '该归属周期的数据已经填写过，无需重复填写。',
            showCancel: false,
            confirmText: '知道了',
            success: (result) => {
              if (result.confirm) {
                // 用户点击"知道了"，保持禁用状态
                console.log('用户确认已知晓数据重复填写，保持禁用状态')
              }
            }
          })
        }

        console.log('数据填写状态检查完成，已填写:', alreadyFilled)
      } else {
        console.warn('检查数据填写状态失败:', response.message)
        this.setState({ checkingDataFill: false })
      }
    } catch (error) {
      console.error('检查数据填写状态失败:', error)
      this.setState({ checkingDataFill: false })
    }
  }

  // 实时验证字段值
  validateFieldRealtime = (key: string, value: string | number): string | null => {
    const { taskType } = this.state

    if (taskType !== 'njkqkzkzzbyd') {
      return null
    }

    // 如果是数字字段，验证非负数
    if (typeof value === 'number' && value < 0) {
      return '数值不能为负数'
    }

    // 定义分子分母关系进行实时验证
    const numeratorDenominatorPairs = [
      { numerator: 't16Mzblhgfs', denominator: 't15Mzblccfs' },
      { numerator: 't21Ggzlxpzgys', denominator: 't20Ggzlbl' },
      { numerator: 't23Ggcthgrs', denominator: 't22Ggctrs' },
      { numerator: 't31Byhchrcs', denominator: 't30Byrcs' },
      { numerator: 't32Byhgccrcs', denominator: 't30Byrcs' },
      { numerator: 't34Ycfgjs', denominator: 't33Ycjjs' },
      { numerator: 't38Zjzljhxs', denominator: 't37Zjblbl' },
      { numerator: 't40Zjylwjwcbls', denominator: 't39Zjylwjccbl' },
      { numerator: 't42Gjpcypjjp', denominator: 't41Gjpcypjbl' },
      { numerator: 't44Xfqtlzztkks', denominator: 't43Zzztkks' },
      { numerator: 't45Zztywfsbl', denominator: 't43Zzztkks' }
    ]

    // 检查当前字段是否为分子，若是则验证不能超过对应分母
    const pair = numeratorDenominatorPairs.find(p => p.numerator === key)
    if (pair) {
      // 获取分母值
      let denominatorValue = 0
      this.state.formGroups.forEach(group => {
        group.fields.forEach(field => {
          if (field.key === pair.denominator) {
            denominatorValue = Number(field.value) || 0
          }
        })
      })

      if (Number(value) > denominatorValue && denominatorValue > 0) {
        return `不能大于对应分母值(${denominatorValue})`
      }
    }

    return null
  }

  // 处理字段值变化
  handleFieldChange = (key: string, value: string | number) => {
    // 实时验证
    const validationError = this.validateFieldRealtime(key, value)
    if (validationError) {
      Taro.showToast({
        title: validationError,
        icon: 'none',
        duration: 1500
      })
    }

    // 定义直接输入百分比的字段（用户输入2表示2%）
    const directPercentageFields = [
      't17Cfhl',        // 处方合格率
      't18Mzkjywcfbl',  // 门诊患者抗菌药物处方比例
      't19Kqzlqxdjhl',  // 口腔诊疗器械消毒或灭菌合格率
      't24Rygglzhl',    // 乳牙根管治疗合格率
      't49Rcyzdhfhl',   // 入出院诊断符合率
      't50Ssqyzdhfhl',  // 手术前后诊断符合率
      't51Wjssqkjxyhl', // 无菌手术切口甲级愈合率
      't52Zyhskjywsl',  // 住院患者抗菌药物使用率
      't53Blzyylcdzydhfhl', // 病理诊断与临床诊断符合率
      't5410Ypzzfybl',  // 腮腺肿瘤 - 药品占总费用比例
      't5411Kjywzypfybl' // 腮腺肿瘤 - 抗菌药物占药品费用比例
    ]

    // 处理直接输入百分比字段的格式化
    if (directPercentageFields.includes(key) && typeof value === 'string') {
      // 移除用户可能输入的%符号
      let numericValue = value.replace('%', '')

      // 验证是否为有效数字
      if (numericValue !== '' && !isNaN(Number(numericValue))) {
        const num = Number(numericValue)

        // 验证不超过100%
        if (num > 100) {
          Taro.showToast({
            title: '百分比不能超过100%',
            icon: 'none',
            duration: 1500
          })
          return // 不更新字段值
        }

        // 验证不能为负数
        if (num < 0) {
          Taro.showToast({
            title: '百分比不能为负数',
            icon: 'none',
            duration: 1500
          })
          return // 不更新字段值
        }

        // 格式化显示：如果用户输入数字，自动添加%符号
        value = numericValue + '%'
      }
    }
    // 处理独立的数据归属周期字段
    if (key === 'dataDateId' && this.state.dataDateField) {
      this.setState({
        dataDateField: { ...this.state.dataDateField, value }
      })
      // 当选择数据归属周期时，检查是否已填写（njkqkzkzzbnd和njkqkzkzzbyd都需要）
      if (value && typeof value === 'string' && (this.state.taskType === 'njkqkzkzzbnd' || this.state.taskType === 'njkqkzkzzbyd')) {
        this.checkDataFillStatus(value)
      }
      return
    }

    if (key === 'dataDateId' && this.state.dataYearField) {
      this.setState({
        dataYearField: { ...this.state.dataYearField, value }
      })
      // 当选择数据归属周期时，检查是否已填写（njkqkzkzzbnd使用dataDateId）
      if (value && typeof value === 'string' && this.state.taskType === 'njkqkzkzzbnd') {
        this.checkDataFillStatus(value)
      }
      return
    }

    // 处理分组中的字段
    const { formGroups } = this.state
    const updatedGroups = formGroups.map(group => ({
      ...group,
      fields: group.fields.map(field => {
        if (field.key === key) {
          return { ...field, value }
        }
        return field
      })
    }))
    this.setState({ formGroups: updatedGroups }, () => {
      // 如果是njkqkzkzzbyd表单且修改的是相关字段，则计算所有比率
      if (this.state.taskType === 'njkqkzkzzbyd') {
        this.calculateAllRates()
      }
    })
  }

  // 处理选择器变化
  handlePickerChange = (key: string, e: any) => {
    // 处理独立的数据归属周期字段
    if (key === 'dataDateId' && this.state.dataDateField?.options) {
      const selectedOption = this.state.dataDateField.options[e.detail.value]
      if (selectedOption) {
        this.handleFieldChange(key, selectedOption.value)
      }
      return
    }

    if (key === 'dataDateId' && this.state.dataYearField?.options) {
      const selectedOption = this.state.dataYearField.options[e.detail.value]
      if (selectedOption) {
        this.handleFieldChange(key, selectedOption.value)
      }
      return
    }

    // 处理分组中的字段
    const { formGroups } = this.state
    let targetField: FormField | null = null

    // 找到目标字段
    for (const group of formGroups) {
      const field = group.fields.find(f => f.key === key)
      if (field) {
        targetField = field
        break
      }
    }

    if (targetField && targetField.options) {
      const selectedOption = targetField.options[e.detail.value]
      if (selectedOption) {
        this.handleFieldChange(key, selectedOption.value)
      }
    }
  }

  // 处理分组展开/收缩
  handleGroupToggle = (groupIndex: number) => {
    const { formGroups } = this.state
    const updatedGroups = formGroups.map((group, index) => {
      if (index === groupIndex) {
        return { ...group, expanded: !group.expanded }
      }
      return group
    })
    this.setState({ formGroups: updatedGroups })
  }

  // 保存表单
  handleSubmit = async () => {
    // 先进行表单验证
    const validation = this.validateForm()
    if (!validation.isValid) {
      const errorMessage = validation.errors.slice(0, 3).join('\n') +
        (validation.errors.length > 3 ? `\n还有${validation.errors.length - 3}个错误...` : '')

      Taro.showModal({
        title: '表单验证失败',
        content: errorMessage,
        showCancel: false,
        confirmText: '知道了'
      })
      return
    }

    const { formGroups, isEdit, taskType, dataDateField, dataYearField, dataId } = this.state

    // 获取用户信息
    const userInfo = getUserInfo()
    if (!userInfo) {
      Taro.showToast({
        title: '用户信息获取失败，请重新登录',
        icon: 'none'
      })
      return
    }

    // 构建提交数据
    const formData: any = {}

    // 添加独立字段数据
    if (dataDateField) {
      formData[dataDateField.key] = dataDateField.value
    }
    if (dataYearField) {
      formData[dataYearField.key] = dataYearField.value
    }

    // 添加分组字段数据
    const directPercentageFields = [
      't17Cfhl', 't18Mzkjywcfbl', 't19Kqzlqxdjhl', 't24Rygglzhl',
      't49Rcyzdhfhl', 't50Ssqyzdhfhl', 't51Wjssqkjxyhl', 't52Zyhskjywsl',
      't53Blzyylcdzydhfhl', 't5410Ypzzfybl', 't5411Kjywzypfybl'
    ]

    formGroups.forEach(group => {
      group.fields.forEach(field => {
        // 直接输入百分比字段转换为小数保存（2% → 0.02）
        if (directPercentageFields.includes(field.key)) {
          const value = field.value as string
          if (value && value.includes('%')) {
            const numericValue = value.replace('%', '')
            const decimalValue = Number(numericValue) / 100
            formData[field.key] = decimalValue
          } else if (value && !isNaN(Number(value))) {
            // 如果用户直接输入数字没有%符号，也转换为小数
            formData[field.key] = Number(value) / 100
          } else {
            formData[field.key] = field.value
          }
        } else {
          // 其他字段：如果有saveValue（计算字段），使用saveValue，否则使用value
          formData[field.key] = field.saveValue !== undefined ? field.saveValue : field.value
        }
      })
    })

    // 添加额外必要字段
    formData.taskId = this.state.taskId || apiConfig.config.taskId
    formData.userId = userInfo.id
    formData.userName = userInfo.name
    formData.departmentId = userInfo.departmentId
    formData.departmentName = userInfo.departmentName

    // 如果是编辑模式，添加数据ID
    if (isEdit && dataId) {
      formData.id = dataId
    }

    console.log('提交表单数据:', formData)
    console.log('提交模式:', isEdit ? '编辑' : '新建')

    this.setState({ loading: true })

    try {
      let response
      // 根据是否为编辑模式调用不同的接口
      if (isEdit && dataId) {
        response = await apiClient.updateFormData(taskType, formData)
      } else {
        response = await apiClient.saveFormData(taskType, formData)
      }

      if (response.success) {
        Taro.showToast({
          title: isEdit ? '修改成功' : '保存成功',
          icon: 'success'
        })

        // 发送数据更新事件，通知数据列表刷新
        Taro.eventCenter.trigger('dataListRefresh')

        // 返回上一页
        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
      } else {
        throw new Error(response.message || '保存失败')
      }
    } catch (error) {
      console.error('保存失败:', error)
      Taro.showToast({
        title: error.message || '保存失败，请重试',
        icon: 'none'
      })
    }

    this.setState({ loading: false })
  }

  // 保存表单（编辑模式）
  handleSave = async () => {
    // 检查操作权限
    if (!this.canPerformOperations()) {
      Taro.showToast({
        title: '当前数据状态不允许保存',
        icon: 'none'
      })
      return
    }

    // 先进行表单验证
    const validation = this.validateForm()
    if (!validation.isValid) {
      const errorMessage = validation.errors.slice(0, 3).join('\n') +
        (validation.errors.length > 3 ? `\n还有${validation.errors.length - 3}个错误...` : '')

      Taro.showModal({
        title: '表单验证失败',
        content: errorMessage,
        showCancel: false,
        confirmText: '知道了'
      })
      return
    }

    const { formGroups, taskType, dataDateField, dataYearField, dataId } = this.state

    // 获取用户信息
    const userInfo = getUserInfo()
    if (!userInfo) {
      Taro.showToast({
        title: '用户信息获取失败，请重新登录',
        icon: 'none'
      })
      return
    }

    // 构建提交数据
    const formData: any = {}

    // 添加独立字段数据
    if (dataDateField) {
      formData[dataDateField.key] = dataDateField.value
    }
    if (dataYearField) {
      formData[dataYearField.key] = dataYearField.value
    }

    // 添加分组字段数据
    const directPercentageFields = [
      't17Cfhl', 't18Mzkjywcfbl', 't19Kqzlqxdjhl', 't24Rygglzhl',
      't49Rcyzdhfhl', 't50Ssqyzdhfhl', 't51Wjssqkjxyhl', 't52Zyhskjywsl',
      't53Blzyylcdzydhfhl', 't5410Ypzzfybl', 't5411Kjywzypfybl'
    ]

    formGroups.forEach(group => {
      group.fields.forEach(field => {
        // 直接输入百分比字段转换为小数保存（2% → 0.02）
        if (directPercentageFields.includes(field.key)) {
          const value = field.value as string
          if (value && value.includes('%')) {
            const numericValue = value.replace('%', '')
            const decimalValue = Number(numericValue) / 100
            formData[field.key] = decimalValue
          } else if (value && !isNaN(Number(value))) {
            // 如果用户直接输入数字没有%符号，也转换为小数
            formData[field.key] = Number(value) / 100
          } else {
            formData[field.key] = field.value
          }
        } else {
          // 其他字段：如果有saveValue（计算字段），使用saveValue，否则使用value
          formData[field.key] = field.saveValue !== undefined ? field.saveValue : field.value
        }
      })
    })

    // 添加额外必要字段
    formData.taskId = this.state.taskId || apiConfig.config.taskId
    formData.userId = userInfo.id
    formData.userName = userInfo.name
    formData.departmentId = userInfo.departmentId
    formData.departmentName = userInfo.departmentName
    formData.id = dataId

    console.log('保存表单数据:', formData)

    this.setState({ loading: true })

    try {
      const response = await apiClient.updateFormData(taskType, formData)

      if (response.success) {
        Taro.showToast({
          title: '保存成功',
          icon: 'success'
        })

        // 发送数据更新事件，通知数据列表刷新
        Taro.eventCenter.trigger('dataListRefresh')
      } else {
        throw new Error(response.message || '保存失败')
      }
    } catch (error) {
      console.error('保存失败:', error)
      Taro.showToast({
        title: error.message || '保存失败，请重试',
        icon: 'none'
      })
    }

    this.setState({ loading: false })
  }

  // 提审
  handleSubmitForReview = () => {
    // 检查操作权限
    if (!this.canPerformOperations()) {
      Taro.showToast({
        title: '当前数据状态不允许提审',
        icon: 'none'
      })
      return
    }

    // 先进行表单验证
    const validation = this.validateForm()
    if (!validation.isValid) {
      const errorMessage = validation.errors.slice(0, 3).join('\n') +
        (validation.errors.length > 3 ? `\n还有${validation.errors.length - 3}个错误...` : '')

      Taro.showModal({
        title: '表单验证失败',
        content: errorMessage,
        showCancel: false,
        confirmText: '知道了'
      })
      return
    }

    const { taskType, dataId } = this.state

    if (!dataId) {
      Taro.showToast({
        title: '数据ID不能为空',
        icon: 'none'
      })
      return
    }

    Taro.showModal({
      title: '提审确认',
      content: '确认提交审核吗？提交后将无法修改。',
      success: async (result) => {
        if (result.confirm) {
          try {
            Taro.showLoading({
              title: '提审中...'
            })

            const response = await apiClient.submitDataForReview(taskType, dataId)

            Taro.hideLoading()

            if (response.success) {
              Taro.showToast({
                title: '提审成功',
                icon: 'success'
              })

              // 发送数据更新事件，通知数据列表刷新
              Taro.eventCenter.trigger('dataListRefresh')

              // 提审成功后返回上一页
              setTimeout(() => {
                Taro.navigateBack()
              }, 1500)
            } else {
              throw new Error(response.message || '提审失败')
            }
          } catch (error) {
            console.error('提审失败:', error)
            Taro.hideLoading()
            Taro.showToast({
              title: error.message || '提审失败，请重试',
              icon: 'none'
            })
          }
        }
      }
    })
  }

  // 查看审批记录
  handleViewReviewRecords = async () => {
    const { dataId } = this.state

    if (!dataId) {
      Taro.showToast({
        title: '数据ID不能为空',
        icon: 'none'
      })
      return
    }

    // 显示弹窗并开始加载
    this.setState({
      showReviewModal: true,
      reviewLoading: true,
      reviewRecords: []
    })

    try {
      const response = await apiClient.getFlowRecordList(dataId)

      if (response.success) {
        this.setState({
          reviewRecords: response.data || [],
          reviewLoading: false
        })
      } else {
        throw new Error(response.message || '获取审批记录失败')
      }
    } catch (error) {
      console.error('获取审批记录失败:', error)
      this.setState({
        reviewLoading: false
      })
      Taro.showToast({
        title: error.message || '获取审批记录失败',
        icon: 'none'
      })
    }
  }

  // 关闭审批记录弹窗
  handleCloseReviewModal = () => {
    this.setState({
      showReviewModal: false,
      reviewRecords: [],
      reviewLoading: false
    })
  }

  // 表单验证
  validateForm = (): { isValid: boolean; errors: string[] } => {
    const { formGroups, taskType, dataDateField, dataYearField } = this.state
    const errors: string[] = []

    // 收集所有字段值
    const fieldValues: { [key: string]: any } = {}
    const fieldLabels: { [key: string]: string } = {}

    // 收集独立字段
    if (dataDateField) {
      fieldValues[dataDateField.key] = dataDateField.value
      fieldLabels[dataDateField.key] = dataDateField.label
    }
    if (dataYearField) {
      fieldValues[dataYearField.key] = dataYearField.value
      fieldLabels[dataYearField.key] = dataYearField.label
    }

    // 收集分组字段
    formGroups.forEach(group => {
      group.fields.forEach(field => {
        fieldValues[field.key] = field.value
        fieldLabels[field.key] = field.label.replace('（%）', '') // 移除标签中的%符号
      })
    })

    // 1. 必填验证 - 所有项目都必填
    Object.keys(fieldValues).forEach(key => {
      const value = fieldValues[key]
      const label = fieldLabels[key]

      if (value === '' || value === null || value === undefined) {
        errors.push(`${label}不能为空`)
      }
    })

    // 2. 针对njkqkzkzzbyd表单的特殊验证
    if (taskType === 'njkqkzkzzbyd') {
      // 定义分子分母关系
      const numeratorDenominatorPairs = [
        {
          numerator: 't16Mzblhgfs',   // 抽查门诊病历合格份数
          denominator: 't15Mzblccfs', // 门诊病历抽查份数
          numeratorLabel: '抽查门诊病历合格份数',
          denominatorLabel: '门诊病历抽查份数'
        },
        {
          numerator: 't21Ggzlxpzgys',  // 根管治疗中橡皮障隔离术使用次数
          denominator: 't20Ggzlbl',    // 根管治疗病例数
          numeratorLabel: '根管治疗中橡皮障隔离术使用次数',
          denominatorLabel: '根管治疗病例数'
        },
        {
          numerator: 't23Ggcthgrs',  // 根管充填合格人数
          denominator: 't22Ggctrs',  // 根管充填人数
          numeratorLabel: '根管充填合格人数',
          denominatorLabel: '根管充填人数'
        },
        {
          numerator: 't31Byhchrcs',  // 拔牙后出血人次数
          denominator: 't30Byrcs',   // 拔牙人次数
          numeratorLabel: '拔牙后出血人次数',
          denominatorLabel: '拔牙人次数'
        },
        {
          numerator: 't32Byhgccrcs', // 拔牙后干槽症人次数
          denominator: 't30Byrcs',   // 拔牙人次数
          numeratorLabel: '拔牙后干槽症人次数',
          denominatorLabel: '拔牙人次数'
        },
        {
          numerator: 't34Ycfgjs',   // 义齿返工件数
          denominator: 't33Ycjjs',  // 义齿总件数
          numeratorLabel: '义齿返工件数',
          denominatorLabel: '义齿总件数'
        },
        {
          numerator: 't38Zjzljhxs',  // 正畸病例中治疗计划与实际符合例数
          denominator: 't37Zjblbl',  // 正畸病例例数
          numeratorLabel: '正畸病例中治疗计划与实际符合例数',
          denominatorLabel: '正畸病例例数'
        },
        {
          numerator: 't40Zjylwjwcbls', // 抽查正畸医疗文件完整例数
          denominator: 't39Zjylwjccbl', // 正畸医疗文件抽查例数
          numeratorLabel: '抽查正畸医疗文件完整例数',
          denominatorLabel: '正畸医疗文件抽查例数'
        },
        {
          numerator: 't42Gjpcypjjp',  // 根尖片抽样评价甲片例数
          denominator: 't41Gjpcypjbl', // 根尖片抽样评价例数
          numeratorLabel: '根尖片抽样评价甲片例数',
          denominatorLabel: '根尖片抽样评价例数'
        },
        {
          numerator: 't44Xfqtlzztkks', // 修复前脱落种植体颗数
          denominator: 't43Zzztkks',   // 植入种植体总颗数
          numeratorLabel: '修复前脱落种植体颗数',
          denominatorLabel: '植入种植体总颗数'
        },
        {
          numerator: 't45Zztywfsbl',  // 种植体周围炎发生例数
          denominator: 't43Zzztkks',  // 植入种植体总颗数
          numeratorLabel: '种植体周围炎发生例数',
          denominatorLabel: '植入种植体总颗数'
        }
      ]

      // 验证分子必须小于等于分母
      numeratorDenominatorPairs.forEach(pair => {
        const numeratorValue = Number(fieldValues[pair.numerator]) || 0
        const denominatorValue = Number(fieldValues[pair.denominator]) || 0

        if (numeratorValue > denominatorValue) {
          errors.push(`${pair.numeratorLabel}(${numeratorValue})不能大于${pair.denominatorLabel}(${denominatorValue})`)
        }

        // 分母不能为0
        if (denominatorValue === 0 && numeratorValue > 0) {
          errors.push(`当${pair.numeratorLabel}大于0时，${pair.denominatorLabel}不能为0`)
        }
      })

      // 3. 百分比字段验证
      const calculatedPercentageFields = [
        't16Mzblsxhgl', 't21Xpgglsggzlsyl', 't23Ggcthgl', 't31Byhchl',
        't32Byhgcl', 't34Ycfgl', 't38Zjzljhxsfhl', 't40Zjylwjwcwzl',
        't42Gjgpl', 't44Zztxfqtll', 't45Zztzwyfsl'
      ]

      const directPercentageFields = [
        't17Cfhl', 't18Mzkjywcfbl', 't19Kqzlqxdjhl', 't24Rygglzhl',
        't49Rcyzdhfhl', 't50Ssqyzdhfhl', 't51Wjssqkjxyhl', 't52Zyhskjywsl',
        't53Blzyylcdzydhfhl', 't5410Ypzzfybl', 't5411Kjywzypfybl'
      ]

      // 验证计算的百分比字段 - 值必须在0-1之间
      formGroups.forEach(group => {
        group.fields.forEach(field => {
          if (calculatedPercentageFields.includes(field.key)) {
            const saveValue = field.saveValue !== undefined ? Number(field.saveValue) : null
            const label = fieldLabels[field.key]

            if (saveValue !== null) {
              if (saveValue < 0) {
                errors.push(`${label}不能小于0%`)
              }
              if (saveValue > 1) {
                errors.push(`${label}不能大于100%`)
              }
            }
          }

          // 验证直接输入的百分比字段 - 转换为小数后值必须在0-1之间
          if (directPercentageFields.includes(field.key)) {
            const value = field.value as string
            const label = fieldLabels[field.key]

            if (value && value !== '') {
              // 移除%符号获取数值
              const numericValue = value.replace('%', '')
              const num = Number(numericValue)

              if (!isNaN(num)) {
                if (num < 0) {
                  errors.push(`${label}不能小于0%`)
                }
                if (num > 100) {
                  errors.push(`${label}不能大于100%`)
                }

                // 转换为小数验证存储值是否在合理范围内
                const decimalValue = num / 100
                if (decimalValue > 1) {
                  errors.push(`${label}转换后的值超出范围`)
                }
              } else {
                errors.push(`${label}必须为有效的数字`)
              }
            }
          }
        })
      })
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // 检查是否可以进行保存和提审操作
  canPerformOperations = () => {
    const { dataStatus } = this.state
    // dataStatus=0 或 dataStatus=3 时可以操作
    return dataStatus === '0' || dataStatus === '3'
  }

  // 计算所有比率字段
  calculateAllRates = () => {
    const { formGroups } = this.state

    // 收集所有字段值
    const fieldValues: { [key: string]: number } = {}
    formGroups.forEach(group => {
      group.fields.forEach(field => {
        if (field.type === 'number') {
          fieldValues[field.key] = Number(field.value) || 0
        }
      })
    })

    // 定义所有计算公式
    const calculations = [
      {
        resultField: 't16Mzblsxhgl', // 门诊病历书写合格率
        numerator: 't16Mzblhgfs',   // 抽查门诊病历合格份数
        denominator: 't15Mzblccfs'  // 门诊病历抽查份数
      },
      {
        resultField: 't21Xpgglsggzlsyl', // 橡皮障隔离术在根管治疗中的使用率
        numerator: 't21Ggzlxpzgys',     // 根管治疗中橡皮障隔离术使用次数
        denominator: 't20Ggzlbl'        // 根管治疗病例数
      },
      {
        resultField: 't23Ggcthgl', // 根管充填合格率
        numerator: 't23Ggcthgrs',  // 根管充填合格人数
        denominator: 't22Ggctrs'   // 根管充填人数
      },
      {
        resultField: 't31Byhchl', // 拔牙术后出血率
        numerator: 't31Byhchrcs', // 拔牙后出血人次数
        denominator: 't30Byrcs'   // 拔牙人次数
      },
      {
        resultField: 't32Byhgcl', // 拔牙术后干槽率
        numerator: 't32Byhgccrcs', // 拔牙后干槽症人次数
        denominator: 't30Byrcs'    // 拔牙人次数
      },
      {
        resultField: 't34Ycfgl', // 义齿返工率
        numerator: 't34Ycfgjs',  // 义齿返工件数
        denominator: 't33Ycjjs'  // 义齿总件数
      },
      {
        resultField: 't38Zjzljhxsfhl', // 正畸治疗计划与实际完成符合率
        numerator: 't38Zjzljhxs',      // 正畸病例中治疗计划与实际符合例数
        denominator: 't37Zjblbl'       // 正畸病例例数
      },
      {
        resultField: 't40Zjylwjwcwzl', // 正畸医疗文件完整率
        numerator: 't40Zjylwjwcbls',   // 抽查正畸医疗文件完整例数
        denominator: 't39Zjylwjccbl'   // 正畸医疗文件抽查例数
      },
      {
        resultField: 't42Gjgpl', // 牙片甲片率
        numerator: 't42Gjpcypjjp', // 根尖片抽样评价甲片例数
        denominator: 't41Gjpcypjbl' // 根尖片抽样评价例数
      },
      {
        resultField: 't44Zztxfqtll', // 种植体修复前脱落率
        numerator: 't44Xfqtlzztkks', // 修复前脱落种植体颗数
        denominator: 't43Zzztkks'    // 植入种植体总颗数
      },
      {
        resultField: 't45Zztzwyfsl', // 种植体周围炎发生率
        numerator: 't45Zztywfsbl',   // 种植体周围炎发生例数
        denominator: 't43Zzztkks'    // 植入种植体总颗数
      }
    ]

    // 执行所有计算
    const updatedGroups = formGroups.map(group => ({
      ...group,
      fields: group.fields.map(field => {
        // 查找是否是计算结果字段
        const calculation = calculations.find(calc => calc.resultField === field.key)
        if (calculation) {
          const numerator = fieldValues[calculation.numerator] || 0
          const denominator = fieldValues[calculation.denominator] || 0

          let displayValue = '' // 显示值（带%）
          let saveValue = ''    // 保存值（小数）

          if (denominator > 0 && numerator >= 0) {
            const decimal = numerator / denominator // 小数形式
            const percentage = (decimal * 100).toFixed(2) // 百分比
            displayValue = percentage + '%'
            saveValue = decimal.toFixed(4) // 保存4位小数精度
          }

          return {
            ...field,
            value: displayValue, // 显示带%的值
            saveValue: saveValue // 保存小数值
          }
        }
        return field
      })
    }))

    this.setState({ formGroups: updatedGroups })
    console.log('所有比率字段计算完成')
  }

  // 渲染独立字段
  renderIndependentField = (field: FormField) => {
    const isDataDateField = field.key === 'dataDateId'
    const showCheckingStatus = isDataDateField && this.state.checkingDataFill && (this.state.taskType === 'njkqkzkzzbnd' || this.state.taskType === 'njkqkzkzzbyd')
    const showFilledWarning = isDataDateField && this.state.dataAlreadyFilled && (this.state.taskType === 'njkqkzkzzbnd' || this.state.taskType === 'njkqkzkzzbyd')
    const isFieldDisabled = field.disabled || this.state.isViewMode

    return (
      <View key={field.key} className='form-item'>
        <View className='form-item-label'>
          <Text className='item-label'>{field.label}</Text>
          {showCheckingStatus && (
            <Text style={{ marginLeft: '8px', color: '#999', fontSize: '24px' }}>
              检查中...
            </Text>
          )}
          {showFilledWarning && !this.state.isViewMode && (
            <Text style={{ marginLeft: '8px', color: '#ff4d4f', fontSize: '24px' }}>
              已填写
            </Text>
          )}
        </View>

        <View className='form-item-control'>
          {field.type === 'input' && (
            <Input
              className={`form-input ${isFieldDisabled ? 'disabled' : ''}`}
              placeholder={this.state.isViewMode ? '' : '请输入'}
              value={field.value as string}
              disabled={isFieldDisabled}
              onInput={(e) => this.handleFieldChange(field.key, e.detail.value)}
            />
          )}

          {field.type === 'number' && (
            <Input
              className={`form-input ${this.state.isViewMode ? 'disabled' : ''}`}
              placeholder={this.state.isViewMode ? '' : '请输入'}
              type='number'
              value={String(field.value)}
              disabled={this.state.isViewMode}
              onInput={(e) => this.handleFieldChange(field.key, Number(e.detail.value) || 0)}
            />
          )}

          {field.type === 'select' && field.options && (
            <Picker
              mode='selector'
              range={field.options.map(opt => opt.label)}
              value={field.options.findIndex(opt => opt.value === field.value)}
              onChange={(e) => this.handlePickerChange(field.key, e)}
              disabled={this.state.isViewMode}
            >
              <View className={`form-picker ${this.state.isViewMode ? 'disabled' : ''}`}>
                <Text className={`picker-text ${!field.value ? 'placeholder' : ''}`}>
                  {field.value ?
                    (field.options.find(opt => opt.value === field.value)?.label || '请选择')
                    : (this.state.isViewMode ? '' : '请选择')
                  }
                </Text>
                {!this.state.isViewMode && <Text className='picker-arrow'>▼</Text>}
              </View>
            </Picker>
          )}
        </View>
      </View>
    )
  }

  // 渲染审批记录弹窗
  renderReviewModal = () => {
    const { showReviewModal, reviewRecords, reviewLoading } = this.state

    if (!showReviewModal) {
      return null
    }

    return (
      <View className='review-modal-overlay' onClick={this.handleCloseReviewModal}>
        <View className='review-modal' onClick={(e) => e.stopPropagation()}>
          <View className='review-modal-header'>
            <Text className='review-modal-title'>审批记录</Text>
            <Text className='review-modal-close' onClick={this.handleCloseReviewModal}>×</Text>
          </View>

          <View className='review-modal-content'>
            {reviewLoading ? (
              <View className='review-loading'>
                <Text>加载中...</Text>
              </View>
            ) : reviewRecords.length === 0 ? (
              <View className='review-empty'>
                <Text>暂无审批记录</Text>
              </View>
            ) : (
              <View className='review-timeline'>
                {reviewRecords.map((record, recordIndex) =>
                  record.recordDetails.map((detail, detailIndex) => (
                    <View key={`${record.instance.id}-${detail.id}`} className='review-step'>
                      <View className='step-number'>
                        <View className={`step-circle ${detail.recordStatus === '1' ? 'completed' : ''}`}>
                          {detail.recordStatus === '1' ? '✓' : detailIndex + 1}
                        </View>
                        {(recordIndex < reviewRecords.length - 1 || detailIndex < record.recordDetails.length - 1) && <View className='step-line' />}
                      </View>

                      <View className='step-content'>
                        <View className='step-title'>{detail.nodeName}</View>
                        <View className='step-status'>
                          {detail.recordStatusName}
                        </View>

                        <View className='step-info'>
                          <View className='step-user'>
                            <Text className='user-icon'>👤</Text>
                            <Text className='user-name'>
                              {detail.flowRecordOpts.length > 0
                                ? detail.flowRecordOpts.map(opt => opt.approverName).join('、')
                                : '待分配'
                              }
                            </Text>
                          </View>
                          <Text className='step-time'>
                            {detail.flowRecordOpts.length > 0 && detail.flowRecordOpts[0].approveDate
                              ? detail.flowRecordOpts[0].approveDate.split(' ')[0]
                              : detail.createTime.split(' ')[0]
                            }
                          </Text>
                        </View>

                        {detail.remarks && (
                          <View className='step-comments'>
                            <Text>备注：{detail.remarks}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    )
  }

  // 构建面包屑导航项
  buildBreadcrumbItems = () => {
    const { taskType, title, isViewMode, isEdit } = this.state

    // 构建详情页路径
    const detailPath = `/pages/dataReportDetail/index?appkey=${taskType}&title=${encodeURIComponent('数据列表')}`

    // 最后一级的名称
    let lastLevelName = title || '填报数据'
    if (isViewMode) {
      lastLevelName = title || '查看数据'
    } else if (isEdit) {
      lastLevelName = title || '编辑数据'
    }

    return [
      { name: '数据上报', path: '/pages/dataReportList/index' },
      { name: '数据列表', path: detailPath },
      { name: lastLevelName }
    ]
  }

  render() {
    const { title, formGroups, loading, isEdit, taskType, departmentName, dataDateLoading, dataDateOptions, dataYearLoading, dataYearOptions, dataDateField, dataYearField } = this.state

    return (
      <View className='data-form'>
        {/* 面包屑导航 */}
        <Breadcrumb
          items={this.buildBreadcrumbItems()}
        />

        {/* 表单内容 */}
        <View className='form-container' onClick={this.handleHideTooltip}>
          <View className='form-header'>
            <Text className='form-title'>
              {this.state.isViewMode ? '数据详情' : (isEdit ? '编辑数据' : '数据填报')}
            </Text>
            {/* 如果是njkqkzkzzbyd或njkqkzkzzbnd表单，显示填报单位名称 */}
            {(taskType === 'njkqkzkzzbyd' || taskType === 'njkqkzkzzbnd') && (
              <View className='form-org-info'>
                <Text className='form-org-label'>填报单位：</Text>
                <Text className='form-org-name'>南京口腔医院</Text>
                {/* 显示数据加载状态 */}
                {(dataDateLoading || dataYearLoading) && (
                  <Text className='form-loading-text'>（数据加载中...）</Text>
                )}
              </View>
            )}
          </View>

          {/* 渲染独立的数据归属周期字段 - 查看模式下不显示 */}
          {!this.state.isViewMode && (dataDateField || dataYearField) && (
            <View className='form-group'>
              <View className='group-content'>
                {dataDateField && (
                  <View>
                    {console.log('渲染dataDateField:', dataDateField)}
                    {this.renderIndependentField(dataDateField)}
                  </View>
                )}
                {dataYearField && (
                  <View>
                    {console.log('渲染dataYearField:', dataYearField)}
                    {this.renderIndependentField(dataYearField)}
                  </View>
                )}
              </View>
            </View>
          )}

          {formGroups.map((group, groupIndex) => (
            <View key={group.title} className='form-group'>
              <View className='group-header' onClick={() => this.handleGroupToggle(groupIndex)}>
                <Text className='group-title'>{group.title}</Text>
                <Text className={`group-arrow ${group.expanded ? 'expanded' : ''}`}>▼</Text>
              </View>

              {group.expanded && (
                <View className='group-content'>
                  {group.fields.map((field, fieldIndex) => (
                    <View key={field.key} className='form-item'>
                      <View className='form-item-label'>
                        <Text className='item-number'>{fieldIndex + 1}、</Text>
                        <Text className='item-label'>{field.label}</Text>
                        {/* 将说明图标移动到label的后面 */}
                        {field.hasHelp && (
                          <View className='help-icon-container'>
                            <View className='help-icon' onClick={(e) => this.handleHelpClick(field.key, e)}>
                              <Text className='help-icon-text'>?</Text>
                            </View>
                            {/* 只为当前激活的字段显示tooltip */}
                            {this.state.showTooltip && this.state.currentHelpField === field.key && (
                              <View className='tooltip' onClick={(e) => e.stopPropagation()}>
                                {this.state.helpLoading ? (
                                  <View className='tooltip-loading'>
                                    <Text>加载中...</Text>
                                  </View>
                                ) : (
                                  <View className='tooltip-content'>
                                    <View className='tooltip-item'>
                                      <Text className='tooltip-label'>指标名称：</Text>
                                      <Text className='tooltip-text'>{this.state.tooltipContent?.name || '暂无指标名称'}</Text>
                                    </View>
                                    <View className='tooltip-item'>
                                      <Text className='tooltip-label'>指标定义：</Text>
                                      <Text className='tooltip-text'>{this.state.tooltipContent?.define || '暂无定义'}</Text>
                                    </View>
                                    <View className='tooltip-item'>
                                      <Text className='tooltip-label'>指标说明：</Text>
                                      <Text className='tooltip-text'>{this.state.tooltipContent?.explain || '暂无说明'}</Text>
                                    </View>
                                    <View className='tooltip-item'>
                                      <Text className='tooltip-label'>统计口径：</Text>
                                      <Text className='tooltip-text'>{this.state.tooltipContent?.caliber || '暂无口径'}</Text>
                                    </View>
                                  </View>
                                )}
                              </View>
                            )}
                          </View>
                        )}
                      </View>

                      <View className='form-item-control'>
                        {field.type === 'input' && (
                          <Input
                            className={`form-input ${field.disabled || this.state.isViewMode ? 'disabled' : ''}`}
                            placeholder={this.state.isViewMode ? '' : '请输入'}
                            value={field.value as string}
                            disabled={field.disabled || this.state.isViewMode}
                            onInput={(e) => this.handleFieldChange(field.key, e.detail.value)}
                          />
                        )}

                        {field.type === 'number' && (
                          <Input
                            className={`form-input ${this.state.isViewMode ? 'disabled' : ''}`}
                            placeholder={this.state.isViewMode ? '' : '请输入'}
                            type='number'
                            value={String(field.value)}
                            disabled={this.state.isViewMode}
                            onInput={(e) => this.handleFieldChange(field.key, Number(e.detail.value) || 0)}
                          />
                        )}

                        {field.type === 'select' && field.options && (
                          <Picker
                            mode='selector'
                            range={field.options.map(opt => opt.label)}
                            value={field.options.findIndex(opt => opt.value === field.value)}
                            onChange={(e) => this.handlePickerChange(field.key, e)}
                            disabled={this.state.isViewMode}
                          >
                            <View className={`form-picker ${this.state.isViewMode ? 'disabled' : ''}`}>
                              <Text className={`picker-text ${!field.value ? 'placeholder' : ''}`}>
                                {field.value ?
                                  (field.options.find(opt => opt.value === field.value)?.label || '请选择')
                                  : (this.state.isViewMode ? '' : '请选择')
                                }
                              </Text>
                              {!this.state.isViewMode && <Text className='picker-arrow'>▼</Text>}
                            </View>
                          </Picker>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}

          {/* 操作按钮 - 查看模式下不显示 */}
          {!this.state.isViewMode && (
            <View className='form-footer'>
              {isEdit ? (
                <View className='form-actions'>
                  <Button
                    className={`action-btn save-btn ${!this.canPerformOperations() ? 'disabled' : ''}`}
                    type='primary'
                    loading={loading}
                    disabled={!this.canPerformOperations()}
                    onClick={this.handleSave}
                  >
                    {loading ? '保存中...' : '保存'}
                  </Button>
                  <Button
                    className={`action-btn submit-btn ${!this.canPerformOperations() ? 'disabled' : ''}`}
                    disabled={!this.canPerformOperations()}
                    onClick={this.handleSubmitForReview}
                  >
                    提审
                  </Button>
                  <Button
                    className='action-btn review-btn'
                    onClick={this.handleViewReviewRecords}
                  >
                    审批记录
                  </Button>
                </View>
              ) : (
                <Button
                  className={`submit-btn ${(this.state.dataAlreadyFilled && (this.state.taskType === 'njkqkzkzzbnd' || this.state.taskType === 'njkqkzkzzbyd')) ? 'disabled' : ''}`}
                  type='primary'
                  loading={loading}
                  disabled={this.state.dataAlreadyFilled && (this.state.taskType === 'njkqkzkzzbnd' || this.state.taskType === 'njkqkzkzzbyd')}
                  onClick={this.handleSubmit}
                >
                  {(this.state.dataAlreadyFilled && (this.state.taskType === 'njkqkzkzzbnd' || this.state.taskType === 'njkqkzkzzbyd'))
                    ? '数据已填写'
                    : (loading ? '保存中...' : '提交')
                  }
                </Button>
              )}
            </View>
          )}
        </View>

        {/* 审批记录弹窗 */}
        {this.renderReviewModal()}
      </View>
    )
  }
}