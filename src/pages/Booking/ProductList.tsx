// 产品列表页面
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Card,
  List,
  Button,
  Tag,
  Space,
  Empty,
  Spin,
  message,
} from 'antd'
import { CheckOutlined, EyeOutlined } from '@ant-design/icons'
import { supabase } from '../../lib/supabase'
import './ProductList.css'

interface Product {
  id: string
  product_type: string
  name: string
  description: string
  price: number
  currency: string
  details: any
}

const ProductList: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)

  const { productType, searchParams, searchRecord } = location.state || {}

  useEffect(() => {
    if (productType && searchParams) {
      loadProducts()
    } else {
      message.error('缺少搜索参数')
      navigate('/booking/classic')
    }
  }, [productType, searchParams])

  const loadProducts = async () => {
    setLoading(true)
    try {
      // 模拟产品数据（实际应该从API获取）
      await new Promise(resolve => setTimeout(resolve, 1000))

      const mockProducts: Product[] = generateMockProducts(productType, searchParams)
      setProducts(mockProducts)
    } catch (error: any) {
      message.error('加载产品失败：' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const generateMockProducts = (type: string, params: any): Product[] => {
    const baseProducts: Product[] = []
    const origin = params.origin || '北京'
    const destination = params.destination || '上海'

    if (type === 'flight') {
      baseProducts.push(
        {
          id: 'flight-1',
          product_type: 'flight',
          name: '中国国际航空 CA1234',
          description: `${origin} → ${destination} | 直飞 | 08:00-10:30`,
          price: 1200,
          currency: 'CNY',
          details: {
            flight_no: 'CA1234',
            airline: '中国国际航空',
            departure_time: '08:00',
            arrival_time: '10:30',
            cabin_class: '经济舱',
            aircraft: '波音737',
          },
        },
        {
          id: 'flight-2',
          product_type: 'flight',
          name: '中国东方航空 MU5678',
          description: `${origin} → ${destination} | 直飞 | 14:00-16:30`,
          price: 980,
          currency: 'CNY',
          details: {
            flight_no: 'MU5678',
            airline: '中国东方航空',
            departure_time: '14:00',
            arrival_time: '16:30',
            cabin_class: '经济舱',
            aircraft: '空客A320',
          },
        },
        {
          id: 'flight-3',
          product_type: 'flight',
          name: '中国南方航空 CZ9012',
          description: `${origin} → ${destination} | 直飞 | 10:00-12:30 | 商务舱`,
          price: 3500,
          currency: 'CNY',
          details: {
            flight_no: 'CZ9012',
            airline: '中国南方航空',
            departure_time: '10:00',
            arrival_time: '12:30',
            cabin_class: '商务舱',
            aircraft: '空客A330',
          },
        }
      )
    } else if (type === 'hotel') {
      baseProducts.push(
        {
          id: 'hotel-1',
          product_type: 'hotel',
          name: '上海外滩华尔道夫酒店',
          description: '五星级 | 市中心 | 外滩景观',
          price: 800,
          currency: 'CNY',
          details: {
            star_rating: 5,
            location: '市中心',
            facilities: ['免费WiFi', '健身房', '商务中心', '游泳池'],
            check_in: '14:00',
            check_out: '12:00',
          },
        },
        {
          id: 'hotel-2',
          product_type: 'hotel',
          name: '上海和平饭店',
          description: '五星级 | 外滩 | 历史建筑',
          price: 1200,
          currency: 'CNY',
          details: {
            star_rating: 5,
            location: '外滩',
            facilities: ['免费WiFi', '健身房', '商务中心', 'SPA'],
            check_in: '14:00',
            check_out: '12:00',
          },
        }
      )
    } else if (type === 'train') {
      baseProducts.push(
        {
          id: 'train-1',
          product_type: 'train',
          name: 'G1 高速列车',
          description: `${origin} → ${destination} | 08:00-12:30 | 商务座`,
          price: 550,
          currency: 'CNY',
          details: {
            train_no: 'G1',
            departure_time: '08:00',
            arrival_time: '12:30',
            seat_type: '商务座',
            duration: '4小时30分',
          },
        },
        {
          id: 'train-2',
          product_type: 'train',
          name: 'G2 高速列车',
          description: `${origin} → ${destination} | 14:00-18:30 | 一等座`,
          price: 350,
          currency: 'CNY',
          details: {
            train_no: 'G2',
            departure_time: '14:00',
            arrival_time: '18:30',
            seat_type: '一等座',
            duration: '4小时30分',
          },
        }
      )
    } else if (type === 'car') {
      baseProducts.push(
        {
          id: 'car-1',
          product_type: 'car',
          name: '经济型轿车',
          description: '5座 | 自动挡 | 含保险',
          price: 300,
          currency: 'CNY',
          details: {
            car_type: '经济型',
            seats: 5,
            transmission: '自动挡',
            includes: ['保险', 'GPS导航'],
          },
        },
        {
          id: 'car-2',
          product_type: 'car',
          name: '商务车',
          description: '7座 | 自动挡 | 含保险',
          price: 500,
          currency: 'CNY',
          details: {
            car_type: '商务车',
            seats: 7,
            transmission: '自动挡',
            includes: ['保险', 'GPS导航', '司机'],
          },
        }
      )
    }

    return baseProducts
  }

  const handleSelect = (productId: string) => {
    setSelectedProduct(productId)
  }

  const handleConfirm = () => {
    if (!selectedProduct) {
      message.warning('请先选择产品')
      return
    }

    const product = products.find(p => p.id === selectedProduct)
    if (product) {
      navigate('/booking/confirm', {
        state: {
          product,
          searchParams,
          productType,
          searchRecord,
        },
      })
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

  if (loading) {
    return <Spin size="large" style={{ display: 'block', textAlign: 'center', marginTop: 100 }} />
  }

  return (
    <div className="product-list">
      <Card
        title={`${getProductTypeName(productType)}搜索结果`}
        extra={
          <Button onClick={() => navigate('/booking/classic')}>
            重新搜索
          </Button>
        }
      >
        {products.length === 0 ? (
          <Empty description="暂无产品" />
        ) : (
          <>
            <List
              dataSource={products}
              renderItem={(product) => (
                <List.Item
                  className={selectedProduct === product.id ? 'selected' : ''}
                  actions={[
                    <Button
                      type={selectedProduct === product.id ? 'primary' : 'default'}
                      icon={selectedProduct === product.id ? <CheckOutlined /> : <EyeOutlined />}
                      onClick={() => handleSelect(product.id)}
                    >
                      {selectedProduct === product.id ? '已选择' : '选择'}
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        <span>{product.name}</span>
                        <Tag color="blue">{getProductTypeName(product.product_type)}</Tag>
                      </Space>
                    }
                    description={product.description}
                  />
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1890ff' }}>
                      ¥{product.price}
                    </div>
                    <div style={{ fontSize: 12, color: '#999' }}>
                      {product.currency}
                    </div>
                  </div>
                </List.Item>
              )}
            />
            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <Button
                type="primary"
                size="large"
                disabled={!selectedProduct}
                onClick={handleConfirm}
              >
                确认预订
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

export default ProductList

