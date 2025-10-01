// 使用 NutUI ImagePreview 的示例
import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
// import { ImagePreview } from '@nutui/nutui-react-taro'

interface ImagePreviewExampleProps {
  images: Array<{
    id: string
    url: string
    title?: string
  }>
}

export const ImagePreviewExample: React.FC<ImagePreviewExampleProps> = ({ images }) => {
  const [visible, setVisible] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePreview = (index: number) => {
    setCurrentIndex(index)
    setVisible(true)
  }

  const imageUrls = images.map(img => img.url)

  return (
    <View>
      {/* 图片网格 */}
      <View style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {images.map((image, index) => (
          <View
            key={image.id}
            onClick={() => handlePreview(index)}
            style={{ aspectRatio: '1', cursor: 'pointer' }}
          >
            <img src={image.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </View>
        ))}
      </View>

      {/* NutUI ImagePreview */}
      {/*
      <ImagePreview
        images={imageUrls}
        visible={visible}
        autoPlay={false}
        pagination={{ visible: true }}
        indicator
        onClose={() => setVisible(false)}
        onChange={(index) => setCurrentIndex(index)}
        closeOnPopstate
        showMenuByLongpress
      />
      */}
    </View>
  )
}

// 使用方式：
/*
const evidenceImages = evidenceList.map(evidence => ({
  id: evidence.id,
  url: evidence.fileUrl,
  title: evidence.fileName
}))

<ImagePreviewExample images={evidenceImages} />
*/