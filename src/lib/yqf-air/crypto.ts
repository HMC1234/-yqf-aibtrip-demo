// 中航服API加密工具
import CryptoJS from 'crypto-js'

/**
 * AES加密工具类
 * 使用AES/CBC/PKCS5Padding算法
 */
export class YQFCrypto {
  /**
   * AES加密并Base64编码
   * @param plainText 原始JSON字符串
   * @param secretKey 密钥（app_secret，长度必须为16或32字节）
   * @returns Base64编码的加密字符串
   */
  static encrypt(plainText: string, secretKey: string): string {
    // 去除首尾空格
    const trimmedKey = secretKey.trim()
    
    // 确保密钥长度为16或32字节
    if (trimmedKey.length !== 16 && trimmedKey.length !== 32) {
      throw new Error(`密钥长度必须为16或32字节，当前长度为${trimmedKey.length}字节。请检查密钥是否正确，确保没有多余的空格。`)
    }
    
    // 使用处理后的密钥
    const key = CryptoJS.enc.Utf8.parse(trimmedKey)

    // 创建16字节的零向量IV（使用明确的方式确保浏览器和Node.js行为一致）
    // WordArray.create([0, 0, 0, 0]) 创建4个32位字 = 16字节
    const iv = CryptoJS.lib.WordArray.create([0, 0, 0, 0])
    // 确保IV长度为16字节（显式设置，避免浏览器环境差异）
    iv.sigBytes = 16

    // 使用AES/CBC/PKCS5Padding加密
    // 重要：必须显式提供IV，否则crypto-js会使用随机salt，导致结果不一致
    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })

    // 返回Base64编码的加密结果
    // 当提供IV时，toString()方法会直接返回Base64编码的密文（不包含salt）
    // 这与文档要求一致：只发送加密后的数据（Base64编码）
    const result = encrypted.toString()
    
    // 开发环境下的调试信息（仅在浏览器控制台可见）
    if (process.env.NODE_ENV === 'development' && typeof console !== 'undefined') {
      console.debug('加密调试信息:', {
        plainTextLength: plainText.length,
        keyLength: trimmedKey.length,
        originalKeyLength: secretKey.length,
        ivLength: iv.sigBytes,
        resultLength: result.length,
        resultPreview: result.substring(0, 50) + '...'
      })
    }
    
    return result
  }

  /**
   * 解密Base64编码的AES加密数据
   * @param cipherText Base64编码的加密字符串
   * @param secretKey 密钥（app_secret）
   * @returns 原始JSON字符串
   */
  static decrypt(cipherText: string, secretKey: string): string {
    // 去除首尾空格
    const trimmedKey = secretKey.trim()
    
    // 确保密钥长度为16或32字节
    if (trimmedKey.length !== 16 && trimmedKey.length !== 32) {
      throw new Error(`密钥长度必须为16或32字节，当前长度为${trimmedKey.length}字节。请检查密钥是否正确，确保没有多余的空格。`)
    }

    // 创建16字节的零向量IV
    const iv = CryptoJS.lib.WordArray.create([0, 0, 0, 0])

    // 解密
    const decrypted = CryptoJS.AES.decrypt(cipherText, CryptoJS.enc.Utf8.parse(trimmedKey), {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })

    // 返回UTF-8字符串
    return decrypted.toString(CryptoJS.enc.Utf8)
  }
}

