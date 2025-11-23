// 已审批出差申请列表页面
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Table, Tag, Button, Space, message, Spin, Empty } from 'antd'
import { EyeOutlined, RobotOutlined, ShoppingOutlined, FileTextOutlined, EnvironmentOutlined, CalendarOutlined } from '@ant-design/icons'
import { supabase } from '../../lib/supabase'
import { TravelRequest } from '../../types'
import './ApprovedRequests.css'

const ApprovedRequests: React.FC = () => {
  const navigate = useNavigate()
  const [requests, setRequests] = useState<TravelRequest[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // 加载已审批的申请单
      const { data, error } = await supabase
        .from('travel_requests')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (error) {
        message.error('加载失败：' + error.message)
        return
      }

      setRequests(data || [])
    } catch (error: any) {
      message.error('加载失败：' + error.message)
    } finally {
      setLoading(false)
    }
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
      title: '产品类型',
      dataIndex: 'products',
      key: 'products',
      render: (products: string[]) => (
        <Space>
          {products.map((p) => (
            <Tag key={p}>{getProductTypeName(p)}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color="green">已审批</Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: TravelRequest) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/travel-request/${record.id}`)}
          >
            查看详情
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="approved-requests">
      <Card
        title={
          <Space>
            <FileTextOutlined style={{ fontSize: 20, color: '#1890ff' }} />
            <span className="navan-desktop-only">已审批出差申请列表</span>
            <span className="navan-mobile-only">已审批申请</span>
          </Space>
        }
      >
        {/* 移动端卡片列表 */}
        <div className="mobile-cards-list">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin size="large" />
            </div>
          ) : requests.length === 0 ? (
            <Empty description="暂无已审批申请" style={{ padding: '40px 0' }} />
          ) : (
            requests.map((request) => {
              const handleCardClick = (e: React.MouseEvent) => {
                e.preventDefault()
                e.stopPropagation()
                navigate(`/travel-request/${request.id}`)
              }
              
              return (
              <Card
                key={request.id}
                className="mobile-record-card"
                onClick={handleCardClick}
              >
                <div className="mobile-card-header">
                  <div className="mobile-card-title-row">
                    <span className="mobile-card-id">{request.request_no}</span>
                    <Tag color="green">已审批</Tag>
                  </div>
                  <div className="mobile-card-route">
                    {request.origin} → {request.destination}
                  </div>
                </div>
                <div className="mobile-card-content">
                  <div className="mobile-card-item">
                    <CalendarOutlined className="mobile-card-icon" />
                    <span className="item-label">出发日期:</span>
                    <span className="item-value">{new Date(request.departure_date).toLocaleDateString()}</span>
                  </div>
                  {request.return_date && (
                    <div className="mobile-card-item">
                      <CalendarOutlined className="mobile-card-icon" />
                      <span className="item-label">回程日期:</span>
                      <span className="item-value">{new Date(request.return_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="mobile-card-item">
                    <ShoppingOutlined className="mobile-card-icon" />
                    <span className="item-label">产品:</span>
                    <span className="item-value">
                      <Space size={[0, 4]} wrap>
                        {request.products.map((p) => (
                          <Tag key={p} style={{ margin: 0 }}>
                            {getProductTypeName(p)}
                          </Tag>
                        ))}
                      </Space>
                    </span>
                  </div>
                </div>
                <div className="mobile-card-footer">
                  <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/travel-request/${request.id}`)
                    }}
                    block
                  >
                    查看详情
                  </Button>
                </div>
              </Card>
              )
            })
          )}
        </div>

        {/* PC端表格 */}
        <div className="navan-desktop-only">
          <div className="table-responsive-wrapper">
            <Table
              columns={columns}
              dataSource={requests}
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
        </div>
      </Card>
    </div>
  )
}

export default ApprovedRequests

