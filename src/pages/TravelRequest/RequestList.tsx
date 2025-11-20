// 出差申请列表页面
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Tag, Space, Card, Tabs } from 'antd'
import type { TabsProps } from 'antd'
import { FileTextOutlined, EyeOutlined } from '@ant-design/icons'
import { supabase } from '../../lib/supabase'
import { TravelRequest } from '../../types'
import './RequestList.css'

const RequestList: React.FC = () => {
  const navigate = useNavigate()
  const [requests, setRequests] = useState<TravelRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    loadRequests()
  }, [activeTab])

  const loadRequests = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      let query = supabase
        .from('travel_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (activeTab !== 'all') {
        if (activeTab === 'pending') {
          query = query.in('status', ['pending'])
        } else if (activeTab === 'approving') {
          query = query.eq('status', 'approving')
        } else if (activeTab === 'approved') {
          query = query.eq('status', 'approved')
        }
      }

      const { data, error } = await query

      if (error) {
        console.error('加载失败:', error)
      } else {
        setRequests(data || [])
      }
    } catch (error) {
      console.error('加载失败:', error)
    } finally {
      setLoading(false)
    }
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

  const columns = [
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
        <span>
          {record.origin} → {record.destination}
        </span>
      ),
    },
    {
      title: '出发日期',
      dataIndex: 'departure_date',
      key: 'departure_date',
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: '回程日期',
      dataIndex: 'return_date',
      key: 'return_date',
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: '产品',
      dataIndex: 'products',
      key: 'products',
      render: (products: string[]) => (
        <Space>
          {products.map((p) => (
            <Tag key={p}>
              {p === 'flight' ? '机票' :
               p === 'hotel' ? '酒店' :
               p === 'train' ? '火车票' : '用车'}
            </Tag>
          ))}
        </Space>
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
      render: (_: any, record: TravelRequest) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/travel-request/${record.id}`)}
        >
          查看详情
        </Button>
      ),
    },
  ]

  const tabItems: TabsProps['items'] = [
    { key: 'all', label: '全部申请' },
    { key: 'pending', label: '待审批' },
    { key: 'approving', label: '审批中' },
    { key: 'approved', label: '已审批' },
  ]

  return (
    <div className="request-list">
      <Card
        title={<><FileTextOutlined /> 我的出差申请</>}
        extra={
          <Button
            type="primary"
            onClick={() => navigate('/travel-request/new')}
          >
            提交新申请
          </Button>
        }
      >
        <Tabs
          activeKey={activeTab}
          items={tabItems}
          onChange={setActiveTab}
        >
        </Tabs>
        <Table
          columns={columns}
          dataSource={requests}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  )
}

export default RequestList

