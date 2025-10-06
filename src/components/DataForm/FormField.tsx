import { Component } from 'react'
import { View, Text, Input, Picker } from '@tarojs/components'
import { FormFieldProps } from './types'
import './FormField.scss'

export default class FormField extends Component<FormFieldProps> {

  handleInputChange = (e) => {
    const { field, onChange } = this.props
    let value = e.detail.value

    if (field.type === 'number') {
      value = parseFloat(value) || 0
    }

    onChange(field.key, value)
  }

  handlePickerChange = (e) => {
    const { field, onChange } = this.props
    const index = e.detail.value
    const selectedOption = field.options?.[index]

    if (selectedOption) {
      onChange(field.key, selectedOption.value)
    }
  }

  handleHelpClick = () => {
    const { field, onHelp } = this.props
    if (onHelp && field.hasHelp) {
      onHelp(field)
    }
  }

  getPickerIndex = () => {
    const { field, value } = this.props
    if (!field.options) return 0

    const index = field.options.findIndex(option => option.value === value)
    return index >= 0 ? index : 0
  }

  render() {
    const { field, value, disabled } = this.props

    return (
      <View className='form-field'>
        <View className='field-label'>
          <Text className='label-text'>{field.label}</Text>
          {field.hasHelp && (
            <View className='help-icon' onClick={this.handleHelpClick}>
              <Text className='help-text'>?</Text>
            </View>
          )}
        </View>

        <View className='field-input'>
          {field.type === 'select' ? (
            <Picker
              mode='selector'
              range={field.options?.map(opt => opt.label) || []}
              value={this.getPickerIndex()}
              onChange={this.handlePickerChange}
              disabled={disabled || field.disabled}
            >
              <View className='picker-wrapper'>
                <Text className='picker-text'>
                  {field.options?.[this.getPickerIndex()]?.label || '请选择'}
                </Text>
                <Text className='picker-arrow'>▼</Text>
              </View>
            </Picker>
          ) : (
            <Input
              className='input-field'
              type={field.type === 'number' ? 'number' : 'text'}
              placeholder={`请输入${field.label}`}
              value={String(value || '')}
              onInput={this.handleInputChange}
              disabled={disabled || field.disabled}
            />
          )}
        </View>
      </View>
    )
  }
}