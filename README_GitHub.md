# YQFAIBTRIP 一起飞智能商旅系统 - DEMO

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/yqf-aibtrip-demo)
[![Deploy with Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/yqf-aibtrip-demo)

## 🌟 项目简介

YQFAIBTRIP（一起飞智能商旅系统）是一个面向企业的SaaS差旅管理平台，支持多企业、多层级、多角色的差旅管理。系统核心特色是**AI智能推荐功能**，能够根据出差申请自动生成最优差旅方案。

## ✨ 核心功能

- ✅ **用户认证系统** - Supabase Auth集成
- ✅ **出差申请管理** - 提交、列表、详情查看
- ✅ **AI智能推荐方案** ⭐ - 从申请单自动生成推荐方案（核心功能）
- ✅ **智能对话预订** - AI对话界面，引导完成差旅需求
- ✅ **推荐方案展示** - 卡片式展示，支持查看详情和一键预订
- ✅ **经典预订流程** - 传统搜索预订功能
- ✅ **订单管理** - 订单列表、详情、状态管理

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

项目将在 http://localhost:3000 启动

### 构建生产版本

```bash
npm run build
```

## 🔑 测试账号

- **Email**: test@example.com
- **Password**: 123456

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **UI组件库**: Ant Design 5
- **路由管理**: React Router v6
- **状态管理**: Zustand
- **后端服务**: Supabase (PostgreSQL)
- **认证**: Supabase Auth
- **日期处理**: Day.js

## 📁 项目结构

```
src/
├── components/          # 通用组件
│   └── Layout/         # 布局组件
├── pages/              # 页面组件
│   ├── Login/          # 登录页
│   ├── Dashboard/      # 首页仪表板
│   ├── TravelRequest/  # 出差申请
│   ├── AIRecommendation/ # AI推荐
│   └── Booking/        # 预订功能
├── lib/                # 工具库
│   └── supabase.ts     # Supabase配置
├── store/              # 状态管理
│   └── authStore.ts    # 认证状态
└── types/              # TypeScript类型
    └── index.ts
```

## 🎯 功能演示

### 1. 用户登录
- Supabase Auth认证
- 路由保护机制

### 2. 出差申请管理
- 提交出差申请（表单验证、单号自动生成）
- 申请单列表（按状态筛选）
- 申请单详情查看

### 3. AI推荐方案（核心功能）⭐
- 从申请单生成推荐方案
- 4步加载动画展示
- 推荐方案列表（3-5个方案卡片）
- 推荐方案详情查看
- 重新推荐功能
- 一键预订功能

### 4. 智能对话预订
- AI对话界面
- 6步进度显示
- 生成出差申请单
- 生成AI推荐方案

### 5. 经典预订流程
- 搜索表单
- 从申请单自动填充
- 产品列表展示（Mock数据）
- 订单确认

### 6. 订单管理
- 订单列表（状态筛选）
- 订单详情展示
- 预订来源标识（经典/AI推荐）

## 🚀 部署

### 方式1：使用Vercel（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/yqf-aibtrip-demo)

1. 点击上方按钮或访问 [Vercel](https://vercel.com)
2. 导入GitHub仓库
3. 点击"Deploy"
4. 等待部署完成

### 方式2：使用Netlify

[![Deploy with Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/yqf-aibtrip-demo)

1. 点击上方按钮或访问 [Netlify](https://www.netlify.com)
2. 导入GitHub仓库
3. 配置构建命令：`npm run build`
4. 发布目录：`build`
5. 点击"Deploy site"

## 📋 使用流程

### 流程1：从申请单生成AI推荐
1. 登录系统
2. 提交出差申请
3. 在Supabase中将申请单状态更新为`approved`
4. 在申请单详情页点击"AI预订"
5. 观看加载动画（4步）
6. 查看推荐方案列表（3-5个方案）
7. 点击方案查看详情或一键预订

### 流程2：智能对话生成推荐
1. 访问"AI推荐"菜单
2. 选择"智能对话预订"标签页
3. 输入"我要出差"
4. 按照提示提供信息（出发地、目的地、日期、原因、产品）
5. 选择"生成推荐方案"
6. 查看推荐方案列表

## ⚙️ 环境变量（可选）

如果使用环境变量，创建`.env`文件：

```env
REACT_APP_SUPABASE_URL=https://ienbmjucvvvdwfwcpejy.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

**注意**：由于Supabase配置已硬编码在代码中，环境变量是可选的。

## 📝 单号生成规则

| 业务类型 | 单号规则 | 示例 |
|---------|---------|------|
| 页面提交出差申请 | BTRQ+JD+年月日时分秒+四位顺序号 | BTRQ+JD+20241219143025+0001 |
| AI对话生成出差申请 | BTRQ+AI+年月日时分秒+四位顺序号 | BTRQ+AI+20241219143025+0001 |
| 申请单自动推荐 | AIRD+ZDT+年月日时分秒+五位顺序号 | AIRD+ZDT+20241219143025+00001 |
| 对话生成推荐 | AIRD+AIC+年月日时分秒+五位顺序号 | AIRD+AIC+20241219143025+00001 |
| 经典预订订单 | BK+TR+年月日时分秒+五位顺序号 | BK+TR+20241219143025+00001 |
| AI推荐一键预订订单 | BK+AI+年月日时分秒+五位顺序号 | BK+AI+20241219143025+00001 |

## 🐛 常见问题

### Q1: 启动时报错 "Cannot find module"
**A**: 执行 `npm install` 安装依赖

### Q2: 登录后无法获取用户信息
**A**: 检查Supabase配置是否正确（`src/lib/supabase.ts`）

### Q3: AI推荐生成失败
**A**: 确保申请单状态为 `approved`

## 📄 许可证

MIT License

## 👥 贡献

欢迎提交Issue和Pull Request！

## 📞 联系方式

如有问题，请提交Issue。

---

**开发完成日期**：2024-12-19  
**版本**：v0.1.0 (DEMO)

