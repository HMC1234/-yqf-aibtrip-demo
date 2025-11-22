# Version参数错误修复说明

## ❌ 错误信息

```
HTTP错误: 500 Internal Server Error
响应内容: {"Code":-3,"Msg":"参数无效: version"}
```

## 🔍 问题分析

**好消息**: 代理已经正常工作！✅
- 请求成功到达了API服务器
- 不再是404错误

**问题**: API返回"参数无效: version"
- 说明API不接受version参数
- 或者version参数格式不正确
- 或者version参数不应该传递

## ✅ 已修复

### 修复1: Version参数变为可选

**位置**: `src/lib/yqf-air/client.ts`

- ✅ 如果version为空或未定义，不传递version参数
- ✅ 只传递有值且不为空的参数

**修改前**:
```typescript
version: config.version,  // 总是传递，即使为空
```

**修改后**:
```typescript
version: config.version && config.version.trim() ? config.version.trim() : undefined,
// 只在有值且不为空时传递
```

### 修复2: 查询字符串构建优化

**位置**: `src/lib/yqf-air/client.ts`

- ✅ 只添加有值且不为空字符串的参数
- ✅ 自动去除参数值的首尾空格

### 修复3: 测试页面更新

**位置**: `src/pages/Test/YQFAPITest.tsx`

- ✅ Version字段标记为"可选"
- ✅ 添加提示：如果API不需要version参数，可以留空
- ✅ 默认值改为空字符串

## 🧪 测试步骤

### 方法1: 不传递version参数（推荐）

1. **打开测试页面**: http://localhost:3000/test/yqf-api
2. **切换到"配置"标签页**
3. **填写配置**:
   - API Base URL: `https://bizapi.yiqifei.cn/servings`
   - App Key: 你的App Key
   - App Secret: 你的App Secret
   - **API Version: 留空**（不填写）
4. **点击"保存配置"**
5. **测试航班查询**

### 方法2: 如果API需要version参数

如果API确实需要version参数，可以尝试：
- 留空（不传递）
- 或者填写正确的格式（可能需要联系API提供商确认格式）

## 📋 修改详情

### 1. 系统级参数构建

```typescript
const systemParams: SystemParams = {
  app_key: config.appKey,
  method,
  // version参数只在有值且不为空字符串时传递
  version: config.version && config.version.trim() ? config.version.trim() : undefined,
}
```

### 2. 查询字符串构建

```typescript
const queryString = new URLSearchParams(
  Object.entries(systemParams).reduce((acc, [key, value]) => {
    // 只添加有值且不为空字符串的参数
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      acc[key] = String(value).trim()
    }
    return acc
  }, {} as Record<string, string>)
).toString()
```

## ✅ 预期结果

修复后，请求URL应该是：
```
http://localhost:3000/api/yqf?app_key=xxx&method=BizApi.OpenAPI.Shopping.EasyShopping_V2
```

**注意**: 不再包含 `&version=v1` 参数

## 🔍 如果仍然出错

如果API确实需要version参数，请：

1. **联系API提供商**确认：
   - version参数是否必需
   - version参数的正确格式
   - version参数的正确值

2. **或者尝试不同的值**:
   - 留空（不传递）
   - `v1`
   - `1`
   - `1.0`

## 📝 总结

- ✅ 代理已正常工作
- ✅ Version参数已变为可选
- ✅ 如果version为空，不会传递该参数
- ✅ 可以重新测试API调用

---

**修复完成时间**: 2025-11-22  
**状态**: ✅ 已修复，可以重新测试

