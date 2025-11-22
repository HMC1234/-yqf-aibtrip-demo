// 中航服API类型定义

/**
 * 乘客类型
 */
export type PassengerType = 'ADT' | 'CHD' | 'INF'

/**
 * 舱位类型
 */
export type BerthType = 'Y' | 'C' | 'F' | string

/**
 * 航段信息
 */
export interface Routing {
  Departure: string // 出发机场代码（如：CAN）
  Arrival: string // 到达机场代码（如：SIN）
  DepartureDate: string // 出发日期（格式：YYYY-MM-DD）
  DepartureType?: number // 出发类型，默认1
  ArrivalType?: number // 到达类型，默认1
}

/**
 * 乘客信息
 */
export interface Passenger {
  PassengerType: PassengerType // ADT成人/CHD儿童/INF婴儿
}

/**
 * 机票查询请求参数
 */
export interface FlightSearchParams {
  Passengers: Passenger[]
  Routings: Routing[]
  OfficeIds: string[] // 必填：注册公司列表
  Type: string // 必填：类型（A:国际，D:国内）
  OnlyDirectFlight?: boolean // 是否只查询直飞
  BerthType?: BerthType // 舱位类型：Y经济舱/C商务舱/F头等舱（国际必传）
  IsQueryRule?: boolean // 是否查询退改规则
  IsQueryAirline?: boolean // 是否查询航空公司
  CodeShare?: boolean // 是否查询代码共享
  IsQueryAirport?: boolean // 是否查询机场
  ChildQty?: number // 儿童数量
}

/**
 * 验价请求参数
 */
export interface VerifyPriceParams {
  FQKey: string // 从查询接口获取的FQKey
  Passengers: Array<{
    PassengerType: PassengerType
    CertTypeCode?: string // 证件类型：ID身份证/PASSPORT护照
    CertNr?: string // 证件号码
    Birthday?: string // 生日（格式：YYYY-MM-DD）
  }>
}

/**
 * 创建订单请求参数
 */
export interface CreateOrderParams {
  SourceTypeID: number // 来源类型ID
  PaymentMethodID: number // 支付方式ID
  SettlementTypeID: number // 结算类型ID
  Products: Array<{
    ProductCategoryID: number // 产品类别ID：8国内机票/9国际机票/2酒店/3火车票/4保险
    GDSCode: string // GDS代码
    PublicAmount: number // 公开价格
    PrivateAmount?: number // 私有价格
    Air?: {
      FQKey: string // 从验价接口获取的FQKey
      TripType: number // 行程类型：1单程/2往返
    }
  }>
  Passengers: Array<{
    LastName: string // 姓
    FirstName: string // 名
    PassengerTypeCode: PassengerType
    Gender: 'M' | 'F' // 性别
    CertTypeCode: string // 证件类型
    CertNr: string // 证件号码
    Mobile: string // 手机号
    Birthday?: string // 生日
    CertValid?: string // 证件有效期
  }>
  ContactInfo: {
    Name: string // 联系人姓名
    Mobile: string // 联系人手机
    Email?: string // 联系人邮箱
  }
  BizPolicy?: {
    PolicyID?: string // 差旅政策ID
    ContrReason?: string // 违背原因
    ContrContent?: string // 违背内容
  }
  CostCenter?: Array<{
    CostCenterID: string // 成本中心ID
    Amount?: number // 金额
    Percent?: number // 百分比
  }>
}

/**
 * 提交订单请求参数
 */
export interface SubmitOrderParams {
  TradeNo: string // 交易号（从创建订单接口获取）
}

/**
 * 获取订单列表请求参数
 */
export interface GetOrderListParams {
  StartDate?: string // 开始日期
  EndDate?: string // 结束日期
  OrderStatusID?: number // 订单状态ID
  PageIndex?: number // 页码
  PageSize?: number // 每页数量
}

/**
 * 航班查询结果
 */
export interface FlightSearchResult {
  JourneyBiz?: any[]
  BriefRuleResult?: any[]
  JourneySegmentResult?: any[]
  JourneyTicketResult?: any[]
  TicketAgencyResult?: any[]
  TicketPricingResult?: any[]
  TicketFareResult?: any[]
  TicketFareFlightResult?: any[]
  JourneyBrandResult?: any[]
}

/**
 * 验价结果
 */
export interface VerifyPriceResult {
  VerifySegment?: any[]
  VerifyLeg?: any[]
  VerifyPricing?: any[]
  VerifyTicket?: any[]
  VerifyTicketLeg?: any[]
  VerifyFare?: any[]
  VerifyTax?: any[]
  VerifyBaggage?: any[]
  VerifySplitPrice?: any[]
}

/**
 * 订单信息
 */
export interface OrderInfo {
  OrderNo: string // 订单号
  ProductCategoryID: number // 产品类别ID
  PNR?: string // PNR（机票）
  PONr?: string // 订单号（火车票）
  OrderStatusID: number // 订单状态ID
  OrderStatusName: string // 订单状态名称
  Passengers?: Array<{
    PassengerTypeCode: PassengerType
    PassengerName: string
    CertTypeCode: string
    CertNr: string
  }>
}

