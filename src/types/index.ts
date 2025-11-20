// TypeScript类型定义

// 用户类型
export interface User {
  id: string
  email: string
  username?: string
  full_name?: string
  role: 'employee' | 'approver' | 'admin'
  company_id?: string
  department_id?: string
  cost_center_id?: string
}

// 出差申请单类型
export interface TravelRequest {
  id: string
  request_no: string
  user_id: string
  origin: string
  destination: string
  departure_date: string
  return_date: string
  reason: string
  products: string[] // ['flight', 'hotel', 'train', 'car']
  status: 'pending' | 'approving' | 'approved' | 'rejected'
  created_at: string
}

// AI推荐方案类型
export interface AIRecommendation {
  id: string
  recommendation_no: string
  user_id: string
  travel_request_id?: string
  origin: string
  destination: string
  departure_date: string
  return_date: string
  products: string[]
  status: 'generating' | 'generated' | 'booked' | 'cancelled'
  keywords?: string[]
  created_at: string
}

// 推荐方案详情类型
export interface RecommendationDetail {
  id: string
  ai_recommendation_id: string
  option_index: number
  product_type: 'flight' | 'hotel' | 'train' | 'car'
  product_data: any // JSONB数据
  keywords?: string[]
  reason?: string
  price?: number
  score?: number
  policy_compliance: boolean
}

// 推荐方案选项（用于展示）
export interface RecommendationOption {
  option_index: number
  product_type: string
  keywords: string[]
  reason: string
  price: number
  score: number
  product_data: any
  policy_compliance?: boolean
}

