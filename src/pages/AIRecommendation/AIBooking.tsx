// AI预订主页面（包含3个固定标签页）
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Tabs, Button } from 'antd'
import type { TabsProps } from 'antd'
import { RobotOutlined, FileTextOutlined, ThunderboltOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import AIChat from './AIChat'
import AllRecommendations from './AllRecommendations'
import ApprovedRequests from './ApprovedRequests'
import './AIBooking.css'

interface AIBookingProps {
  defaultTab?: 'chat' | 'recommendations' | 'approved-requests'
}

const AIBooking: React.FC<AIBookingProps> = ({ defaultTab = 'chat' }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(defaultTab)

  // 根据当前路径确定activeTab
  useEffect(() => {
    const path = location.pathname
    if (path.includes('/chat')) {
      setActiveTab('chat')
    } else if (path.includes('/recommendations')) {
      setActiveTab('recommendations')
    } else if (path.includes('/approved-requests')) {
      setActiveTab('approved-requests')
    } else {
      setActiveTab(defaultTab)
    }
  }, [location.pathname, defaultTab])

  // 当activeTab变化时更新路由
  const handleTabChange = (key: string) => {
    // 类型检查，确保key是有效的tab值
    if (key === 'chat' || key === 'recommendations' || key === 'approved-requests') {
      // 防止重复导航
      const currentPath = location.pathname
      const targetPath = key === 'chat' ? '/ai-booking/chat' 
                     : key === 'recommendations' ? '/ai-booking/recommendations'
                     : '/ai-booking/approved-requests'
      
      if (currentPath !== targetPath) {
        setActiveTab(key)
        navigate(targetPath, { replace: true })
      }
    }
  }

  const tabItems: TabsProps['items'] = [
    {
      key: 'chat',
      label: (
        <span className="ai-tab-label">
          <RobotOutlined />
          <span>智能对话预订</span>
        </span>
      ),
      children: <AIChat />,
    },
    {
      key: 'recommendations',
      label: (
        <span className="ai-tab-label">
          <ThunderboltOutlined />
          <span>AI推荐方案</span>
        </span>
      ),
      children: <AllRecommendations />,
    },
    {
      key: 'approved-requests',
      label: (
        <span className="ai-tab-label">
          <FileTextOutlined />
          <span>已审批申请列表</span>
        </span>
      ),
      children: <ApprovedRequests />,
    },
  ]

  return (
    <div className="ai-booking">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/ai-booking')}
        className="ai-booking-back-btn"
      >
        返回选择
      </Button>
      <div className="ai-booking-header">
        <Tabs
          activeKey={activeTab}
          items={tabItems}
          onChange={handleTabChange}
          size="large"
          className="ai-booking-tabs"
        />
      </div>
      <div className="ai-booking-content">
        {tabItems.find((item) => item.key === activeTab)?.children}
      </div>
    </div>
  )
}

export default AIBooking
