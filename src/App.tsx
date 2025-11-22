// 主应用组件
import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import MainLayout from './components/Layout/MainLayout'
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import { navanTheme } from './styles/navan-theme'
import { useThemeStore } from './store/themeStore'
// UI1主题样式（当前默认主题 - Navan风格）
import './styles/navan-variables.css'
import './styles/responsive.css'
import './styles/navan-components.css'
import './styles/page-container.css'
import './styles/tag-optimized.css'
import './styles/mobile-pwa-fixes.css'
import NewRequest from './pages/TravelRequest/NewRequest'
import RequestList from './pages/TravelRequest/RequestList'
import RequestDetail from './pages/TravelRequest/RequestDetail'
import GenerateRecommendation from './pages/AIRecommendation/GenerateRecommendation'
import RecommendationDetail from './pages/AIRecommendation/RecommendationDetail'
import RecommendationList from './pages/AIRecommendation/RecommendationList'
import AIBooking from './pages/AIRecommendation/AIBooking'
import AIBookingWelcome from './pages/AIRecommendation/AIBookingWelcome'
import ClassicBooking from './pages/Booking/ClassicBooking'
import ProductList from './pages/Booking/ProductList'
import OrderConfirm from './pages/Booking/OrderConfirm'
import OrderList from './pages/Booking/OrderList'
import OrderDetail from './pages/Booking/OrderDetail'
import Profile from './pages/Profile/Profile'
import YQFAPITest from './pages/Test/YQFAPITest'
import { useAuthStore } from './store/authStore'
import './App.css'

// 路由保护组件
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, initialized, loading } = useAuthStore()

  if (!initialized || loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 16
      }}>
        <div style={{ fontSize: 16, color: '#666' }}>加载中...</div>
        <div style={{ 
          width: 40, 
          height: 40, 
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #1890ff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function App() {
  const { initialize } = useAuthStore()
  const { currentTheme } = useThemeStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  // 根据当前主题应用对应的Ant Design主题配置
  // 目前UI1使用navanTheme，未来可以为UI2、UI3创建不同的主题配置
  const getAntdTheme = () => {
    switch (currentTheme) {
      case 'UI1':
        return navanTheme
      case 'UI2':
        // TODO: 未来添加UI2主题配置
        return navanTheme
      case 'UI3':
        // TODO: 未来添加UI3主题配置
        return navanTheme
      default:
        return navanTheme
    }
  }

  return (
    <ConfigProvider locale={zhCN} theme={getAntdTheme()}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="travel-request/new" element={<NewRequest />} />
            <Route path="travel-request/list" element={<RequestList />} />
            <Route path="travel-request/:id" element={<RequestDetail />} />
            <Route path="ai-booking" element={<AIBookingWelcome />} />
            <Route path="ai-booking/chat" element={<AIBooking defaultTab="chat" />} />
            <Route path="ai-booking/recommendations" element={<AIBooking defaultTab="recommendations" />} />
            <Route path="ai-booking/approved-requests" element={<AIBooking defaultTab="approved-requests" />} />
            <Route path="ai-recommendation/generate/:id" element={<GenerateRecommendation />} />
            <Route path="ai-recommendation/:recommendationId/list" element={<RecommendationList />} />
            <Route path="ai-recommendation/:recommendationId/option/:optionIndex" element={<RecommendationDetail />} />
            <Route path="booking/classic" element={<ClassicBooking />} />
            <Route path="booking/products" element={<ProductList />} />
            <Route path="booking/confirm" element={<OrderConfirm />} />
            <Route path="booking/orders" element={<OrderList />} />
            <Route path="booking/orders/:id" element={<OrderDetail />} />
            <Route path="profile" element={<Profile />} />
            <Route path="test/yqf-api" element={<YQFAPITest />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App

