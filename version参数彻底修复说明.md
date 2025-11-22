# Version参数彻底修复说明

## ❌ 问题根源

虽然之前修复了URL构建逻辑，但问题出在**配置合并**上：

1. **默认配置**中 `version: 'v1'`（在 `config.ts` 中）
2. **测试配置**中 `version: ''`（空字符串）
3. 当合并配置时，空字符串的 `version` 没有正确覆盖默认值
4. 导致仍然传递了 `version=v1` 参数

## ✅ 已完成的修复

### 修复1: 配置合并逻辑 (`src/lib/yqf-air/config.ts`)

**问题**: `setTestConfig` 没有正确处理空字符串的 version

**修复**:
```typescript
export const setTestConfig = (config: Partial<YQFConfig>) => {
  if (typeof window !== 'undefined') {
    const currentConfig = getConfig()
    const mergedConfig: YQFConfig = {
      ...currentConfig,
      ...config,
    }
    
    // 如果version是空字符串，明确设置为undefined，确保不传递该参数
    if (mergedConfig.version !== undefined && mergedConfig.version.trim() === '') {
      mergedConfig.version = undefined
    }
    
    ;(window as any).__YQF_TEST_CONFIG__ = mergedConfig
  }
}
```

### 修复2: 客户端配置获取 (`src/lib/yqf-air/client.ts`)

**问题**: `getConfig` 没有处理空字符串的 version

**修复**:
```typescript
private getConfig(): YQFConfig {
  let config: YQFConfig
  
  // 优先使用测试配置（如果存在）
  if (typeof window !== 'undefined' && (window as any).__YQF_TEST_CONFIG__) {
    config = { ...(window as any).__YQF_TEST_CONFIG__ }
  } else {
    config = { ...yqfConfig }
  }
  
  // 确保version为空字符串时设置为undefined，确保不传递该参数
  if (config.version !== undefined && config.version.trim() === '') {
    config.version = undefined
  }
  
  // ... 其他逻辑
}
```

### 修复3: 添加调试日志 (`src/lib/yqf-air/client.ts`)

**新增**: 在开发环境中显示实际构建的URL和参数

```typescript
// 调试日志：显示实际构建的URL和参数
if (process.env.NODE_ENV === 'development') {
  console.log('🔍 [API调用] 配置信息:', {
    baseUrl: config.baseUrl,
    appKey: config.appKey,
    version: config.version,
    versionType: typeof config.version,
    versionLength: config.version?.length,
  })
  console.log('🔍 [API调用] 系统级参数:', systemParams)
  console.log('🔍 [API调用] 查询参数对象:', queryParams)
  console.log('🔍 [API调用] 最终URL:', url)
}
```

## 🧪 测试步骤

### 步骤1: 清除浏览器缓存

**重要**: 确保使用最新代码！

1. **硬刷新浏览器**:
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **或者清除缓存**:
   - 打开开发者工具（F12）
   - 右键点击刷新按钮
   - 选择"清空缓存并硬性重新加载"

### 步骤2: 填写配置

1. 打开测试页面: http://localhost:3000/test/yqf-api
2. 切换到"配置"标签页
3. 填写配置:
   - API Base URL: `https://bizapi.yiqifei.cn/servings`
   - App Key: 你的 App Key
   - App Secret: 你的 App Secret
   - **API Version: 留空**（不填写任何内容）
4. 点击"保存配置"

### 步骤3: 测试并查看日志

1. 切换到"航班查询"标签页
2. 填写查询参数
3. 点击"查询航班"
4. **打开浏览器控制台（F12）**，查看调试日志

### 步骤4: 验证URL

在浏览器控制台中，应该看到：

```
🔍 [API调用] 配置信息: {
  baseUrl: "/api/yqf",
  appKey: "100999",
  version: undefined,  // ✅ 应该是 undefined
  versionType: "undefined",
  versionLength: undefined
}

🔍 [API调用] 系统级参数: {
  app_key: "100999",
  method: "BizApi.OpenAPI.Shopping.EasyShopping_V2",
  version: undefined  // ✅ 应该是 undefined
}

🔍 [API调用] 查询参数对象: {
  app_key: "100999",
  method: "BizApi.OpenAPI.Shopping.EasyShopping_V2"
  // ✅ 不应该有 version 字段
}

🔍 [API调用] 最终URL: /api/yqf?app_key=100999&method=BizApi.OpenAPI.Shopping.EasyShopping_V2
// ✅ URL中不应该包含 version 参数
```

## ✅ 预期结果

1. **浏览器控制台日志**:
   - version 应该是 `undefined`
   - 最终URL不应该包含 `version` 参数

2. **API调用结果**:
   - 不再出现 "参数无效: version" 错误
   - 应该返回正常的API响应（或业务错误，但不是version参数错误）

## 🔍 如果仍然出错

### 检查1: 确认代码已更新

查看浏览器控制台的调试日志，确认：
- `version` 是 `undefined`
- URL中不包含 `version` 参数

### 检查2: 如果version仍然是 'v1'

可能的原因：
1. 浏览器缓存了旧代码 → 硬刷新浏览器
2. 配置表单中填写了 'v1' → 清空version字段
3. 服务器没有重新编译 → 检查终端是否有编译错误

### 检查3: 查看实际请求

在浏览器Network标签中：
1. 找到API请求
2. 查看请求URL
3. 确认是否包含 `version` 参数

## 📝 修复总结

- ✅ 修复了配置合并逻辑
- ✅ 修复了配置获取逻辑
- ✅ 添加了调试日志
- ✅ 确保空字符串的version正确转换为undefined

---

**修复完成时间**: 2025-11-22  
**状态**: ✅ 已彻底修复  
**下一步**: 清除浏览器缓存并重新测试

