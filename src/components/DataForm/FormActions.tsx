import { Component } from 'react'
import { View, Button } from '@tarojs/components'
import { FormActionsProps } from './types'
import './FormActions.scss'

export default class FormActions extends Component<FormActionsProps> {

  render() {
    const { loading, isEdit, isViewMode, dataStatus, onSave, onSubmit, onReview } = this.props

    if (isViewMode) {
      return (
        <View className='form-actions view-mode'>
          <Button className='action-btn review-btn' onClick={onReview}>
            查看审批记录
          </Button>
        </View>
      )
    }

    return (
      <View className='form-actions'>
        {isEdit && (
          <Button
            className='action-btn save-btn'
            onClick={onSave}
            loading={loading}
            disabled={loading}
          >
            保存
          </Button>
        )}

        {dataStatus !== 'submitted' && (
          <Button
            className='action-btn submit-btn primary'
            onClick={onSubmit}
            loading={loading}
            disabled={loading}
          >
            提交
          </Button>
        )}

        <Button className='action-btn review-btn' onClick={onReview}>
          查看审批记录
        </Button>
      </View>
    )
  }
}