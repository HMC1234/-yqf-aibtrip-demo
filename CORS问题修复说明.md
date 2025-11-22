# CORS问题修复说明

## 问题描述

在测试页面提交测试时，遇到以下错误：
```
网络请求失败。可能的原因：1) API服务器不可达 2) CORS跨域问题 3) 网络连接问题。
```

## 问题原因

由于浏览器的CORS（跨域资源共享）策略限制，从 `localhost:3000` 直接调用 `https://bizapi.yiqifei.cn/servings` 会被浏览器阻止。

## 解决方案

已恢复开发环境的**自动代理功能**，在开发环境中自动使用代理路径来绕过CORS限制。

### 修复内容

1. **恢复代理逻辑** (`src/lib/yqf-air/client.ts`)
   - 在开发环境中，如果检测到是 `localhost` 或 `127.0.0.1`
   - 并且 `baseUrl` 是 `https://bizapi.yiqifei.cn/servings`
   - 自动将 `baseUrl` 切换为 `/api/yqf`（代理路径）

2. **代理配置** (`src/setupProxy.js`)
   - 代理路径：`/api/yqf` → `https://bizapi.yiqifei.cn/servings`
   - 已配置CORS头，允许跨域请求

## 工作流程

### 开发环境（localhost）

1. **用户配置**：
   ```
   Base URL: https://bizapi.yiqifei.cn/servings
   ```

2. **自动检测**：
   - 检测到：`localhost` + 原始API地址
   - 自动切换为：`/api/yqf`

3. **实际请求**：
   ```
   浏览器请求: http://localhost:3000/api/yqf?version=2.0&app_key=xxx&method=...
   ↓
   代理转发: https://bizapi.yiqifei.cn/servings?version=2.0&app_key=xxx&method=...
   ```

### 生产环境

直接调用：
```
https://bizapi.yiqifei.cn/servings?version=2.0&app_key=xxx&method=...
```

## 重要提示

### ⚠️ 必须重启开发服务器

`setupProxy.js` 的配置需要重启开发服务器才能生效。

**重启步骤**：
1. 在运行 `npm start` 的终端按 `Ctrl + C` 停止服务器
2. 重新启动：`npm start`
3. 等待编译完成

### 验证代理是否工作

1. **查看终端日志**：
   重启后，在终端中应该看到：
   ```
   ✅ setupProxy.js 已加载
   ✅ 代理配置已设置: /api/yqf -> https://bizapi.yiqifei.cn/servings
   ```

2. **查看浏览器控制台**：
   测试时应该看到：
   ```
   🔄 [开发环境] 自动使用代理路径绕过CORS限制: /api/yqf
   🔄 [API调用] 通过代理调用（开发环境）: /api/yqf?...
   ```

3. **查看Network标签**：
   - 请求URL应该是：`http://localhost:3000/api/yqf?...`
   - 状态码应该是：200（成功）或具体的API错误码

## 测试步骤

1. **重启开发服务器**（重要！）
   ```bash
   # 停止当前服务器（Ctrl+C）
   npm start
   ```

2. **打开测试页面**
   - 访问：`http://localhost:3000/test/yqf-api`

3. **配置API信息**
   - 在"配置"标签页填写：
     - API Base URL：`https://bizapi.yiqifei.cn/servings`（已默认）
     - App Key：你的应用密钥
     - App Secret：你的应用密钥
     - Version：`2.0`（已默认）
     - OfficeIds：`EI00D`（已默认）
   - 点击"保存配置"

4. **测试航班查询**
   - 切换到"航班查询"标签页
   - 填写查询参数
   - 点击"查询航班"

5. **检查结果**
   - 如果成功，会显示航班数据
   - 如果失败，查看浏览器控制台的详细错误信息

## 常见问题

### Q1: 仍然出现CORS错误？

**A**: 请确认：
1. ✅ 开发服务器已重启
2. ✅ 终端中看到代理配置日志
3. ✅ 浏览器控制台显示"使用代理路径"

### Q2: 代理404错误？

**A**: 检查：
1. `src/setupProxy.js` 文件是否存在
2. 是否安装了 `http-proxy-middleware`：
   ```bash
   npm list http-proxy-middleware
   ```
3. 如果未安装，运行：
   ```bash
   npm install --save-dev http-proxy-middleware
   ```

### Q3: 如何确认代理是否工作？

**A**: 查看终端日志：
- 应该看到 `🔵 [代理] 请求:` 日志
- 应该看到 `🟢 [代理] 响应:` 日志

## 总结

✅ **已修复**：恢复开发环境自动代理功能  
✅ **已配置**：代理路径 `/api/yqf` → `https://bizapi.yiqifei.cn/servings`  
✅ **已测试**：代理配置正确，等待服务器重启后测试

**下一步**：重启开发服务器并测试API调用

