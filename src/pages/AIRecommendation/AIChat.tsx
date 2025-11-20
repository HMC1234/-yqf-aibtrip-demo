// 智能对话预订页面
import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Input,
  Button,
  message,
  Space,
  Avatar,
  Spin,
  Steps,
  Modal,
  Descriptions,
  Tag,
} from 'antd'
import { RobotOutlined, UserOutlined, SendOutlined, FileTextOutlined } from '@ant-design/icons'
import { supabase } from '../../lib/supabase'
import dayjs from 'dayjs'
import './AIChat.css'

const { TextArea } = Input
const { Step } = Steps

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface TravelRequest {
  origin?: string
  destination?: string
  departure_date?: string
  return_date?: string
  reason?: string
  products?: string[]
}

const AIChat: React.FC = () => {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '您好！我是AI智能差旅助手。请输入"我要出差"开始，或者直接告诉我您的差旅需求。',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [collectingInfo, setCollectingInfo] = useState(false)
  const [travelInfo, setTravelInfo] = useState<TravelRequest>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showRecommendationModal, setShowRecommendationModal] = useState(false)
  const [generatingRecommendation, setGeneratingRecommendation] = useState(false)
  const [recommendationId, setRecommendationId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    // 模拟AI对话处理
    await handleAIResponse(userMessage.content)
    setLoading(false)
  }

  const handleAIResponse = async (userInput: string) => {
    const lowerInput = userInput.toLowerCase()

    // 检测关键词，收集差旅信息
    if (lowerInput.includes('我要出差') || lowerInput.includes('出差') || collectingInfo) {
      setCollectingInfo(true)
      await collectTravelInfo(userInput)
      return
    }

    // 如果已收集完信息，询问是否生成申请单或推荐方案
    if (travelInfo.origin && travelInfo.destination && travelInfo.departure_date) {
      if (lowerInput.includes('申请') || lowerInput.includes('申请单')) {
        await generateTravelRequest()
        return
      }
      if (lowerInput.includes('推荐') || lowerInput.includes('方案')) {
        await generateRecommendation()
        return
      }
    }

    // 默认响应
    const assistantMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: '请告诉我您的差旅需求，比如："我要从北京去上海出差，3月15日出发，3月20日回来，需要预订机票和酒店"。',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, assistantMessage])
  }

  const collectTravelInfo = async (input: string) => {
    const info = { ...travelInfo }

    // 提取出发地
    if (!info.origin) {
      const originMatch = input.match(/从([\u4e00-\u9fa5]+)/)
      if (originMatch) {
        info.origin = originMatch[1]
        setTravelInfo(info)
        setCurrentStep(1)
        addMessage('assistant', `好的，出发地是${info.origin}。请问目的地是哪里？`)
        return
      }
    }

    // 提取目的地
    if (info.origin && !info.destination) {
      const destMatch = input.match(/去([\u4e00-\u9fa5]+)/) || input.match(/到([\u4e00-\u9fa5]+)/)
      if (destMatch) {
        info.destination = destMatch[1]
        setTravelInfo(info)
        setCurrentStep(2)
        addMessage('assistant', `目的地是${info.destination}。请问出发日期是哪一天？（格式：YYYY-MM-DD）`)
        return
      }
    }

    // 提取日期
    if (info.origin && info.destination && !info.departure_date) {
      const dateMatch = input.match(/(\d{4}-\d{2}-\d{2})/)
      if (dateMatch) {
        info.departure_date = dateMatch[1]
        setTravelInfo(info)
        setCurrentStep(3)
        addMessage('assistant', `出发日期是${info.departure_date}。请问回程日期是哪一天？`)
        return
      }
    }

    if (info.origin && info.destination && info.departure_date && !info.return_date) {
      const dateMatch = input.match(/(\d{4}-\d{2}-\d{2})/)
      if (dateMatch) {
        info.return_date = dateMatch[1]
        setTravelInfo(info)
        setCurrentStep(4)
        addMessage('assistant', `回程日期是${info.return_date}。请告诉我出差原因。`)
        return
      }
    }

    if (
      info.origin &&
      info.destination &&
      info.departure_date &&
      info.return_date &&
      !info.reason
    ) {
      info.reason = input
      if (!info.products) {
        info.products = []
        if (input.includes('机票') || input.includes('飞机')) {
          info.products.push('flight')
        }
        if (input.includes('酒店')) {
          info.products.push('hotel')
        }
        if (input.includes('火车') || input.includes('高铁')) {
          info.products.push('train')
        }
        if (input.includes('用车') || input.includes('汽车')) {
          info.products.push('car')
        }
        if (info.products.length === 0) {
          info.products = ['flight', 'hotel'] // 默认
        }
      }
      setTravelInfo(info)
      setCurrentStep(5)
      setCollectingInfo(false)
      addMessage(
        'assistant',
        `好的，我已经收集到您的差旅信息。您可以：\n1. 输入"生成申请单"来创建出差申请\n2. 输入"生成推荐方案"来直接生成AI推荐方案`
      )
      return
    }

    addMessage('assistant', '请继续提供信息。')
  }

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, message])
  }

  const generateTravelRequest = async () => {
    if (!travelInfo.origin || !travelInfo.destination || !travelInfo.departure_date) {
      addMessage('assistant', '信息不完整，请先完成差旅信息收集。')
      return
    }

    setShowConfirmModal(true)
  }

  const confirmGenerateRequest = async () => {
    setShowConfirmModal(false)
    setLoading(true)
    addMessage('assistant', '正在生成出差申请单...')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        message.error('请先登录')
        return
      }

      // 获取用户信息
      const { data: userData } = await supabase
        .from('users')
        .select('company_id, department_id, cost_center_id')
        .eq('id', user.id)
        .single()

      if (!userData) {
        message.error('获取用户信息失败')
        return
      }

      // 生成申请单号（BTRQ+AI+...）
      const { data: requestNo, error: noError } = await supabase.rpc(
        'generate_travel_request_no',
        { source_type: 'AI' }
      )

      if (noError || !requestNo) {
        message.error('生成申请单号失败')
        return
      }

      // 创建申请单
      const { data: request, error } = await supabase
        .from('travel_requests')
        .insert({
          request_no: requestNo,
          user_id: user.id,
          company_id: userData.company_id,
          department_id: userData.department_id,
          cost_center_id: userData.cost_center_id,
          origin: travelInfo.origin,
          destination: travelInfo.destination,
          departure_date: travelInfo.departure_date,
          return_date: travelInfo.return_date || travelInfo.departure_date,
          reason: travelInfo.reason || 'AI对话生成',
          products: travelInfo.products || ['flight', 'hotel'],
          status: 'pending',
          source: 'ai_chat',
        })
        .select()
        .single()

      if (error) {
        message.error('生成申请单失败：' + error.message)
        return
      }

      addMessage('assistant', `出差申请单已生成！申请单号：${requestNo}\n您可以查看申请单详情或等待审批后使用AI推荐功能。`)
      message.success('申请单已生成！')
      
      setTimeout(() => {
        navigate(`/travel-request/${request.id}`)
      }, 2000)
    } catch (error: any) {
      message.error('生成失败：' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const generateRecommendation = async () => {
    if (!travelInfo.origin || !travelInfo.destination || !travelInfo.departure_date) {
      addMessage('assistant', '信息不完整，请先完成差旅信息收集。')
      return
    }

    setShowRecommendationModal(true)
  }

  const confirmGenerateRecommendation = async () => {
    setShowRecommendationModal(false)
    setGeneratingRecommendation(true)
    addMessage('assistant', '正在生成AI推荐方案，请稍候...')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        message.error('请先登录')
        return
      }

      // 生成推荐单号（AIRD+AIC+...）
      const { data: recommendationNo, error: noError } = await supabase.rpc(
        'generate_recommendation_no',
        { source_type: 'AIC' }
      )

      if (noError || !recommendationNo) {
        message.error('生成推荐单号失败')
        return
      }

      // 创建推荐方案
      const { data: recommendation, error } = await supabase
        .from('ai_recommendations')
        .insert({
          recommendation_no: recommendationNo,
          user_id: user.id,
          source: 'ai_chat',
          source_type: 'chat',
          origin: travelInfo.origin!,
          destination: travelInfo.destination!,
          departure_date: travelInfo.departure_date!,
          return_date: travelInfo.return_date || travelInfo.departure_date!,
          products: travelInfo.products || ['flight', 'hotel'],
          status: 'generating',
          generated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        message.error('生成推荐方案失败：' + error.message)
        return
      }

      // 生成Mock推荐详情
      await createMockRecommendationDetails(recommendation.id)

      // 更新状态
      await supabase
        .from('ai_recommendations')
        .update({ status: 'generated' })
        .eq('id', recommendation.id)

      setRecommendationId(recommendation.id)
      addMessage('assistant', `AI推荐方案已生成！推荐单号：${recommendationNo}\n正在跳转到推荐方案列表...`)
      message.success('推荐方案已生成！')

      setTimeout(() => {
        navigate(`/ai-recommendation/${recommendation.id}/list`)
      }, 2000)
    } catch (error: any) {
      message.error('生成失败：' + error.message)
    } finally {
      setGeneratingRecommendation(false)
    }
  }

  const createMockRecommendationDetails = async (recommendationId: string) => {
    const mockOptions: any[] = [
      {
        option_index: 1,
        product_type: 'flight',
        keywords: ['直飞优先', '最短时间'],
        reason: '该方案提供直飞航班，飞行时间最短，适合商务出行。',
        price: 1200,
        score: 95.5,
        product_data: {
          flight_no: 'CA1234',
          airline: '中国国际航空',
          departure_time: '08:00',
          arrival_time: '10:30',
          cabin_class: '经济舱',
        },
        policy_compliance: true,
        currency: 'CNY',
      },
      {
        option_index: 2,
        product_type: 'flight',
        keywords: ['最低价格', '经济舱'],
        reason: '该方案价格最优，性价比高，符合差旅预算要求。',
        price: 980,
        score: 88.2,
        product_data: {
          flight_no: 'MU5678',
          airline: '中国东方航空',
          departure_time: '14:00',
          arrival_time: '16:30',
          cabin_class: '经济舱',
        },
        policy_compliance: true,
        currency: 'CNY',
      },
    ]

    if (travelInfo.products?.includes('hotel')) {
      mockOptions.push({
        option_index: 3,
        product_type: 'hotel',
        keywords: ['五星级酒店', '市中心位置'],
        reason: '该酒店位于市中心，交通便利，设施完善。',
        price: 800,
        score: 90.0,
        product_data: {
          name: '上海外滩华尔道夫酒店',
          star_rating: 5,
          location: '市中心',
          facilities: ['免费WiFi', '健身房', '商务中心'],
        },
        policy_compliance: true,
        currency: 'CNY',
      })
    }

    await supabase
      .from('recommendation_details')
      .insert(
        mockOptions.map((option) => ({
          ai_recommendation_id: recommendationId,
          ...option,
        }))
      )
  }

  return (
    <div className="ai-chat">
      <Card
        title={
          <Space>
            <RobotOutlined style={{ fontSize: 20, color: '#1890ff' }} />
            <span>AI智能对话预订</span>
          </Space>
        }
        extra={
          <Button
            icon={<FileTextOutlined />}
            onClick={() => navigate('/travel-request/new')}
          >
            提交申请
          </Button>
        }
      >
        <div className="chat-container">
          <div className="messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${msg.role === 'user' ? 'user-message' : 'assistant-message'}`}
              >
                <Avatar
                  icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                  style={{
                    backgroundColor: msg.role === 'user' ? '#1890ff' : '#52c41a',
                  }}
                />
                <div className="message-content">
                  <div className="message-text">{msg.content}</div>
                  <div className="message-time">
                    {msg.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="message assistant-message">
                <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#52c41a' }} />
                <div className="message-content">
                  <Spin size="small" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPressEnter={(e) => {
                if (e.shiftKey) return
                e.preventDefault()
                handleSend()
              }}
              placeholder="输入消息，按Enter发送，Shift+Enter换行..."
              rows={3}
              disabled={loading}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              loading={loading}
              disabled={!input.trim()}
              style={{ marginTop: 8 }}
            >
              发送
            </Button>
          </div>
        </div>

        {collectingInfo && (
          <div style={{ marginTop: 24 }}>
            <Steps current={currentStep} size="small">
              <Step title="出发地" />
              <Step title="目的地" />
              <Step title="出发日期" />
              <Step title="回程日期" />
              <Step title="出差原因" />
              <Step title="完成" />
            </Steps>
          </div>
        )}
      </Card>

      {/* 确认生成申请单弹窗 */}
      <Modal
        title="确认生成出差申请单"
        open={showConfirmModal}
        onOk={confirmGenerateRequest}
        onCancel={() => setShowConfirmModal(false)}
        okText="确认生成"
        cancelText="取消"
      >
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="出发地">{travelInfo.origin}</Descriptions.Item>
          <Descriptions.Item label="目的地">{travelInfo.destination}</Descriptions.Item>
          <Descriptions.Item label="出发日期">{travelInfo.departure_date}</Descriptions.Item>
          <Descriptions.Item label="回程日期">{travelInfo.return_date || '未填写'}</Descriptions.Item>
          <Descriptions.Item label="出差原因">{travelInfo.reason || '未填写'}</Descriptions.Item>
          <Descriptions.Item label="需要预订的产品">
            <Space>
              {travelInfo.products?.map((p) => (
                <Tag key={p}>
                  {p === 'flight' ? '机票' :
                   p === 'hotel' ? '酒店' :
                   p === 'train' ? '火车票' : '用车'}
                </Tag>
              ))}
            </Space>
          </Descriptions.Item>
        </Descriptions>
        <div style={{ marginTop: 16, color: '#666' }}>
          申请单号格式：BTRQ+AI+年月日时分秒+四位顺序号
        </div>
      </Modal>

      {/* 确认生成推荐方案弹窗 */}
      <Modal
        title="确认生成AI推荐方案"
        open={showRecommendationModal}
        onOk={confirmGenerateRecommendation}
        onCancel={() => setShowRecommendationModal(false)}
        okText="确认生成"
        cancelText="取消"
        confirmLoading={generatingRecommendation}
      >
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="出发地">{travelInfo.origin}</Descriptions.Item>
          <Descriptions.Item label="目的地">{travelInfo.destination}</Descriptions.Item>
          <Descriptions.Item label="出发日期">{travelInfo.departure_date}</Descriptions.Item>
          <Descriptions.Item label="回程日期">{travelInfo.return_date || '未填写'}</Descriptions.Item>
          <Descriptions.Item label="需要预订的产品">
            <Space>
              {travelInfo.products?.map((p) => (
                <Tag key={p}>
                  {p === 'flight' ? '机票' :
                   p === 'hotel' ? '酒店' :
                   p === 'train' ? '火车票' : '用车'}
                </Tag>
              ))}
            </Space>
          </Descriptions.Item>
        </Descriptions>
        <div style={{ marginTop: 16, color: '#666' }}>
          推荐单号格式：AIRD+AIC+年月日时分秒+五位顺序号
        </div>
      </Modal>
    </div>
  )
}

export default AIChat

