// Navan风格Dashboard首页（参考图片的模块布局）
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Tag, Space, Spin, Empty, message } from 'antd'
import {
  FileTextOutlined,
  CheckCircleOutlined,
  UserOutlined,
  ShoppingOutlined,
  RobotOutlined,
  EyeOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  DollarOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '../../store/authStore'
import { supabase } from '../../lib/supabase'
import './Dashboard.css'

interface Order {
  id: string
  order_no: string
  product_type: string
  product_details: any
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

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setOrdersLoading(true)
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) return

      const { data, error } = await supabase
        .from('orders')
        .select('id, order_no, product_type, product_details, origin, destination, departure_date, return_date, total_amount, currency, status, booking_source, created_at')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })
        .limit(10) // 首页显示最近10条

      if (error) {
        console.error('加载订单失败:', error)
      } else {
        setOrders(data || [])
      }
    } catch (error: any) {
      console.error('加载订单失败:', error)
    } finally {
      setOrdersLoading(false)
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

  const getOrderStatusInfo = (order: Order) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // 根据订单状态和出发日期判断订单类别
    if (order.status === 'pending') {
      return { category: 'unpaid', label: '未支付', color: 'orange', text: '待支付' }
    }
    
    if (order.status === 'cancelled') {
      return { category: 'cancelled', label: '已取消', color: 'red', text: '已取消' }
    }
    
    if (order.status === 'paid' || order.status === 'confirmed') {
      // 检查出发日期
      if (order.departure_date) {
        const departureDate = new Date(order.departure_date)
        departureDate.setHours(0, 0, 0, 0)
        
        if (departureDate > today) {
          return { category: 'paid_not_traveled', label: '已支付未出行', color: 'blue', text: '已支付未出行' }
        } else {
          return { category: 'traveled', label: '已出行', color: 'green', text: '已出行' }
        }
      }
      return { category: 'paid_not_traveled', label: '已支付未出行', color: 'blue', text: '已支付未出行' }
    }
    
    if (order.status === 'completed') {
      return { category: 'traveled', label: '已出行', color: 'green', text: '已完成' }
    }
    
    return { category: 'other', label: order.status, color: 'default', text: order.status }
  }

  // 按类别分组订单
  const unpaidOrders = orders.filter(order => getOrderStatusInfo(order).category === 'unpaid')
  const paidNotTraveledOrders = orders.filter(order => getOrderStatusInfo(order).category === 'paid_not_traveled')
  const traveledOrders = orders.filter(order => getOrderStatusInfo(order).category === 'traveled')

  return (
    <div className="dashboard-new">
      {/* 顶部Header区域 */}
      <div className="dashboard-header">
        <div className="dashboard-header-left">
          <h1 className="dashboard-app-title">一起飞差旅管理系统</h1>
          <p className="dashboard-welcome-text">
            欢迎回来, {user?.full_name || user?.email?.split('@')[0] || '测试用户'}
          </p>
        </div>
      </div>

      {/* 主欢迎横幅 */}
      <div className="dashboard-banner">
        <h2 className="dashboard-banner-title">欢迎使用一起飞差旅管理系统</h2>
        <p className="dashboard-banner-subtitle">智能出行,轻松管理</p>
      </div>

      {/* 功能卡片（上排3个） */}
      <div className="dashboard-feature-cards">
        <Card
          className="feature-card"
          hoverable
          onClick={() => navigate('/travel-request/new')}
        >
          <div className="feature-card-icon feature-icon-orange">
            <FileTextOutlined />
          </div>
          <h3 className="feature-card-title">出差申请</h3>
          <p className="feature-card-desc">提交和管理出差申请,在线审批流程</p>
        </Card>

        <Card
          className="feature-card"
          hoverable
          onClick={() => navigate('/travel-request/list')}
        >
          <div className="feature-card-icon feature-icon-green">
            <CheckCircleOutlined />
          </div>
          <h3 className="feature-card-title">审批管理</h3>
          <p className="feature-card-desc">审批下属申请,管理团队出差</p>
        </Card>

        <Card
          className="feature-card"
          hoverable
          onClick={() => navigate('/booking/orders')}
        >
          <div className="feature-card-icon feature-icon-blue">
            <ShoppingOutlined />
          </div>
          <h3 className="feature-card-title">我的订单</h3>
          <p className="feature-card-desc">管理机票酒店 火车票等订单</p>
        </Card>
      </div>

      {/* 预订选项卡片（下排2个） */}
      <div className="dashboard-booking-cards">
        <Card className="booking-card" hoverable>
          <div className="booking-card-content">
            <div className="booking-card-left">
              <div className="booking-card-icon booking-icon-blue">
                <ShoppingOutlined />
              </div>
              <div className="booking-card-text">
                <h3 className="booking-card-title">经典预订</h3>
                <p className="booking-card-desc">
                  传统预订方式,提供机票、酒店、火车票等多种预订服务,操作简单快捷
                </p>
              </div>
            </div>
            <Button
              type="primary"
              className="booking-card-btn"
              onClick={(e) => {
                e.stopPropagation()
                navigate('/booking/classic')
              }}
            >
              立即预订
            </Button>
          </div>
        </Card>

        <Card className="booking-card" hoverable>
          <div className="booking-card-content">
            <div className="booking-card-left">
              <div className="booking-card-icon booking-icon-pink">
                <RobotOutlined />
              </div>
              <div className="booking-card-text">
                <h3 className="booking-card-title">AI智能预订</h3>
                <p className="booking-card-desc">
                  智能对话式预订,AI助手为您推荐最优出行方案,体验智能科技带来的便利
                </p>
              </div>
            </div>
            <Button
              type="primary"
              className="booking-card-btn booking-btn-ai"
              onClick={(e) => {
                e.stopPropagation()
                navigate('/ai-booking')
              }}
            >
              智能助手
            </Button>
          </div>
        </Card>
      </div>

      {/* 我的订单模块 */}
      <div className="dashboard-orders-section">
        <div className="dashboard-orders-header">
          <h2 className="dashboard-orders-title">
            <ShoppingOutlined style={{ marginRight: 8, color: 'var(--navan-purple)' }} />
            我的订单
          </h2>
          <Button
            type="link"
            onClick={() => navigate('/booking/orders')}
            className="dashboard-orders-view-all"
          >
            查看全部
          </Button>
        </div>

        <Spin spinning={ordersLoading}>
          {orders.length === 0 ? (
            <Card className="dashboard-orders-empty">
              <Empty 
                description="暂无订单记录" 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
              <Button 
                type="primary" 
                onClick={() => navigate('/booking/classic')}
                style={{ marginTop: 16 }}
              >
                立即预订
              </Button>
            </Card>
          ) : (
            <div className="dashboard-orders-content">
              {/* 未支付订单 */}
              {unpaidOrders.length > 0 && (
                <div className="dashboard-orders-group">
                  <div className="dashboard-orders-group-header">
                    <Tag color="orange" style={{ fontSize: 14, padding: '4px 12px', height: 28 }}>
                      未支付
                    </Tag>
                    <span className="dashboard-orders-count">共 {unpaidOrders.length} 条</span>
                  </div>
                  <div className="dashboard-orders-list">
                    {/* 桌面端表格样式 */}
                    <div className="desktop-orders-list">
                      {unpaidOrders.slice(0, 5).map((order) => {
                        const statusInfo = getOrderStatusInfo(order)
                        const productName = order.product_details?.name || '-'
                        return (
                          <Card
                            key={order.id}
                            className="dashboard-order-item"
                            onClick={() => navigate(`/booking/orders/${order.id}`)}
                          >
                            <div className="dashboard-order-item-content">
                              <div className="dashboard-order-item-left">
                                <div className="dashboard-order-item-id">{order.order_no}</div>
                                <div className="dashboard-order-item-info">
                                  <span className="dashboard-order-item-product">
                                    {getProductTypeName(order.product_type)}
                                  </span>
                                  <span className="dashboard-order-item-route">
                                    {order.origin} → {order.destination}
                                  </span>
                                  {order.departure_date && (
                                    <span className="dashboard-order-item-date">
                                      {new Date(order.departure_date).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="dashboard-order-item-right">
                                <div className="dashboard-order-item-amount">
                                  ¥{order.total_amount.toLocaleString()}
                                </div>
                                <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
                              </div>
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                    {/* 移动端卡片样式 */}
                    <div className="mobile-orders-list">
                      {unpaidOrders.slice(0, 5).map((order) => {
                        const statusInfo = getOrderStatusInfo(order)
                        return (
                          <Card
                            key={order.id}
                            className="mobile-order-card"
                            onClick={() => navigate(`/booking/orders/${order.id}`)}
                          >
                            <div className="mobile-order-card-header">
                              <div className="mobile-order-card-title-row">
                                <span className="mobile-order-card-id">{order.order_no}</span>
                                <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
                              </div>
                            </div>
                            <div className="mobile-order-card-content">
                              <div className="mobile-order-card-info-row">
                                <ShoppingOutlined className="mobile-order-card-icon" />
                                <span className="mobile-order-card-label">产品：</span>
                                <span className="mobile-order-card-value">
                                  {getProductTypeName(order.product_type)}
                                </span>
                              </div>
                              <div className="mobile-order-card-info-row">
                                <EnvironmentOutlined className="mobile-order-card-icon" />
                                <span className="mobile-order-card-label">行程：</span>
                                <span className="mobile-order-card-value">
                                  {order.origin} → {order.destination}
                                </span>
                              </div>
                              {order.departure_date && (
                                <div className="mobile-order-card-info-row">
                                  <CalendarOutlined className="mobile-order-card-icon" />
                                  <span className="mobile-order-card-label">出发：</span>
                                  <span className="mobile-order-card-value">
                                    {new Date(order.departure_date).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                              <div className="mobile-order-card-info-row mobile-order-card-highlight">
                                <DollarOutlined className="mobile-order-card-icon" style={{ color: '#1890ff' }} />
                                <span className="mobile-order-card-label">金额：</span>
                                <span className="mobile-order-card-value" style={{ color: '#1890ff', fontWeight: 'bold', fontSize: '16px' }}>
                                  ¥{order.total_amount.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* 已支付未出行订单 */}
              {paidNotTraveledOrders.length > 0 && (
                <div className="dashboard-orders-group">
                  <div className="dashboard-orders-group-header">
                    <Tag color="blue" style={{ fontSize: 14, padding: '4px 12px', height: 28 }}>
                      已支付未出行
                    </Tag>
                    <span className="dashboard-orders-count">共 {paidNotTraveledOrders.length} 条</span>
                  </div>
                  <div className="dashboard-orders-list">
                    {/* 桌面端表格样式 */}
                    <div className="desktop-orders-list">
                      {paidNotTraveledOrders.slice(0, 5).map((order) => {
                        const statusInfo = getOrderStatusInfo(order)
                        return (
                          <Card
                            key={order.id}
                            className="dashboard-order-item"
                            onClick={() => navigate(`/booking/orders/${order.id}`)}
                          >
                            <div className="dashboard-order-item-content">
                              <div className="dashboard-order-item-left">
                                <div className="dashboard-order-item-id">{order.order_no}</div>
                                <div className="dashboard-order-item-info">
                                  <span className="dashboard-order-item-product">
                                    {getProductTypeName(order.product_type)}
                                  </span>
                                  <span className="dashboard-order-item-route">
                                    {order.origin} → {order.destination}
                                  </span>
                                  {order.departure_date && (
                                    <span className="dashboard-order-item-date">
                                      {new Date(order.departure_date).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="dashboard-order-item-right">
                                <div className="dashboard-order-item-amount">
                                  ¥{order.total_amount.toLocaleString()}
                                </div>
                                <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
                              </div>
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                    {/* 移动端卡片样式 */}
                    <div className="mobile-orders-list">
                      {paidNotTraveledOrders.slice(0, 5).map((order) => {
                        const statusInfo = getOrderStatusInfo(order)
                        const handleCardClick = (e: React.MouseEvent) => {
                          e.preventDefault()
                          e.stopPropagation()
                          navigate(`/booking/orders/${order.id}`)
                        }
                        
                        return (
                          <Card
                            key={order.id}
                            className="mobile-order-card"
                            onClick={handleCardClick}
                          >
                            <div className="mobile-order-card-header">
                              <div className="mobile-order-card-title-row">
                                <span className="mobile-order-card-id">{order.order_no}</span>
                                <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
                              </div>
                            </div>
                            <div className="mobile-order-card-content">
                              <div className="mobile-order-card-info-row">
                                <ShoppingOutlined className="mobile-order-card-icon" />
                                <span className="mobile-order-card-label">产品：</span>
                                <span className="mobile-order-card-value">
                                  {getProductTypeName(order.product_type)}
                                </span>
                              </div>
                              <div className="mobile-order-card-info-row">
                                <EnvironmentOutlined className="mobile-order-card-icon" />
                                <span className="mobile-order-card-label">行程：</span>
                                <span className="mobile-order-card-value">
                                  {order.origin} → {order.destination}
                                </span>
                              </div>
                              {order.departure_date && (
                                <div className="mobile-order-card-info-row">
                                  <CalendarOutlined className="mobile-order-card-icon" />
                                  <span className="mobile-order-card-label">出发：</span>
                                  <span className="mobile-order-card-value">
                                    {new Date(order.departure_date).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                              <div className="mobile-order-card-info-row mobile-order-card-highlight">
                                <DollarOutlined className="mobile-order-card-icon" style={{ color: '#1890ff' }} />
                                <span className="mobile-order-card-label">金额：</span>
                                <span className="mobile-order-card-value" style={{ color: '#1890ff', fontWeight: 'bold', fontSize: '16px' }}>
                                  ¥{order.total_amount.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* 已出行订单 */}
              {traveledOrders.length > 0 && (
                <div className="dashboard-orders-group">
                  <div className="dashboard-orders-group-header">
                    <Tag color="green" style={{ fontSize: 14, padding: '4px 12px', height: 28 }}>
                      已出行
                    </Tag>
                    <span className="dashboard-orders-count">共 {traveledOrders.length} 条</span>
                  </div>
                  <div className="dashboard-orders-list">
                    {/* 桌面端表格样式 */}
                    <div className="desktop-orders-list">
                      {traveledOrders.slice(0, 5).map((order) => {
                        const statusInfo = getOrderStatusInfo(order)
                        return (
                          <Card
                            key={order.id}
                            className="dashboard-order-item"
                            onClick={() => navigate(`/booking/orders/${order.id}`)}
                          >
                            <div className="dashboard-order-item-content">
                              <div className="dashboard-order-item-left">
                                <div className="dashboard-order-item-id">{order.order_no}</div>
                                <div className="dashboard-order-item-info">
                                  <span className="dashboard-order-item-product">
                                    {getProductTypeName(order.product_type)}
                                  </span>
                                  <span className="dashboard-order-item-route">
                                    {order.origin} → {order.destination}
                                  </span>
                                  {order.departure_date && (
                                    <span className="dashboard-order-item-date">
                                      {new Date(order.departure_date).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="dashboard-order-item-right">
                                <div className="dashboard-order-item-amount">
                                  ¥{order.total_amount.toLocaleString()}
                                </div>
                                <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
                              </div>
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                    {/* 移动端卡片样式 */}
                    <div className="mobile-orders-list">
                      {traveledOrders.slice(0, 5).map((order) => {
                        const statusInfo = getOrderStatusInfo(order)
                        return (
                          <Card
                            key={order.id}
                            className="mobile-order-card"
                            onClick={() => navigate(`/booking/orders/${order.id}`)}
                          >
                            <div className="mobile-order-card-header">
                              <div className="mobile-order-card-title-row">
                                <span className="mobile-order-card-id">{order.order_no}</span>
                                <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
                              </div>
                            </div>
                            <div className="mobile-order-card-content">
                              <div className="mobile-order-card-info-row">
                                <ShoppingOutlined className="mobile-order-card-icon" />
                                <span className="mobile-order-card-label">产品：</span>
                                <span className="mobile-order-card-value">
                                  {getProductTypeName(order.product_type)}
                                </span>
                              </div>
                              <div className="mobile-order-card-info-row">
                                <EnvironmentOutlined className="mobile-order-card-icon" />
                                <span className="mobile-order-card-label">行程：</span>
                                <span className="mobile-order-card-value">
                                  {order.origin} → {order.destination}
                                </span>
                              </div>
                              {order.departure_date && (
                                <div className="mobile-order-card-info-row">
                                  <CalendarOutlined className="mobile-order-card-icon" />
                                  <span className="mobile-order-card-label">出发：</span>
                                  <span className="mobile-order-card-value">
                                    {new Date(order.departure_date).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                              <div className="mobile-order-card-info-row mobile-order-card-highlight">
                                <DollarOutlined className="mobile-order-card-icon" style={{ color: '#1890ff' }} />
                                <span className="mobile-order-card-label">金额：</span>
                                <span className="mobile-order-card-value" style={{ color: '#1890ff', fontWeight: 'bold', fontSize: '16px' }}>
                                  ¥{order.total_amount.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </Spin>
      </div>
    </div>
  )
}

export default Dashboard
