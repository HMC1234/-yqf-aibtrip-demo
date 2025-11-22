// 中航服API HTTP客户端
import { YQFCrypto } from './crypto'
import { yqfConfig, validateConfig, type YQFConfig } from './config'

/**
 * API响应基础结构
 */
export interface YQFResponse<T = any> {
  Code: number
  Msg: string
  Data?: T
  TradeNo?: string
  Orders?: any[]
}

/**
 * 系统级参数
 */
interface SystemParams {
  app_key: string
  method: string
  version?: string
}

/**
 * 中航服API客户端
 */
export class YQFClient {
  /**
   * 获取当前配置（支持动态更新）
   */
  private getConfig(): YQFConfig {
    let config: YQFConfig
    
    // 优先使用测试配置（如果存在）
    if (typeof window !== 'undefined' && (window as any).__YQF_TEST_CONFIG__) {
      config = { ...(window as any).__YQF_TEST_CONFIG__ }
    } else {
      config = { ...yqfConfig }
    }
    
    // 根据文档，version是必填参数，必须填写2.0
    // 如果version为空，使用默认值2.0
    if (!config.version || config.version.trim() === '') {
      config.version = '2.0'
    }
    
    // 在开发环境中，如果直接调用外部API会遇到CORS问题
    // 自动使用代理路径来绕过CORS限制
    if (typeof window !== 'undefined') {
      const isLocalhost = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname === '[::1]'
      const isOriginalApiUrl = config.baseUrl === 'https://bizapi.yiqifei.cn/servings' ||
                               (config.baseUrl && config.baseUrl.includes('bizapi.yiqifei.cn'))
      
      // 在开发环境中，如果baseUrl是原始API地址，则使用代理路径
      if (isLocalhost && isOriginalApiUrl && process.env.NODE_ENV === 'development') {
        config.baseUrl = '/api/yqf'
        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 [开发环境] 自动使用代理路径绕过CORS限制:', config.baseUrl)
        }
      }
    }
    
    // 确保baseUrl是完整的API地址（如果不是代理路径）
    if (config.baseUrl && !config.baseUrl.startsWith('http') && !config.baseUrl.startsWith('/')) {
      // 如果baseUrl不是完整URL也不是代理路径，则使用默认地址
      config.baseUrl = 'https://bizapi.yiqifei.cn/servings'
    }
    
    return config
  }

  /**
   * 调用API接口
   * @param method 接口方法名（如：ShoppingServer.EasyShopping_V2）
   * @param params 业务参数（会被加密）
   * @returns API响应
   */
  async call<T = any>(method: string, params: any): Promise<YQFResponse<T>> {
    const config = this.getConfig()
    
    // 验证配置
    if (!config.baseUrl || !config.appKey || !config.appSecret) {
      throw new Error('中航服API配置不完整，请检查环境变量或测试配置')
    }
    
    // 确保App Secret已去除首尾空格
    const trimmedAppSecret = config.appSecret.trim()
    if (trimmedAppSecret.length !== 16 && trimmedAppSecret.length !== 32) {
      throw new Error(`App Secret长度不正确：当前长度为${trimmedAppSecret.length}字节，必须是16或32字节。请检查配置是否正确，确保没有多余的空格。`)
    }

    // 构建系统级参数（URL查询字符串）
    // 根据文档，version是必填参数，必须填写2.0
    const systemParams: SystemParams = {
      app_key: config.appKey,
      method,
      version: config.version || '2.0', // version必填，默认2.0
    }

    // 构建查询字符串（只包含有值的参数）
    const queryParams: Record<string, string> = {}
    Object.entries(systemParams).forEach(([key, value]) => {
      // 只添加有值且不为空字符串的参数
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        queryParams[key] = String(value).trim()
      }
    })
    
    const queryString = new URLSearchParams(queryParams).toString()

    // 构建完整URL
    const url = `${config.baseUrl}?${queryString}`
    
    // 调试日志：显示实际构建的URL和参数
    if (process.env.NODE_ENV === 'development') {
      const isProxy = url.startsWith('/api/yqf')
      console.log('🔍 [API调用] 配置信息:', {
        基础地址: config.baseUrl,
        appKey: config.appKey,
        version: config.version,
        接口方法: method,
        使用代理: isProxy ? '是（开发环境自动启用）' : '否',
      })
      console.log('🔍 [API调用] 系统级参数:', systemParams)
      console.log('🔍 [API调用] 查询参数对象:', queryParams)
      console.log('🔍 [API调用] 完整请求URL:', url)
      if (isProxy) {
        console.log('🔄 [API调用] 通过代理调用（开发环境）:', url)
        console.log('   → 代理目标: https://bizapi.yiqifei.cn/servings')
      } else {
        console.log('✅ [API调用] 直接调用:', url)
      }
    }

    // 准备业务参数（JSON格式）
    const jsonParams = JSON.stringify(params)

    // 加密业务参数（使用处理后的密钥）
    const encryptedBody = YQFCrypto.encrypt(jsonParams, trimmedAppSecret)

    try {
      // 发送HTTP POST请求
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'Accept-Encoding': 'gzip, deflate',
        },
        body: encryptedBody,
      })

      // 检查HTTP状态
      if (!response.ok) {
        const errorText = await response.text().catch(() => '无法读取错误信息')
        throw new Error(`HTTP错误: ${response.status} ${response.statusText}。响应内容: ${errorText.substring(0, 200)}`)
      }

      // 解析响应（响应是JSON格式，不需要解密）
      const result: YQFResponse<T> = await response.json()

      // 检查业务状态码
      if (result.Code !== 0) {
        throw new Error(`API错误: ${result.Msg} (Code: ${result.Code})`)
      }

      return result
    } catch (error: any) {
      // 处理不同类型的错误
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        // 网络错误或CORS错误
        const errorMsg = error.message.includes('Failed to fetch') 
          ? '网络请求失败。可能的原因：1) API服务器不可达 2) CORS跨域问题 3) 网络连接问题。请检查API地址是否正确，或联系API提供商确认CORS配置。'
          : `网络错误: ${error.message}`
        throw new Error(errorMsg)
      }
      
      // 如果是我们抛出的错误，直接抛出
      if (error.message && !error.message.includes('API调用失败')) {
        throw error
      }
      
      // 其他错误包装后抛出
      throw new Error(`API调用失败: ${error.message || '未知错误'}`)
    }
  }
}

// 导出单例客户端
export const yqfClient = new YQFClient()

