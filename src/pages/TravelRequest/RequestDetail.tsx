// 出差申请单详情页面
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Descriptions,
  Tag,
  Button,
  Space,
  message,
  Spin,
} from 'antd'
import { RobotOutlined, ShoppingOutlined } from '@ant-design/icons'
import { supabase } from '../../lib/supabase'
import { TravelRequest } from '../../types'
import './RequestDetail.css'

const RequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [request, setRequest] = useState<TravelRequest | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadRequest(id)
    }
  }, [id])

  const loadRequest = async (requestId: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('travel_requests')
        .select('*')
        .eq('id', requestId)
        .single()

      if (error) {
        message.error('加载失败：' + error.message)
      } else {
        setRequest(data)
      }
    } catch (error: any) {
      message.error('加载失败：' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClassicBooking = () => {
    if (request) {
      navigate('/booking/classic', {
        state: {
          origin: request.origin,
          destination: request.destination,
          departure_date: request.departure_date,
          return_date: request.return_date,
          products: request.products,
          travel_request_id: request.id,
        },
      })
    }
  }

  const handleAIBooking = () => {
    if (request) {
      navigate(`/ai-recommendation/generate/${request.id}`)
    }
  }

  if (loading) {
    return <Spin size="large" style={{ display: 'block', textAlign: 'center', marginTop: 100 }} />
  }

  if (!request) {
    return <div>申请单不存在</div>
  }

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      pending: { color: 'orange', text: '待审批' },
      approving: { color: 'blue', text: '审批中' },
      approved: { color: 'green', text: '已审批' },
      rejected: { color: 'red', text: '已拒绝' },
    }
    const statusInfo = statusMap[status] || { color: 'default', text: status }
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
  }

  return (
    <div className="request-detail">
      <Card
        title={`申请单详情 - ${request.request_no}`}
        extra={getStatusTag(request.status)}
      >
        <Descriptions column={2} bordered>
          <Descriptions.Item label="申请单号">
            <span style={{ fontFamily: 'monospace' }}>{request.request_no}</span>
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            {getStatusTag(request.status)}
          </Descriptions.Item>
          <Descriptions.Item label="出发地">{request.origin}</Descriptions.Item>
          <Descriptions.Item label="目的地">{request.destination}</Descriptions.Item>
          <Descriptions.Item label="出发日期">
            {new Date(request.departure_date).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label="回程日期">
            {new Date(request.return_date).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label="需要预订的产品" span={2}>
            <Space>
              {request.products.map((p) => (
                <Tag key={p} color="blue">
                  {p === 'flight' ? '机票' :
                   p === 'hotel' ? '酒店' :
                   p === 'train' ? '火车票' : '用车'}
                </Tag>
              ))}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="出差原因" span={2}>
            {request.reason}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {new Date(request.created_at).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>

        {request.status === 'approved' && (
          <div className="booking-actions" style={{ marginTop: 24, textAlign: 'center' }}>
            <Space size="large">
              <Button
                type="default"
                size="large"
                icon={<ShoppingOutlined />}
                onClick={handleClassicBooking}
              >
                经典预订
              </Button>
              <Button
                type="primary"
                size="large"
                icon={<RobotOutlined />}
                onClick={handleAIBooking}
              >
                AI预订
              </Button>
            </Space>
          </div>
        )}
      </Card>
    </div>
  )
}

export default RequestDetail

