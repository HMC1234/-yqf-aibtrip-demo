// AI预订主页面（包含3个标签页）
import React, { useState } from 'react'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
import { RobotOutlined, FileTextOutlined, ThunderboltOutlined } from '@ant-design/icons'
import AIChat from './AIChat'
import AllRecommendations from './AllRecommendations'
import ApprovedRequests from './ApprovedRequests'
import './AIBooking.css'

const AIBooking: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chat')

  const tabItems: TabsProps['items'] = [
    {
      key: 'chat',
      label: (
        <span>
          <RobotOutlined />
          智能对话预订
        </span>
      ),
      children: <AIChat />,
    },
    {
      key: 'recommendations',
      label: (
        <span>
          <ThunderboltOutlined />
          AI推荐方案
        </span>
      ),
      children: <AllRecommendations />,
    },
    {
      key: 'approved-requests',
      label: (
        <span>
          <FileTextOutlined />
          已审批申请列表
        </span>
      ),
      children: <ApprovedRequests />,
    },
  ]

  return (
    <div className="ai-booking">
      <Tabs
        activeKey={activeTab}
        items={tabItems}
        onChange={setActiveTab}
        size="large"
      />
    </div>
  )
}

export default AIBooking

