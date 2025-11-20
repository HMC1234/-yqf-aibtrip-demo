// 登录页面
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
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
      <Card className="login-card" title="YQFAIBTRIP 一起飞智能商旅系统">
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱！' },
              { type: 'email', message: '请输入有效的邮箱地址！' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="邮箱"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>

          <div className="login-tip">
            <p>测试账号：test@example.com</p>
            <p>测试密码：123456</p>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Login





