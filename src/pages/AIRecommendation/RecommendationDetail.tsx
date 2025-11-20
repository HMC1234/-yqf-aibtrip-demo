// AI推荐方案详情页面
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Descriptions,
  Tag,
  Button,
  Space,
  Spin,
  message,
  Modal,
} from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { supabase } from '../../lib/supabase'
import { RecommendationOption } from '../../types'
import './RecommendationDetail.css'

const RecommendationDetail: React.FC = () => {
  const { recommendationId, optionIndex } = useParams<{
    recommendationId: string
    optionIndex: string
  }>()
  const navigate = useNavigate()
  const [recommendation, setRecommendation] = useState<any>(null)
  const [option, setOption] = useState<RecommendationOption | null>(null)
  const [loading, setLoading] = useState(true)
  const [travelRequestId, setTravelRequestId] = useState<string | null>(null)
  const [regenerating, setRegenerating] = useState(false)

  useEffect(() => {
    if (recommendationId && optionIndex) {
      loadData()
    }
  }, [recommendationId, optionIndex])

  const getProductTypeName = (type: string) => {
    const map: Record<string, string> = {
      flight: '机票',
      hotel: '酒店',
      train: '火车票',
      car: '用车',
    }
    return map[type] || type
  }

  const handleRegenerateRecommendation = async () => {
    if (!recommendation) return

    Modal.confirm({
      title: '确认重新推荐',
      content: '将基于当前推荐方案的参数重新生成推荐方案，是否继续？',
      onOk: async () => {
        setRegenerating(true)
        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) {
            message.error('请先登录')
            return
          }

          // 生成新的推荐单号（AIRD+GXH+...或AIRD+GXC+...）
          const sourceType = recommendation.source === 'travel_request' ? 'GXH' : 'GXC'
          const { data: recommendationNo, error: noError } = await supabase.rpc(
            'generate_recommendation_no',
            { source_type: sourceType }
          )

          if (noError || !recommendationNo) {
            message.error('生成推荐单号失败')
            return
          }

          // 创建新的推荐方案
          const { data: newRecommendation, error } = await supabase
            .from('ai_recommendations')
            .insert({
              recommendation_no: recommendationNo,
              user_id: user.id,
              travel_request_id: recommendation.travel_request_id || null,
              source: recommendation.source,
              source_type: recommendation.source === 'travel_request' ? 'regenerate' : 'chat_regenerate',
              origin: recommendation.origin,
              destination: recommendation.destination,
              departure_date: recommendation.departure_date,
              return_date: recommendation.return_date,
              products: recommendation.products,
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
          await createMockRecommendationDetails(newRecommendation.id, recommendation)

          // 更新状态
          await supabase
            .from('ai_recommendations')
            .update({ status: 'generated' })
            .eq('id', newRecommendation.id)

          message.success('重新推荐方案已生成！')
          navigate(`/ai-recommendation/${newRecommendation.id}/list`)
        } catch (error: any) {
          message.error('重新推荐失败：' + error.message)
        } finally {
          setRegenerating(false)
        }
      },
    })
  }

  const createMockRecommendationDetails = async (recommendationId: string, originalRec: any) => {
    const mockOptions: any[] = [
      {
        option_index: 1,
        product_type: 'flight',
        keywords: ['直飞优先', '最短时间'],
        reason: '重新推荐的方案：该方案提供直飞航班，飞行时间最短，适合商务出行。',
        price: 1180,
        score: 94.5,
        product_data: {
          flight_no: 'CA1235',
          airline: '中国国际航空',
          departure_time: '08:30',
          arrival_time: '10:50',
          cabin_class: '经济舱',
        },
        policy_compliance: true,
        currency: 'CNY',
      },
      {
        option_index: 2,
        product_type: 'flight',
        keywords: ['最低价格', '经济舱'],
        reason: '重新推荐的方案：该方案价格最优，性价比高，符合差旅预算要求。',
        price: 960,
        score: 87.8,
        product_data: {
          flight_no: 'MU5679',
          airline: '中国东方航空',
          departure_time: '14:30',
          arrival_time: '17:00',
          cabin_class: '经济舱',
        },
        policy_compliance: true,
        currency: 'CNY',
      },
    ]

    if (originalRec.products?.includes('hotel')) {
      mockOptions.push({
        option_index: 3,
        product_type: 'hotel',
        keywords: ['五星级酒店', '市中心位置'],
        reason: '重新推荐的方案：该酒店位于市中心，交通便利，设施完善。',
        price: 750,
        score: 89.5,
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

  const handleOneClickBooking = () => {
    if (!option || !recommendation) return

    navigate('/booking/confirm', {
      state: {
        product: {
          id: `ai-${recommendationId}-${option.option_index}`,
          product_type: option.product_type,
          name: `${getProductTypeName(option.product_type)} - 方案${option.option_index}`,
          description: option.reason,
          price: option.price,
          currency: 'CNY',
          details: option.product_data,
        },
        searchParams: {
          origin: recommendation.origin,
          destination: recommendation.destination,
          departure_date: recommendation.departure_date,
          return_date: recommendation.return_date,
          passenger_count: 1,
        },
        productType: option.product_type,
        aiRecommendationId: recommendationId,
        searchRecord: null,
      },
    })
  }

  const loadData = async () => {
    if (!recommendationId || !optionIndex) {
      return
    }

    try {
      // 加载推荐方案
      const { data: recData } = await supabase
        .from('ai_recommendations')
        .select('*')
        .eq('id', recommendationId)
        .single()

      setRecommendation(recData)
      
      // 保存travel_request_id用于返回
      if (recData?.travel_request_id) {
        setTravelRequestId(recData.travel_request_id)
      }

      // 加载推荐方案详情
      const optionIndexNum = parseInt(optionIndex)
      if (isNaN(optionIndexNum)) {
        message.error('无效的方案序号')
        return
      }

      const { data: optionData } = await supabase
        .from('recommendation_details')
        .select('*')
        .eq('ai_recommendation_id', recommendationId)
        .eq('option_index', optionIndexNum)
        .single()

      setOption(optionData as any)
    } catch (error: any) {
      message.error('加载失败：' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Spin size="large" style={{ display: 'block', textAlign: 'center', marginTop: 100 }} />
  }

  if (!option || !recommendation) {
    return <div>数据不存在</div>
  }

  return (
    <div className="recommendation-detail">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => {
          if (travelRequestId) {
            navigate(`/travel-request/${travelRequestId}`)
          } else {
            navigate('/travel-request/list')
          }
        }}
        style={{ marginBottom: 16 }}
      >
        返回
      </Button>

      <Card
        title={
          <div>
            <span>推荐方案详情 - 方案 {option.option_index}</span>
            <span style={{ marginLeft: 16, fontFamily: 'monospace', color: '#666', fontSize: 14 }}>
              {recommendation.recommendation_no}
            </span>
          </div>
        }
      >
        <Descriptions column={2} bordered style={{ marginBottom: 24 }}>
          <Descriptions.Item label="推荐单号">
            <span style={{ fontFamily: 'monospace' }}>{recommendation.recommendation_no}</span>
          </Descriptions.Item>
          <Descriptions.Item label="方案序号">
            方案 {option.option_index}
          </Descriptions.Item>
          <Descriptions.Item label="产品类型">
            {option.product_type === 'flight' ? '机票' :
             option.product_type === 'hotel' ? '酒店' :
             option.product_type === 'train' ? '火车票' : '用车'}
          </Descriptions.Item>
          <Descriptions.Item label="价格">
            <span style={{ fontSize: 20, fontWeight: 'bold', color: '#1890ff' }}>
              ¥{option.price?.toLocaleString()}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="推荐评分">
            {option.score} 分
          </Descriptions.Item>
          <Descriptions.Item label="政策符合度">
            {option.policy_compliance ? (
              <Tag color="green">符合</Tag>
            ) : (
              <Tag color="red">不符合</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="核心关键字" span={2}>
            <Space>
              {option.keywords?.map((keyword, idx) => (
                <Tag key={idx} color="green">{keyword}</Tag>
              ))}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="推荐原因" span={2}>
            {option.reason}
          </Descriptions.Item>
        </Descriptions>

        <Card title="产品详情" style={{ marginTop: 24 }}>
          <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 4 }}>
            {JSON.stringify(option.product_data, null, 2)}
          </pre>
        </Card>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Space size="large">
            <Button
              type="default"
              size="large"
              onClick={handleRegenerateRecommendation}
              loading={regenerating}
            >
              重新推荐
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={handleOneClickBooking}
            >
              一键预订
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  )
}

export default RecommendationDetail

