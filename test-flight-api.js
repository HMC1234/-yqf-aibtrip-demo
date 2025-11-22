// 机票查询API测试脚本
// 使用方法：node test-flight-api.js

// 注意：这个脚本需要在Node.js环境中运行
// 由于使用了浏览器环境的window对象，建议通过测试页面进行测试

console.log('========================================');
console.log('中航服机票查询API测试');
console.log('========================================\n');

console.log('⚠️  注意：');
console.log('1. 此脚本需要配置API信息');
console.log('2. 建议使用测试页面进行测试：http://localhost:3000/test/yqf-api');
console.log('3. 或者设置环境变量：');
console.log('   REACT_APP_YQF_BASE_URL=你的API地址');
console.log('   REACT_APP_YQF_APP_KEY=你的AppKey');
console.log('   REACT_APP_YQF_APP_SECRET=你的AppSecret\n');

console.log('========================================');
console.log('测试步骤：');
console.log('========================================');
console.log('1. 启动开发服务器：npm start');
console.log('2. 访问测试页面：http://localhost:3000/test/yqf-api');
console.log('3. 在"配置"标签页填写API信息');
console.log('4. 切换到"航班查询"标签页');
console.log('5. 填写查询参数（或使用默认值）');
console.log('6. 点击"查询航班"按钮');
console.log('7. 查看响应数据\n');

console.log('========================================');
console.log('示例查询参数：');
console.log('========================================');
const exampleParams = {
  Passengers: [
    { PassengerType: 'ADT' }
  ],
  Routings: [
    {
      Departure: 'PEK',  // 北京
      Arrival: 'SHA',    // 上海
      DepartureDate: '2024-12-25',
      DepartureType: 1,
      ArrivalType: 1,
    }
  ],
  OnlyDirectFlight: false,
  BerthType: 'Y',
  Type: 'D',  // D国内/A国际
  ChildQty: 0,
  IsQueryRule: false,
  IsQueryAirline: false,
  CodeShare: false,
  IsQueryAirport: false,
};

console.log(JSON.stringify(exampleParams, null, 2));
console.log('\n');

console.log('========================================');
console.log('预期响应结构：');
console.log('========================================');
console.log('{');
console.log('  "Code": 0,');
console.log('  "Msg": "调用成功",');
console.log('  "Data": {');
console.log('    "JourneyBiz": [...],');
console.log('    "JourneySegmentResult": [...],');
console.log('    "JourneyTicketResult": [...],');
console.log('    "TicketFareResult": [...],');
console.log('    ...');
console.log('  }');
console.log('}');
console.log('\n');

console.log('========================================');
console.log('如果遇到错误：');
console.log('========================================');
console.log('1. 检查API配置是否正确');
console.log('2. 检查网络连接');
console.log('3. 检查API地址是否可访问');
console.log('4. 检查App Key和App Secret是否正确');
console.log('5. 查看浏览器控制台的详细错误信息\n');

