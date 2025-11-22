# 中航服机票API集成

## 概述

本模块实现了与中航服（一起飞）机票API的集成，包括加密、HTTP客户端和所有主要接口的封装。

## 配置

在项目根目录创建 `.env` 文件，添加以下配置：

```env
REACT_APP_YQF_BASE_URL=https://bizapi.yiqifei.cn/servings
REACT_APP_YQF_APP_KEY=your_app_key
REACT_APP_YQF_APP_SECRET=your_app_secret
REACT_APP_YQF_VERSION=v1
```

**注意**：API Base URL已设置默认值 `https://bizapi.yiqifei.cn/servings`

## 加密验证

加密实现已通过文档测试示例验证：

- **测试密钥**：`1234567890123456`
- **原始文本**：`abcdefghigklmnopqrstuvwxyz0123456789`
- **预期结果**：`8Z3dZzqn05FmiuBLowExK0CAbs4TY2GorC2dDPVlsn/tP+VuJGePqIMv1uSaVErr`
- **实际结果**：✅ 完全一致

可以使用测试脚本验证：
```bash
node test-encryption.js
```

或在测试页面使用"使用文档示例测试"按钮进行验证。

## 使用示例

### 1. 查询航班

```typescript
import { FlightAPI } from '@/lib/yqf-air'
import { cityToAirportCode } from '@/lib/yqf-air/adapter'

// 查询北京到上海的航班
const searchParams = {
  Passengers: [{ PassengerType: 'ADT' }],
  Routings: [
    {
      Departure: cityToAirportCode('北京'), // 'PEK'
      Arrival: cityToAirportCode('上海'),   // 'SHA'
      DepartureDate: '2024-12-20',
      DepartureType: 1,
      ArrivalType: 1,
    },
  ],
  OnlyDirectFlight: false,
  BerthType: 'Y', // Y经济舱/C商务舱/F头等舱
  Type: 'D', // D国内/A国际
}

try {
  const response = await FlightAPI.searchFlights(searchParams)
  if (response.Code === 0 && response.Data) {
    // 转换响应格式
    const products = adaptFlightSearchResult(
      response.Data,
      '北京',
      '上海'
    )
    console.log('查询到的航班:', products)
  }
} catch (error) {
  console.error('查询失败:', error)
}
```

### 2. 验价

```typescript
import { FlightAPI } from '@/lib/yqf-air'

// 使用查询接口返回的FQKey进行验价
const verifyParams = {
  FQKey: '从查询接口获取的FQKey',
  Passengers: [
    {
      PassengerType: 'ADT',
      CertTypeCode: 'ID',
      CertNr: '110101199001011234',
    },
  ],
}

try {
  const response = await FlightAPI.verifyPrice(verifyParams)
  if (response.Code === 0) {
    console.log('验价成功:', response.Data)
    // 验价成功后可以使用返回的FQKey创建订单
  }
} catch (error) {
  console.error('验价失败:', error)
}
```

### 3. 创建订单

```typescript
import { FlightAPI } from '@/lib/yqf-air'

const orderParams = {
  SourceTypeID: 1,
  PaymentMethodID: 1,
  SettlementTypeID: 11,
  Products: [
    {
      ProductCategoryID: 8, // 8国内机票/9国际机票
      GDSCode: '1E',
      PublicAmount: 1200.00,
      PrivateAmount: 0,
      Air: {
        FQKey: '从验价接口获取的FQKey',
        TripType: 1, // 1单程/2往返
      },
    },
  ],
  Passengers: [
    {
      LastName: '张',
      FirstName: '三',
      PassengerTypeCode: 'ADT',
      Gender: 'M',
      CertTypeCode: 'ID',
      CertNr: '110101199001011234',
      Mobile: '13800138000',
    },
  ],
  ContactInfo: {
    Name: '张三',
    Mobile: '13800138000',
    Email: 'zhangsan@example.com',
  },
}

try {
  const response = await FlightAPI.createOrder(orderParams)
  if (response.Code === 0 && response.Data) {
    console.log('订单创建成功:', response.Data.TradeNo)
    console.log('订单列表:', response.Data.Orders)
  }
} catch (error) {
  console.error('创建订单失败:', error)
}
```

### 4. 提交订单

```typescript
import { FlightAPI } from '@/lib/yqf-air'

// 使用创建订单返回的TradeNo
const submitParams = {
  TradeNo: 'T202511180001',
}

try {
  const response = await FlightAPI.submitOrder(submitParams)
  if (response.Code === 0) {
    console.log('订单提交成功')
  }
} catch (error) {
  console.error('提交订单失败:', error)
}
```

### 5. 查询订单列表

```typescript
import { FlightAPI } from '@/lib/yqf-air'

const listParams = {
  StartDate: '2024-12-01',
  EndDate: '2024-12-31',
  PageIndex: 1,
  PageSize: 20,
}

try {
  const response = await FlightAPI.getOrderList(listParams)
  if (response.Code === 0 && response.Data) {
    console.log('订单列表:', response.Data)
  }
} catch (error) {
  console.error('查询订单列表失败:', error)
}
```

## 完整流程示例

### 机票预订完整流程

```typescript
import { FlightAPI } from '@/lib/yqf-air'
import { adaptFlightSearchResult, cityToAirportCode } from '@/lib/yqf-air/adapter'

async function bookFlight() {
  try {
    // 1. 查询航班
    const searchResponse = await FlightAPI.searchFlights({
      Passengers: [{ PassengerType: 'ADT' }],
      Routings: [
        {
          Departure: cityToAirportCode('北京'),
          Arrival: cityToAirportCode('上海'),
          DepartureDate: '2024-12-20',
          DepartureType: 1,
          ArrivalType: 1,
        },
      ],
      BerthType: 'Y',
      Type: 'D',
    })

    if (searchResponse.Code !== 0 || !searchResponse.Data) {
      throw new Error('查询航班失败')
    }

    // 2. 转换并显示航班列表
    const products = adaptFlightSearchResult(
      searchResponse.Data,
      '北京',
      '上海'
    )
    console.log('可用航班:', products)

    // 3. 用户选择航班后，进行验价
    const selectedProduct = products[0]
    if (!selectedProduct.fqKey) {
      throw new Error('航班FQKey不存在')
    }

    const verifyResponse = await FlightAPI.verifyPrice({
      FQKey: selectedProduct.fqKey,
      Passengers: [
        {
          PassengerType: 'ADT',
          CertTypeCode: 'ID',
          CertNr: '110101199001011234',
        },
      ],
    })

    if (verifyResponse.Code !== 0) {
      throw new Error('验价失败')
    }

    // 4. 创建订单
    const createResponse = await FlightAPI.createOrder({
      SourceTypeID: 1,
      PaymentMethodID: 1,
      SettlementTypeID: 11,
      Products: [
        {
          ProductCategoryID: 8,
          GDSCode: '1E',
          PublicAmount: selectedProduct.price,
          Air: {
            FQKey: selectedProduct.fqKey,
            TripType: 1,
          },
        },
      ],
      Passengers: [
        {
          LastName: '张',
          FirstName: '三',
          PassengerTypeCode: 'ADT',
          Gender: 'M',
          CertTypeCode: 'ID',
          CertNr: '110101199001011234',
          Mobile: '13800138000',
        },
      ],
      ContactInfo: {
        Name: '张三',
        Mobile: '13800138000',
      },
    })

    if (createResponse.Code !== 0 || !createResponse.Data) {
      throw new Error('创建订单失败')
    }

    // 5. 提交订单
    const submitResponse = await FlightAPI.submitOrder({
      TradeNo: createResponse.Data.TradeNo,
    })

    if (submitResponse.Code !== 0) {
      throw new Error('提交订单失败')
    }

    console.log('预订成功！订单号:', createResponse.Data.Orders?.[0]?.OrderNo)
  } catch (error) {
    console.error('预订流程失败:', error)
  }
}
```

## API接口列表

- `searchFlights` - 机票查询
- `verifyPrice` - 验价
- `createOrder` - 创建订单
- `submitOrder` - 提交订单
- `getOrderList` - 获取订单列表
- `verifyCabin` - 验舱并补位
- `reshopFlights` - 改期航班查询
- `getRefundPrice` - 查询退票费
- `getFareRuleDetail` - 获取退改条款
- `cancelPNR` - 取消PNR
- `getAirportList` - 获取全球机场信息

## 注意事项

1. **加密密钥**：`app_secret` 必须妥善保管，不要提交到代码仓库
2. **FQKey**：查询接口返回的FQKey有时效性，需要及时使用
3. **错误处理**：所有接口调用都应该进行错误处理
4. **环境变量**：生产环境和开发环境应使用不同的配置
5. **API地址**：文档中API调用地址未完整显示，需要从供应商获取完整地址

## 测试

可以使用测试密钥进行加密测试：
- 测试密钥：`1234567890123456`
- 验证加密实现是否正确

