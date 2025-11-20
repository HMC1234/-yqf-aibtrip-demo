// 订单详情页面
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
} from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { supabase } from '../../lib/supabase'
import './OrderDetail.css'

interface Order {
  id: string
  order_no: string
  product_type: string
  product_name: string
  product_data: any
  origin: string
  destination: string
  departure_date: string
  return_date?: string
  passenger_count: number
  total_amount: number
  currency: string
  status: string
  booking_source: string
  contact_name: string
  contact_phone: string
  remarks?: string
  created_at: string
}

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadOrder(id)
    }
  }, [id])

  const loadOrder = async (orderId: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (error) {
        message.error('加载失败：' + error.message)
      } else {
        setOrder(data)
      }
    } catch (error: any) {
      message.error('加载失败：' + error.message)
    } finally {
      setLoading(false)
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
            {order.product_name}
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
          <Descriptions.Item label="人数/房间数">
            {order.passenger_count}
          </Descriptions.Item>
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
          <Descriptions.Item label="联系人">
            {order.contact_name}
          </Descriptions.Item>
          <Descriptions.Item label="联系电话">
            {order.contact_phone}
          </Descriptions.Item>
          {order.remarks && (
            <Descriptions.Item label="备注" span={2}>
              {order.remarks}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="创建时间">
            {new Date(order.created_at).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>

        <Card title="产品详情" style={{ marginTop: 24 }}>
          <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 4 }}>
            {JSON.stringify(order.product_data, null, 2)}
          </pre>
        </Card>
      </Card>
    </div>
  )
}

export default OrderDetail





