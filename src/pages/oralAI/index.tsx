import { Component } from 'react'
import { View, Text, Input, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { getAiApiConfig } from '../../utils/miniProgramConfig'
import { apiClient } from '../../utils/api'
import './index.scss'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  time: string
}

interface OralAIState {
  messages: Message[]
  inputText: string
  isLoading: boolean
  conversationId: string
}

export default class OralAI extends Component<{}, OralAIState> {

  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      inputText: '',
      isLoading: false,
      conversationId: ''
    }
  }

  async componentDidMount() {
    Taro.setNavigationBarTitle({
      title: '口腔AI'
    })
    // 加载小程序配置
    await this.loadMiniProgramConfig()
  }

  // 加载小程序配置
  loadMiniProgramConfig = async () => {
    try {
      const response = await apiClient.getMiniProgramConfig()
      if (response.success && response.data) {
        Taro.setStorageSync('miniProgramConfig', { data: response.data })
      }
    } catch (error) {
      console.error('加载小程序配置失败:', error)
    }
  }

  componentDidShow() {
    // 更新自定义TabBar
    this.updateCustomTabBar()
  }

  updateCustomTabBar = () => {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().updateTabBar()
    }
  }

  handleInputChange = (e) => {
    this.setState({ inputText: e.detail.value })
  }

  handleSend = async () => {
    const { inputText, messages, isLoading, conversationId } = this.state

    if (!inputText.trim() || isLoading) {
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }

    this.setState({
      messages: [...messages, userMessage],
      inputText: '',
      isLoading: true
    })

    try {
      const aiConfig = getAiApiConfig()
      const userId = this.generateUserId()

      const requestData = {
        query: inputText.trim(),
        inputs: {},
        response_mode: "streaming",
        user: userId,
        conversation_id: conversationId
      }

      const response = await Taro.request({
        url: aiConfig.apiUrl,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${aiConfig.appKey}`
        },
        data: requestData
      })

      if (response.statusCode === 200 && response.data) {
        // 处理流式响应或普通响应
        let aiContent = ''

        if (typeof response.data === 'string') {
          // 流式响应处理
          const lines = response.data.split('\n')
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const jsonData = JSON.parse(line.substring(6))
                if (jsonData.answer) {
                  aiContent += jsonData.answer
                }
                if (jsonData.conversation_id && !conversationId) {
                  this.setState({ conversationId: jsonData.conversation_id })
                }
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        } else if (response.data.answer) {
          aiContent = response.data.answer
          if (response.data.conversation_id && !conversationId) {
            this.setState({ conversationId: response.data.conversation_id })
          }
        }

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: aiContent || '抱歉，我无法理解您的问题，请重新提问。',
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        }

        this.setState({
          messages: [...this.state.messages, aiMessage],
          isLoading: false
        })
      } else {
        throw new Error('API请求失败')
      }
    } catch (error) {
      console.error('AI API调用失败:', error)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '抱歉，AI服务暂时不可用，请稍后再试。',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }

      this.setState({
        messages: [...this.state.messages, errorMessage],
        isLoading: false
      })

      Taro.showToast({
        title: 'AI服务异常',
        icon: 'none'
      })
    }
  }

  // 生成用户ID
  generateUserId = () => {
    let userId = Taro.getStorageSync('ai_user_id')
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      Taro.setStorageSync('ai_user_id', userId)
    }
    return userId
  }

  render() {
    const { messages, inputText, isLoading } = this.state

    return (
      <View className='oral-ai'>
        {/* 聊天消息列表 */}
        <ScrollView className='message-list' scrollY scrollIntoView='bottom'>
          {messages.map(message => (
            <View key={message.id} className={`message-item ${message.type}`}>
              {message.type === 'user' ? (
                <View className='user-message'>
                  <View className='user-bubble'>
                    <Text className='message-text'>{message.content}</Text>
                  </View>
                </View>
              ) : (
                <View className='ai-message'>
                  <View className='ai-avatar'>
                    <Text className='avatar-icon'>🤖</Text>
                  </View>
                  <View className='ai-bubble'>
                    <Text className='message-text'>{message.content}</Text>
                  </View>
                </View>
              )}
            </View>
          ))}

          {/* AI正在思考的提示 */}
          {isLoading && (
            <View className='message-item ai'>
              <View className='ai-message'>
                <View className='ai-avatar'>
                  <Text className='avatar-icon'>🤖</Text>
                </View>
                <View className='ai-bubble loading'>
                  <Text className='message-text'>AI正在思考中...</Text>
                </View>
              </View>
            </View>
          )}

          <View id='bottom'></View>
        </ScrollView>

        {/* 输入框 */}
        <View className='input-bar'>
          <Input
            className='message-input'
            placeholder='请输入问题，默认一行，文字增加后自动变多行。'
            value={inputText}
            onInput={this.handleInputChange}
            confirmType='send'
            onConfirm={this.handleSend}
          />
          <View
            className={`send-btn ${isLoading ? 'disabled' : ''}`}
            onClick={this.handleSend}
          >
            <Text className='send-icon'>➤</Text>
          </View>
        </View>
      </View>
    )
  }
}