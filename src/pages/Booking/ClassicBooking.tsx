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

// 常见城市列表（参考携程）
const COMMON_CITIES = [
  { label: '北京', value: '北京' },
  { label: '上海', value: '上海' },
  { label: '广州', value: '广州' },
  { label: '深圳', value: '深圳' },
  { label: '杭州', value: '杭州' },
  { label: '成都', value: '成都' },
  { label: '重庆', value: '重庆' },
  { label: '西安', value: '西安' },
  { label: '南京', value: '南京' },
  { label: '武汉', value: '武汉' },
  { label: '天津', value: '天津' },
  { label: '苏州', value: '苏州' },
  { label: '长沙', value: '长沙' },
  { label: '郑州', value: '郑州' },
  { label: '青岛', value: '青岛' },
  { label: '大连', value: '大连' },
  { label: '厦门', value: '厦门' },
  { label: '昆明', value: '昆明' },
  { label: '三亚', value: '三亚' },
  { label: '哈尔滨', value: '哈尔滨' },
]

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
      
      // 根据产品类型构建搜索记录
      const searchRecord: any = {
        user_id: user.id,
        product_type: productType,
        search_source: location.state ? 'travel_request' : 'independent',
        travel_request_id: (location.state as any)?.travel_request_id || null,
        has_order: false,
        search_params: {},
      }

      // 机票和火车票
      if (productType === 'flight' || productType === 'train') {
        searchRecord.origin = values.origin
        searchRecord.destination = values.destination
        searchRecord.departure_date = departure_date
        searchRecord.return_date = return_date
        searchRecord.passenger_count = values.passenger_count || 1
        searchRecord.search_params = {
          cabin_class: values.cabin_class,
        }
      }

      // 酒店
      if (productType === 'hotel') {
        searchRecord.origin = values.city // 酒店使用city作为origin
        searchRecord.destination = values.city
        searchRecord.departure_date = departure_date // 入住日期
        searchRecord.return_date = return_date // 退房日期
        searchRecord.passenger_count = values.guest_count || 1
        searchRecord.search_params = {
          room_count: values.room_count || 1,
          guest_count: values.guest_count || 2,
          hotel_star: values.hotel_star || '',
          location_preference: values.location_preference || '',
          price_range: values.price_range || '',
        }
      }

      // 用车
      if (productType === 'car') {
        searchRecord.origin = values.origin
        searchRecord.destination = values.destination
        searchRecord.departure_date = departure_date
        // 用车没有return_date，使用duration计算
        searchRecord.passenger_count = 1 // 用车通常按车计算
        searchRecord.search_params = {
          city: values.city,
          car_time: values.car_time,
          car_type: values.car_type,
          service_type: values.service_type,
          duration: values.duration || 2,
        }
      }

      // 保存搜索记录
      const { data: insertedRecord } = await supabase
        .from('search_records')
        .insert(searchRecord)
        .select()
        .single()

      // 构建传递给产品列表的搜索参数
      const searchParamsForProduct: any = {
        ...values,
        date_range: dateRange,
      }

      // 酒店：将city映射为origin和destination
      if (productType === 'hotel' && values.city) {
        searchParamsForProduct.origin = values.city
        searchParamsForProduct.destination = values.city
      }

      // 用车：添加city字段
      if (productType === 'car') {
        searchParamsForProduct.city = values.city
      }

      // 跳转到产品列表页面
      navigate('/booking/products', {
        state: {
          productType,
          searchParams: searchParamsForProduct,
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
              onChange={(e) => {
                const newType = e.target.value
                setProductType(newType)
                // 切换产品类型时，清除相关字段
                if (newType === 'hotel' || newType === 'car') {
                  form.setFieldsValue({
                    origin: undefined,
                    destination: undefined,
                  })
                } else {
                  form.setFieldsValue({
                    city: undefined,
                  })
                }
              }}
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

          {/* 机票和火车票：出发地和目的地 */}
          {(productType === 'flight' || productType === 'train') && (
            <>
              <Form.Item
                label="出发地"
                name="origin"
                rules={[{ required: true, message: '请选择出发地' }]}
              >
                <Select
                  size="large"
                  placeholder="请选择出发地"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={COMMON_CITIES}
                />
              </Form.Item>

              <Form.Item
                label="目的地"
                name="destination"
                rules={[{ required: true, message: '请选择目的地' }]}
              >
                <Select
                  size="large"
                  placeholder="请选择目的地"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={COMMON_CITIES}
                />
              </Form.Item>
            </>
          )}

          {/* 酒店：入住城市 */}
          {productType === 'hotel' && (
            <Form.Item
              label="入住城市"
              name="city"
              rules={[{ required: true, message: '请选择入住城市' }]}
            >
              <Select
                size="large"
                placeholder="请选择入住城市"
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={COMMON_CITIES}
              />
            </Form.Item>
          )}

          {/* 用车：用车城市 */}
          {productType === 'car' && (
            <Form.Item
              label="用车城市"
              name="city"
              rules={[{ required: true, message: '请选择用车城市' }]}
            >
              <Select
                size="large"
                placeholder="请选择用车城市"
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={COMMON_CITIES}
              />
            </Form.Item>
          )}

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
                rules={[{ required: true, message: '请选择入住和退房日期' }]}
              >
                <RangePicker
                  style={{ width: '100%' }}
                  size="large"
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
              
              <Form.Item 
                label="房间数" 
                name="room_count"
                rules={[{ required: true, message: '请选择房间数' }]}
                initialValue={1}
              >
                <Select size="large" placeholder="选择房间数">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <Select.Option key={num} value={num}>
                      {num} 间
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item 
                label="入住人数" 
                name="guest_count"
                rules={[{ required: true, message: '请选择入住人数' }]}
                initialValue={2}
              >
                <Select size="large" placeholder="选择入住人数">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <Select.Option key={num} value={num}>
                      {num} 人
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="酒店星级" name="hotel_star">
                <Select size="large" placeholder="不限（可选择星级）">
                  <Select.Option value="">不限</Select.Option>
                  <Select.Option value="5">五星级/豪华型</Select.Option>
                  <Select.Option value="4">四星级/高档型</Select.Option>
                  <Select.Option value="3">三星级/舒适型</Select.Option>
                  <Select.Option value="2">二星级/经济型</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="位置偏好" name="location_preference">
                <Select size="large" placeholder="不限（可选择位置）">
                  <Select.Option value="">不限</Select.Option>
                  <Select.Option value="downtown">市中心</Select.Option>
                  <Select.Option value="airport">机场附近</Select.Option>
                  <Select.Option value="station">火车站附近</Select.Option>
                  <Select.Option value="business">商务区</Select.Option>
                  <Select.Option value="scenic">景区附近</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="价格区间（元/晚）" name="price_range">
                <Select size="large" placeholder="不限（可选择价格区间）">
                  <Select.Option value="">不限</Select.Option>
                  <Select.Option value="0-300">￥0-300</Select.Option>
                  <Select.Option value="300-500">￥300-500</Select.Option>
                  <Select.Option value="500-800">￥500-800</Select.Option>
                  <Select.Option value="800-1200">￥800-1200</Select.Option>
                  <Select.Option value="1200+">￥1200以上</Select.Option>
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
            <>
              <Form.Item
                label="用车日期"
                name="date_range"
                rules={[{ required: true, message: '请选择用车日期' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  size="large"
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                  format="YYYY-MM-DD"
                />
              </Form.Item>

              <Form.Item
                label="用车时间"
                name="car_time"
                rules={[{ required: true, message: '请选择用车时间' }]}
              >
                <Select size="large" placeholder="选择用车时间">
                  <Select.Option value="08:00">08:00</Select.Option>
                  <Select.Option value="09:00">09:00</Select.Option>
                  <Select.Option value="10:00">10:00</Select.Option>
                  <Select.Option value="11:00">11:00</Select.Option>
                  <Select.Option value="12:00">12:00</Select.Option>
                  <Select.Option value="13:00">13:00</Select.Option>
                  <Select.Option value="14:00">14:00</Select.Option>
                  <Select.Option value="15:00">15:00</Select.Option>
                  <Select.Option value="16:00">16:00</Select.Option>
                  <Select.Option value="17:00">17:00</Select.Option>
                  <Select.Option value="18:00">18:00</Select.Option>
                  <Select.Option value="19:00">19:00</Select.Option>
                  <Select.Option value="20:00">20:00</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="出发地点"
                name="origin"
                rules={[{ required: true, message: '请输入出发地点' }]}
              >
                <Input placeholder="例如：北京首都机场T3航站楼" size="large" />
              </Form.Item>

              <Form.Item
                label="目的地"
                name="destination"
                rules={[{ required: true, message: '请输入目的地' }]}
              >
                <Input placeholder="例如：北京国贸CBD" size="large" />
              </Form.Item>

              <Form.Item
                label="车型选择"
                name="car_type"
                rules={[{ required: true, message: '请选择车型' }]}
              >
                <Select size="large" placeholder="选择车型">
                  <Select.Option value="economy">经济型（5座）</Select.Option>
                  <Select.Option value="comfort">舒适型（5座）</Select.Option>
                  <Select.Option value="business">商务型（7座）</Select.Option>
                  <Select.Option value="luxury">豪华型（5座）</Select.Option>
                  <Select.Option value="suv">SUV（5座/7座）</Select.Option>
                  <Select.Option value="mpv">MPV（7座）</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="服务类型"
                name="service_type"
                rules={[{ required: true, message: '请选择服务类型' }]}
                initialValue="with_driver"
              >
                <Radio.Group size="large">
                  <Radio value="with_driver">带司机</Radio>
                  <Radio value="self_drive">自驾</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item 
                label="预计用车时长（小时）" 
                name="duration"
                rules={[{ required: true, message: '请选择预计用车时长' }]}
                initialValue={2}
              >
                <Select size="large" placeholder="选择预计用车时长">
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12, 24].map((num) => (
                    <Select.Option key={num} value={num}>
                      {num} {num >= 24 ? '天' : '小时'}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}

          {/* 机票和火车票：人数 */}
          {(productType === 'flight' || productType === 'train') && (
            <Form.Item 
              label="人数" 
              name="passenger_count"
              rules={[{ required: true, message: '请选择人数' }]}
              initialValue={1}
            >
              <Select size="large" style={{ width: 200 }} placeholder="选择人数">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <Select.Option key={num} value={num}>
                    {num} 人
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}

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

