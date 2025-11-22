# 直接调用API配置完成

## 已完成的修改

✅ **移除了所有代理逻辑**：
- 不再自动检测或使用代理路径
- 直接使用配置的 `baseUrl` 进行调用
- 移除了所有代理相关的代码和提示

✅ **更新了错误处理**：
- 移除了代理相关的错误提示
- 简化了404错误的诊断信息

✅ **更新了测试页面**：
- 移除了代理相关的提示
- 简化了API Base URL字段的说明

## 当前配置

### API调用方式

**直接调用**：
```
https://bizapi.yiqifei.cn/servings?version=2.0&app_key=xxx&method=ShoppingServer.EasyShopping_V2
```

### 请求流程

1. **构建系统级参数**（URL查询字符串）：
   - `version=2.0`（必填）
   - `app_key=xxx`（必填）
   - `method=ShoppingServer.EasyShopping_V2`（必填）

2. **构建业务参数**（HTTP Body，需加密）：
   - JSON格式的业务参数
   - 使用AES加密
   - Base64编码

3. **发送HTTP POST请求**：
   - URL：`https://bizapi.yiqifei.cn/servings?version=2.0&app_key=xxx&method=...`
   - Headers：`Content-Type: text/plain`
   - Body：加密后的业务参数

## 使用方式

### 在测试页面

1. **打开测试页面**：`http://localhost:3000/test/yqf-api`

2. **配置API信息**（"配置"标签页）：
   - **API Base URL**：`https://bizapi.yiqifei.cn/servings`（默认值）
   - **App Key**：您的应用密钥
   - **App Secret**：您的应用密钥
   - **API Version**：`2.0`（默认值）
   - **注册公司（OfficeIds）**：`EI00D`（默认值）

3. **测试航班查询**（"航班查询"标签页）：
   - 参数已自动填充（广州→北京，2025-12-01）
   - 点击"查询航班"按钮

## 注意事项

### CORS问题

如果遇到CORS跨域错误：
- 这是浏览器的安全策略限制
- 需要API服务器配置CORS策略，允许来自 `localhost:3000` 的请求
- 或者使用后端代理（不在前端代码中处理）

### 404错误

如果遇到404错误：
- 检查API地址是否正确：`https://bizapi.yiqifei.cn/servings`
- 检查系统级参数是否正确（version=2.0, app_key, method）
- 查看浏览器控制台的完整请求URL

## 调试信息

测试时，浏览器控制台会显示：

```
🔍 [API调用] 配置信息: {
  基础地址: "https://bizapi.yiqifei.cn/servings",
  appKey: "...",
  version: "2.0",
  接口方法: "ShoppingServer.EasyShopping_V2"
}
🔍 [API调用] 系统级参数: {...}
🔍 [API调用] 完整请求URL: "https://bizapi.yiqifei.cn/servings?version=2.0&app_key=...&method=..."
✅ [API调用] 直接调用API: "https://bizapi.yiqifei.cn/servings?..."
```

## 总结

✅ **已配置**：直接调用 `https://bizapi.yiqifei.cn/servings`  
✅ **已移除**：所有代理相关逻辑  
✅ **符合文档**：按照文档要求直接调用API

现在代码完全按照文档要求，直接调用API接口，不使用任何代理。

