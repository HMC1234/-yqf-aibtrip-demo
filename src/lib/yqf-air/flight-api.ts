// 中航服机票API接口实现
import { yqfClient } from './client'
import type {
  FlightSearchParams,
  FlightSearchResult,
  VerifyPriceParams,
  VerifyPriceResult,
  CreateOrderParams,
  SubmitOrderParams,
  GetOrderListParams,
  OrderInfo,
} from './types'

/**
 * 机票API服务类
 */
export class FlightAPI {
  /**
   * 机票查询接口
   * 根据文档接口列表：ShoppingServer.EasyShopping_V2
   */
  static async searchFlights(params: FlightSearchParams) {
    return yqfClient.call<FlightSearchResult>(
      'ShoppingServer.EasyShopping_V2',
      params
    )
  }

  /**
   * 验价接口
   * 根据文档接口列表：ShoppingServer.VerifyPriceServing
   * 应用场景：预订前验价和验舱
   */
  static async verifyPrice(params: VerifyPriceParams) {
    return yqfClient.call<VerifyPriceResult>(
      'ShoppingServer.VerifyPriceServing',
      params
    )
  }

  /**
   * 创建订单接口
   * 根据文档接口列表：OpenAPI.CreateOrder
   * 注意：文档中还有BizApi.OpenAPI.Easy.AICreateOrder（AI智能创建订单），
   * 但接口列表显示为OpenAPI.CreateOrder
   */
  static async createOrder(params: CreateOrderParams) {
    return yqfClient.call<{
      TradeNo: string
      Orders: OrderInfo[]
    }>('OpenAPI.CreateOrder', params)
  }

  /**
   * 提交订单接口
   * 根据文档接口列表：OpenAPI.SubmitOrder
   */
  static async submitOrder(params: SubmitOrderParams) {
    return yqfClient.call('OpenAPI.SubmitOrder', params)
  }

  /**
   * 获取订单列表接口
   * 根据文档接口列表：OpenAPI.GetOrderList
   */
  static async getOrderList(params?: GetOrderListParams) {
    return yqfClient.call('OpenAPI.GetOrderList', params || {})
  }

  /**
   * 验舱并补位接口
   * 根据文档接口列表：OpenAPI.VerifyCabin
   */
  static async verifyCabin(params: { FQKey: string }) {
    return yqfClient.call('OpenAPI.VerifyCabin', params)
  }

  /**
   * 改期航班查询接口
   * 根据文档接口列表：ShoppingServer.AirReshopServing
   */
  static async reshopFlights(params: FlightSearchParams) {
    return yqfClient.call<FlightSearchResult>(
      'ShoppingServer.AirReshopServing',
      params
    )
  }

  /**
   * 查询退票费接口
   * 根据文档接口列表：ShoppingServer.AirRefundPriceServing
   */
  static async getRefundPrice(params: { FQKey: string }) {
    return yqfClient.call('ShoppingServer.AirRefundPriceServing', params)
  }

  /**
   * 获取退改条款接口
   * 根据文档接口列表：FareRuleServer.GetFareRule
   */
  static async getFareRuleDetail(params: { FQKey: string }) {
    return yqfClient.call('FareRuleServer.GetFareRule', params)
  }

  /**
   * 取消PNR接口
   * 根据文档接口列表：ShoppingServer.PNRCancelByPSONr
   */
  static async cancelPNR(params: { PSONr: string }) {
    return yqfClient.call('ShoppingServer.PNRCancelByPSONr', params)
  }

  /**
   * 获取全球机场信息接口
   * 根据文档接口列表：OpenAPI.Dest.GetAirportList
   */
  static async getAirportList(params?: { CountryCode?: string }) {
    return yqfClient.call('OpenAPI.Dest.GetAirportList', params || {})
  }
}

// 导出便捷方法
export const flightAPI = FlightAPI

