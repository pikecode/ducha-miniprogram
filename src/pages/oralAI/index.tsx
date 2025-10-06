import { Component } from 'react'
import { View, Text, Input, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { getAiApiConfig, ensureConfigLoaded } from '../../utils/miniProgramConfig'
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
  streamingMessage: string
  isStreaming: boolean
}

export default class OralAI extends Component<{}, OralAIState> {

  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      inputText: '',
      isLoading: false,
      conversationId: '',
      streamingMessage: '',
      isStreaming: false
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
      // 确保配置已加载（避免重复请求）
      await ensureConfigLoaded()
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
    const { inputText, messages, isLoading, conversationId, isStreaming } = this.state

    if (!inputText.trim() || isLoading || isStreaming) {
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
      isLoading: true,
      streamingMessage: '',
      isStreaming: false
    }, () => {
      this.scrollToBottom()
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
        // 开始流式显示
        this.setState({
          isLoading: false,
          isStreaming: true,
          streamingMessage: ''
        })

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

        // 开始逐字显示AI回答
        this.simulateTyping(aiContent || '抱歉，我无法理解您的问题，请重新提问。')
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
      }, () => {
        this.scrollToBottom()
      })

      Taro.showToast({
        title: 'AI服务异常',
        icon: 'none'
      })
    }
  }

  // 获取用户ID
  generateUserId = () => {
    // 优先使用登录用户的真实ID
    const userInfo = Taro.getStorageSync('userInfo')
    if (userInfo && userInfo.id) {
      return userInfo.id.toString()
    }

    // 如果没有登录用户信息，使用缓存的AI用户ID
    let userId = Taro.getStorageSync('ai_user_id')
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      Taro.setStorageSync('ai_user_id', userId)
    }
    return userId
  }

  // 滚动到底部
  scrollToBottom = () => {
    setTimeout(() => {
      Taro.pageScrollTo({
        scrollTop: 99999,
        duration: 300
      })
    }, 100)
  }

  // 模拟打字效果
  simulateTyping = (content: string) => {
    const formattedContent = this.formatMarkdownContent(content)
    const chars = formattedContent.split('')
    let currentText = ''
    let index = 0

    const typeNextChar = () => {
      if (index < chars.length) {
        currentText += chars[index]
        this.setState({
          streamingMessage: currentText
        }, () => {
          // 每显示几个字符就滚动一次
          if (index % 10 === 0) {
            this.scrollToBottom()
          }
        })
        index++

        // 根据字符类型调整速度
        let delay = 30 // 基础延迟
        const char = chars[index - 1]
        if (char === '\n') {
          delay = 200 // 换行稍慢
        } else if (char === '。' || char === '！' || char === '？') {
          delay = 300 // 句号更慢
        } else if (char === '，' || char === '、') {
          delay = 100 // 逗号稍慢
        }

        setTimeout(typeNextChar, delay)
      } else {
        // 打字完成，添加到消息列表
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: formattedContent,
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        }

        this.setState({
          messages: [...this.state.messages, aiMessage],
          isStreaming: false,
          streamingMessage: ''
        }, () => {
          this.scrollToBottom()
        })
      }
    }

    typeNextChar()
  }

  // 格式化markdown内容
  formatMarkdownContent = (content: string): string => {
    if (!content) return ''

    return content
      // 首先移除思考标签
      .replace(/<think>[\s\S]*?<\/think>/g, '')
      .replace(/<thinking>[\s\S]*?<\/thinking>/g, '')

      // 处理标题
      .replace(/^### (.*$)/gim, '\n📌 $1\n')
      .replace(/^## (.*$)/gim, '\n🔹 $1\n')
      .replace(/^# (.*$)/gim, '\n📋 $1\n')

      // 处理粗体
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')

      // 处理斜体
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/_(.*?)_/g, '$1')

      // 处理列表项
      .replace(/^\* (.*$)/gim, '• $1')
      .replace(/^- (.*$)/gim, '• $1')
      .replace(/^\+ (.*$)/gim, '• $1')

      // 处理有序列表
      .replace(/^\d+\.\s+(.*$)/gim, '▪ $1')

      // 处理代码块
      .replace(/```[\s\S]*?```/g, (match) => {
        const code = match.replace(/```\w*\n?/g, '').replace(/```$/g, '')
        return `\n【代码】\n${code}\n`
      })

      // 处理行内代码
      .replace(/`([^`]+)`/g, '「$1」')

      // 处理引用
      .replace(/^> (.*$)/gim, '💬 $1')

      // 处理分隔线
      .replace(/^---+$/gm, '\n────────────────\n')
      .replace(/^\*\*\*+$/gm, '\n────────────────\n')

      // 处理表格（简化处理）
      .replace(/\|(.+)\|/g, (match) => {
        return match.replace(/\|/g, ' | ').trim()
      })

      // 清理多余的换行
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  }

  render() {
    const { messages, inputText, isLoading, isStreaming } = this.state

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

          {/* AI流式回答显示 */}
          {this.state.isStreaming && this.state.streamingMessage && (
            <View className='message-item ai'>
              <View className='ai-message'>
                <View className='ai-avatar'>
                  <Text className='avatar-icon'>🤖</Text>
                </View>
                <View className='ai-bubble'>
                  <Text className='message-text'>{this.state.streamingMessage}</Text>
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
            placeholder='请输入问题'
            value={inputText}
            onInput={this.handleInputChange}
            confirmType='send'
            onConfirm={this.handleSend}
          />
          <View
            className={`send-btn ${isLoading || isStreaming ? 'disabled' : ''}`}
            onClick={this.handleSend}
          >
            <Text className='send-icon'>➤</Text>
          </View>
        </View>
      </View>
    )
  }
}