// 中航服API配置
export interface YQFConfig {
  /** API基础地址 */
  baseUrl: string
  /** 应用密钥（app_key） */
  appKey: string
  /** 应用密钥（app_secret，用于加密） */
  appSecret: string
  /** API版本 */
  version?: string
}

// 从环境变量读取配置
const getConfig = (): YQFConfig => {
  // 优先使用测试配置（如果存在）
  if (typeof window !== 'undefined' && (window as any).__YQF_TEST_CONFIG__) {
    return (window as any).__YQF_TEST_CONFIG__
  }
  
  return {
    baseUrl: process.env.REACT_APP_YQF_BASE_URL || 'https://bizapi.yiqifei.cn/servings',
    appKey: process.env.REACT_APP_YQF_APP_KEY || '',
    appSecret: process.env.REACT_APP_YQF_APP_SECRET || '',
    version: process.env.REACT_APP_YQF_VERSION || '2.0', // 根据文档，version必须填写2.0
  }
}

export const yqfConfig = getConfig()

// 设置测试配置（仅用于测试页面）
export const setTestConfig = (config: Partial<YQFConfig>) => {
  if (typeof window !== 'undefined') {
    const currentConfig = getConfig()
    const mergedConfig: YQFConfig = {
      ...currentConfig,
      ...config,
    }
    
    // 根据文档，version是必填参数，必须填写2.0
    // 如果version为空，使用默认值2.0
    if (!mergedConfig.version || mergedConfig.version.trim() === '') {
      mergedConfig.version = '2.0'
    }
    
    ;(window as any).__YQF_TEST_CONFIG__ = mergedConfig
  }
}

// 清除测试配置
export const clearTestConfig = () => {
  if (typeof window !== 'undefined') {
    delete (window as any).__YQF_TEST_CONFIG__
  }
}

// 验证配置是否完整
export const validateConfig = (): boolean => {
  const config = getConfig()
  return !!(config.baseUrl && config.appKey && config.appSecret)
}

