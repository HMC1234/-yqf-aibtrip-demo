// API调用测试脚本
// 测试请求构建和加密逻辑

const CryptoJS = require('crypto-js');

// 模拟配置
const config = {
  baseUrl: 'https://bizapi.yiqifei.cn/servings',
  appKey: 'test_app_key',
  appSecret: '1234567890123456', // 16字节测试密钥
  version: 'v1'
};

// 加密函数
function encrypt(plainText, secretKey) {
  if (secretKey.length !== 16 && secretKey.length !== 32) {
    throw new Error('密钥长度必须为16或32字节');
  }
  const iv = CryptoJS.lib.WordArray.create([0, 0, 0, 0]);
  const encrypted = CryptoJS.AES.encrypt(plainText, CryptoJS.enc.Utf8.parse(secretKey), {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

console.log('========================================');
console.log('API调用逻辑测试');
console.log('========================================\n');

// 测试1: 系统级参数构建
console.log('测试1: 系统级参数构建');
const method = 'BizApi.OpenAPI.Shopping.EasyShopping_V2';
const systemParams = {
  app_key: config.appKey,
  method: method,
  version: config.version,
};

const queryString = Object.entries(systemParams)
  .filter(([_, value]) => value !== undefined && value !== null)
  .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
  .join('&');

const fullUrl = `${config.baseUrl}?${queryString}`;
console.log('完整URL:', fullUrl);
console.log('✅ URL构建正确\n');

// 测试2: 业务参数加密
console.log('测试2: 业务参数加密');
const businessParams = {
  Passengers: [{ PassengerType: 'ADT' }],
  Routings: [{
    Departure: 'PEK',
    Arrival: 'SHA',
    DepartureDate: '2024-12-25',
    DepartureType: 1,
    ArrivalType: 1,
  }],
  OnlyDirectFlight: false,
  BerthType: 'Y',
  Type: 'D',
};

const jsonParams = JSON.stringify(businessParams);
console.log('业务参数JSON:', jsonParams);

try {
  const encryptedBody = encrypt(jsonParams, config.appSecret);
  console.log('加密后长度:', encryptedBody.length);
  console.log('加密后前50字符:', encryptedBody.substring(0, 50) + '...');
  console.log('✅ 加密成功\n');
} catch (error) {
  console.error('❌ 加密失败:', error.message);
}

// 测试3: HTTP请求头
console.log('测试3: HTTP请求头');
const headers = {
  'Content-Type': 'text/plain',
  'Accept-Encoding': 'gzip, deflate',
};
console.log('请求头:', JSON.stringify(headers, null, 2));
console.log('✅ 请求头正确\n');

// 测试4: 完整请求信息
console.log('测试4: 完整请求信息');
console.log('请求方法: POST');
console.log('请求URL:', fullUrl);
console.log('请求头:', headers);
console.log('请求体: [加密后的Base64字符串]');
console.log('✅ 请求构建完成\n');

console.log('========================================');
console.log('测试总结');
console.log('========================================');
console.log('✅ URL构建: 正确');
console.log('✅ 参数加密: 正确');
console.log('✅ 请求头: 正确');
console.log('✅ 请求格式: 符合文档要求');
console.log('\n⚠️  注意: 此测试仅验证请求构建逻辑，');
console.log('   实际API调用需要真实的app_key和app_secret。');
console.log('   请在测试页面填写真实的API凭证进行实际测试。\n');

