# 直接调用API说明

## 根据文档要求

根据**广州中航服机票文档 v1.2**，API调用方式如下：

### API调用地址
```
https://bizapi.yiqifei.cn/servings
```

### 调用方式
直接通过HTTP POST请求调用，无需代理服务器。

## 已完成的修改

✅ **移除了自动代理逻辑**：
- 不再自动将 `https://bizapi.yiqifei.cn/servings` 转换为 `/api/yqf`
- 直接使用配置的API地址进行调用

✅ **更新了测试页面**：
- API Base URL字段现在可以编辑
- 默认值：`https://bizapi.yiqifei.cn/servings`
- 如果遇到CORS错误，可以手动设置为 `/api/yqf` 使用代理

✅ **改进了错误提示**：
- 如果遇到CORS错误，会提示可以使用代理

## 使用方式

### 方式1：直接调用（推荐）

1. 在测试页面的"配置"标签页
2. 设置 `API Base URL` 为：`https://bizapi.yiqifei.cn/servings`
3. 填写其他配置信息
4. 保存并测试

**优点**：
- 符合文档要求
- 直接调用，无需额外配置
- 如果API服务器支持CORS，可以直接使用

### 方式2：使用代理（如果遇到CORS错误）

如果直接调用时遇到CORS跨域错误：

1. 在测试页面的"配置"标签页
2. 设置 `API Base URL` 为：`/api/yqf`
3. 填写其他配置信息
4. 保存并测试

**注意**：使用代理需要：
- 开发服务器正在运行
- `src/setupProxy.js` 文件存在
- `http-proxy-middleware` 已安装

## CORS问题说明

CORS（跨域资源共享）是浏览器的安全策略，不是API文档的要求。

- **如果API服务器支持CORS**：可以直接调用，无需代理
- **如果API服务器不支持CORS**：浏览器会阻止请求，需要使用代理

## 测试步骤

1. **首先尝试直接调用**：
   - 配置 `API Base URL` 为：`https://bizapi.yiqifei.cn/servings`
   - 测试API调用
   - 如果成功，说明API服务器支持CORS，可以直接使用

2. **如果遇到CORS错误**：
   - 配置 `API Base URL` 为：`/api/yqf`
   - 确保代理服务器已配置
   - 重新测试

## 总结

✅ **默认行为**：直接调用 `https://bizapi.yiqifei.cn/servings`  
✅ **可选方案**：如果遇到CORS问题，可以使用 `/api/yqf` 代理  
✅ **符合文档**：按照文档要求直接调用API


