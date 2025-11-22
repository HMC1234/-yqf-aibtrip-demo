// 加密测试脚本
// 用于验证加密实现是否正确

const CryptoJS = require('crypto-js');

/**
 * AES加密函数（与YQFCrypto.encrypt相同）
 */
function encrypt(plainText, secretKey) {
  // 确保密钥长度为16或32字节
  if (secretKey.length !== 16 && secretKey.length !== 32) {
    throw new Error('密钥长度必须为16或32字节');
  }

  // 创建16字节的零向量IV
  const iv = CryptoJS.lib.WordArray.create([0, 0, 0, 0]);

  // 使用AES/CBC/PKCS5Padding加密
  const encrypted = CryptoJS.AES.encrypt(plainText, CryptoJS.enc.Utf8.parse(secretKey), {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  // 返回Base64编码的加密结果
  return encrypted.toString();
}

// 测试用例
const testKey = '1234567890123456';
const testText = 'abcdefghigklmnopqrstuvwxyz0123456789';
const expectedResult = '8Z3dZzqn05FmiuBLowExK0CAbs4TY2GorC2dDPVlsn/tP+VuJGePqIMv1uSaVErr';

console.log('========================================');
console.log('加密测试');
console.log('========================================\n');

console.log('测试密钥:', testKey);
console.log('原始文本:', testText);
console.log('预期结果:', expectedResult);
console.log('');

try {
  const result = encrypt(testText, testKey);
  console.log('实际结果:', result);
  console.log('');

  if (result === expectedResult) {
    console.log('✅ 加密测试通过！加密实现正确。');
  } else {
    console.log('❌ 加密测试失败！结果不匹配。');
    console.log('差异分析：');
    console.log('  长度 - 预期:', expectedResult.length, '实际:', result.length);
  }
} catch (error) {
  console.error('❌ 加密测试出错:', error.message);
}

console.log('\n========================================');

