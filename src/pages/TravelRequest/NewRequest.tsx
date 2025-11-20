// 提交出差申请页面
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  Checkbox,
  message,
  Space,
} from 'antd'
import { supabase } from '../../lib/supabase'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import './NewRequest.css'

const { TextArea } = Input
const { RangePicker } = DatePicker

const NewRequest: React.FC = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        message.error('请先登录')
        navigate('/login')
        return
      }

      // 获取用户信息
      const { data: userData } = await supabase
        .from('users')
        .select('company_id, department_id, cost_center_id')
        .eq('id', user.id)
        .single()

      if (!userData) {
        message.error('获取用户信息失败')
        return
      }

      // 生成申请单号
      const { data: requestNo, error: noError } = await supabase.rpc(
        'generate_travel_request_no',
        { source_type: 'JD' }
      )

      if (noError || !requestNo) {
        message.error('生成申请单号失败')
        return
      }

      // 解析日期
      const [departure_date, return_date] = values.date_range as [Dayjs, Dayjs]

      // 插入申请单
      const { data, error } = await supabase
        .from('travel_requests')
        .insert({
          request_no: requestNo,
          user_id: user.id,
          company_id: userData.company_id,
          department_id: userData.department_id,
          cost_center_id: userData.cost_center_id,
          origin: values.origin,
          destination: values.destination,
          departure_date: departure_date.format('YYYY-MM-DD'),
          return_date: return_date.format('YYYY-MM-DD'),
          reason: values.reason,
          products: values.products,
          status: 'pending',
          source: 'manual',
        })
        .select()
        .single()

      if (error) {
        message.error('提交失败：' + error.message)
      } else {
        message.success('提交成功！申请单号：' + requestNo)
        navigate('/travel-request/list')
      }
    } catch (error: any) {
      message.error('提交失败：' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="new-request">
      <Card title="提交出差申请">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            products: [],
          }}
        >
          <Form.Item
            label="出发地"
            name="origin"
            rules={[{ required: true, message: '请输入出发地' }]}
          >
            <Input placeholder="例如：北京" />
          </Form.Item>

          <Form.Item
            label="目的地"
            name="destination"
            rules={[{ required: true, message: '请输入目的地' }]}
          >
            <Input placeholder="例如：上海" />
          </Form.Item>

          <Form.Item
            label="出发日期和回程日期"
            name="date_range"
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <RangePicker
              style={{ width: '100%' }}
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>

          <Form.Item
            label="出差原因"
            name="reason"
            rules={[
              { required: true, message: '请输入出差原因' },
              { min: 10, message: '出差原因至少10个字符' },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="请详细说明出差原因..."
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item
            label="需要预订的产品"
            name="products"
            rules={[
              { required: true, message: '请至少选择一种产品' },
              { type: 'array', min: 1, message: '请至少选择一种产品' },
            ]}
          >
            <Checkbox.Group>
              <Space direction="vertical">
                <Checkbox value="flight">机票</Checkbox>
                <Checkbox value="hotel">酒店</Checkbox>
                <Checkbox value="train">火车票</Checkbox>
                <Checkbox value="car">用车</Checkbox>
              </Space>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                提交申请
              </Button>
              <Button onClick={() => navigate('/travel-request/list')}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default NewRequest

