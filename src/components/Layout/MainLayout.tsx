// Navan风格主布局组件（顶部导航栏）
import React, { useState } from 'react'
import { Layout, Avatar, Dropdown, Button, Drawer } from 'antd'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  DashboardOutlined,
  FileTextOutlined,
  ShoppingOutlined,
  RobotOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '../../store/authStore'
import './MainLayout.css'

const { Header, Content } = Layout

const MainLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { key: '/dashboard', label: '首页', icon: <DashboardOutlined /> },
    { key: '/travel-request/list', label: '出差申请', icon: <FileTextOutlined /> },
    { key: '/booking/classic', label: '经典预订', icon: <ShoppingOutlined /> },
    { key: '/booking/orders', label: '我的订单', icon: <ShoppingOutlined /> },
    { key: '/ai-booking', label: 'AI推荐', icon: <RobotOutlined /> },
  ]

  const handleNavClick = (key: string) => {
    navigate(key)
    setMobileMenuOpen(false) // 关闭移动端菜单
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
        navigate('/profile')
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
      <Header className="layout-header">
        <div className="header-content">
          {/* Logo区域（左侧） */}
          <div className="header-logo" onClick={() => navigate('/dashboard')}>
            <RobotOutlined className="header-logo-icon" />
            <div className="header-logo-content">
              <span className="header-logo-text">YQFAIBTRIP</span>
              <span className="header-logo-subtitle">一起飞差旅管理系统</span>
            </div>
          </div>

          {/* 导航菜单（居中，PC端显示） */}
          <nav className="header-nav">
            {navItems.map((item) => (
              <a
                key={item.key}
                className={`header-nav-item ${
                  location.pathname === item.key ? 'active' : ''
                }`}
                onClick={() => handleNavClick(item.key)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* 右侧区域 */}
          <div className="header-right">
            {/* 移动端菜单按钮 */}
            <Button
              type="text"
              className="mobile-menu-btn"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuOpen(true)}
            />

            {/* 用户菜单（右侧） */}
            <div className="header-user">
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" className="user-dropdown">
                <Button type="text" className="user-menu">
                  <div className="user-menu-icon-wrapper">
                    <UserOutlined className="user-menu-icon" />
                  </div>
                  <span className="user-menu-text">个人中心</span>
                </Button>
              </Dropdown>
            </div>
          </div>
        </div>
      </Header>

      {/* 移动端抽屉菜单 */}
      <Drawer
        title={
          <div className="drawer-header">
            <span>菜单</span>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setMobileMenuOpen(false)}
              className="drawer-close-btn"
            />
          </div>
        }
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        className="mobile-drawer"
        width={280}
      >
        <nav className="mobile-nav">
          {navItems.map((item) => (
            <a
              key={item.key}
              className={`mobile-nav-item ${
                location.pathname === item.key ? 'active' : ''
              }`}
              onClick={() => handleNavClick(item.key)}
            >
              <span className="mobile-nav-icon">{item.icon}</span>
              <span className="mobile-nav-label">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* 移动端用户信息 */}
        <div className="mobile-user-info">
          <Avatar icon={<UserOutlined />} size="large" />
          <div className="mobile-user-details">
            <div className="mobile-user-name">
              {user?.full_name || user?.email?.split('@')[0]}
            </div>
            <div className="mobile-user-email">{user?.email}</div>
          </div>
        </div>

        {/* 移动端用户操作 */}
        <div className="mobile-user-actions">
          <Button
            type="text"
            block
            icon={<UserOutlined />}
            onClick={() => {
              navigate('/profile')
              setMobileMenuOpen(false)
            }}
            className="mobile-action-btn"
          >
            个人中心
          </Button>
          <Button
            type="text"
            block
            danger
            icon={<LogoutOutlined />}
            onClick={() => {
              handleLogout()
              setMobileMenuOpen(false)
            }}
            className="mobile-action-btn"
          >
            退出登录
          </Button>
        </div>
      </Drawer>

      <Content className="layout-content">
        <Outlet />
      </Content>
    </Layout>
  )
}

export default MainLayout

