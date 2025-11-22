# API接口地址说明

## 📍 当前配置

### 基础地址（Base URL）
```
https://bizapi.yiqifei.cn/servings
```

### 配置位置
- **默认配置**: `src/lib/yqf-air/config.ts` (第21行)
- **测试页面默认值**: `src/pages/Test/YQFAPITest.tsx` (第42行)

## 🔄 调用流程

### 开发环境（localhost）

1. **客户端请求**:
   ```
   http://localhost:3000/api/yqf?app_key=xxx&method=BizApi.OpenAPI.Shopping.EasyShopping_V2
   ```

2. **代理转发**:
   ```
   https://bizapi.yiqifei.cn/servings?app_key=xxx&method=BizApi.OpenAPI.Shopping.EasyShopping_V2
   ```

3. **最终请求**:
   - 基础地址: `https://bizapi.yiqifei.cn/servings`
   - 查询参数: `app_key=xxx&method=BizApi.OpenAPI.Shopping.EasyShopping_V2`
   - HTTP Body: 加密后的业务参数

### 生产环境

直接调用：
```
https://bizapi.yiqifei.cn/servings?app_key=xxx&method=BizApi.OpenAPI.Shopping.EasyShopping_V2
```

## ✅ 确认

当前配置**已经是** `https://bizapi.yiqifei.cn/servings`，无需修改。

## 🔍 如何验证

1. **查看测试页面配置**:
   - 打开: http://localhost:3000/test/yqf-api
   - 切换到"配置"标签页
   - 查看"API Base URL"字段，应该是: `https://bizapi.yiqifei.cn/servings`

2. **查看浏览器控制台**:
   - 打开开发者工具（F12）
   - 查看调试日志:
     ```
     🔍 [API调用] 配置信息: {
       baseUrl: "/api/yqf"  // 开发环境自动使用代理
     }
     ```

3. **查看Network标签**:
   - 请求URL应该是: `http://localhost:3000/api/yqf?...`
   - 代理会转发到: `https://bizapi.yiqifei.cn/servings?...`

## 📝 说明

- ✅ **基础地址已正确配置**: `https://bizapi.yiqifei.cn/servings`
- ✅ **开发环境使用代理**: 自动通过 `/api/yqf` 代理转发
- ✅ **生产环境直接调用**: 直接使用 `https://bizapi.yiqifei.cn/servings`

---

**当前状态**: ✅ 已配置正确，无需修改


