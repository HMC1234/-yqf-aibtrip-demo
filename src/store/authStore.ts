// 认证状态管理（使用Zustand）
import { create } from 'zustand'
import { User } from '../types'
import { supabase } from '../lib/supabase'

interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,

  setUser: (user) => set({ user }),

  setLoading: (loading) => set({ loading }),

  signIn: async (email: string, password: string) => {
    set({ loading: true })
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        set({ loading: false })
        return { error }
      }

      if (data.user) {
        // 获取用户详细信息
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single()

        if (userError) {
          set({ loading: false })
          return { error: userError }
        }

        set({ user: userData as User, loading: false })
        return { error: null }
      }

      set({ loading: false })
      return { error: null }
    } catch (error) {
      set({ loading: false })
      return { error }
    }
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null })
  },

  initialize: async () => {
    set({ loading: true })
    
    // 备用超时机制：10秒后强制完成初始化
    const fallbackTimeout = setTimeout(() => {
      console.warn('初始化超时，强制完成初始化')
      set({ loading: false, initialized: true })
    }, 10000)
    
    try {
      // 添加超时机制（5秒）
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('初始化超时')), 5000)
      )
      
      const authPromise = supabase.auth.getUser()
      const { data: { user } } = await Promise.race([authPromise, timeoutPromise]) as any
      
      clearTimeout(fallbackTimeout)
      
      if (user) {
        try {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single()

          if (userData && !userError) {
            set({ user: userData as User, loading: false, initialized: true })
          } else {
            // 如果users表中没有数据，仍然设置initialized为true，允许用户继续
            console.warn('用户数据未找到，但已认证:', userError)
            set({ loading: false, initialized: true })
          }
        } catch (userError) {
          console.error('获取用户数据失败:', userError)
          set({ loading: false, initialized: true })
        }
      } else {
        set({ loading: false, initialized: true })
      }
    } catch (error) {
      clearTimeout(fallbackTimeout)
      console.error('初始化认证失败:', error)
      // 即使出错也设置initialized为true，避免无限加载
      set({ loading: false, initialized: true })
    }
  },
}))


