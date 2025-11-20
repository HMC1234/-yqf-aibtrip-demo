// AI推荐方案列表展示页面
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Row, Col, Button, Tag, Space, Spin, message } from 'antd'
import { CheckCircleOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons'
import { supabase } from '../../lib/supabase'
import { RecommendationOption } from '../../types'
import './RecommendationList.css'

interface RecommendationListProps {
  recommendationId?: string
  requestId?: string
}

const RecommendationList: React.FC<RecommendationListProps> = ({ recommendationId: propRecommendationId }) => {
  const navigate = useNavigate()
  const { recommendationId: routeRecommendationId } = useParams<{ recommendationId: string }>()
  // 优先使用路由参数，如果没有则使用props
  const recommendationId = routeRecommendationId || propRecommendationId
  const [recommendation, setRecommendation] = useState<any>(null)
  const [options, setOptions] = useState<RecommendationOption[]>([])
  const [loading, setLoading] = useState(true)
  const [travelRequest, setTravelRequest] = useState<any>(null)

  useEffect(() => {
    if (recommendationId) {
      loadRecommendation()
    }
  }, [recommendationId])

  const loadRecommendation = async () => {
    if (!recommendationId) return
    try {
      // 加载推荐方案主信息
      const { data: recData, error: recError } = await supabase
        .from('ai_recommendations')
        .select('*')
        .eq('id', recommendationId)
        .single()

      if (recError) {
        message.error('加载失败：' + recError.message)
        return
      }

      setRecommendation(recData)

      // 如果推荐方案来源于出差申请单，加载申请单信息
      if (recData?.travel_request_id) {
        const { data: requestData, error: requestError } = await supabase
          .from('travel_requests')
          .select('id, request_no, origin, destination, departure_date, return_date, status')
          .eq('id', recData.travel_request_id)
          .single()

        if (!requestError && requestData) {
          setTravelRequest(requestData)
        }
      }

      // 加载推荐方案详情
      const { data: detailsData, error: detailsError } = await supabase
        .from('recommendation_details')
        .select('*')
        .eq('ai_recommendation_id', recommendationId)
        .order('option_index', { ascending: true })

      if (detailsError) {
        message.error('加载详情失败：' + detailsError.message)
      } else {
        setOptions(detailsData as any)
      }
    } catch (error: any) {
      message.error('加载失败：' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetail = (option: RecommendationOption) => {
    navigate(`/ai-recommendation/${recommendationId}/option/${option.option_index}`)
  }

  const handleOneClickBooking = (option: RecommendationOption) => {
    // 跳转到订单确认页面，使用AI推荐方案的数据
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
          origin: recommendation?.origin,
          destination: recommendation?.destination,
          departure_date: recommendation?.departure_date,
          return_date: recommendation?.return_date,
          passenger_count: 1,
        },
        productType: option.product_type,
        aiRecommendationId: recommendationId,
        searchRecord: null,
      },
    })
  }

  const getProductTypeName = (type: string) => {
    const map: Record<string, string> = {
      flight: '机票',
      hotel: '酒店',
      train: '火车票',
      car: '用车',
    }
    return map[type] || type
  }

  if (loading) {
    return <Spin size="large" style={{ display: 'block', textAlign: 'center', marginTop: 100 }} />
  }

  return (
    <div className="recommendation-list">
      <Card
        title={
          <div>
            <span>AI智能推荐方案</span>
            <span style={{ marginLeft: 16, fontFamily: 'monospace', color: '#666' }}>
              {recommendation?.recommendation_no}
            </span>
          </div>
        }
      >
        <div className="recommendation-info" style={{ marginBottom: 24 }}>
          {/* 显示来源申请单信息 */}
          {travelRequest && (
            <Card
              size="small"
              style={{ marginBottom: 16, background: '#e6f7ff', borderColor: '#91d5ff' }}
            >
              <Space>
                <FileTextOutlined style={{ color: '#1890ff' }} />
                <span><strong>来源申请单：</strong></span>
                <Button
                  type="link"
                  style={{ padding: 0, height: 'auto', fontFamily: 'monospace' }}
                  onClick={() => navigate(`/travel-request/${travelRequest.id}`)}
                >
                  {travelRequest.request_no}
                </Button>
                <Tag color="blue">出差申请</Tag>
              </Space>
            </Card>
          )}
          
          <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 4 }}>
            <Space>
              <span><strong>行程：</strong>{recommendation?.origin} → {recommendation?.destination}</span>
              <span><strong>出发：</strong>{new Date(recommendation?.departure_date).toLocaleDateString()}</span>
              <span><strong>回程：</strong>{new Date(recommendation?.return_date).toLocaleDateString()}</span>
            </Space>
          </div>
        </div>

        <Row gutter={[16, 16]}>
          {options.map((option) => (
            <Col xs={24} sm={12} lg={8} key={option.option_index}>
              <Card
                className="recommendation-card"
                hoverable
                actions={[
                  <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetail(option)}
                  >
                    查看详情
                  </Button>,
                  <Button
                    type="primary"
                    onClick={() => handleOneClickBooking(option)}
                  >
                    一键预订
                  </Button>,
                ]}
              >
                <div className="card-header">
                  <Tag color="blue" style={{ fontSize: 16, padding: '4px 12px' }}>
                    方案 {option.option_index}
                  </Tag>
                  {option.score && (
                    <span className="score">评分: {option.score}</span>
                  )}
                </div>

                <div className="card-content">
                  <div className="keywords" style={{ marginBottom: 12 }}>
                    {option.keywords?.map((keyword, idx) => (
                      <Tag key={idx} color="green">{keyword}</Tag>
                    ))}
                  </div>

                  <div className="reason" style={{ marginBottom: 12, color: '#666' }}>
                    {option.reason}
                  </div>

                  <div className="price" style={{ fontSize: 20, fontWeight: 'bold', color: '#1890ff' }}>
                    ¥{option.price?.toLocaleString()}
                  </div>

                  {option.policy_compliance && (
                    <div style={{ marginTop: 8 }}>
                      <Tag icon={<CheckCircleOutlined />} color="green">
                        符合差旅政策
                      </Tag>
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  )
}

export default RecommendationList

