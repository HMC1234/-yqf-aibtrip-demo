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
   * BizApi.OpenAPI.Shopping.EasyShopping_V2
   */
  static async searchFlights(params: FlightSearchParams) {
    return yqfClient.call<FlightSearchResult>(
      'BizApi.OpenAPI.Shopping.EasyShopping_V2',
      params
    )
  }

  /**
   * 验价接口
   * BizApi.AirTickets.Shopping.VerifyPriceServing
   * 应用场景：预订前验价和验舱
   */
  static async verifyPrice(params: VerifyPriceParams) {
    return yqfClient.call<VerifyPriceResult>(
      'BizApi.AirTickets.Shopping.VerifyPriceServing',
      params
    )
  }

  /**
   * 创建订单接口
   * BizApi.OpenAPI.Easy.AICreateOrder
   * 支持机票、酒店、火车票、保险等多种产品类型
   */
  static async createOrder(params: CreateOrderParams) {
    return yqfClient.call<{
      TradeNo: string
      Orders: OrderInfo[]
    }>('BizApi.OpenAPI.Easy.AICreateOrder', params)
  }

  /**
   * 提交订单接口
   * BizApi.OpenAPI.SubmitOrder
   */
  static async submitOrder(params: SubmitOrderParams) {
    return yqfClient.call('BizApi.OpenAPI.SubmitOrder', params)
  }

  /**
   * 获取订单列表接口
   * BizApi.OpenAPI.GetOrderList
   */
  static async getOrderList(params?: GetOrderListParams) {
    return yqfClient.call('BizApi.OpenAPI.GetOrderList', params || {})
  }

  /**
   * 验舱并补位接口
   * BizApi.OpenAPI.Shopping.VerifyCabin
   */
  static async verifyCabin(params: { FQKey: string }) {
    return yqfClient.call('BizApi.OpenAPI.Shopping.VerifyCabin', params)
  }

  /**
   * 改期航班查询接口
   * BizApi.OpenAPI.Shopping.AirReshopServing
   */
  static async reshopFlights(params: FlightSearchParams) {
    return yqfClient.call<FlightSearchResult>(
      'BizApi.OpenAPI.Shopping.AirReshopServing',
      params
    )
  }

  /**
   * 查询退票费接口
   * BizApi.AirTickets.Shopping.AirRefundPriceServing
   */
  static async getRefundPrice(params: { FQKey: string }) {
    return yqfClient.call('BizApi.AirTickets.Shopping.AirRefundPriceServing', params)
  }

  /**
   * 获取退改条款接口
   * BizApi.AirTickets.Shopping.GetFareRuleDetailServing
   */
  static async getFareRuleDetail(params: { FQKey: string }) {
    return yqfClient.call('BizApi.AirTickets.Shopping.GetFareRuleDetailServing', params)
  }

  /**
   * 取消PNR接口
   * BizApi.AirTickets.Shopping.PNRCancelByPSONr
   */
  static async cancelPNR(params: { PSONr: string }) {
    return yqfClient.call('BizApi.AirTickets.Shopping.PNRCancelByPSONr', params)
  }

  /**
   * 获取全球机场信息接口
   * BizApi.OpenAPI.Dest.GetAirportList
   */
  static async getAirportList(params?: { CountryCode?: string }) {
    return yqfClient.call('BizApi.OpenAPI.Dest.GetAirportList', params || {})
  }
}

// 导出便捷方法
export const flightAPI = FlightAPI

