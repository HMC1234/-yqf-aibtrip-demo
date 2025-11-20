// 首页仪表板
import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Statistic, List, Button } from 'antd'
import {
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  RobotOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { TravelRequest } from '../../types'
import './Dashboard.css'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
  })
  const [recentRequests, setRecentRequests] = useState<TravelRequest[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.log('未获取到用户信息')
        return
      }

      // 获取统计数据
      const { data: requests, error } = await supabase
        .from('travel_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('加载数据失败:', error)
        return
      }

      if (requests) {
        setStats({
          total: requests.length,
          pending: requests.filter((r: TravelRequest) => r.status === 'pending' || r.status === 'approving').length,
          approved: requests.filter((r: TravelRequest) => r.status === 'approved').length,
        })
        setRecentRequests(requests.slice(0, 5))
      } else {
        // 如果没有数据，设置默认值
        setStats({ total: 0, pending: 0, approved: 0 })
        setRecentRequests([])
      }
    } catch (error) {
      console.error('加载数据失败:', error)
      // 即使出错也显示页面
      setStats({ total: 0, pending: 0, approved: 0 })
      setRecentRequests([])
    }
  }

  return (
    <div className="dashboard">
      <h1>欢迎回来</h1>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="总申请数"
              value={stats.total}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="待审批"
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="已审批"
              value={stats.approved}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card
            title="最近申请"
            extra={<Button type="link" onClick={() => navigate('/travel-request/list')}>查看全部</Button>}
          >
            <List
              dataSource={recentRequests}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.request_no}
                    description={`${item.origin} → ${item.destination}`}
                  />
                  <div>
                    <span style={{ marginRight: 16 }}>
                      {new Date(item.departure_date).toLocaleDateString()}
                    </span>
                    <span style={{
                      color: item.status === 'approved' ? '#52c41a' : 
                             item.status === 'pending' ? '#faad14' : '#1890ff'
                    }}>
                      {item.status === 'approved' ? '已审批' :
                       item.status === 'pending' ? '待审批' : '审批中'}
                    </span>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="快速操作"
            extra={<RobotOutlined style={{ fontSize: 20, color: '#1890ff' }} />}
          >
            <div className="quick-actions">
              <Button
                type="primary"
                size="large"
                block
                style={{ marginBottom: 16 }}
                onClick={() => navigate('/travel-request/new')}
              >
                提交出差申请
              </Button>
              <Button
                size="large"
                block
                onClick={() => navigate('/travel-request/list')}
              >
                查看我的申请
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard

