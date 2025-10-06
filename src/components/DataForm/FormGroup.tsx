import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import FormField from './FormField'
import { FormGroupProps } from './types'
import './FormGroup.scss'

export default class FormGroup extends Component<FormGroupProps> {

  handleToggle = () => {
    const { group, onToggle } = this.props
    onToggle(group.title)
  }

  render() {
    const { group, expanded, disabled, onFieldChange, onFieldHelp } = this.props

    return (
      <View className='form-group'>
        <View className='group-header' onClick={this.handleToggle}>
          <Text className='group-title'>{group.title}</Text>
          <Text className={`expand-icon ${expanded ? 'expanded' : ''}`}>
            ▼
          </Text>
        </View>

        {expanded && (
          <View className='group-content'>
            {group.fields.map(field => (
              <FormField
                key={field.key}
                field={field}
                value={field.value}
                disabled={disabled}
                onChange={onFieldChange}
                onHelp={onFieldHelp}
              />
            ))}
          </View>
        )}
      </View>
    )
  }
}