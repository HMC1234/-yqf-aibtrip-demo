// AI推荐方案总列表页面（显示所有历史推荐方案）
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Table, Tag, Button, Space, message, Spin, Empty } from 'antd'
import { EyeOutlined, RobotOutlined, EnvironmentOutlined, CalendarOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { supabase } from '../../lib/supabase'
import './AllRecommendations.css'

interface Recommendation {
  id: string
  recommendation_no: string
  origin: string
  destination: string
  departure_date: string
  return_date: string
  products: string[]
  status: string
  source: string
  source_type: string
  created_at: string
  option_count?: number
}

const AllRecommendations: React.FC = () => {
  const navigate = useNavigate()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadRecommendations()
  }, [])

  const loadRecommendations = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // 加载所有推荐方案
      const { data, error } = await supabase
        .from('ai_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        message.error('加载失败：' + error.message)
        return
      }

      // 加载每个推荐方案的选项数量
      const recommendationsWithCount = await Promise.all(
        (data || []).map(async (rec) => {
          const { count } = await supabase
            .from('recommendation_details')
            .select('*', { count: 'exact', head: true })
            .eq('ai_recommendation_id', rec.id)
          return {
            ...rec,
            option_count: count || 0,
          }
        })
      )

      setRecommendations(recommendationsWithCount)
    } catch (error: any) {
      message.error('加载失败：' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      generating: { color: 'blue', text: '生成中' },
      generated: { color: 'green', text: '已生成' },
      booked: { color: 'purple', text: '已预订' },
      cancelled: { color: 'red', text: '已取消' },
    }
    const statusInfo = statusMap[status] || { color: 'default', text: status }
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
  }

  const getSourceTag = (source: string, sourceType: string) => {
    if (source === 'travel_request') {
      return <Tag color="blue">申请单推荐</Tag>
    } else if (source === 'ai_chat') {
      return <Tag color="green">对话生成</Tag>
    }
    return <Tag>{source}</Tag>
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
      title: '推荐单号',
      dataIndex: 'recommendation_no',
      key: 'recommendation_no',
      render: (text: string) => (
        <span style={{ fontFamily: 'monospace' }}>{text}</span>
      ),
    },
    {
      title: '行程',
      key: 'route',
      render: (_: any, record: Recommendation) => (
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
      title: '方案数量',
      key: 'option_count',
      render: (_: any, record: Recommendation) => (
        <span>{record.option_count || 0} 个方案</span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '来源',
      key: 'source',
      render: (_: any, record: Recommendation) =>
        getSourceTag(record.source, record.source_type),
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
      render: (_: any, record: Recommendation) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/ai-recommendation/${record.id}/list`)}
        >
          查看方案
        </Button>
      ),
    },
  ]

  return (
    <div className="all-recommendations">
      <Card
        title={
          <Space>
            <RobotOutlined style={{ fontSize: 20, color: '#9333EA' }} />
            <span className="navan-desktop-only">AI推荐方案列表</span>
            <span className="navan-mobile-only">推荐方案</span>
          </Space>
        }
      >
        {/* 移动端卡片列表 */}
        <div className="mobile-cards-list">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin size="large" />
            </div>
          ) : recommendations.length === 0 ? (
            <Empty description="暂无推荐方案" style={{ padding: '40px 0' }} />
          ) : (
            recommendations.map((rec) => (
              <Card
                key={rec.id}
                className="mobile-record-card"
                onClick={() => navigate(`/ai-recommendation/${rec.id}/list`)}
              >
                <div className="mobile-card-header">
                  <div className="mobile-card-title-row">
                    <span className="mobile-card-id">{rec.recommendation_no}</span>
                    {getStatusTag(rec.status)}
                  </div>
                  <div className="mobile-card-route">
                    {rec.origin} → {rec.destination}
                  </div>
                </div>
                <div className="mobile-card-content">
                  <div className="mobile-card-item">
                    <CalendarOutlined className="mobile-card-icon" />
                    <span className="item-label">出发日期:</span>
                    <span className="item-value">{new Date(rec.departure_date).toLocaleDateString()}</span>
                  </div>
                  {rec.return_date && (
                    <div className="mobile-card-item">
                      <CalendarOutlined className="mobile-card-icon" />
                      <span className="item-label">回程日期:</span>
                      <span className="item-value">{new Date(rec.return_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="mobile-card-item">
                    <ThunderboltOutlined className="mobile-card-icon" />
                    <span className="item-label">产品:</span>
                    <span className="item-value">
                      <Space size={[0, 4]} wrap>
                        {rec.products.map((p) => (
                          <Tag key={p} style={{ margin: 0 }}>
                            {getProductTypeName(p)}
                          </Tag>
                        ))}
                      </Space>
                    </span>
                  </div>
                  <div className="mobile-card-item">
                    <RobotOutlined className="mobile-card-icon" />
                    <span className="item-label">方案数量:</span>
                    <span className="item-value">{rec.option_count || 0} 个方案</span>
                  </div>
                  <div className="mobile-card-item">
                    <span className="item-label">来源:</span>
                    <span className="item-value">
                      {getSourceTag(rec.source, rec.source_type)}
                    </span>
                  </div>
                </div>
                <div className="mobile-card-footer">
                  <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/ai-recommendation/${rec.id}/list`)
                    }}
                    block
                  >
                    查看方案
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* PC端表格 */}
        <div className="navan-desktop-only">
          <div className="table-responsive-wrapper">
            <Table
              columns={columns}
              dataSource={recommendations}
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

export default AllRecommendations

