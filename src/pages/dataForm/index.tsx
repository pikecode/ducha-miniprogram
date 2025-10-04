import { Component } from 'react'
import { View, Text, Input, Button, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { apiClient } from '../../utils/api'
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
      dataAlreadyFilled: false
    }
  }

  componentDidMount() {
    const params = Taro.getCurrentInstance().router?.params
    if (params) {
      const isEdit = params.dataId ? true : false
      const isViewMode = params.mode === 'view'
      this.setState({
        taskType: params.taskType || '',
        taskId: params.taskId || '',
        dataId: params.dataId || '',
        title: decodeURIComponent(params.title || ''),
        isEdit,
        isViewMode
      })

      // 设置导航栏标题
      let title = '填报数据'
      if (isViewMode) {
        title = '查看详情'
      } else if (isEdit) {
        title = '编辑数据'
      }
      Taro.setNavigationBarTitle({
        title: title
      })

      // 初始化表单字段
      this.initFormFields(params.taskType || '')

      // 根据表单类型加载字典数据，然后加载表单详情
      this.loadDictionariesAndFormData(params.taskType || '', params.dataId || '', isViewMode, isEdit)

      console.log('表单页接收参数:', {
        taskType: params.taskType,
        taskId: params.taskId,
        dataId: params.dataId,
        title: decodeURIComponent(params.title || ''),
        isEdit,
        isViewMode
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
            key: 'dataYearId',
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
        const updatedGroups = formGroups.map(group => ({
          ...group,
          fields: group.fields.map(field => ({
            ...field,
            value: formData[field.key] !== undefined ? formData[field.key] : field.value
          }))
        }))

        // 填充独立字段数据
        let updatedDataDateField = this.state.dataDateField
        let updatedDataYearField = this.state.dataYearField

        if (updatedDataDateField && formData.dataDateId) {
          console.log('填充dataDateField，原值:', updatedDataDateField.value, '新值:', formData.dataDateId)
          updatedDataDateField = { ...updatedDataDateField, value: formData.dataDateId }
        }

        if (updatedDataYearField && formData.dataYearId) {
          console.log('填充dataYearField，原值:', updatedDataYearField.value, '新值:', formData.dataYearId)
          updatedDataYearField = { ...updatedDataYearField, value: formData.dataYearId }
        }

        this.setState({
          formGroups: updatedGroups,
          dataDateField: updatedDataDateField,
          dataYearField: updatedDataYearField,
          loading: false
        })

        console.log('表单数据加载成功')
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
        key: 'dataYearId',
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
              label: '门诊病历书写合格率',
              type: 'input',
              value: '',
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
              label: '拔牙术后出血率',
              type: 'input',
              value: '',
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
              label: '拔牙术后干槽率',
              type: 'input',
              value: '',
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
              label: '义齿返工率',
              type: 'input',
              value: '',
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
              label: '正畸治疗计划与实际完成符合率',
              type: 'input',
              value: '',
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
              label: '正畸医疗文件完整率',
              type: 'input',
              value: '',
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
              label: '牙片甲片率',
              type: 'input',
              value: '',
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
              label: '种植体修复前脱落率',
              type: 'input',
              value: '',
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
              label: '种植体周围炎发生率',
              type: 'input',
              value: '',
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
    if (!dataDateId || this.state.taskType !== 'njkqkzkzzbnd') {
      return
    }

    this.setState({ checkingDataFill: true })

    try {
      console.log('开始检查数据填写状态，dataDateId:', dataDateId)
      const response = await apiClient.checkDataFill('njkqkzkzzbnd', dataDateId)

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

  // 处理字段值变化
  handleFieldChange = (key: string, value: string | number) => {
    // 处理独立的数据归属周期字段
    if (key === 'dataDateId' && this.state.dataDateField) {
      this.setState({
        dataDateField: { ...this.state.dataDateField, value }
      })
      // 当选择数据归属周期时，检查是否已填写
      if (value && typeof value === 'string') {
        this.checkDataFillStatus(value)
      }
      return
    }

    if (key === 'dataYearId' && this.state.dataYearField) {
      this.setState({
        dataYearField: { ...this.state.dataYearField, value }
      })
      // 当选择数据归属周期时，检查是否已填写（njkqkzkzzbnd使用dataYearId）
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
    this.setState({ formGroups: updatedGroups })
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

    if (key === 'dataYearId' && this.state.dataYearField?.options) {
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
    const { formGroups, isEdit, taskType, dataDateField, dataYearField } = this.state

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
    formGroups.forEach(group => {
      group.fields.forEach(field => {
        formData[field.key] = field.value
      })
    })

    // 添加额外必要字段
    formData.taskId = this.state.taskId || apiConfig.config.taskId
    formData.userId = userInfo.id
    formData.userName = userInfo.name
    formData.departmentId = userInfo.departmentId
    formData.departmentName = userInfo.departmentName

    console.log('提交表单数据:', formData)

    this.setState({ loading: true })

    try {
      // 调用保存接口
      const response = await apiClient.saveFormData(taskType, formData)

      if (response.success) {
        Taro.showToast({
          title: isEdit ? '修改成功' : '保存成功',
          icon: 'success'
        })

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

  // 渲染独立字段
  renderIndependentField = (field: FormField) => {
    const isDataDateField = field.key === 'dataDateId' || field.key === 'dataYearId'
    const showCheckingStatus = isDataDateField && this.state.checkingDataFill
    const showFilledWarning = isDataDateField && this.state.dataAlreadyFilled
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

          {/* 提交按钮 - 查看模式下不显示 */}
          {!this.state.isViewMode && (
            <View className='form-footer'>
              <Button
                className={`submit-btn ${this.state.dataAlreadyFilled ? 'disabled' : ''}`}
                type='primary'
                loading={loading}
                disabled={this.state.dataAlreadyFilled}
                onClick={this.handleSubmit}
              >
                {this.state.dataAlreadyFilled
                  ? '数据已填写'
                  : (loading ? '保存中...' : (isEdit ? '保存修改' : '提交'))
                }
              </Button>
            </View>
          )}
        </View>
      </View>
    )
  }
}