// 个人信息页面（支持移动端优化布局）
import React, { useEffect, useState } from 'react'
import { Card, Descriptions, Button, Space, Tabs, Table, Tag, message, Spin, Radio, Alert, Empty, Divider, Switch } from 'antd'
import { 
  UserOutlined, EditOutlined, BgColorsOutlined, MailOutlined, PhoneOutlined, 
  EnvironmentOutlined, CalendarOutlined, FileTextOutlined, DollarOutlined, 
  ShoppingOutlined, EyeOutlined, CheckCircleOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'
import { useThemeStore, UITheme } from '../../store/themeStore'
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

const Profile: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { currentTheme, setTheme, getThemeName, getThemeDescription } = useThemeStore()
  const [userData, setUserData] = useState<any>(null)
  const [travelRequests, setTravelRequests] = useState<TravelRequest[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [requestsLoading, setRequestsLoading] = useState(false)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [updatingApprovalPermission, setUpdatingApprovalPermission] = useState(false)
  const [canApprove, setCanApprove] = useState<boolean>(true) // 默认有权限

  const handleThemeChange = (theme: UITheme) => {
    setTheme(theme)
    message.success(`已切换到${getThemeName(theme)}，页面将刷新以应用新主题`)
    setTimeout(() => {
      window.location.reload()
    }, 800)
  }

  useEffect(() => {
    loadUserData()
    loadTravelRequests()
    loadOrders()
  }, [])

  const loadUserData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        console.warn('未找到认证用户')
        return
      }

      console.log('正在加载用户数据，用户ID:', authUser.id)

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error) {
        console.error('加载用户信息失败:', error)
        // 如果错误是因为字段不存在，给出提示
        if (error.message?.includes('can_approve')) {
          message.error('加载用户信息失败：can_approve 字段不存在，请先执行数据库迁移脚本')
        } else {
          message.error('加载用户信息失败：' + error.message)
        }
      } else if (data) {
        console.log('用户数据加载成功:', { 
          email: data.email, 
          can_approve: data.can_approve,
          hasCanApprove: 'can_approve' in data
        })
        setUserData(data)
        // 设置审批权限状态，确保即使字段不存在也使用默认值
        const hasPermission = data.can_approve !== false // 如果为null或undefined，默认为true
        setCanApprove(hasPermission)
        // 更新authStore中的用户信息，确保can_approve字段同步
        const { setUser } = useAuthStore.getState()
        setUser({ ...user, ...data } as any)
      } else {
        console.warn('未找到用户数据')
      }
    } catch (error: any) {
      console.error('加载用户信息异常:', error)
      message.error('加载用户信息失败：' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleApprovalPermissionChange = async (checked: boolean) => {
    setUpdatingApprovalPermission(true)
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        message.error('用户未登录')
        return
      }

      const { error } = await supabase
        .from('users')
        .update({ can_approve: checked })
        .eq('id', authUser.id)

      if (error) {
        console.error('更新审批权限失败:', error)
        message.error('更新审批权限失败：' + error.message)
        // 如果更新失败，恢复原来的状态
        setCanApprove(!checked)
      } else {
        console.log('审批权限更新成功:', { checked })
        message.success(`审批权限已${checked ? '开启' : '关闭'}`)
        // 更新本地状态
        setCanApprove(checked)
        // 重新加载用户数据
        await loadUserData()
      }
    } catch (error: any) {
      console.error('更新审批权限异常:', error)
      message.error('更新审批权限失败：' + error.message)
      // 恢复原来的状态
      setCanApprove(!checked)
    } finally {
      setUpdatingApprovalPermission(false)
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
        .select('id, order_no, product_type, origin, destination, departure_date, return_date, total_amount, currency, status, booking_source, created_at, product_details')
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
      approving: { color: 'blue', text: '审批中' },
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
            {/* 移动端个人信息卡片 */}
            <div className="mobile-profile-info">
              <div className="mobile-profile-header">
                <div className="mobile-profile-avatar">
                  <UserOutlined style={{ fontSize: 48, color: 'var(--navan-purple)' }} />
                </div>
                <div className="mobile-profile-name">
                  {userData?.full_name || user?.email?.split('@')[0] || '用户'}
                </div>
                <div className="mobile-profile-email">
                  {userData?.email || user?.email || '-'}
                </div>
              </div>

              <Divider style={{ margin: '16px 0' }} />

              <div className="mobile-profile-info-list">
                <div className="mobile-profile-info-item">
                  <UserOutlined className="mobile-profile-icon" />
                  <div className="mobile-profile-info-content">
                    <div className="mobile-profile-info-label">姓名</div>
                    <div className="mobile-profile-info-value">{userData?.full_name || '-'}</div>
                  </div>
                </div>

                <Divider style={{ margin: '12px 0' }} />

                <div className="mobile-profile-info-item">
                  <MailOutlined className="mobile-profile-icon" />
                  <div className="mobile-profile-info-content">
                    <div className="mobile-profile-info-label">邮箱</div>
                    <div className="mobile-profile-info-value">{userData?.email || user?.email || '-'}</div>
                  </div>
                </div>

                {userData?.phone && (
                  <>
                    <Divider style={{ margin: '12px 0' }} />
                    <div className="mobile-profile-info-item">
                      <PhoneOutlined className="mobile-profile-icon" />
                      <div className="mobile-profile-info-content">
                        <div className="mobile-profile-info-label">手机号</div>
                        <div className="mobile-profile-info-value">{userData.phone}</div>
                      </div>
                    </div>
                  </>
                )}

                {userData?.position && (
                  <>
                    <Divider style={{ margin: '12px 0' }} />
                    <div className="mobile-profile-info-item">
                      <UserOutlined className="mobile-profile-icon" />
                      <div className="mobile-profile-info-content">
                        <div className="mobile-profile-info-label">职位</div>
                        <div className="mobile-profile-info-value">{userData.position}</div>
                      </div>
                    </div>
                  </>
                )}

                {userData?.company_id && (
                  <>
                    <Divider style={{ margin: '12px 0' }} />
                    <div className="mobile-profile-info-item">
                      <EnvironmentOutlined className="mobile-profile-icon" />
                      <div className="mobile-profile-info-content">
                        <div className="mobile-profile-info-label">公司</div>
                        <div className="mobile-profile-info-value">ID: {userData.company_id}</div>
                      </div>
                    </div>
                  </>
                )}

                {userData?.department_id && (
                  <>
                    <Divider style={{ margin: '12px 0' }} />
                    <div className="mobile-profile-info-item">
                      <EnvironmentOutlined className="mobile-profile-icon" />
                      <div className="mobile-profile-info-content">
                        <div className="mobile-profile-info-label">部门</div>
                        <div className="mobile-profile-info-value">ID: {userData.department_id}</div>
                      </div>
                    </div>
                  </>
                )}

                {userData?.cost_center_id && (
                  <>
                    <Divider style={{ margin: '12px 0' }} />
                    <div className="mobile-profile-info-item">
                      <FileTextOutlined className="mobile-profile-icon" />
                      <div className="mobile-profile-info-content">
                        <div className="mobile-profile-info-label">成本中心</div>
                        <div className="mobile-profile-info-value">ID: {userData.cost_center_id}</div>
                      </div>
                    </div>
                  </>
                )}

                {userData?.created_at && (
                  <>
                    <Divider style={{ margin: '12px 0' }} />
                    <div className="mobile-profile-info-item">
                      <CalendarOutlined className="mobile-profile-icon" />
                      <div className="mobile-profile-info-content">
                        <div className="mobile-profile-info-label">注册时间</div>
                        <div className="mobile-profile-info-value">
                          {new Date(userData.created_at).toLocaleString('zh-CN')}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* 审批权限设置（移动端）- 始终显示 */}
                <Divider style={{ margin: '12px 0' }} />
                <div className="mobile-profile-info-item">
                  <CheckCircleOutlined className="mobile-profile-icon" />
                  <div className="mobile-profile-info-content" style={{ flex: 1 }}>
                    <div className="mobile-profile-info-label">审批权限</div>
                    <div className="mobile-profile-info-value" style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Switch
                        checked={userData?.can_approve !== false && canApprove} // 使用状态变量，默认true
                        onChange={handleApprovalPermissionChange}
                        disabled={updatingApprovalPermission || !userData}
                        checkedChildren="有"
                        unCheckedChildren="无"
                        style={{ flexShrink: 0 }}
                      />
                      <span style={{ fontSize: 14, color: '#666' }}>
                        {(userData?.can_approve !== false && canApprove) ? '有权限审批出差申请单' : '无审批权限'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 桌面端Descriptions */}
            <div className="desktop-profile-info">
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
                <Descriptions.Item label="审批权限">
                  <Space>
                    <Switch
                      checked={userData?.can_approve !== false && canApprove} // 使用状态变量，默认true
                      onChange={handleApprovalPermissionChange}
                      disabled={updatingApprovalPermission || !userData}
                      checkedChildren="有"
                      unCheckedChildren="无"
                    />
                    <span style={{ color: '#666' }}>
                      {(userData?.can_approve !== false && canApprove) ? '有权限审批出差申请单' : '无审批权限'}
                    </span>
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Spin>
        </Card>
      ),
    },
    {
      key: 'theme',
      label: (
        <Space>
          <BgColorsOutlined />
          <span>UI主题设置</span>
        </Space>
      ),
      children: (
        <Card>
          <div className="theme-settings-container">
            <Alert
              message="主题切换说明"
              description="您可以选择不同的UI设计风格。切换主题后，页面将自动刷新以应用新样式。您的选择将被保存，下次登录时仍会使用您选择的主题。"
              type="info"
              showIcon
              className="theme-alert"
            />
            
            <div className="theme-selection">
              <h3 className="theme-title">选择UI主题</h3>
              <Radio.Group
                value={currentTheme}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="theme-radio-group"
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Radio value="UI1" className="theme-radio-option">
                    <div>
                      <div className="theme-radio-name">{getThemeName('UI1')}</div>
                      <div className="theme-radio-desc">{getThemeDescription('UI1')}</div>
                    </div>
                  </Radio>
                  
                  <Radio value="UI2" disabled className="theme-radio-option theme-radio-disabled">
                    <div>
                      <div className="theme-radio-name">{getThemeName('UI2')}</div>
                      <div className="theme-radio-desc">{getThemeDescription('UI2')}</div>
                    </div>
                  </Radio>
                  
                  <Radio value="UI3" disabled className="theme-radio-option theme-radio-disabled">
                    <div>
                      <div className="theme-radio-name">{getThemeName('UI3')}</div>
                      <div className="theme-radio-desc">{getThemeDescription('UI3')}</div>
                    </div>
                  </Radio>
                </Space>
              </Radio.Group>
            </div>

            <div className="theme-current">
              <div className="theme-current-label">当前主题：</div>
              <div className="theme-current-info">
                <strong>{getThemeName(currentTheme)}</strong>
                <div className="theme-current-desc">{getThemeDescription(currentTheme)}</div>
              </div>
            </div>
          </div>
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
            <Button 
              onClick={() => navigate('/travel-request/list')}
              className="navan-desktop-only"
            >
              查看全部
            </Button>
          }
        >
          {/* 移动端卡片列表 */}
          <div className="mobile-cards-list">
            {requestsLoading ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Spin size="large" />
              </div>
            ) : travelRequests.length === 0 ? (
              <Empty description="暂无申请记录" style={{ padding: '40px 0' }} />
            ) : (
              travelRequests.map((request) => (
                <Card
                  key={request.id}
                  className="mobile-record-card"
                  onClick={() => navigate(`/travel-request/${request.id}`)}
                >
                  <div className="mobile-card-header">
                    <div className="mobile-card-title-row">
                      <span className="mobile-card-id">{request.request_no}</span>
                      {getStatusTag(request.status)}
                    </div>
                  </div>
                  
                  <div className="mobile-card-content">
                    <div className="mobile-card-info-row">
                      <EnvironmentOutlined className="mobile-card-icon" />
                      <span className="mobile-card-label">行程：</span>
                      <span className="mobile-card-value">
                        {request.origin} → {request.destination}
                      </span>
                    </div>
                    
                    <div className="mobile-card-info-row">
                      <CalendarOutlined className="mobile-card-icon" />
                      <span className="mobile-card-label">出发：</span>
                      <span className="mobile-card-value">
                        {new Date(request.departure_date).toLocaleDateString()}
                      </span>
                      {request.return_date && (
                        <>
                          <span className="mobile-card-label" style={{ marginLeft: 12 }}>回程：</span>
                          <span className="mobile-card-value">
                            {new Date(request.return_date).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="mobile-card-footer">
                    <Button
                      type="primary"
                      block
                      icon={<EyeOutlined />}
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/travel-request/${request.id}`)
                      }}
                    >
                      查看详情
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* 桌面端表格 */}
          <div className="desktop-table-wrapper">
            <Table
              columns={requestColumns}
              dataSource={travelRequests}
              rowKey="id"
              loading={requestsLoading}
              scroll={{ x: 'max-content' }}
              pagination={false}
            />
          </div>

          {/* 移动端查看全部按钮 */}
          <div className="mobile-view-all">
            <Button 
              block 
              onClick={() => navigate('/travel-request/list')}
            >
              查看全部申请记录
            </Button>
          </div>
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
            <Button 
              onClick={() => navigate('/booking/orders')}
              className="navan-desktop-only"
            >
              查看全部
            </Button>
          }
        >
          {/* 移动端卡片列表 */}
          <div className="mobile-cards-list">
            {ordersLoading ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Spin size="large" />
              </div>
            ) : orders.length === 0 ? (
              <Empty description="暂无订单记录" style={{ padding: '40px 0' }} />
            ) : (
              orders.map((order) => {
                const productName = order.product_details?.name || '-'
                return (
                  <Card
                    key={order.id}
                    className="mobile-record-card"
                    onClick={() => navigate(`/booking/orders/${order.id}`)}
                  >
                    <div className="mobile-card-header">
                      <div className="mobile-card-title-row">
                        <span className="mobile-card-id">{order.order_no}</span>
                        {getOrderStatusTag(order.status)}
                      </div>
                    </div>
                    
                    <div className="mobile-card-content">
                      <div className="mobile-card-info-row">
                        <ShoppingOutlined className="mobile-card-icon" />
                        <span className="mobile-card-label">产品：</span>
                        <span className="mobile-card-value">
                          {getProductTypeName(order.product_type)}
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
              columns={orderColumns}
              dataSource={orders}
              rowKey="id"
              loading={ordersLoading}
              scroll={{ x: 'max-content' }}
              pagination={false}
            />
          </div>

          {/* 移动端查看全部按钮 */}
          <div className="mobile-view-all">
            <Button 
              block 
              onClick={() => navigate('/booking/orders')}
            >
              查看全部订单记录
            </Button>
          </div>
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
          <Button icon={<EditOutlined />} disabled className="navan-desktop-only">
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
