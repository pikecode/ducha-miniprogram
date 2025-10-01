import { Component } from 'react'
import { View, Text, Input, Radio, RadioGroup, Textarea } from '@tarojs/components'
import { InspectItem, DictItem, InspectEMRResult } from '../../utils/api'
import './index.scss'

interface InspectItemCardProps {
  item: InspectItem
  index: number
  isEvaluationMode: boolean
  evaluationOptions: DictItem[]
  optionsLoading: boolean
  savedResult?: InspectEMRResult
  onRadioChange: (itemId: string, value: string) => void
  onInputChange: (itemId: string, value: string) => void
  onScoreChange: (itemId: string, value: string) => void
  onUploadImage: (itemId: string) => void
  onViewImages: (itemId: string) => void
  getSelectedValue: (itemId: string) => string
  getRemarkValue: (itemId: string) => string
  getScoreValue: (itemId: string) => string
}

export default class InspectItemCard extends Component<InspectItemCardProps> {

  handleRadioChange = (e) => {
    this.props.onRadioChange(this.props.item.id, e.detail.value)
  }

  handleInputChange = (e) => {
    this.props.onInputChange(this.props.item.id, e.detail.value)
  }

  handleScoreChange = (e) => {
    this.props.onScoreChange(this.props.item.id, e.detail.value)
  }

  handleUploadImage = () => {
    this.props.onUploadImage(this.props.item.id)
  }

  handleViewImages = () => {
    this.props.onViewImages(this.props.item.id)
  }

  render() {
    const {
      item,
      index,
      isEvaluationMode,
      evaluationOptions,
      optionsLoading,
      getSelectedValue,
      getRemarkValue,
      getScoreValue
    } = this.props

    return (
      <View className={isEvaluationMode ? 'evaluation-item' : 'score-item'}>
        <View className='item-header'>
          <Text className='item-title'>{index + 1}、{item.itemName}</Text>
          <View className='right-section'>
            {!isEvaluationMode && item.score > 0 && (
              <Text className='item-score'>{item.score}分</Text>
            )}
            <View className='image-actions'>
              <Text className='upload-text' onClick={this.handleUploadImage}>上传</Text>
              <Text className='view-text' onClick={this.handleViewImages}>照片 ({item.fileCount})</Text>
            </View>
          </View>
        </View>

        <View className='item-content'>
          {isEvaluationMode ? (
            // 评级模式：显示单选按钮
            <View className='evaluation-section'>
              {optionsLoading ? (
                <View className='loading-text'>加载评级选项中...</View>
              ) : (
                <RadioGroup onChange={this.handleRadioChange}>
                  {evaluationOptions.map(option => (
                    <View key={option.id} className='radio-item'>
                      <Radio value={option.valueNameCn} checked={getSelectedValue(item.id) === option.valueNameCn}>
                        {option.valueNameCn}
                      </Radio>
                    </View>
                  ))}
                </RadioGroup>
              )}
            </View>
          ) : (
            // 打分模式：显示评分输入框
            <View className='score-section'>
              <View className='score-row'>
                <Text className='score-label'>评分</Text>
                <Input
                  className='score-input'
                  type='number'
                  value={getScoreValue(item.id)}
                  onInput={this.handleScoreChange}
                />
              </View>
            </View>
          )}

          {/* 统一的存在不足输入区域 */}
          <View className='remark-section'>
            <Text className='remark-label'>存在不足</Text>
            <Textarea
              className='remark-input'
              placeholder='请输入存在不足'
              value={getRemarkValue(item.id)}
              onInput={this.handleInputChange}
              autoHeight
            />
          </View>
        </View>
      </View>
    )
  }
}