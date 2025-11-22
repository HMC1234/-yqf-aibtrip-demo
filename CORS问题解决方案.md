# CORS问题解决方案

## ✅ 已完成的配置

### 1. 创建了代理服务器配置
- 文件：`src/setupProxy.js`
- 功能：将 `/api/yqf` 路径的请求代理到 `https://bizapi.yiqifei.cn/servings`
- 作用：绕过浏览器的CORS限制

### 2. 修改了API客户端
- 文件：`src/lib/yqf-air/client.ts`
- 功能：在开发环境中自动检测并使用代理路径
- 逻辑：
  - 如果是在 `localhost` 或 `127.0.0.1` 上运行
  - 并且baseUrl是 `https://bizapi.yiqifei.cn/servings`
  - 则自动使用 `/api/yqf` 作为代理路径

### 3. 更新了测试页面
- 添加了开发环境提示
- 说明代理功能已启用

## 🔄 需要重启开发服务器

**重要**：`setupProxy.js` 的更改需要重启开发服务器才能生效。

### 重启步骤：

1. **停止当前服务器**
   - 在运行 `npm start` 的终端窗口中
   - 按 `Ctrl + C` 停止服务器

2. **重新启动服务器**
   ```bash
   npm start
   ```

3. **等待服务器启动完成**
   - 看到 "Compiled successfully!" 消息
   - 浏览器自动打开或访问 http://localhost:3000

## 🧪 测试步骤

1. **打开测试页面**
   - 访问：http://localhost:3000/test/yqf-api

2. **配置API信息**
   - 在"配置"标签页填写：
     - API Base URL：`https://bizapi.yiqifei.cn/servings`（已默认）
     - App Key：你的应用密钥
     - App Secret：你的应用密钥
   - 点击"保存配置"

3. **测试航班查询**
   - 切换到"航班查询"标签页
   - 填写查询参数
   - 点击"查询航班"

4. **检查结果**
   - 如果成功，会显示航班数据
   - 如果失败，查看浏览器控制台的错误信息

## 🔍 如何验证代理是否工作

### 方法1：查看浏览器Network标签

1. 打开浏览器开发者工具（F12）
2. 切换到 Network 标签
3. 点击"查询航班"按钮
4. 查找请求：
   - **请求URL**应该是：`http://localhost:3000/api/yqf?...`
   - **状态码**应该是：200（成功）或其他HTTP状态码（不是CORS错误）

### 方法2：查看终端日志

在运行 `npm start` 的终端中，应该能看到：
```
代理请求: POST /api/yqf?app_key=...
代理响应: 200
```

## ⚠️ 注意事项

1. **仅开发环境有效**
   - 代理配置只在开发环境（`npm start`）中有效
   - 生产环境需要API服务器配置CORS，或使用后端API网关

2. **代理路径**
   - 开发环境：`/api/yqf`（自动代理）
   - 生产环境：`https://bizapi.yiqifei.cn/servings`（直接请求）

3. **如果仍然失败**
   - 确认已重启开发服务器
   - 检查 `src/setupProxy.js` 文件是否存在
   - 查看终端是否有代理相关错误
   - 检查浏览器控制台的完整错误信息

## 📋 代理配置说明

代理配置将：
- `/api/yqf` → `https://bizapi.yiqifei.cn/servings`
- 保持所有查询参数和请求体
- 添加必要的CORS头
- 记录请求和响应日志

## 🆘 如果问题仍然存在

请提供：
1. 浏览器控制台的完整错误信息
2. 终端中的代理日志
3. Network标签中的请求详情（截图）

---

**提示**：重启服务器后，CORS错误应该消失，请求会通过代理服务器转发。

