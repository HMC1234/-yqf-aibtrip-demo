// Navan风格登录页面
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined, RobotOutlined } from '@ant-design/icons'
import { useAuthStore } from '../../store/authStore'
import './Login.css'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { signIn, loading } = useAuthStore()
  const [form] = Form.useForm()

  const onFinish = async (values: { email: string; password: string }) => {
    const { error } = await signIn(values.email, values.password)
    
    if (error) {
      message.error('登录失败：' + (error.message || '用户名或密码错误'))
    } else {
      message.success('登录成功！')
      navigate('/dashboard')
    }
  }

  return (
    <div className="login-container">
      {/* Navan风格Logo（顶部中心） */}
      <div className="login-logo">
        <div className="login-logo-text">YQFAIBTRIP</div>
      </div>

      <div className="login-card">
        {/* Logo和标题区域 */}
        <div className="login-card-header">
          <div className="login-card-logo">
            <div className="login-card-logo-icon">
              <RobotOutlined />
            </div>
          </div>
          <h1 className="login-card-title">一起飞智能商旅</h1>
          <p className="login-card-subtitle">Business Travel Solutions</p>
        </div>

        {/* 登录表单 */}
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          className="login-form"
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱！' },
              { type: 'email', message: '请输入有效的邮箱地址！' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入您的邮箱"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入您的密码"
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 32 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              size="large"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login





