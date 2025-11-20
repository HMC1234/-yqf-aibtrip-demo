// 订单详情页面
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Descriptions,
  Tag,
  Button,
  Spin,
  message,
  Select,
  Space,
} from 'antd'
import { ArrowLeftOutlined, LinkOutlined } from '@ant-design/icons'
import { supabase } from '../../lib/supabase'
import { TravelRequest } from '../../types'
import './OrderDetail.css'

interface Order {
  id: string
  order_no: string
  product_type: string
  product_details: any // JSONB字段，包含所有产品信息和联系信息
  origin: string
  destination: string
  departure_date: string
  return_date?: string
  total_amount: number
  currency: string
  status: string
  booking_source: string
  ai_recommendation_id?: string
  travel_request_id?: string
  created_at: string
}

interface OrderSource {
  type: 'ai_recommendation' | 'classic'
  recommendationNo?: string
  travelRequestNo?: string
  searchRecordId?: string
}

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [orderSource, setOrderSource] = useState<OrderSource | null>(null)
  const [loading, setLoading] = useState(true)
  const [travelRequests, setTravelRequests] = useState<TravelRequest[]>([])
  const [selectedRequestId, setSelectedRequestId] = useState<string | undefined>(undefined)
  const [linking, setLinking] = useState(false)

  useEffect(() => {
    if (id) {
      loadOrder(id)
    }
  }, [id])

  const loadOrder = async (orderId: string) => {
    setLoading(true)
    try {
      // 加载订单信息
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (orderError) {
        message.error('加载订单失败：' + orderError.message)
        return
      }

      if (!orderData) {
        message.error('订单不存在')
        return
      }

      setOrder(orderData)

      // 根据订单来源加载相关信息
      const source: OrderSource = {
        type: orderData.booking_source === 'ai_recommendation' ? 'ai_recommendation' : 'classic',
      }

      // 如果订单来自AI推荐
      if (orderData.booking_source === 'ai_recommendation' && orderData.ai_recommendation_id) {
        // 查询AI推荐信息
        const { data: recommendationData, error: recError } = await supabase
          .from('ai_recommendations')
          .select('recommendation_no, travel_request_id')
          .eq('id', orderData.ai_recommendation_id)
          .single()

        if (!recError && recommendationData) {
          source.recommendationNo = recommendationData.recommendation_no

          // 如果AI推荐关联了出差申请单，查询申请单号
          if (recommendationData.travel_request_id) {
            const { data: requestData, error: requestError } = await supabase
              .from('travel_requests')
              .select('request_no')
              .eq('id', recommendationData.travel_request_id)
              .single()

            if (!requestError && requestData) {
              source.travelRequestNo = requestData.request_no
            }
          }
        }
      }

      // 如果订单来自经典搜索
      if (orderData.booking_source === 'classic') {
        // 查询搜索记录
        const { data: searchRecordData, error: searchError } = await supabase
          .from('search_records')
          .select('id')
          .eq('order_id', orderId)
          .single()

        if (!searchError && searchRecordData) {
          // 使用搜索记录ID的前8位作为显示（更友好）
          source.searchRecordId = searchRecordData.id.substring(0, 8).toUpperCase()
        }
      }

      setOrderSource(source)

      // 如果是经典预订，加载用户的申请单列表（用于关联）
      if (orderData.booking_source === 'classic') {
        loadTravelRequests()
        
        // 如果已经有关联申请单，也需要查询申请单号用于显示
        if (orderData.travel_request_id) {
          const { data: requestData } = await supabase
            .from('travel_requests')
            .select('request_no')
            .eq('id', orderData.travel_request_id)
            .single()
          
          if (requestData) {
            source.travelRequestNo = requestData.request_no
          }
        }
      }
    } catch (error: any) {
      message.error('加载失败：' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const loadTravelRequests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('travel_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('加载出差申请单失败:', error)
      } else {
        setTravelRequests((data as TravelRequest[]) || [])
      }
    } catch (error) {
      console.error('加载出差申请单失败:', error)
    }
  }

  const handleLinkTravelRequest = async () => {
    if (!selectedRequestId) {
      message.warning('请选择一个出差申请单')
      return
    }

    if (!order) return

    setLinking(true)
    try {
      const { error } = await supabase
        .from('orders')
        .update({ travel_request_id: selectedRequestId })
        .eq('id', order.id)

      if (error) {
        message.error('关联失败：' + error.message)
        return
      }

      message.success('关联成功！')
      
      // 重新加载订单信息
      await loadOrder(order.id)
      
      // 清空选择
      setSelectedRequestId(undefined)
    } catch (error: any) {
      message.error('关联失败：' + error.message)
    } finally {
      setLinking(false)
    }
  }

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      pending: { color: 'orange', text: '待支付' },
      paid: { color: 'blue', text: '已支付' },
      confirmed: { color: 'green', text: '已确认' },
      cancelled: { color: 'red', text: '已取消' },
      completed: { color: 'green', text: '已完成' },
    }
    const statusInfo = statusMap[status] || { color: 'default', text: status }
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
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

  if (!order) {
    return <div>订单不存在</div>
  }

  return (
    <div className="order-detail">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/booking/orders')}
        style={{ marginBottom: 16 }}
      >
        返回
      </Button>

      <Card
        title={`订单详情 - ${order.order_no}`}
        extra={getStatusTag(order.status)}
      >
        <Descriptions column={2} bordered>
          <Descriptions.Item label="订单号">
            <span style={{ fontFamily: 'monospace' }}>{order.order_no}</span>
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            {getStatusTag(order.status)}
          </Descriptions.Item>
          <Descriptions.Item label="产品类型">
            {getProductTypeName(order.product_type)}
          </Descriptions.Item>
          <Descriptions.Item label="产品名称">
            {order.product_details?.name || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="出发地">
            {order.origin}
          </Descriptions.Item>
          <Descriptions.Item label="目的地">
            {order.destination}
          </Descriptions.Item>
          <Descriptions.Item label="出发日期">
            {new Date(order.departure_date).toLocaleDateString()}
          </Descriptions.Item>
          {order.return_date && (
            <Descriptions.Item label="回程日期">
              {new Date(order.return_date).toLocaleDateString()}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="订单金额">
            <span style={{ fontSize: 20, fontWeight: 'bold', color: '#1890ff' }}>
              ¥{order.total_amount.toLocaleString()}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="预订来源">
            <Tag color={order.booking_source === 'ai_recommendation' ? 'purple' : 'blue'}>
              {order.booking_source === 'ai_recommendation' ? 'AI推荐' : '经典预订'}
            </Tag>
          </Descriptions.Item>
          {orderSource && (
            <>
              {orderSource.type === 'ai_recommendation' && orderSource.recommendationNo && (
                <>
                  <Descriptions.Item label="AI智能推荐号">
                    <span style={{ fontFamily: 'monospace' }}>
                      {orderSource.recommendationNo}
                    </span>
                  </Descriptions.Item>
                  {orderSource.travelRequestNo && (
                    <Descriptions.Item label="来源出差申请单号">
                      <Button
                        type="link"
                        style={{ padding: 0, height: 'auto', fontFamily: 'monospace' }}
                        onClick={() => {
                          // 通过travel_request_id跳转到申请单详情页
                          if (order.travel_request_id) {
                            navigate(`/travel-request/${order.travel_request_id}`)
                          } else {
                            // 如果没有直接的travel_request_id，通过AI推荐查询
                            if (order.ai_recommendation_id) {
                              supabase
                                .from('ai_recommendations')
                                .select('travel_request_id')
                                .eq('id', order.ai_recommendation_id)
                                .single()
                                .then(({ data, error }) => {
                                  if (!error && data?.travel_request_id) {
                                    navigate(`/travel-request/${data.travel_request_id}`)
                                  }
                                })
                            }
                          }
                        }}
                      >
                        {orderSource.travelRequestNo}
                      </Button>
                    </Descriptions.Item>
                  )}
                </>
              )}
              {orderSource.type === 'classic' && orderSource.searchRecordId && (
                <Descriptions.Item label="搜索记录号">
                  <span style={{ fontFamily: 'monospace' }}>
                    SR-{orderSource.searchRecordId}
                  </span>
                </Descriptions.Item>
              )}
              {orderSource.type === 'classic' && !order.travel_request_id && (
                <Descriptions.Item label="关联出差申请单" span={2}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Select
                      placeholder="选择要关联的出差申请单（可选）"
                      style={{ width: '100%', maxWidth: 500 }}
                      showSearch
                      value={selectedRequestId}
                      onChange={setSelectedRequestId}
                      optionFilterProp="label"
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={travelRequests.map(req => ({
                        value: req.id,
                        label: `${req.request_no} - ${req.origin} → ${req.destination} (${new Date(req.departure_date).toLocaleDateString()})`,
                      }))}
                      notFoundContent={travelRequests.length === 0 ? '暂无可关联的出差申请单' : undefined}
                    />
                    {selectedRequestId && (
                      <Button
                        type="primary"
                        icon={<LinkOutlined />}
                        onClick={handleLinkTravelRequest}
                        loading={linking}
                      >
                        确认关联
                      </Button>
                    )}
                  </Space>
                </Descriptions.Item>
              )}
              {order.travel_request_id && orderSource && orderSource.type === 'classic' && (
                <Descriptions.Item label="关联出差申请单">
                  <Button
                    type="link"
                    style={{ padding: 0, height: 'auto', fontFamily: 'monospace' }}
                    onClick={() => navigate(`/travel-request/${order.travel_request_id}`)}
                  >
                    {(() => {
                      const request = travelRequests.find(r => r.id === order.travel_request_id)
                      return request?.request_no || '加载中...'
                    })()}
                  </Button>
                </Descriptions.Item>
              )}
            </>
          )}
          {order.product_details?.contact_name && (
            <Descriptions.Item label="联系人">
              {order.product_details.contact_name}
            </Descriptions.Item>
          )}
          {order.product_details?.contact_phone && (
            <Descriptions.Item label="联系电话">
              {order.product_details.contact_phone}
            </Descriptions.Item>
          )}
          {order.product_details?.remarks && (
            <Descriptions.Item label="备注" span={2}>
              {order.product_details.remarks}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="创建时间">
            {new Date(order.created_at).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>

        <Card title="产品详情" style={{ marginTop: 24 }}>
          <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 4 }}>
            {JSON.stringify(order.product_details, null, 2)}
          </pre>
        </Card>
      </Card>
    </div>
  )
}

export default OrderDetail





