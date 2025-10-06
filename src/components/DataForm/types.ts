/**
 * DataForm组件相关的类型定义
 */

export interface FormField {
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

export interface FormGroup {
  title: string
  fields: FormField[]
  expanded?: boolean
}

export interface TooltipContent {
  name: string
  define: string
  explain: string
  caliber: string
}

export interface DataFormProps {
  taskType: string
  taskId: string
  dataId: string
  title: string
  isEdit: boolean
  isViewMode: boolean
  departmentName: string
}

export interface FormFieldProps {
  field: FormField
  value: string | number
  disabled?: boolean
  onChange: (key: string, value: string | number) => void
  onHelp?: (field: FormField) => void
}

export interface FormGroupProps {
  group: FormGroup
  expanded: boolean
  disabled?: boolean
  onToggle: (title: string) => void
  onFieldChange: (key: string, value: string | number) => void
  onFieldHelp?: (field: FormField) => void
}

export interface FormActionsProps {
  loading: boolean
  isEdit: boolean
  isViewMode: boolean
  dataStatus: string | null
  onSave: () => void
  onSubmit: () => void
  onReview: () => void
}