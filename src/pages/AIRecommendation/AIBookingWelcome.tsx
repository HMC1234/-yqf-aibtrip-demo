// AI预订欢迎/选择页面 - 过渡页面
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Card, Button, Space } from 'antd'
import {
  RobotOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  StarOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons'
import './AIBookingWelcome.css'

const AIBookingWelcome: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const options = [
    {
      id: 'chat',
      icon: <MessageOutlined />,
      title: 'AI智能对话预订',
      description: '和AI聊聊您的需求，它比您想象的更懂您',
      highlight: '💬 像聊天一样简单',
      color: 'purple',
      route: '/ai-booking/chat',
      action: '开始对话',
    },
    {
      id: 'approved',
      icon: <CheckCircleOutlined />,
      title: '通过已审批申请单预订',
      description: '申请已通过？直接预订，一步到位',
      highlight: '✅ 无需重复填写',
      color: 'green',
      route: '/ai-booking/approved-requests',
      action: '查看申请单',
    },
    {
      id: 'recommendations',
      icon: <StarOutlined />,
      title: '查看所有AI推荐方案',
      description: '看看AI为您推荐了什么好方案',
      highlight: '⭐ 历史推荐一览',
      color: 'blue',
      route: '/ai-booking/recommendations',
      action: '查看推荐',
    },
  ]

  const handleSelect = (route: string) => {
    // 防止重复导航
    if (location.pathname !== route) {
      navigate(route)
    }
  }

  return (
    <div className="ai-booking-welcome">
      {/* 顶部欢迎区域 */}
      <div className="welcome-header">
        <div className="welcome-icon-wrapper">
          <RobotOutlined className="welcome-main-icon" />
        </div>
        <h1 className="welcome-title">AI智能预订，开启您的旅程</h1>
        <p className="welcome-subtitle">
          三种方式，任您选择
        </p>
      </div>

      {/* 选择卡片区域 */}
      <div className="welcome-options">
        {options.map((option) => (
          <Card
            key={option.id}
            className={`welcome-option-card welcome-card-${option.color}`}
            hoverable
            onClick={() => handleSelect(option.route)}
          >
            <div className="option-card-header">
              <div className={`option-icon-wrapper option-icon-${option.color}`}>
                {option.icon}
              </div>
              <div className="option-card-title-row">
                <h3 className="option-title">{option.title}</h3>
                <Button
                  type="primary"
                  className={`option-action-btn option-btn-${option.color}`}
                  icon={<ArrowRightOutlined />}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelect(option.route)
                  }}
                >
                  {option.action}
                </Button>
              </div>
            </div>
            <div className="option-card-content">
              <p className="option-highlight">{option.highlight}</p>
              <p className="option-description">{option.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* 底部提示 */}
      <div className="welcome-footer">
        <p className="footer-tip">
          💡 温馨提示：选错了？随时可以换
        </p>
      </div>
    </div>
  )
}

export default AIBookingWelcome

