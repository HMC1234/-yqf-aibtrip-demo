# DEMO部署指南

**项目名称**：YQFAIBTRIP 一起飞智能商旅系统 - DEMO  
**部署日期**：2024-12-19

---

## 🚀 免费部署平台推荐

### 推荐1：Vercel（最推荐）⭐

**优点**：
- ✅ 完全免费
- ✅ 自动部署（连接GitHub）
- ✅ 自动HTTPS
- ✅ 全球CDN加速
- ✅ 支持环境变量
- ✅ 零配置部署（自动检测React）

**访问**：https://vercel.com

### 推荐2：Netlify

**优点**：
- ✅ 完全免费
- ✅ 自动部署
- ✅ 自动HTTPS
- ✅ 全球CDN
- ✅ 支持环境变量

**访问**：https://www.netlify.com

### 推荐3：GitHub Pages

**优点**：
- ✅ 完全免费
- ✅ 稳定可靠
- ✅ GitHub集成

**注意**：需要额外配置路由

---

## 📋 部署前准备

### 1. 确保项目可以构建

```bash
# 安装依赖
npm install

# 本地构建测试
npm run build
```

如果构建成功，说明项目可以部署。

### 2. 准备GitHub仓库（可选，推荐）

如果还没有Git仓库，建议先初始化：

```bash
# 初始化Git仓库
git init

# 添加文件
git add .

# 提交
git commit -m "Initial commit - DEMO ready for deployment"

# 创建GitHub仓库并推送（在GitHub上创建仓库后）
git remote add origin https://github.com/your-username/yqf-aibtrip-demo.git
git push -u origin main
```

---

## 🎯 方式1：使用Vercel部署（推荐）

### 步骤1：注册Vercel账号

1. 访问 https://vercel.com
2. 点击"Sign Up"
3. 使用GitHub账号登录（推荐）

### 步骤2：导入项目

1. 登录Vercel后，点击"Add New..." → "Project"
2. 如果已连接GitHub，选择你的仓库
3. 如果没有，点击"Import Git Repository"，连接GitHub

### 步骤3：配置项目

Vercel会自动检测到这是React项目，配置如下：

**Framework Preset**：Create React App（自动检测）  
**Root Directory**：`./`（默认）  
**Build Command**：`npm run build`（自动）  
**Output Directory**：`build`（自动）

### 步骤4：配置环境变量（可选）

如果使用环境变量，在"Environment Variables"中添加：

```
REACT_APP_SUPABASE_URL=https://ienbmjucvvvdwfwcpejy.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbmJtanVjdnZ2ZHdmd2NwZWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NTQ4MzEsImV4cCI6MjA3OTEzMDgzMX0.1s4B5IKWvOBUa0QXPffyJpGr9cxrf3h5A3FdRTv-OLY
```

**注意**：由于Supabase配置已硬编码在代码中，环境变量是可选的。

### 步骤5：部署

1. 点击"Deploy"按钮
2. 等待构建完成（通常2-3分钟）
3. 部署成功后，会获得一个公网地址，例如：
   ```
   https://yqf-aibtrip-demo.vercel.app
   ```

### 步骤6：分享链接

部署成功后，将链接分享给其他人员测试！

---

## 🎯 方式2：使用Netlify部署

### 步骤1：注册Netlify账号

1. 访问 https://www.netlify.com
2. 点击"Sign up"
3. 使用GitHub账号登录

### 步骤2：导入项目

1. 登录后，点击"Add new site" → "Import an existing project"
2. 选择GitHub，授权并选择仓库
3. 配置构建设置：

**Build command**：`npm run build`  
**Publish directory**：`build`

### 步骤3：配置环境变量（可选）

在"Site settings" → "Environment variables"中添加环境变量。

### 步骤4：部署

1. 点击"Deploy site"
2. 等待构建完成
3. 获得公网地址，例如：
   ```
   https://yqf-aibtrip-demo.netlify.app
   ```

---

## 🎯 方式3：手动部署（无需GitHub）

### 步骤1：本地构建

```bash
npm run build
```

这会生成 `build` 目录。

### 步骤2：上传到Vercel

1. 访问 https://vercel.com
2. 点击"Add New..." → "Project"
3. 点击"Browse All Templates"
4. 选择"Other"或直接拖拽 `build` 目录
5. 或者使用Vercel CLI：

```bash
# 安装Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

### 步骤3：获得链接

部署成功后获得公网地址。

---

## ✅ 部署后验证

部署完成后，验证以下功能：

1. ✅ **访问首页**：确认页面正常加载
2. ✅ **用户登录**：使用测试账号登录（test@example.com / 123456）
3. ✅ **提交申请**：测试提交出差申请功能
4. ✅ **AI推荐**：测试AI推荐生成功能
5. ✅ **推荐方案**：测试推荐方案列表和详情
6. ✅ **一键预订**：测试一键预订功能
7. ✅ **路由跳转**：测试所有页面路由是否正常

---

## 🔧 常见问题

### 问题1：构建失败

**解决方案**：
- 检查是否有编译错误
- 确保所有依赖已安装
- 检查环境变量配置

### 问题2：页面空白或404

**解决方案**：
- Vercel已配置 `vercel.json`，会自动处理路由
- Netlify需要创建 `netlify.toml` 文件（已提供）

### 问题3：Supabase连接失败

**解决方案**：
- 检查Supabase配置是否正确
- 确认Supabase项目已启动
- 检查网络连接

### 问题4：环境变量不生效

**解决方案**：
- 在部署平台的环境变量中重新配置
- 确保变量名以 `REACT_APP_` 开头
- 重新部署

---

## 📝 部署检查清单

- [ ] 项目可以本地构建成功（`npm run build`）
- [ ] Git仓库已准备好（可选）
- [ ] 选择部署平台（Vercel/Netlify）
- [ ] 配置构建命令和输出目录
- [ ] 配置环境变量（如果需要）
- [ ] 部署成功
- [ ] 获得公网地址
- [ ] 验证所有功能正常
- [ ] 分享链接给测试人员

---

## 🎉 部署完成

部署成功后，你会获得一个公网地址，例如：
- Vercel：`https://yqf-aibtrip-demo.vercel.app`
- Netlify：`https://yqf-aibtrip-demo.netlify.app`

**将这个链接分享给其他人员即可开始测试！**

---

## 📞 需要帮助？

如果遇到问题：
1. 检查构建日志中的错误信息
2. 查看部署平台的文档
3. 检查Supabase配置是否正确

---

**创建日期**：2024-12-19  
**最后更新**：2024-12-19

