# API调用错误排查指南

## ❌ "Failed to fetch" 错误

### 可能的原因

#### 1. CORS跨域问题（最常见）
**症状**：浏览器控制台显示CORS错误

**原因**：
- API服务器未配置允许跨域请求
- 浏览器安全策略阻止了跨域请求

**解决方案**：
- 联系API提供商，要求他们在服务器端配置CORS
- 或者使用代理服务器转发请求

#### 2. 网络连接问题
**症状**：无法连接到API服务器

**检查方法**：
1. 检查API地址是否正确：`https://bizapi.yiqifei.cn/servings`
2. 在浏览器中直接访问API地址，看是否能连接
3. 检查网络连接是否正常

#### 3. API服务器不可达
**症状**：请求超时或连接被拒绝

**检查方法**：
- 使用ping命令测试服务器：`ping bizapi.yiqifei.cn`
- 或使用curl测试：`curl https://bizapi.yiqifei.cn/servings`

#### 4. 请求格式问题
**症状**：服务器返回400或500错误

**检查方法**：
- 查看浏览器Network标签中的请求详情
- 检查请求头是否正确
- 检查请求体格式是否正确

## 🔍 调试步骤

### 步骤1：检查浏览器控制台

1. 打开浏览器开发者工具（F12）
2. 查看Console标签
3. 查找错误信息，特别是：
   - CORS相关错误
   - 网络错误
   - 请求详情

### 步骤2：检查Network标签

1. 打开Network标签
2. 点击"查询航班"按钮
3. 查找失败的请求（红色）
4. 点击请求，查看：
   - **Request URL**：检查URL是否正确
   - **Request Headers**：检查请求头
   - **Request Payload**：检查请求体
   - **Response**：查看服务器响应

### 步骤3：检查请求URL

请求URL格式应该是：
```
https://bizapi.yiqifei.cn/servings?app_key=你的AppKey&method=BizApi.OpenAPI.Shopping.EasyShopping_V2&version=v1
```

### 步骤4：检查配置

确保在"配置"标签页填写了：
- ✅ API Base URL：`https://bizapi.yiqifei.cn/servings`
- ✅ App Key：你的应用密钥
- ✅ App Secret：你的应用密钥
- ✅ 点击了"保存配置"按钮

## 🛠️ 临时解决方案

### 方案1：使用代理服务器

如果遇到CORS问题，可以：
1. 配置开发服务器代理（在`package.json`中添加proxy）
2. 或使用后端API网关转发请求

### 方案2：检查API地址

确认API地址是否正确：
- 测试地址：`https://bizapi.yiqifei.cn/servings`
- 如果地址不对，联系API提供商获取正确地址

### 方案3：检查网络

1. 检查防火墙设置
2. 检查VPN或代理设置
3. 尝试使用不同的网络环境

## 📋 错误信息对照表

| 错误信息 | 可能原因 | 解决方案 |
|---------|---------|---------|
| Failed to fetch | CORS问题/网络问题 | 检查CORS配置或网络连接 |
| Network error | 网络连接失败 | 检查网络和API地址 |
| CORS policy | 跨域被阻止 | 联系API提供商配置CORS |
| 400 Bad Request | 请求格式错误 | 检查请求参数 |
| 401 Unauthorized | 认证失败 | 检查App Key和App Secret |
| 500 Internal Server Error | 服务器错误 | 联系API提供商 |

## 🔧 改进的错误处理

代码已更新，现在会：
1. ✅ 显示更详细的错误信息
2. ✅ 区分不同类型的错误（网络错误、CORS错误等）
3. ✅ 在控制台输出请求详情，便于调试
4. ✅ 显示错误类型和堆栈信息

## 📝 下一步

如果问题仍然存在，请提供：
1. 浏览器控制台的完整错误信息
2. Network标签中的请求详情（截图）
3. 使用的API配置信息（App Key和App Secret可以打码）

---

**提示**：大多数"Failed to fetch"错误都是CORS问题，需要API提供商在服务器端配置允许跨域请求。

