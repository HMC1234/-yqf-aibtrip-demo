// UI主题管理Store（使用Zustand）
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type UITheme = 'UI1' | 'UI2' | 'UI3'

interface ThemeState {
  currentTheme: UITheme
  setTheme: (theme: UITheme) => void
  getThemeName: (theme: UITheme) => string
  getThemeDescription: (theme: UITheme) => string
}

// 主题名称和描述
const themeInfo: Record<UITheme, { name: string; description: string }> = {
  UI1: {
    name: 'UI1 - Navan风格',
    description: '现代简洁的Navan风格设计，采用紫色主题，注重用户体验和视觉一致性',
  },
  UI2: {
    name: 'UI2 - 待开发',
    description: '新的UI设计方案，即将推出',
  },
  UI3: {
    name: 'UI3 - 待开发',
    description: '新的UI设计方案，即将推出',
  },
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: 'UI1', // 默认使用UI1

      setTheme: (theme: UITheme) => {
        set({ currentTheme: theme })
        // 应用主题样式
        applyTheme(theme)
      },

      getThemeName: (theme: UITheme) => {
        return themeInfo[theme]?.name || theme
      },

      getThemeDescription: (theme: UITheme) => {
        return themeInfo[theme]?.description || '暂无描述'
      },
    }),
    {
      name: 'ui-theme-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// 应用主题样式
const applyTheme = (theme: UITheme) => {
  // 移除所有主题类
  document.documentElement.classList.remove('theme-ui1', 'theme-ui2', 'theme-ui3')
  
  // 添加当前主题类
  document.documentElement.classList.add(`theme-${theme.toLowerCase()}`)
  
  // 动态加载主题样式
  const themeId = 'dynamic-theme-style'
  let themeStyle = document.getElementById(themeId)
  
  if (!themeStyle) {
    themeStyle = document.createElement('style')
    themeStyle.id = themeId
    document.head.appendChild(themeStyle)
  }
  
  // 根据主题加载不同的CSS文件
  loadThemeStyles(theme)
}

// 动态加载主题样式文件
const loadThemeStyles = (theme: UITheme) => {
  // 移除之前加载的样式链接
  const existingLinks = document.querySelectorAll(`link[data-theme]`)
  existingLinks.forEach((link) => link.remove())
  
  // 加载新的主题样式
  if (theme === 'UI1') {
    // UI1是默认主题，样式已经在App.tsx中加载
    return
  }
  
  // 未来可以为UI2, UI3加载不同的样式文件
  // const link = document.createElement('link')
  // link.rel = 'stylesheet'
  // link.href = `/themes/${theme.toLowerCase()}/theme.css`
  // link.setAttribute('data-theme', theme)
  // document.head.appendChild(link)
}

// 初始化主题（在模块加载时执行）
if (typeof window !== 'undefined') {
  // 确保DOM加载完成后再应用主题
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const store = useThemeStore.getState()
      applyTheme(store.currentTheme)
    })
  } else {
    const store = useThemeStore.getState()
    applyTheme(store.currentTheme)
  }
}

