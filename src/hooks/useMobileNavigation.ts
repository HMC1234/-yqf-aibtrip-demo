/**
 * 移动端导航优化 Hook
 * 解决移动端点击延迟、重复点击、路由跳转慢等问题
 */

import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

interface NavigationOptions {
  /** 是否阻止事件冒泡 */
  stopPropagation?: boolean
  /** 是否阻止默认行为 */
  preventDefault?: boolean
  /** 是否显示加载状态 */
  showLoading?: boolean
  /** 防抖延迟时间（毫秒） */
  debounceDelay?: number
  /** 点击回调 */
  onBeforeNavigate?: () => void
  /** 导航后回调 */
  onAfterNavigate?: () => void
}

/**
 * 移动端导航优化 Hook
 * @returns 优化的导航函数
 */
export const useMobileNavigation = () => {
  const navigate = useNavigate()
  const navigatingRef = useRef(false)
  const lastClickTimeRef = useRef(0)

  /**
   * 优化的导航函数
   * @param path 目标路径
   * @param options 导航选项
   */
  const navigateTo = useCallback(
    (
      path: string,
      options: NavigationOptions = {}
    ) => {
      const {
        stopPropagation = false,
        preventDefault = false,
        debounceDelay = 300,
        onBeforeNavigate,
        onAfterNavigate,
      } = options

      // 防止重复点击（防抖）
      const now = Date.now()
      if (navigatingRef.current || now - lastClickTimeRef.current < debounceDelay) {
        return
      }

      // 防止事件冒泡和默认行为
      const handleEvent = (e?: React.MouseEvent | React.TouchEvent) => {
        if (e) {
          if (stopPropagation) {
            e.stopPropagation()
          }
          if (preventDefault) {
            e.preventDefault()
          }
        }
      }

      // 标记正在导航
      navigatingRef.current = true
      lastClickTimeRef.current = now

      // 执行前置回调
      if (onBeforeNavigate) {
        onBeforeNavigate()
      }

      // 导航到目标路径
      try {
        navigate(path)
      } catch (error) {
        console.error('Navigation error:', error)
        navigatingRef.current = false
      }

      // 延迟重置导航状态
      setTimeout(() => {
        navigatingRef.current = false
        if (onAfterNavigate) {
          onAfterNavigate()
        }
      }, debounceDelay)

      // 返回事件处理器
      return handleEvent
    },
    [navigate]
  )

  /**
   * 创建优化的点击处理器
   * @param path 目标路径
   * @param options 导航选项
   * @returns 点击事件处理器
   */
  const createClickHandler = useCallback(
    (
      path: string,
      options: NavigationOptions = {}
    ): ((e?: React.MouseEvent | React.TouchEvent) => void) => {
      return (e?: React.MouseEvent | React.TouchEvent) => {
        const handleEvent = navigateTo(path, options)
        if (handleEvent && e) {
          handleEvent(e)
        }
      }
    },
    [navigateTo]
  )

  /**
   * 检查是否正在导航
   */
  const isNavigating = useCallback(() => {
    return navigatingRef.current
  }, [])

  return {
    navigateTo,
    createClickHandler,
    isNavigating,
  }
}


