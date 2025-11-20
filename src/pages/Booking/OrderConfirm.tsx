// 订单确认页面
import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Card,
  Descriptions,
  Button,
  Space,
  Form,
  Input,
  message,
  Spin,
} from 'antd'
import { CheckOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { supabase } from '../../lib/supabase'
import './OrderConfirm.css'

const { TextArea } = Input

const OrderConfirm: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const { product, searchParams, productType, searchRecord, aiRecommendationId } = location.state || {}

  // 验证必需数据
  if (!product || !productType) {
    message.error('缺少产品信息或产品类型')
    setTimeout(() => {
      navigate('/booking/classic')
    }, 1000)
    return null
  }

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      // 验证必需数据
      if (!product) {
        message.error('缺少产品信息')
        return
      }

      if (!productType) {
        message.error('缺少产品类型信息')
        console.error('productType is missing:', { product, searchParams, productType, searchRecord, aiRecommendationId })
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        message.error('请先登录')
        return
      }

      // 获取用户信息
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('company_id, department_id, cost_center_id')
        .eq('id', user.id)
        .single()

      if (userError || !userData) {
        console.error('获取用户信息失败:', userError)
        message.error('获取用户信息失败：' + (userError?.message || '用户数据不存在'))
        return
      }

      // 生成订单号
      const bookingSource = aiRecommendationId ? 'ai_recommendation' : 'classic'
      const { data: orderNo, error: noError } = await supabase.rpc(
        'generate_order_no',
        { booking_source: bookingSource }
      )

      if (noError || !orderNo) {
        console.error('生成订单号失败:', noError)
        message.error('生成订单号失败：' + (noError?.message || '订单号为空'))
        return
      }

      // 处理日期格式
      let departure_date: string | undefined
      let return_date: string | undefined

      // 优先使用departure_date和return_date
      if (searchParams?.departure_date) {
        departure_date = typeof searchParams.departure_date === 'string' 
          ? searchParams.departure_date 
          : searchParams.departure_date?.format?.('YYYY-MM-DD')
      } else if (searchParams?.date_range?.[0]) {
        departure_date = searchParams.date_range[0]?.format?.('YYYY-MM-DD')
      }

      if (searchParams?.return_date) {
        return_date = typeof searchParams.return_date === 'string' 
          ? searchParams.return_date 
          : searchParams.return_date?.format?.('YYYY-MM-DD')
      } else if (searchParams?.date_range?.[1]) {
        return_date = searchParams.date_range[1]?.format?.('YYYY-MM-DD')
      }

      // 创建订单
      // product_details是JSONB字段，需要包含所有产品信息和联系信息
      const productDetails = {
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        currency: product.currency || 'CNY',
        contact_name: values.contact_name,
        contact_phone: values.contact_phone,
        remarks: values.remarks || '',
        company_id: userData.company_id,
        department_id: userData.department_id,
        cost_center_id: userData.cost_center_id,
        ...(product.details || {}), // 包含产品详细信息（如航班号、酒店名等）
      }

      const orderData: any = {
        order_no: orderNo,
        user_id: user.id,
        product_type: productType,
        product_details: productDetails, // JSONB字段，包含所有产品信息和联系信息
        origin: searchParams?.origin || '',
        destination: searchParams?.destination || '',
        total_amount: product.price,
        currency: product.currency || 'CNY',
        status: 'pending',
        booking_source: bookingSource === 'ai_recommendation' ? 'ai_recommendation' : 'classic',
      }

      // 添加日期字段（如果存在）
      if (departure_date) {
        orderData.departure_date = departure_date
      }
      if (return_date) {
        orderData.return_date = return_date
      }

      // 如果是从AI推荐跳转，关联推荐方案
      if (aiRecommendationId) {
        orderData.ai_recommendation_id = aiRecommendationId
      }

      // 如果是从申请单跳转，关联申请单
      if (searchRecord?.travel_request_id) {
        orderData.travel_request_id = searchRecord.travel_request_id
      }

      console.log('准备创建订单:', orderData)

      const { data: order, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single()

      if (error) {
        console.error('创建订单失败:', error, '订单数据:', orderData)
        message.error('创建订单失败：' + error.message)
        return
      }

      if (!order) {
        console.error('创建订单失败: order is null')
        message.error('创建订单失败：未返回订单数据')
        return
      }

      // 更新搜索记录（如果存在）
      if (searchRecord?.id) {
        const { error: updateError } = await supabase
          .from('search_records')
          .update({
            has_order: true,
            order_id: order.id,
          })
          .eq('id', searchRecord.id)

        if (updateError) {
          console.error('更新搜索记录失败:', updateError)
          // 不阻止订单创建成功，只记录错误
        }
      }

      message.success('订单创建成功！订单号：' + orderNo)
      setTimeout(() => {
        navigate('/booking/orders')
      }, 1000)
    } catch (error: any) {
      console.error('创建订单异常:', error)
      message.error('创建订单失败：' + (error?.message || '未知错误'))
    } finally {
      setLoading(false)
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

  return (
    <div className="order-confirm">
      <Card
        title="确认订单信息"
        extra={
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          >
            返回
          </Button>
        }
      >
        <Descriptions column={2} bordered style={{ marginBottom: 24 }}>
          <Descriptions.Item label="产品类型">
            {getProductTypeName(productType)}
          </Descriptions.Item>
          <Descriptions.Item label="产品名称">
            {product.name}
          </Descriptions.Item>
          <Descriptions.Item label="出发地">
            {searchParams?.origin}
          </Descriptions.Item>
          <Descriptions.Item label="目的地">
            {searchParams?.destination}
          </Descriptions.Item>
          {searchParams?.departure_date && (
            <Descriptions.Item label="出发日期">
              {typeof searchParams.departure_date === 'string' 
                ? searchParams.departure_date 
                : searchParams.departure_date?.format?.('YYYY-MM-DD') || 
                  searchParams.departure_date?.toString?.() || '-'}
            </Descriptions.Item>
          )}
          {searchParams?.return_date && (
            <Descriptions.Item label="回程日期">
              {typeof searchParams.return_date === 'string' 
                ? searchParams.return_date 
                : searchParams.return_date?.format?.('YYYY-MM-DD') || 
                  searchParams.return_date?.toString?.() || '-'}
            </Descriptions.Item>
          )}
          {searchParams?.date_range && Array.isArray(searchParams.date_range) && (
            <>
              <Descriptions.Item label="出发日期">
                {searchParams.date_range[0]?.format?.('YYYY-MM-DD') || 
                 (typeof searchParams.date_range[0] === 'string' ? searchParams.date_range[0] : 
                  searchParams.date_range[0]?.toString?.() || '-')}
              </Descriptions.Item>
              {searchParams.date_range[1] && (
                <Descriptions.Item label="回程日期">
                  {searchParams.date_range[1]?.format?.('YYYY-MM-DD') || 
                   (typeof searchParams.date_range[1] === 'string' ? searchParams.date_range[1] : 
                    searchParams.date_range[1]?.toString?.() || '-')}
                </Descriptions.Item>
              )}
            </>
          )}
          <Descriptions.Item label="人数/房间数">
            {searchParams?.passenger_count || 1}
          </Descriptions.Item>
          <Descriptions.Item label="订单金额">
            <span style={{ fontSize: 20, fontWeight: 'bold', color: '#1890ff' }}>
              ¥{product.price}
            </span>
          </Descriptions.Item>
        </Descriptions>

        <Card title="联系信息" style={{ marginBottom: 24 }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              contact_name: '',
              contact_phone: '',
              remarks: '',
            }}
          >
            <Form.Item
              label="联系人姓名"
              name="contact_name"
              rules={[{ required: true, message: '请输入联系人姓名' }]}
            >
              <Input size="large" placeholder="请输入联系人姓名" />
            </Form.Item>

            <Form.Item
              label="联系电话"
              name="contact_phone"
              rules={[
                { required: true, message: '请输入联系电话' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' },
              ]}
            >
              <Input size="large" placeholder="请输入手机号码" />
            </Form.Item>

            <Form.Item label="备注" name="remarks">
              <TextArea
                rows={4}
                placeholder="请输入备注信息（可选）"
                maxLength={500}
                showCount
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  icon={<CheckOutlined />}
                  loading={loading}
                >
                  确认下单
                </Button>
                <Button size="large" onClick={() => navigate(-1)}>
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Card>
    </div>
  )
}

export default OrderConfirm

