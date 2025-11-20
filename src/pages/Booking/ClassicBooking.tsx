// 经典预订搜索页面
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Card,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Radio,
  Space,
  message,
} from 'antd'
import {
  SearchOutlined,
  CarOutlined,
  HomeOutlined,
  AppstoreOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import dayjs, { Dayjs } from 'dayjs'
import { supabase } from '../../lib/supabase'
import './ClassicBooking.css'

const { RangePicker } = DatePicker

const ClassicBooking: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [form] = Form.useForm()
  const [productType, setProductType] = useState<string>('flight')
  const [loading, setLoading] = useState(false)

  // 如果从申请单跳转，自动填充参数
  useEffect(() => {
    if (location.state) {
      const { origin, destination, departure_date, return_date, products } = location.state as any
      if (origin && destination) {
        form.setFieldsValue({
          origin,
          destination,
          date_range: departure_date && return_date ? [
            dayjs(departure_date),
            dayjs(return_date)
          ] : departure_date ? dayjs(departure_date) : undefined,
        })
        // 如果只有一个产品类型，自动选择
        if (products && products.length === 1) {
          setProductType(products[0])
        }
      }
    }
  }, [location.state, form])

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        message.error('请先登录')
        return
      }

      // 记录搜索记录
      const dateRange = values.date_range as [Dayjs, Dayjs] | Dayjs | undefined
      let departure_date: string | undefined
      let return_date: string | undefined

      if (Array.isArray(dateRange)) {
        departure_date = dateRange[0]?.format('YYYY-MM-DD')
        return_date = dateRange[1]?.format('YYYY-MM-DD')
      } else if (dateRange) {
        departure_date = dateRange.format('YYYY-MM-DD')
      }
      
      const searchRecord = {
        user_id: user.id,
        product_type: productType,
        origin: values.origin,
        destination: values.destination,
        departure_date,
        return_date,
        passenger_count: values.passenger_count || 1,
        search_source: location.state ? 'travel_request' : 'independent',
        travel_request_id: (location.state as any)?.travel_request_id || null,
        has_order: false,
        search_params: {
          cabin_class: values.cabin_class,
          hotel_star: values.hotel_star,
        },
      }

      // 保存搜索记录
      const { data: insertedRecord } = await supabase
        .from('search_records')
        .insert(searchRecord)
        .select()
        .single()

      // 跳转到产品列表页面
      navigate('/booking/products', {
        state: {
          productType,
          searchParams: {
            ...values,
            date_range: dateRange,
          },
          searchRecord: insertedRecord,
        },
      })
    } catch (error: any) {
      message.error('搜索失败：' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="classic-booking">
      <Card title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SearchOutlined />
          <span>经典预订</span>
        </div>
      }>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            productType: 'flight',
            passenger_count: 1,
          }}
        >
          <Form.Item label="产品类型" name="productType">
            <Radio.Group
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              buttonStyle="solid"
              size="large"
            >
              <Radio.Button value="flight">
                <ThunderboltOutlined /> 机票
              </Radio.Button>
              <Radio.Button value="hotel">
                <HomeOutlined /> 酒店
              </Radio.Button>
              <Radio.Button value="train">
                <AppstoreOutlined /> 火车票
              </Radio.Button>
              <Radio.Button value="car">
                <CarOutlined /> 用车
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="出发地"
            name="origin"
            rules={[{ required: true, message: '请输入出发地' }]}
          >
            <Input placeholder="例如：北京" size="large" />
          </Form.Item>

          <Form.Item
            label="目的地"
            name="destination"
            rules={[{ required: true, message: '请输入目的地' }]}
          >
            <Input placeholder="例如：上海" size="large" />
          </Form.Item>

          {productType === 'flight' && (
            <Form.Item
              label="出发日期和回程日期"
              name="date_range"
              rules={[{ required: true, message: '请选择日期' }]}
            >
              <RangePicker
                style={{ width: '100%' }}
                size="large"
                disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </Form.Item>
          )}

          {productType === 'hotel' && (
            <>
              <Form.Item
                label="入住日期和退房日期"
                name="date_range"
                rules={[{ required: true, message: '请选择日期' }]}
              >
                <RangePicker
                  style={{ width: '100%' }}
                  size="large"
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>
              <Form.Item label="酒店星级" name="hotel_star">
                <Select size="large" placeholder="选择酒店星级">
                  <Select.Option value="3">三星级</Select.Option>
                  <Select.Option value="4">四星级</Select.Option>
                  <Select.Option value="5">五星级</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}

          {productType === 'train' && (
            <Form.Item
              label="出发日期"
              name="date_range"
              rules={[{ required: true, message: '请选择日期' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                size="large"
                disabledDate={(current) => current && current < dayjs().startOf('day')}
                format="YYYY-MM-DD"
              />
            </Form.Item>
          )}

          {productType === 'car' && (
            <Form.Item
              label="用车日期"
              name="date_range"
              rules={[{ required: true, message: '请选择日期' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                size="large"
                disabledDate={(current) => current && current < dayjs().startOf('day')}
                format="YYYY-MM-DD"
              />
            </Form.Item>
          )}

          <Form.Item label="人数/房间数" name="passenger_count">
            <Select size="large" style={{ width: 200 }}>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <Select.Option key={num} value={num}>
                  {num} {productType === 'hotel' ? '间' : '人'}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {productType === 'flight' && (
            <Form.Item label="舱位等级" name="cabin_class">
              <Select size="large" placeholder="选择舱位">
                <Select.Option value="economy">经济舱</Select.Option>
                <Select.Option value="business">商务舱</Select.Option>
                <Select.Option value="first">头等舱</Select.Option>
              </Select>
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              icon={<SearchOutlined />}
              loading={loading}
              block
            >
              搜索
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default ClassicBooking

