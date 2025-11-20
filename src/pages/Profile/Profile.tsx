// 个人信息页面
import React, { useEffect, useState } from 'react'
import { Card, Descriptions, Button, Space, Tabs, Table, Tag, message, Spin } from 'antd'
import { UserOutlined, EditOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'
import './Profile.css'

interface TravelRequest {
  id: string
  request_no: string
  origin: string
  destination: string
  departure_date: string
  return_date?: string
  status: string
  created_at: string
}

interface Order {
  id: string
  order_no: string
  product_type: string
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

const Profile: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [userData, setUserData] = useState<any>(null)
  const [travelRequests, setTravelRequests] = useState<TravelRequest[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [requestsLoading, setRequestsLoading] = useState(false)
  const [ordersLoading, setOrdersLoading] = useState(false)

  useEffect(() => {
    loadUserData()
    loadTravelRequests()
    loadOrders()
  }, [])

  const loadUserData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) return

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error) {
        message.error('加载用户信息失败：' + error.message)
      } else {
        setUserData(data)
      }
    } catch (error: any) {
      message.error('加载用户信息失败：' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const loadTravelRequests = async () => {
    setRequestsLoading(true)
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) return

      const { data, error } = await supabase
        .from('travel_requests')
        .select('id, request_no, origin, destination, departure_date, return_date, status, created_at')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) {
        message.error('加载申请记录失败：' + error.message)
      } else {
        setTravelRequests(data || [])
      }
    } catch (error: any) {
      message.error('加载申请记录失败：' + error.message)
    } finally {
      setRequestsLoading(false)
    }
  }

  const loadOrders = async () => {
    setOrdersLoading(true)
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) return

      const { data, error } = await supabase
        .from('orders')
        .select('id, order_no, product_type, origin, destination, departure_date, return_date, total_amount, currency, status, booking_source, created_at')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) {
        message.error('加载订单记录失败：' + error.message)
      } else {
        setOrders(data || [])
      }
    } catch (error: any) {
      message.error('加载订单记录失败：' + error.message)
    } finally {
      setOrdersLoading(false)
    }
  }

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      pending: { color: 'orange', text: '待审批' },
      approved: { color: 'green', text: '已审批' },
      rejected: { color: 'red', text: '已拒绝' },
    }
    const statusInfo = statusMap[status] || { color: 'default', text: status }
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
  }

  const getOrderStatusTag = (status: string) => {
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

  const requestColumns = [
    {
      title: '申请单号',
      dataIndex: 'request_no',
      key: 'request_no',
      render: (text: string) => (
        <span style={{ fontFamily: 'monospace' }}>{text}</span>
      ),
    },
    {
      title: '行程',
      key: 'route',
      render: (_: any, record: TravelRequest) => (
        <span>{record.origin} → {record.destination}</span>
      ),
    },
    {
      title: '出发日期',
      dataIndex: 'departure_date',
      key: 'departure_date',
      render: (text: string) => text ? new Date(text).toLocaleDateString() : '-',
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
      render: (_: any, record: TravelRequest) => (
        <Button
          type="link"
          onClick={() => navigate(`/travel-request/${record.id}`)}
        >
          查看详情
        </Button>
      ),
    },
  ]

  const orderColumns = [
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
      title: '行程',
      key: 'route',
      render: (_: any, record: Order) => (
        <span>{record.origin} → {record.destination}</span>
      ),
    },
    {
      title: '订单金额',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (amount: number) => (
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
      render: (status: string) => getOrderStatusTag(status),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Order) => (
        <Button
          type="link"
          onClick={() => navigate(`/booking/orders/${record.id}`)}
        >
          查看详情
        </Button>
      ),
    },
  ]

  const tabItems = [
    {
      key: 'info',
      label: '个人信息',
      children: (
        <Card>
          <Spin spinning={loading}>
            <Descriptions title="基本信息" bordered column={2}>
              <Descriptions.Item label="姓名">
                {userData?.full_name || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="邮箱">
                {userData?.email || user?.email || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="手机号">
                {userData?.phone || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="职位">
                {userData?.position || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="公司">
                {userData?.company_id ? `公司ID: ${userData.company_id}` : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="部门">
                {userData?.department_id ? `部门ID: ${userData.department_id}` : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="成本中心">
                {userData?.cost_center_id ? `成本中心ID: ${userData.cost_center_id}` : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="注册时间">
                {userData?.created_at ? new Date(userData.created_at).toLocaleString() : '-'}
              </Descriptions.Item>
            </Descriptions>
          </Spin>
        </Card>
      ),
    },
    {
      key: 'requests',
      label: '出差申请',
      children: (
        <Card
          title="最近申请记录"
          extra={
            <Button onClick={() => navigate('/travel-request/list')}>
              查看全部
            </Button>
          }
        >
          <Table
            columns={requestColumns}
            dataSource={travelRequests}
            rowKey="id"
            loading={requestsLoading}
            pagination={false}
          />
        </Card>
      ),
    },
    {
      key: 'orders',
      label: '我的订单',
      children: (
        <Card
          title="最近订单记录"
          extra={
            <Button onClick={() => navigate('/booking/orders')}>
              查看全部
            </Button>
          }
        >
          <Table
            columns={orderColumns}
            dataSource={orders}
            rowKey="id"
            loading={ordersLoading}
            pagination={false}
          />
        </Card>
      ),
    },
  ]

  return (
    <div className="profile">
      <Card
        title={
          <Space>
            <UserOutlined />
            <span>个人中心</span>
          </Space>
        }
        extra={
          <Button icon={<EditOutlined />} disabled>
            编辑（开发中）
          </Button>
        }
      >
        <Tabs items={tabItems} />
      </Card>
    </div>
  )
}

export default Profile

