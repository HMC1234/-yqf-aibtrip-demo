// 中航服API响应适配器
// 将中航服API的响应格式转换为项目内部使用的格式

import type { FlightSearchResult } from './types'

/**
 * 项目内部使用的产品格式
 */
export interface Product {
  id: string
  product_type: string
  name: string
  description: string
  price: number
  currency: string
  details: any
  fqKey?: string // 中航服API的FQKey，用于后续验价和预订
}

/**
 * 将中航服航班查询结果转换为项目内部格式
 */
export function adaptFlightSearchResult(
  result: FlightSearchResult,
  origin: string,
  destination: string
): Product[] {
  const products: Product[] = []

  // 解析JourneyTicketResult（航班票务结果）
  if (result.JourneyTicketResult && Array.isArray(result.JourneyTicketResult)) {
    result.JourneyTicketResult.forEach((journey, journeyIndex) => {
      // 解析每个行程的航班信息
      if (result.JourneySegmentResult && result.JourneySegmentResult[journeyIndex]) {
        const segments = result.JourneySegmentResult[journeyIndex]
        
        if (Array.isArray(segments)) {
          segments.forEach((segment: any, segmentIndex: number) => {
            // 解析票价信息
            if (result.TicketFareResult && result.TicketFareResult[journeyIndex]) {
              const fares = result.TicketFareResult[journeyIndex]
              
              if (Array.isArray(fares)) {
                fares.forEach((fare: any, fareIndex: number) => {
                  // 构建产品信息
                  const flightNo = segment.FlightNumber || segment.FlightNo || 'N/A'
                  const airline = segment.AirlineName || segment.Airline || '未知航空公司'
                  const departureTime = segment.DepartureTime || segment.DepartureDateTime || ''
                  const arrivalTime = segment.ArrivalTime || segment.ArrivalDateTime || ''
                  const cabinClass = fare.CabinClass || fare.BerthType || '经济舱'
                  const price = fare.Price || fare.PublicAmount || 0
                  const fqKey = fare.FQKey || journey.FQKey || ''

                  // 格式化时间显示
                  const depTime = departureTime ? new Date(departureTime).toLocaleTimeString('zh-CN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  }) : ''
                  const arrTime = arrivalTime ? new Date(arrivalTime).toLocaleTimeString('zh-CN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  }) : ''

                  products.push({
                    id: `flight-${journeyIndex}-${segmentIndex}-${fareIndex}`,
                    product_type: 'flight',
                    name: `${airline} ${flightNo}`,
                    description: `${origin} → ${destination} | ${depTime}-${arrTime} | ${cabinClass}`,
                    price: price,
                    currency: 'CNY',
                    fqKey: fqKey,
                    details: {
                      flight_no: flightNo,
                      airline: airline,
                      departure_time: depTime,
                      arrival_time: arrTime,
                      cabin_class: cabinClass,
                      aircraft: segment.AircraftType || segment.Aircraft || '',
                      duration: segment.Duration || '',
                      stops: segment.Stops || 0,
                      origin: origin,
                      destination: destination,
                      // 保留原始数据以便后续使用
                      rawData: {
                        journey,
                        segment,
                        fare,
                      },
                    },
                  })
                })
              }
            }
          })
        }
      }
    })
  }

  // 如果没有解析到数据，返回空数组
  return products
}

/**
 * 将城市名称转换为机场代码（简化版，实际应该调用机场列表接口）
 */
export function cityToAirportCode(city: string): string {
  const cityMap: Record<string, string> = {
    '北京': 'PEK',
    '上海': 'SHA',
    '广州': 'CAN',
    '深圳': 'SZX',
    '杭州': 'HGH',
    '成都': 'CTU',
    '重庆': 'CKG',
    '西安': 'XIY',
    '南京': 'NKG',
    '武汉': 'WUH',
    '天津': 'TSN',
    '苏州': 'SZV',
    '长沙': 'CSX',
    '郑州': 'CGO',
    '青岛': 'TAO',
    '大连': 'DLC',
    '厦门': 'XMN',
    '昆明': 'KMG',
    '三亚': 'SYX',
    '哈尔滨': 'HRB',
  }
  return cityMap[city] || city.toUpperCase()
}

