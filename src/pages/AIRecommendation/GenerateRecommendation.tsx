// AI推荐方案生成页面（核心功能）
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Steps, Spin, message } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { supabase } from '../../lib/supabase'
import { TravelRequest } from '../../types'
import RecommendationList from './RecommendationList'
import './GenerateRecommendation.css'

const { Step } = Steps

const GenerateRecommendation: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [request, setRequest] = useState<TravelRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(true)
  const [recommendationId, setRecommendationId] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (id) {
      loadRequest(id)
    }
  }, [id])

  useEffect(() => {
    if (request && generating) {
      generateRecommendation()
    }
  }, [request, generating])

  const loadRequest = async (requestId: string) => {
    try {
      const { data, error } = await supabase
        .from('travel_requests')
        .select('*')
        .eq('id', requestId)
        .single()

      if (error) {
        message.error('加载失败：' + error.message)
        navigate('/travel-request/list')
      } else {
        setRequest(data)
        setLoading(false)
      }
    } catch (error: any) {
      message.error('加载失败：' + error.message)
      navigate('/travel-request/list')
    }
  }

  const generateRecommendation = async () => {
    if (!request) return

    // 模拟AI推荐生成过程
    setCurrentStep(0) // 正在获取产品数据
    await sleep(2000)

    setCurrentStep(1) // 正在核查差旅政策
    await sleep(2000)

    setCurrentStep(2) // 正在生成推荐方案
    await sleep(2000)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // 生成推荐单号
      const { data: recommendationNo, error: noError } = await supabase.rpc(
        'generate_recommendation_no',
        { source_type: 'ZDT' }
      )

      if (noError || !recommendationNo) {
        message.error('生成推荐单号失败')
        setGenerating(false)
        return
      }

      // 创建AI推荐方案（使用Mock数据）
      const { data: recommendation, error } = await supabase
        .from('ai_recommendations')
        .insert({
          recommendation_no: recommendationNo,
          user_id: user.id,
          travel_request_id: request.id,
          source: 'travel_request',
          source_type: 'auto',
          origin: request.origin,
          destination: request.destination,
          departure_date: request.departure_date,
          return_date: request.return_date,
          products: request.products,
          status: 'generated',
          generated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        message.error('生成推荐方案失败：' + error.message)
        setGenerating(false)
        return
      }

      // 创建推荐方案详情（Mock数据）
      await createMockRecommendationDetails(recommendation.id, request)

      setRecommendationId(recommendation.id)
      setCurrentStep(3) // 完成
      setGenerating(false)
      message.success('推荐方案生成成功！')
    } catch (error: any) {
      message.error('生成失败：' + error.message)
      setGenerating(false)
    }
  }

  const createMockRecommendationDetails = async (
    recommendationId: string,
    request: TravelRequest
  ) => {
    // 创建3-5个Mock推荐方案
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
      },
      {
        option_index: 3,
        product_type: 'flight',
        keywords: ['商务舱', '舒适型'],
        reason: '该方案提供商务舱服务，舒适度高，适合长途出行。',
        price: 3500,
        score: 92.0,
        product_data: {
          flight_no: 'CZ9012',
          airline: '中国南方航空',
          departure_time: '10:00',
          arrival_time: '12:30',
          cabin_class: '商务舱',
        },
      },
    ]

      // 如果有酒店需求，添加酒店推荐
    if (request.products.includes('hotel')) {
      mockOptions.push({
        option_index: 4,
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
      })
    }

    // 批量插入推荐详情
    const details = mockOptions.map(option => ({
      ai_recommendation_id: recommendationId,
      ...option,
      policy_compliance: true,
      currency: 'CNY',
    }))

    await supabase.from('recommendation_details').insert(details)
  }

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  if (loading) {
    return <Spin size="large" style={{ display: 'block', textAlign: 'center', marginTop: 100 }} />
  }

  if (generating) {
    return (
      <div className="generate-recommendation">
        <Card>
          <div className="generating-content">
            <h2>正在根据您的出差申请，智能生成推荐方案</h2>
            <Steps current={currentStep} style={{ marginTop: 40, marginBottom: 40 }}>
              <Step title="获取产品数据" description="正在获取可用的差旅产品..." />
              <Step title="核查差旅政策" description="正在验证产品合规性..." />
              <Step title="生成推荐方案" description="AI正在分析并生成最优方案..." />
              <Step title="完成" description="推荐方案已生成" />
            </Steps>
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <LoadingOutlined style={{ fontSize: 48, color: '#1890ff' }} spin />
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (recommendationId) {
    return <RecommendationList recommendationId={recommendationId} requestId={id || ''} />
  }

  return null
}

export default GenerateRecommendation

