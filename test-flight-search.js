// 测试机票查询接口
// 参数：出发地：广州，目的地：北京，出发日期：2025年12月1日

// 使用Node.js内置的fetch（Node 18+）或安装node-fetch
let fetch;
try {
  // 尝试使用Node.js 18+的内置fetch
  if (typeof globalThis.fetch !== 'undefined') {
    fetch = globalThis.fetch;
  } else {
    // 如果没有，尝试require node-fetch
    fetch = require('node-fetch');
  }
} catch (e) {
  console.error('❌ 需要Node.js 18+或安装node-fetch: npm install node-fetch@2');
  process.exit(1);
}

const CryptoJS = require('crypto-js');

// 配置信息（请替换为真实的配置）
const config = {
  baseUrl: 'https://bizapi.yiqifei.cn/servings',
  appKey: process.env.REACT_APP_YQF_APP_KEY || '100999', // 请替换为真实的App Key
  appSecret: process.env.REACT_APP_YQF_APP_SECRET || '', // 请替换为真实的App Secret
  version: '2.0',
  officeIds: 'EI00D', // 注册公司
};

// 城市名称到机场代码的映射
const cityToAirportCode = (city) => {
  const map = {
    '北京': 'PEK',
    '上海': 'SHA',
    '广州': 'CAN',
    '深圳': 'SZX',
    '杭州': 'HGH',
    '成都': 'CTU',
    '西安': 'XIY',
    '南京': 'NKG',
    '武汉': 'WUH',
    '重庆': 'CKG',
  };
  return map[city] || city;
};

// AES加密函数
function encrypt(plainText, secretKey) {
  const trimmedSecretKey = secretKey.trim();
  if (trimmedSecretKey.length !== 16 && trimmedSecretKey.length !== 32) {
    throw new Error('密钥长度必须为16或32字节');
  }
  
  const iv = CryptoJS.lib.WordArray.create([0, 0, 0, 0]);
  iv.sigBytes = 16;
  const key = CryptoJS.enc.Utf8.parse(trimmedSecretKey);
  
  const encrypted = CryptoJS.AES.encrypt(plainText, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  
  return encrypted.toString();
}

// 测试机票查询
async function testFlightSearch() {
  console.log('🧪 开始测试机票查询接口...\n');
  
  // 检查配置
  if (!config.appSecret) {
    console.error('❌ 错误：请设置 REACT_APP_YQF_APP_SECRET 环境变量或修改脚本中的 appSecret');
    console.log('\n使用方法：');
    console.log('  REACT_APP_YQF_APP_KEY=your_key REACT_APP_YQF_APP_SECRET=your_secret node test-flight-search.js');
    process.exit(1);
  }
  
  // 构建请求参数
  const params = {
    Passengers: [
      { PassengerType: 'ADT' }
    ],
    Routings: [
      {
        Departure: cityToAirportCode('广州'), // CAN
        Arrival: cityToAirportCode('北京'),   // PEK
        DepartureDate: '2025-12-01',
        DepartureType: 1,
        ArrivalType: 1,
      },
    ],
    OfficeIds: [config.officeIds], // 必填参数
    Type: 'D', // D:国内，A:国际
    OnlyDirectFlight: false,
    BerthType: 'Y', // Y:经济舱
    ChildQty: 0,
    IsQueryRule: false,
    IsQueryAirline: false,
    CodeShare: false,
    IsQueryAirport: false,
  };
  
  // 构建系统级参数
  const systemParams = {
    app_key: config.appKey,
    method: 'ShoppingServer.EasyShopping_V2',
    version: config.version,
  };
  
  // 构建URL
  const queryString = new URLSearchParams(systemParams).toString();
  const url = `${config.baseUrl}?${queryString}`;
  
  console.log('📋 请求参数：');
  console.log('  出发地：广州 (CAN)');
  console.log('  目的地：北京 (PEK)');
  console.log('  出发日期：2025-12-01');
  console.log('  机票类型：国内 (D)');
  console.log('  舱位类型：经济舱 (Y)');
  console.log('  注册公司：', config.officeIds);
  console.log('\n🔗 请求URL：', url);
  console.log('\n📦 业务参数：');
  console.log(JSON.stringify(params, null, 2));
  
  // 加密业务参数
  const jsonParams = JSON.stringify(params);
  const encryptedBody = encrypt(jsonParams, config.appSecret);
  
  console.log('\n🔐 加密后的Body长度：', encryptedBody.length);
  console.log('🔐 加密后的Body预览：', encryptedBody.substring(0, 50) + '...');
  
  try {
    console.log('\n🚀 发送请求...\n');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Accept-Encoding': 'gzip, deflate',
      },
      body: encryptedBody,
    });
    
    console.log('📊 响应状态：', response.status, response.statusText);
    console.log('📊 响应头：', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ HTTP错误：', errorText);
      return;
    }
    
    const result = await response.json();
    
    console.log('\n✅ 响应结果：');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.Code === 0) {
      console.log('\n✅ 查询成功！');
      if (result.Data) {
        console.log('📊 返回数据：', JSON.stringify(result.Data, null, 2));
      }
    } else {
      console.log('\n❌ API返回错误：', result.Msg, '(Code:', result.Code + ')');
    }
    
  } catch (error) {
    console.error('\n❌ 请求失败：', error.message);
    if (error.message.includes('fetch')) {
      console.error('   可能是网络错误或CORS问题');
    }
    console.error('\n完整错误：', error);
  }
}

// 运行测试
testFlightSearch();

