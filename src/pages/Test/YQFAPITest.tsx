// 中航服API测试页面
import React, { useState } from 'react'
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Space,
  Divider,
  message,
  Tabs,
  Row,
  Col,
  InputNumber,
  Radio,
} from 'antd'
import { PlayCircleOutlined, ReloadOutlined } from '@ant-design/icons'
import { FlightAPI } from '../../lib/yqf-air'
import { YQFCrypto } from '../../lib/yqf-air'
import { cityToAirportCode } from '../../lib/yqf-air/adapter'
import { setTestConfig, clearTestConfig, type YQFConfig } from '../../lib/yqf-air/config'
import dayjs from 'dayjs'
import './YQFAPITest.css'

const { TextArea } = Input
const { Option } = Select

const YQFAPITest: React.FC = () => {
  const [configForm] = Form.useForm()
  const [searchForm] = Form.useForm()
  const [verifyForm] = Form.useForm()
  const [orderForm] = Form.useForm()
  
  const [responseData, setResponseData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('config')

  // 配置信息
  const [config, setConfig] = useState({
    baseUrl: 'https://bizapi.yiqifei.cn/servings',
    appKey: '',
    appSecret: '',
    version: '2.0', // 根据文档，version必须填写2.0
    officeIds: 'EI00D', // 注册公司，根据文档示例
  })

  // 保存配置
  const handleSaveConfig = (values: any) => {
    setConfig(values)
    // 设置测试配置
    setTestConfig(values)
    message.success('配置已保存（仅本次会话有效）')
  }

  // 获取并验证配置（辅助函数）
  const getAndValidateConfig = (): YQFConfig | null => {
    // 从配置表单读取最新的配置
    const configValues = configForm.getFieldsValue()
    
    // 处理App Secret：去除首尾空格
    const rawAppSecret = (configValues.appSecret || config.appSecret || '').trim()
    
    const currentConfig = {
      baseUrl: (configValues.baseUrl || config.baseUrl || '').trim(),
      appKey: (configValues.appKey || config.appKey || '').trim(),
      appSecret: rawAppSecret,
      // 根据文档，version是必填参数，必须填写2.0
      version: (configValues.version || config.version || '2.0').trim() || '2.0',
      officeIds: (configValues.officeIds || config.officeIds || 'EI00D').trim(),
    }

    // 验证配置是否完整
    if (!currentConfig.baseUrl || !currentConfig.appKey || !currentConfig.appSecret) {
      message.error('请先在"配置"标签页填写完整的API配置信息（Base URL、App Key、App Secret）并保存')
      return null
    }

    // 验证App Secret长度（必须是16或32字节）
    if (currentConfig.appSecret.length !== 16 && currentConfig.appSecret.length !== 32) {
      message.error(`App Secret长度不正确：当前长度为${currentConfig.appSecret.length}字节，必须是16或32字节。请检查是否有多余的空格或字符。`)
      return null
    }

    // 设置测试配置
    setTestConfig(currentConfig)
    setConfig(currentConfig)
    return currentConfig
  }

  // 测试加密
  const handleTestEncrypt = () => {
    try {
      const testText = configForm.getFieldValue('encryptTestText') || '{"test": "data"}'
      // 优先使用加密测试专用的密钥输入框，如果没有则使用App Secret
      const secret = configForm.getFieldValue('encryptTestSecret') || 
                     config.appSecret || 
                     configForm.getFieldValue('appSecret') || 
                     '1234567890123456'
      
      if (!secret) {
        message.error('请输入测试密钥')
        return
      }
      
      if (secret.length !== 16 && secret.length !== 32) {
        message.error('密钥长度必须为16或32字节，当前长度：' + secret.length)
        return
      }

      console.log('加密测试参数:', {
        text: testText,
        secretLength: secret.length,
        secretPreview: secret.substring(0, 4) + '...' + secret.substring(secret.length - 4)
      })

      const encrypted = YQFCrypto.encrypt(testText, secret)
      configForm.setFieldsValue({ encryptResult: encrypted })
      
      // 如果是文档测试示例，自动验证结果
      if (testText === 'abcdefghigklmnopqrstuvwxyz0123456789' && secret === '1234567890123456') {
        const expected = '8Z3dZzqn05FmiuBLowExK0CAbs4TY2GorC2dDPVlsn/tP+VuJGePqIMv1uSaVErr'
        if (encrypted === expected) {
          message.success('✅ 加密测试通过！结果与预期完全一致。')
        } else {
          message.warning('⚠️ 加密结果与预期不一致')
          console.log('实际结果:', encrypted)
          console.log('预期结果:', expected)
          console.log('结果长度 - 实际:', encrypted.length, '预期:', expected.length)
        }
      } else {
        message.success('加密成功')
      }
    } catch (error: any) {
      message.error('加密失败：' + error.message)
      console.error('加密错误:', error)
    }
  }

  // 测试航班查询
  const handleSearchFlights = async () => {
    setLoading(true)
    try {
      // 获取并验证配置
      const currentConfig = getAndValidateConfig()
      if (!currentConfig) {
        setResponseData({
          error: '中航服API配置不完整，请检查环境变量或测试配置',
          timestamp: new Date().toISOString(),
        })
        return
      }

      const values = searchForm.getFieldsValue()
      
      // 构建查询参数
      // 根据文档，OfficeIds是必填参数（注册公司）
      const officeIds = (values.officeIds || config.officeIds || 'EI00D')
        .split(',')
        .map((id: string) => id.trim())
        .filter((id: string) => id)
      
      const params: any = {
        Passengers: [
          { PassengerType: values.passengerType || 'ADT' }
        ],
        Routings: [
          {
            Departure: cityToAirportCode(values.origin || '北京'),
            Arrival: cityToAirportCode(values.destination || '上海'),
            DepartureDate: values.departureDate?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD'),
            DepartureType: 1,
            ArrivalType: 1,
          },
        ],
        OfficeIds: officeIds, // 必填参数：注册公司
        Type: values.flightType || 'D',
        OnlyDirectFlight: values.onlyDirectFlight || false,
        BerthType: values.berthType || 'Y',
        ChildQty: values.childQty || 0,
        IsQueryRule: values.isQueryRule || false,
        IsQueryAirline: values.isQueryAirline || false,
        CodeShare: values.codeShare || false,
        IsQueryAirport: values.isQueryAirport || false,
      }

      // 如果是往返，添加回程
      if (values.returnDate) {
        params.Routings.push({
          Departure: cityToAirportCode(values.destination || '上海'),
          Arrival: cityToAirportCode(values.origin || '北京'),
          DepartureDate: values.returnDate.format('YYYY-MM-DD'),
          DepartureType: 1,
          ArrivalType: 1,
        })
      }

      console.log('🔍 [航班查询] 准备调用API:', {
        基础地址: currentConfig.baseUrl,
        接口方法: 'BizApi.OpenAPI.Shopping.EasyShopping_V2',
        完整URL: `${currentConfig.baseUrl}?app_key=${currentConfig.appKey}&method=BizApi.OpenAPI.Shopping.EasyShopping_V2`,
        查询参数: params,
        调用方式: '直接调用（不使用代理）',
      })

      const response = await FlightAPI.searchFlights(params)
      setResponseData({
        request: params,
        response: response,
        timestamp: new Date().toISOString(),
      })
      message.success('查询成功')
    } catch (error: any) {
      console.error('查询失败详情:', error)
      setResponseData({
        error: error.message,
        errorType: error.name,
        errorStack: error.stack,
        timestamp: new Date().toISOString(),
      })
      message.error('查询失败：' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // 测试验价
  const handleVerifyPrice = async () => {
    setLoading(true)
    try {
      // 获取并验证配置
      const currentConfig = getAndValidateConfig()
      if (!currentConfig) {
        return
      }

      const values = verifyForm.getFieldsValue()
      
      if (!values.fqKey) {
        message.error('请输入FQKey')
        return
      }

      const params = {
        FQKey: values.fqKey,
        Passengers: [
          {
            PassengerType: values.passengerType || 'ADT',
            CertTypeCode: values.certTypeCode || 'ID',
            CertNr: values.certNr || '',
            Birthday: values.birthday?.format('YYYY-MM-DD') || undefined,
          },
        ],
      }

      const response = await FlightAPI.verifyPrice(params)
      setResponseData({
        request: params,
        response: response,
        timestamp: new Date().toISOString(),
      })
      message.success('验价成功')
    } catch (error: any) {
      console.error('验价失败详情:', error)
      setResponseData({
        error: error.message,
        errorType: error.name,
        errorStack: error.stack,
        timestamp: new Date().toISOString(),
      })
      message.error('验价失败：' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // 测试创建订单
  const handleCreateOrder = async () => {
    setLoading(true)
    try {
      // 获取并验证配置
      const currentConfig = getAndValidateConfig()
      if (!currentConfig) {
        return
      }

      const values = orderForm.getFieldsValue()
      
      const params = {
        SourceTypeID: values.sourceTypeID || 1,
        PaymentMethodID: values.paymentMethodID || 1,
        SettlementTypeID: values.settlementTypeID || 11,
        Products: [
          {
            ProductCategoryID: values.productCategoryID || 8,
            GDSCode: values.gdsCode || '1E',
            PublicAmount: values.publicAmount || 0,
            PrivateAmount: values.privateAmount || 0,
            Air: values.fqKey ? {
              FQKey: values.fqKey,
              TripType: values.tripType || 1,
            } : undefined,
          },
        ],
        Passengers: [
          {
            LastName: values.lastName || '张',
            FirstName: values.firstName || '三',
            PassengerTypeCode: values.passengerTypeCode || 'ADT',
            Gender: values.gender || 'M',
            CertTypeCode: values.certTypeCode || 'ID',
            CertNr: values.certNr || '110101199001011234',
            Mobile: values.mobile || '13800138000',
            Birthday: values.birthday?.format('YYYY-MM-DD') || undefined,
            CertValid: values.certValid || undefined,
          },
        ],
        ContactInfo: {
          Name: values.contactName || '张三',
          Mobile: values.contactMobile || '13800138000',
          Email: values.contactEmail || '',
        },
      }

      const response = await FlightAPI.createOrder(params)
      setResponseData({
        request: params,
        response: response,
        timestamp: new Date().toISOString(),
      })
      message.success('创建订单成功')
    } catch (error: any) {
      console.error('创建订单失败详情:', error)
      setResponseData({
        error: error.message,
        errorType: error.name,
        errorStack: error.stack,
        timestamp: new Date().toISOString(),
      })
      message.error('创建订单失败：' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="yqf-api-test">
      <Card title="中航服API测试工具" style={{ marginBottom: 16 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'config',
              label: '配置',
              children: (
                <Form
                  form={configForm}
                  layout="vertical"
                  initialValues={config}
                  onFinish={handleSaveConfig}
                >
                  {process.env.NODE_ENV === 'development' && (
                    <div style={{ marginBottom: 16, padding: 12, background: '#e6f7ff', border: '1px solid #91d5ff', borderRadius: 4 }}>
                      <div style={{ fontSize: 12, color: '#1890ff' }}>
                        💡 <strong>开发环境提示</strong>：已配置代理服务器，请求会自动通过代理转发，避免CORS跨域问题。
                        <br />
                        实际请求会从 <code>https://bizapi.yiqifei.cn/servings</code> 通过代理转发。
                      </div>
                    </div>
                  )}
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="API Base URL"
                        name="baseUrl"
                        rules={[
                          { required: true, message: '请输入API地址' },
                          {
                            validator: (_, value) => {
                              if (!value) {
                                return Promise.resolve()
                              }
                              const trimmed = value.trim()
                              if (!trimmed.includes('bizapi.yiqifei.cn/servings')) {
                                return Promise.reject(new Error('航班查询必须使用 https://bizapi.yiqifei.cn/servings'))
                              }
                              return Promise.resolve()
                            },
                          },
                        ]}
                        initialValue="https://bizapi.yiqifei.cn/servings"
                        tooltip="航班查询接口地址：https://bizapi.yiqifei.cn/servings（开发环境会自动通过代理转发）"
                      >
                        <Input 
                          placeholder="https://bizapi.yiqifei.cn/servings" 
                          readOnly
                          style={{ background: '#f5f5f5', cursor: 'not-allowed' }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="App Key"
                        name="appKey"
                        rules={[{ required: true, message: '请输入App Key' }]}
                      >
                        <Input placeholder="your_app_key" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="App Secret"
                        name="appSecret"
                        rules={[
                          { required: true, message: '请输入App Secret' },
                          {
                            validator: (_, value) => {
                              if (!value) {
                                return Promise.resolve()
                              }
                              const trimmed = value.trim()
                              if (trimmed.length !== 16 && trimmed.length !== 32) {
                                return Promise.reject(new Error('App Secret长度必须是16或32字节（当前：' + trimmed.length + '字节）'))
                              }
                              return Promise.resolve()
                            },
                          },
                        ]}
                        tooltip="密钥长度必须为16或32字节，请确保没有多余的空格"
                      >
                        <Input.Password 
                          placeholder="your_app_secret (16或32字节)" 
                          maxLength={32}
                          showCount
                          onBlur={(e) => {
                            // 自动去除首尾空格
                            const trimmed = e.target.value.trim()
                            if (trimmed !== e.target.value) {
                              configForm.setFieldValue('appSecret', trimmed)
                            }
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="API Version"
                        name="version"
                        initialValue="2.0"
                        rules={[{ required: true, message: 'version是必填参数，必须填写2.0' }]}
                        tooltip="根据API文档，version是必填参数，必须填写2.0"
                      >
                        <Input placeholder="2.0" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="注册公司（OfficeIds）"
                        name="officeIds"
                        initialValue="EI00D"
                        rules={[{ required: true, message: '注册公司是必填参数' }]}
                        tooltip="根据API文档，OfficeIds是必填参数。多个公司用逗号分隔，如：EI00D,ABC123"
                      >
                        <Input placeholder="例如：EI00D" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      保存配置
                    </Button>
                  </Form.Item>
                  
                  <Divider>加密测试</Divider>
                  <div style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
                    <div style={{ marginBottom: 8, fontWeight: 'bold' }}>📝 文档测试示例：</div>
                    <div style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>
                      <div>测试密钥：<code>1234567890123456</code></div>
                      <div>原始文本：<code>abcdefghigklmnopqrstuvwxyz0123456789</code></div>
                      <div>预期结果：<code>8Z3dZzqn05FmiuBLowExK0CAbs4TY2GorC2dDPVlsn/tP+VuJGePqIMv1uSaVErr</code></div>
                    </div>
                    <Button 
                      size="small" 
                      type="primary"
                      style={{ marginTop: 8 }}
                      onClick={() => {
                        configForm.setFieldsValue({
                          encryptTestText: 'abcdefghigklmnopqrstuvwxyz0123456789',
                          encryptTestSecret: '1234567890123456',
                          appSecret: '1234567890123456'
                        })
                        // 自动执行加密测试
                        setTimeout(() => {
                          handleTestEncrypt()
                          const result = configForm.getFieldValue('encryptResult')
                          const expected = '8Z3dZzqn05FmiuBLowExK0CAbs4TY2GorC2dDPVlsn/tP+VuJGePqIMv1uSaVErr'
                          if (result === expected) {
                            message.success('✅ 加密测试通过！加密实现正确。')
                          } else {
                            message.warning('⚠️ 加密结果与预期不一致，请检查实现。')
                            console.log('实际结果:', result)
                            console.log('预期结果:', expected)
                          }
                        }, 100)
                      }}
                    >
                      使用文档示例测试
                    </Button>
                  </div>
                  <Form.Item 
                    label="测试密钥（用于加密测试）" 
                    name="encryptTestSecret"
                    tooltip="用于加密测试的密钥，可以是App Secret或测试密钥1234567890123456"
                  >
                    <Input 
                      placeholder="1234567890123456" 
                      maxLength={32}
                      showCount
                    />
                  </Form.Item>
                  <Form.Item label="测试文本" name="encryptTestText">
                    <TextArea rows={2} placeholder='abcdefghigklmnopqrstuvwxyz0123456789' />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" onClick={handleTestEncrypt}>
                      测试加密
                    </Button>
                  </Form.Item>
                  <Form.Item label="加密结果" name="encryptResult">
                    <TextArea rows={3} readOnly />
                  </Form.Item>
                  <Form.Item label="验证结果">
                    <div style={{ padding: 8, background: '#f0f0f0', borderRadius: 4 }}>
                      <div style={{ fontSize: 12, color: '#666' }}>
                        预期结果：<code style={{ fontSize: 11, wordBreak: 'break-all' }}>8Z3dZzqn05FmiuBLowExK0CAbs4TY2GorC2dDPVlsn/tP+VuJGePqIMv1uSaVErr</code>
                      </div>
                    </div>
                  </Form.Item>
                </Form>
              ),
            },
            {
              key: 'search',
              label: '航班查询',
              children: (
                <Form 
                  form={searchForm} 
                  layout="vertical"
                  initialValues={{
                    origin: '北京',
                    destination: '上海',
                    departureDate: dayjs('2025-12-01'),
                    passengerType: 'ADT',
                    flightType: 'D',
                    berthType: 'Y',
                    childQty: 0,
                    officeIds: 'EI00D', // 注册公司，必填参数
                    onlyDirectFlight: false,
                    isQueryRule: false,
                    isQueryAirline: false,
                    codeShare: false,
                    isQueryAirport: false,
                  }}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="出发地" name="origin">
                        <Select>
                          <Option value="北京">北京</Option>
                          <Option value="上海">上海</Option>
                          <Option value="广州">广州</Option>
                          <Option value="深圳">深圳</Option>
                          <Option value="杭州">杭州</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="目的地" name="destination">
                        <Select>
                          <Option value="北京">北京</Option>
                          <Option value="上海">上海</Option>
                          <Option value="广州">广州</Option>
                          <Option value="深圳">深圳</Option>
                          <Option value="杭州">杭州</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item 
                        label="出发日期" 
                        name="departureDate"
                      >
                        <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="回程日期（可选）" name="returnDate">
                        <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item label="乘客类型" name="passengerType" initialValue="ADT">
                        <Select>
                          <Option value="ADT">成人</Option>
                          <Option value="CHD">儿童</Option>
                          <Option value="INF">婴儿</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="儿童数量" name="childQty">
                        <InputNumber min={0} max={9} style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="舱位类型" name="berthType">
                        <Select>
                          <Option value="Y">经济舱</Option>
                          <Option value="C">商务舱</Option>
                          <Option value="F">头等舱</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item 
                        label="注册公司（OfficeIds）" 
                        name="officeIds"
                        rules={[{ required: true, message: '注册公司是必填参数' }]}
                        tooltip="根据API文档，OfficeIds是必填参数。多个公司用逗号分隔，如：EI00D,ABC123"
                      >
                        <Input placeholder="例如：EI00D" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item 
                        label="注册公司（OfficeIds）" 
                        name="officeIds"
                        rules={[{ required: true, message: '注册公司是必填参数' }]}
                        tooltip="根据API文档，OfficeIds是必填参数。多个公司用逗号分隔，如：EI00D,ABC123"
                      >
                        <Input placeholder="例如：EI00D" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="航班类型" name="flightType">
                        <Select>
                          <Option value="D">国内</Option>
                          <Option value="A">国际</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item label="查询航空公司" name="isQueryAirline" valuePropName="checked">
                        <Radio.Group>
                          <Radio value={true}>是</Radio>
                          <Radio value={false}>否</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="查询代码共享" name="codeShare" valuePropName="checked">
                        <Radio.Group>
                          <Radio value={true}>是</Radio>
                          <Radio value={false}>否</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item label="查询机场" name="isQueryAirport" valuePropName="checked">
                        <Radio.Group>
                          <Radio value={true}>是</Radio>
                          <Radio value={false}>否</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="仅直飞" name="onlyDirectFlight" valuePropName="checked">
                        <Radio.Group>
                          <Radio value={true}>是</Radio>
                          <Radio value={false}>否</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="查询退改规则" name="isQueryRule" valuePropName="checked">
                        <Radio.Group>
                          <Radio value={true}>是</Radio>
                          <Radio value={false}>否</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item>
                    <Button
                      type="primary"
                      icon={<PlayCircleOutlined />}
                      onClick={handleSearchFlights}
                      loading={loading}
                    >
                      查询航班
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
            {
              key: 'verify',
              label: '验价',
              children: (
                <Form form={verifyForm} layout="vertical">
                  <Form.Item
                    label="FQKey"
                    name="fqKey"
                    rules={[{ required: true, message: '请输入FQKey' }]}
                  >
                    <TextArea rows={2} placeholder="从航班查询接口获取的FQKey" />
                  </Form.Item>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item label="乘客类型" name="passengerType" initialValue="ADT">
                        <Select>
                          <Option value="ADT">成人</Option>
                          <Option value="CHD">儿童</Option>
                          <Option value="INF">婴儿</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="证件类型" name="certTypeCode" initialValue="ID">
                        <Select>
                          <Option value="ID">身份证</Option>
                          <Option value="PASSPORT">护照</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="证件号码" name="certNr">
                        <Input placeholder="110101199001011234" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item label="生日（可选）" name="birthday">
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      icon={<PlayCircleOutlined />}
                      onClick={handleVerifyPrice}
                      loading={loading}
                    >
                      验价
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
            {
              key: 'order',
              label: '创建订单',
              children: (
                <Form form={orderForm} layout="vertical">
                  <Card title="订单信息" size="small" style={{ marginBottom: 16 }}>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item label="来源类型ID" name="sourceTypeID" initialValue={1}>
                          <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="支付方式ID" name="paymentMethodID" initialValue={1}>
                          <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="结算类型ID" name="settlementTypeID" initialValue={11}>
                          <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                  <Card title="产品信息" size="small" style={{ marginBottom: 16 }}>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item label="产品类别ID" name="productCategoryID" initialValue={8}>
                          <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="GDS代码" name="gdsCode" initialValue="1E">
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="公开价格" name="publicAmount" initialValue={1200}>
                          <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="FQKey（从验价接口获取）" name="fqKey">
                          <TextArea rows={2} placeholder="从验价接口获取的FQKey" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="行程类型" name="tripType" initialValue={1}>
                          <Select>
                            <Option value={1}>单程</Option>
                            <Option value={2}>往返</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                  <Card title="乘客信息" size="small" style={{ marginBottom: 16 }}>
                    <div style={{ marginBottom: 8, color: '#666', fontSize: 12 }}>
                      💡 提示：使用身份证时，Birthday可从证件号自动解析；使用护照等非身份证时，必须提供Birthday和CertValid
                    </div>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item label="姓" name="lastName" initialValue="张">
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="名" name="firstName" initialValue="三">
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="乘客类型" name="passengerTypeCode" initialValue="ADT">
                          <Select>
                            <Option value="ADT">成人</Option>
                            <Option value="CHD">儿童</Option>
                            <Option value="INF">婴儿</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item label="性别" name="gender" initialValue="M">
                          <Select>
                            <Option value="M">男</Option>
                            <Option value="F">女</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="证件类型" name="certTypeCode" initialValue="ID">
                          <Select>
                            <Option value="ID">身份证</Option>
                            <Option value="PASSPORT">护照</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="证件号码" name="certNr" initialValue="110101199001011234">
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item label="手机号" name="mobile" initialValue="13800138000">
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="生日（护照必填）" name="birthday">
                          <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="证件有效期（护照必填）" name="certValid">
                          <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                  <Card title="联系人信息" size="small" style={{ marginBottom: 16 }}>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item label="联系人姓名" name="contactName" initialValue="张三">
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="联系人手机" name="contactMobile" initialValue="13800138000">
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="联系人邮箱（可选）" name="contactEmail">
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                  <Form.Item>
                    <Button
                      type="primary"
                      icon={<PlayCircleOutlined />}
                      onClick={handleCreateOrder}
                      loading={loading}
                    >
                      创建订单
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
            {
              key: 'other',
              label: '其他接口',
              children: (
                <div>
                  <Card title="订单列表查询" size="small" style={{ marginBottom: 16 }}>
                    <Form layout="inline" onFinish={async (values) => {
                      setLoading(true)
                      try {
                        const currentConfig = getAndValidateConfig()
                        if (!currentConfig) {
                          return
                        }
                        const response = await FlightAPI.getOrderList({
                          StartDate: values.startDate,
                          EndDate: values.endDate,
                          OrderStatusID: values.orderStatusID,
                          PageIndex: values.pageIndex || 1,
                          PageSize: values.pageSize || 20,
                        })
                        setResponseData({
                          request: values,
                          response: response,
                          timestamp: new Date().toISOString(),
                        })
                        message.success('查询成功')
                      } catch (error: any) {
                        console.error('API调用失败详情:', error)
                        setResponseData({
                          error: error.message,
                          errorType: error.name,
                          errorStack: error.stack,
                          timestamp: new Date().toISOString(),
                        })
                        message.error('查询失败：' + error.message)
                      } finally {
                        setLoading(false)
                      }
                    }}>
                      <Form.Item label="开始日期" name="startDate">
                        <DatePicker />
                      </Form.Item>
                      <Form.Item label="结束日期" name="endDate">
                        <DatePicker />
                      </Form.Item>
                      <Form.Item label="订单状态ID" name="orderStatusID">
                        <InputNumber placeholder="可选" />
                      </Form.Item>
                      <Form.Item label="页码" name="pageIndex" initialValue={1}>
                        <InputNumber min={1} />
                      </Form.Item>
                      <Form.Item label="每页数量" name="pageSize" initialValue={20}>
                        <InputNumber min={1} max={100} />
                      </Form.Item>
                      <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                          查询订单列表
                        </Button>
                      </Form.Item>
                    </Form>
                  </Card>

                  <Card title="验舱并补位" size="small" style={{ marginBottom: 16 }}>
                    <Form layout="inline" onFinish={async (values) => {
                      setLoading(true)
                      try {
                        const currentConfig = getAndValidateConfig()
                        if (!currentConfig) {
                          return
                        }
                        const response = await FlightAPI.verifyCabin({ FQKey: values.fqKey })
                        setResponseData({
                          request: { FQKey: values.fqKey },
                          response: response,
                          timestamp: new Date().toISOString(),
                        })
                        message.success('验舱成功')
                      } catch (error: any) {
                        setResponseData({
                          error: error.message,
                          timestamp: new Date().toISOString(),
                        })
                        message.error('验舱失败：' + error.message)
                      } finally {
                        setLoading(false)
                      }
                    }}>
                      <Form.Item label="FQKey" name="fqKey" rules={[{ required: true }]}>
                        <Input style={{ width: 400 }} placeholder="从查询接口获取的FQKey" />
                      </Form.Item>
                      <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                          验舱
                        </Button>
                      </Form.Item>
                    </Form>
                  </Card>

                  <Card title="查询退票费" size="small" style={{ marginBottom: 16 }}>
                    <Form layout="inline" onFinish={async (values) => {
                      setLoading(true)
                      try {
                        const currentConfig = getAndValidateConfig()
                        if (!currentConfig) {
                          return
                        }
                        const response = await FlightAPI.getRefundPrice({ FQKey: values.fqKey })
                        setResponseData({
                          request: { FQKey: values.fqKey },
                          response: response,
                          timestamp: new Date().toISOString(),
                        })
                        message.success('查询成功')
                      } catch (error: any) {
                        console.error('API调用失败详情:', error)
                        setResponseData({
                          error: error.message,
                          errorType: error.name,
                          errorStack: error.stack,
                          timestamp: new Date().toISOString(),
                        })
                        message.error('查询失败：' + error.message)
                      } finally {
                        setLoading(false)
                      }
                    }}>
                      <Form.Item label="FQKey" name="fqKey" rules={[{ required: true }]}>
                        <Input style={{ width: 400 }} placeholder="从查询接口获取的FQKey" />
                      </Form.Item>
                      <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                          查询退票费
                        </Button>
                      </Form.Item>
                    </Form>
                  </Card>

                  <Card title="获取退改条款" size="small" style={{ marginBottom: 16 }}>
                    <Form layout="inline" onFinish={async (values) => {
                      setLoading(true)
                      try {
                        const currentConfig = getAndValidateConfig()
                        if (!currentConfig) {
                          return
                        }
                        const response = await FlightAPI.getFareRuleDetail({ FQKey: values.fqKey })
                        setResponseData({
                          request: { FQKey: values.fqKey },
                          response: response,
                          timestamp: new Date().toISOString(),
                        })
                        message.success('查询成功')
                      } catch (error: any) {
                        console.error('API调用失败详情:', error)
                        setResponseData({
                          error: error.message,
                          errorType: error.name,
                          errorStack: error.stack,
                          timestamp: new Date().toISOString(),
                        })
                        message.error('查询失败：' + error.message)
                      } finally {
                        setLoading(false)
                      }
                    }}>
                      <Form.Item label="FQKey" name="fqKey" rules={[{ required: true }]}>
                        <Input style={{ width: 400 }} placeholder="从查询接口获取的FQKey" />
                      </Form.Item>
                      <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                          获取退改条款
                        </Button>
                      </Form.Item>
                    </Form>
                  </Card>

                  <Card title="获取机场列表" size="small" style={{ marginBottom: 16 }}>
                    <Form layout="inline" onFinish={async (values) => {
                      setLoading(true)
                      try {
                        const currentConfig = getAndValidateConfig()
                        if (!currentConfig) {
                          return
                        }
                        const response = await FlightAPI.getAirportList({
                          CountryCode: values.countryCode || undefined,
                        })
                        setResponseData({
                          request: values,
                          response: response,
                          timestamp: new Date().toISOString(),
                        })
                        message.success('查询成功')
                      } catch (error: any) {
                        console.error('API调用失败详情:', error)
                        setResponseData({
                          error: error.message,
                          errorType: error.name,
                          errorStack: error.stack,
                          timestamp: new Date().toISOString(),
                        })
                        message.error('查询失败：' + error.message)
                      } finally {
                        setLoading(false)
                      }
                    }}>
                      <Form.Item label="国家代码（可选）" name="countryCode">
                        <Input placeholder="如：CN" style={{ width: 200 }} />
                      </Form.Item>
                      <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                          获取机场列表
                        </Button>
                      </Form.Item>
                    </Form>
                  </Card>
                </div>
              ),
            },
          ]}
        />
      </Card>

      {responseData && (
        <Card
          title={
            <Space>
              <span>响应数据</span>
              <Button
                size="small"
                icon={<ReloadOutlined />}
                onClick={() => setResponseData(null)}
              >
                清空
              </Button>
            </Space>
          }
        >
          <TextArea
            rows={20}
            value={JSON.stringify(responseData, null, 2)}
            readOnly
            style={{ fontFamily: 'monospace', fontSize: 12 }}
          />
        </Card>
      )}
    </div>
  )
}

export default YQFAPITest

