// 主布局组件
import React from 'react'
import { Layout, Menu, Avatar, Dropdown, Button, message } from 'antd'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  DashboardOutlined,
  FileTextOutlined,
  ShoppingOutlined,
  RobotOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '../../store/authStore'
import './MainLayout.css'

const { Header, Sider, Content } = Layout

const MainLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut } = useAuthStore()

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '首页',
    },
    {
      key: '/travel-request/list',
      icon: <FileTextOutlined />,
      label: '出差申请',
    },
    {
      key: '/booking/classic',
      icon: <ShoppingOutlined />,
      label: '经典预订',
    },
    {
      key: '/booking/orders',
      icon: <ShoppingOutlined />,
      label: '我的订单',
    },
    {
      key: '/ai-booking',
      icon: <RobotOutlined />,
      label: 'AI推荐',
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => {
        // 个人中心功能待实现
        message.info('个人中心功能开发中')
      },
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ]

  return (
    <Layout className="main-layout">
      <Sider
        width={200}
        className="layout-sider"
        theme="light"
      >
        <div className="logo">
          <RobotOutlined style={{ fontSize: 24, color: '#1890ff' }} />
          <span className="logo-text">YQFAIBTRIP</span>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ height: 'calc(100vh - 64px)', borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header className="layout-header">
          <div className="header-content">
            <h1 className="header-title">一起飞智能商旅系统</h1>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Button type="text" className="user-menu">
                <Avatar icon={<UserOutlined />} />
                <span style={{ marginLeft: 8 }}>{user?.full_name || user?.email}</span>
              </Button>
            </Dropdown>
          </div>
        </Header>
        <Content className="layout-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout

