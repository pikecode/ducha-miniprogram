import { Component } from 'react'
import { View, Text, Input, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
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
}

export default class OralAI extends Component<{}, OralAIState> {

  constructor(props) {
    super(props)
    this.state = {
      messages: [
        {
          id: '1',
          type: 'user',
          content: '口腔医疗质量控制一般包含哪些指标',
          time: '14:30'
        },
        {
          id: '2',
          type: 'ai',
          content: '好的，这是一个非常重要且专业的问题。口腔医疗质量控制（简称"口腔质控"）是一个系统性工程，旨在通过一系列指标来评估和改善口腔医疗服务的安全性、有效性和患者体验。\n\n这些指标通常可以分为以下几大类：\n\n一、核心医疗质量与安全指标\n\n这是质控中最核心的部分，直接关系到患者的治疗 outcomes 和安全。\n\n1. 感染控制指标\n\n• 器械消毒灭菌合格率：每月生物监测（如使用生物指示剂）和化学监测的合格率，必须达到100%。\n\n• 手卫生依从性：医护人员在"两前三',
          time: '14:31'
        }
      ],
      inputText: ''
    }
  }

  componentDidMount() {
    Taro.setNavigationBarTitle({
      title: '口腔AI'
    })
  }

  handleInputChange = (e) => {
    this.setState({ inputText: e.detail.value })
  }

  handleSend = () => {
    const { inputText, messages } = this.state

    if (!inputText.trim()) {
      return
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }

    this.setState({
      messages: [...messages, newMessage],
      inputText: ''
    })

    // 模拟AI回复
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '这是AI的回复...',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }
      this.setState({
        messages: [...this.state.messages, aiMessage]
      })
    }, 1000)
  }

  render() {
    const { messages, inputText } = this.state

    return (
      <View className='oral-ai'>
        {/* 聊天消息列表 */}
        <ScrollView className='message-list' scrollY scrollIntoView='bottom'>
          {messages.map(message => (
            <View key={message.id} className={`message-item ${message.type}`}>
              {message.type === 'user' ? (
                <View className='user-message'>
                  <View className='message-bubble user-bubble'>
                    <Text className='message-text'>{message.content}</Text>
                  </View>
                </View>
              ) : (
                <View className='ai-message'>
                  <View className='ai-avatar'>
                    <Text className='avatar-icon'>🤖</Text>
                  </View>
                  <View className='message-bubble ai-bubble'>
                    <Text className='message-text'>{message.content}</Text>
                  </View>
                </View>
              )}
            </View>
          ))}
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
          <View className='send-btn' onClick={this.handleSend}>
            <Text className='send-icon'>➤</Text>
          </View>
        </View>
      </View>
    )
  }
}