// 订单列表页面（支持移动端卡片布局）
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Tag, Space, Card, Tabs, message, Empty, Spin } from 'antd'
import { EyeOutlined, ShoppingOutlined, CalendarOutlined, EnvironmentOutlined, DollarOutlined } from '@ant-design/icons'
import type { TabsProps } from 'antd'
import { supabase } from '../../lib/supabase'
import './OrderList.css'

interface Order {
  id: string
  order_no: string
  product_type: string
  product_details: any // JSONB字段
  origin: string
  destination: string
  departure_date: string
  return_date?: string
  total_amount: number
  currency: string
  status: string
  booking_source: string
  created_at: string
}

const OrderList: React.FC = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    loadOrders()
  }, [activeTab])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      let query = supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (activeTab !== 'all') {
        query = query.eq('status', activeTab)
      }

      const { data, error } = await query

      if (error) {
        message.error('加载失败：' + error.message)
      } else {
        setOrders(data || [])
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

  const columns = [
    {
      title: '订单号',
      dataIndex: 'order_no',
      key: 'order_no',
      render: (text: string) => (
        <span style={{ fontFamily: 'monospace' }}>{text}</span>
      ),
    },
    {
      title: '产品类型',
      dataIndex: 'product_type',
      key: 'product_type',
      render: (type: string) => getProductTypeName(type),
    },
    {
      title: '产品名称',
      key: 'product_name',
      render: (_: any, record: Order) => {
        // 从product_details JSONB字段中获取产品名称
        const productName = record.product_details?.name || '-'
        return <span>{productName}</span>
      },
    },
    {
      title: '行程',
      key: 'route',
      render: (_: any, record: Order) => (
        <span>
          {record.origin} → {record.destination}
        </span>
      ),
    },
    {
      title: '出发日期',
      dataIndex: 'departure_date',
      key: 'departure_date',
      render: (text: string) => text ? new Date(text).toLocaleDateString() : '-',
    },
    {
      title: '订单金额',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (amount: number, record: Order) => (
        <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
          ¥{amount.toLocaleString()}
        </span>
      ),
    },
    {
      title: '预订来源',
      dataIndex: 'booking_source',
      key: 'booking_source',
      render: (source: string) => (
        <Tag color={source === 'ai_recommendation' ? 'purple' : 'blue'}>
          {source === 'ai_recommendation' ? 'AI推荐' : '经典预订'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Order) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/booking/orders/${record.id}`)}
        >
          查看详情
        </Button>
      ),
    },
  ]

  const tabItems: TabsProps['items'] = [
    { key: 'all', label: '全部订单' },
    { key: 'pending', label: '待支付' },
    { key: 'paid', label: '已支付' },
    { key: 'confirmed', label: '已确认' },
    { key: 'completed', label: '已完成' },
  ]

  return (
    <div className="order-list">
      <Card
        title={<><ShoppingOutlined /> 我的订单</>}
        extra={
          <Button
            type="primary"
            onClick={() => navigate('/booking/classic')}
            className="navan-desktop-only"
          >
            新建预订
          </Button>
        }
      >
        <Tabs
          activeKey={activeTab}
          items={tabItems}
          onChange={setActiveTab}
        />
        
        {/* 移动端卡片列表 */}
        <div className="mobile-cards-list">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin size="large" />
            </div>
          ) : orders.length === 0 ? (
            <Empty description="暂无订单记录" style={{ padding: '40px 0' }} />
          ) : (
            orders.map((order) => {
              const handleCardClick = (e: React.MouseEvent) => {
                e.preventDefault()
                e.stopPropagation()
                navigate(`/booking/orders/${order.id}`)
              }
              
              return (
              <Card
                key={order.id}
                className="mobile-record-card"
                onClick={handleCardClick}
              >
                <div className="mobile-card-header">
                  <div className="mobile-card-title-row">
                    <span className="mobile-card-id">{order.order_no}</span>
                    {getStatusTag(order.status)}
                  </div>
                </div>
                
                <div className="mobile-card-content">
                  <div className="mobile-card-info-row">
                    <ShoppingOutlined className="mobile-card-icon" />
                    <span className="mobile-card-label">产品：</span>
                    <span className="mobile-card-value">
                      {getProductTypeName(order.product_type)} - {order.product_details?.name || '-'}
                    </span>
                  </div>
                  
                  <div className="mobile-card-info-row">
                    <EnvironmentOutlined className="mobile-card-icon" />
                    <span className="mobile-card-label">行程：</span>
                    <span className="mobile-card-value">
                      {order.origin} → {order.destination}
                    </span>
                  </div>
                  
                  {order.departure_date && (
                    <div className="mobile-card-info-row">
                      <CalendarOutlined className="mobile-card-icon" />
                      <span className="mobile-card-label">出发：</span>
                      <span className="mobile-card-value">
                        {new Date(order.departure_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  <div className="mobile-card-info-row mobile-card-highlight">
                    <DollarOutlined className="mobile-card-icon" style={{ color: '#1890ff' }} />
                    <span className="mobile-card-label">金额：</span>
                    <span className="mobile-card-value" style={{ color: '#1890ff', fontWeight: 'bold', fontSize: '16px' }}>
                      ¥{order.total_amount.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="mobile-card-info-row">
                    <span className="mobile-card-label">来源：</span>
                    <Tag color={order.booking_source === 'ai_recommendation' ? 'purple' : 'blue'}>
                      {order.booking_source === 'ai_recommendation' ? 'AI推荐' : '经典预订'}
                    </Tag>
                  </div>
                </div>
                
                <div className="mobile-card-footer">
                  <Button
                    type="primary"
                    block
                    icon={<EyeOutlined />}
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/booking/orders/${order.id}`)
                    }}
                  >
                    查看详情
                  </Button>
                </div>
              </Card>
              )
            })
          )}
        </div>

        {/* 桌面端表格 */}
        <div className="desktop-table-wrapper">
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="id"
            loading={loading}
            scroll={{ x: 'max-content' }}
            pagination={{
              pageSize: 10,
              showTotal: (total) => `共 ${total} 条记录`,
              responsive: true,
            }}
          />
        </div>
      </Card>
    </div>
  )
}

export default OrderList





