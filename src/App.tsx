// 主应用组件
import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import MainLayout from './components/Layout/MainLayout'
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import NewRequest from './pages/TravelRequest/NewRequest'
import RequestList from './pages/TravelRequest/RequestList'
import RequestDetail from './pages/TravelRequest/RequestDetail'
import GenerateRecommendation from './pages/AIRecommendation/GenerateRecommendation'
import RecommendationDetail from './pages/AIRecommendation/RecommendationDetail'
import RecommendationList from './pages/AIRecommendation/RecommendationList'
import AIBooking from './pages/AIRecommendation/AIBooking'
import ClassicBooking from './pages/Booking/ClassicBooking'
import ProductList from './pages/Booking/ProductList'
import OrderConfirm from './pages/Booking/OrderConfirm'
import OrderList from './pages/Booking/OrderList'
import OrderDetail from './pages/Booking/OrderDetail'
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

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <ConfigProvider locale={zhCN}>
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
            <Route path="ai-booking" element={<AIBooking />} />
            <Route path="ai-recommendation/generate/:id" element={<GenerateRecommendation />} />
            <Route path="ai-recommendation/:recommendationId/list" element={<RecommendationList />} />
            <Route path="ai-recommendation/:recommendationId/option/:optionIndex" element={<RecommendationDetail />} />
            <Route path="booking/classic" element={<ClassicBooking />} />
            <Route path="booking/products" element={<ProductList />} />
            <Route path="booking/confirm" element={<OrderConfirm />} />
            <Route path="booking/orders" element={<OrderList />} />
            <Route path="booking/orders/:id" element={<OrderDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App

