import { Component } from 'react'
import { View, Text, Image, ScrollView, Swiper, SwiperItem } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { EvidenceItem } from '../../utils/api'
import './index.scss'

interface ImageViewerProps {
  visible: boolean
  evidenceList: EvidenceItem[]
  loading: boolean
  onClose: () => void
  onDelete?: (id: string) => void
}

interface ImageViewerState {
  currentIndex: number // 当前选中的图片索引
}

export default class ImageViewer extends Component<ImageViewerProps, ImageViewerState> {

  constructor(props) {
    super(props)
    this.state = {
      currentIndex: 0
    }
  }

  // 选择图片
  handleSelectImage = (index: number) => {
    this.setState({
      currentIndex: index
    })
  }

  // 全屏预览
  handleFullscreenPreview = () => {
    const { evidenceList } = this.props
    const { currentIndex } = this.state
    const urls = evidenceList.map(item => item.fileUrl).filter(url => url)

    if (urls.length === 0) {
      Taro.showToast({
        title: '暂无图片',
        icon: 'none'
      })
      return
    }

    // 使用原生预览
    Taro.previewImage({
      current: evidenceList[currentIndex].fileUrl,
      urls: urls
    })
  }

  // 删除图片
  handleDeleteImage = (id: string) => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这张图片吗？',
      success: (res) => {
        if (res.confirm && this.props.onDelete) {
          this.props.onDelete(id)
        }
      }
    })
  }

  // 阻止事件冒泡
  handleContentClick = (e) => {
    e.stopPropagation()
  }

  // 格式化文件大小
  formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  render() {
    const { visible, evidenceList, loading, onClose } = this.props
    const { currentIndex } = this.state

    if (!visible) {
      return null
    }

    const currentEvidence = evidenceList[currentIndex]

    return (
      <View className='image-viewer-overlay' onClick={onClose}>
        {/* 关闭按钮 - 在弹窗外部 */}
        <View className='image-viewer-close' onClick={onClose}>
          <Text className='close-icon'>✕</Text>
        </View>

        <View className='image-viewer-content' onClick={this.handleContentClick}>
          {/* 主体内容 */}
          <View className='image-viewer-body'>
            {loading ? (
              <View className='loading-container'>
                <View className='loading-spinner'></View>
                <Text className='loading-text'>加载中...</Text>
              </View>
            ) : evidenceList.length === 0 ? (
              <View className='empty-container'>
                <Text className='empty-icon'>📷</Text>
                <Text className='empty-text'>暂无图片证据</Text>
                <Text className='empty-desc'>点击上传按钮添加图片</Text>
              </View>
            ) : (
              <View className='main-preview-layout'>
                {/* 主图预览区域 */}
                <View className='main-image-container'>
                  <Image
                    className='main-image'
                    src={currentEvidence.fileUrl}
                    mode='aspectFit'
                    onClick={this.handleFullscreenPreview}
                    onError={() => {

                    }}
                  />
                  <View className='main-image-overlay' onClick={this.handleFullscreenPreview}>
                    <Text className='fullscreen-icon'>🔍</Text>
                    <Text className='fullscreen-text'>点击全屏预览</Text>
                  </View>
                  {/* 删除按钮 */}
                  <View
                    className='delete-button'
                    onClick={(e) => {
                      e.stopPropagation()
                      this.handleDeleteImage(currentEvidence.id)
                    }}
                  >
                    <Text className='delete-icon'>🗑️</Text>
                  </View>
                </View>

                {/* 底部缩略图横向滚动列表 */}
                <View className='thumbnail-section'>
                  <Text className='thumbnail-title'>所有图片</Text>
                  <ScrollView
                    className='thumbnail-scroll'
                    scrollX
                    enhanced
                    showScrollbar={false}
                  >
                    <View className='thumbnail-list'>
                      {evidenceList.map((evidence, index) => (
                        <View
                          key={evidence.id}
                          className={`thumbnail-item ${index === currentIndex ? 'active' : ''}`}
                          onClick={() => this.handleSelectImage(index)}
                        >
                          <Image
                            className='thumbnail-image'
                            src={evidence.fileUrl}
                            mode='aspectFill'
                            onError={() => {

                            }}
                          />
                          {index === currentIndex && (
                            <View className='thumbnail-active-indicator'></View>
                          )}
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    )
  }
}