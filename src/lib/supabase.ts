// Supabase客户端配置
import { createClient } from '@supabase/supabase-js'

// Supabase配置信息（从环境变量读取，如果没有则使用默认值）
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://ienbmjucvvvdwfwcpejy.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbmJtanVjdnZ2ZHdmd2NwZWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NTQ4MzEsImV4cCI6MjA3OTEzMDgzMX0.1s4B5IKWvOBUa0QXPffyJpGr9cxrf3h5A3FdRTv-OLY'

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 导出类型（如果需要）
export type Database = {
  // 可以在这里定义数据库类型
}





