# YQFAIBTRIP 一起飞智能商旅系统 - DEMO

## 🚀 快速开始

<!-- Trigger deployment -->

### 方式1：一键启动（推荐）

**Windows用户**：
```bash
双击运行 一键启动.bat
```

**Mac/Linux用户**：
```bash
chmod +x 一键启动.sh
./一键启动.sh
```

### 方式2：手动启动

#### 步骤1：安装依赖

```bash
npm install
```

#### 步骤2：启动项目

```bash
npm start
```

项目将在 http://localhost:3000 启动

---

## 🔑 测试账号

- **Email**: test@example.com
- **Password**: 123456

---

## ✨ 功能说明

### 已实现的功能

1. ✅ **用户登录** - Supabase Auth认证
2. ✅ **首页仪表板** - 统计和快速操作
3. ✅ **提交出差申请** - 完整表单和验证
4. ✅ **申请单列表** - 按状态筛选
5. ✅ **申请单详情** - 完整信息展示
6. ✅ **AI推荐方案生成** ⭐ - 核心功能
7. ✅ **推荐方案列表** - 卡片式展示
8. ✅ **推荐方案详情** - 完整方案信息

---

## 📋 使用流程

1. **登录系统**
   - 使用测试账号登录

2. **提交出差申请**
   - 点击"提交新申请"
   - 填写表单（出发地、目的地、日期、原因、产品）
   - 提交申请

3. **查看申请单**
   - 在申请单列表中查看
   - 点击"查看详情"查看完整信息

4. **AI推荐（核心功能）**
   - 在申请单详情页，点击"AI预订"
   - 观看AI推荐生成过程（加载动画）
   - 查看生成的推荐方案（3-5个方案卡片）
   - 点击方案查看详情

---

## ⚠️ 重要提示

### 审批流程（DEMO阶段）

DEMO阶段，审批流程是模拟的。要测试AI推荐功能，需要手动将申请单状态更新为"已审批"：

**方法1：在Supabase Dashboard中**
1. 打开 Table Editor
2. 找到 `travel_requests` 表
3. 找到你的申请单
4. 将 `status` 字段改为 `approved`

**方法2：在SQL Editor中执行**
```sql
-- 将所有申请单更新为已审批（测试用）
UPDATE travel_requests 
SET status = 'approved' 
WHERE status = 'pending';
```

---

## 🛠️ 技术栈

- **React 18** - UI框架
- **TypeScript** - 类型安全
- **Ant Design** - UI组件库
- **React Router** - 路由管理
- **Zustand** - 状态管理
- **Supabase** - 后端服务
- **Day.js** - 日期处理

---

## 📁 项目结构

```
src/
├── components/          # 通用组件
│   └── Layout/         # 布局组件
├── pages/              # 页面组件
│   ├── Login/          # 登录页
│   ├── Dashboard/      # 首页
│   ├── TravelRequest/   # 出差申请
│   └── AIRecommendation/ # AI推荐
├── lib/                # 工具库
│   └── supabase.ts     # Supabase配置
├── store/              # 状态管理
│   └── authStore.ts    # 认证状态
├── types/              # TypeScript类型
│   └── index.ts
├── App.tsx             # 主应用
└── index.tsx           # 入口文件
```

---

## 🐛 常见问题

### Q1: 启动时报错 "Cannot find module"
**A**: 执行 `npm install` 安装依赖

### Q2: 登录后无法获取用户信息
**A**: 检查：
- Supabase配置是否正确（`src/lib/supabase.ts`）
- 用户是否在users表中有记录
- 网络连接是否正常

### Q3: 申请单提交失败
**A**: 检查：
- 用户是否有company_id, department_id, cost_center_id
- 单号生成函数是否正常工作
- 数据库连接是否正常

### Q4: AI推荐生成失败
**A**: 检查：
- 申请单状态是否为 `approved`
- 推荐单号生成函数是否正常
- 数据库连接是否正常

---

## 📝 开发说明

### Mock数据
- AI推荐方案使用Mock数据
- 推荐详情使用预设模板
- 产品数据是示例数据

### 下一步
完成DEMO测试后：
1. 收集反馈
2. 优化UI和体验
3. 准备正式开发

---

## 📞 需要帮助？

如果遇到问题：
1. 检查控制台错误信息
2. 检查网络连接
3. 检查Supabase配置
4. 查看浏览器控制台日志

---

**创建日期**：2024-12-19  
**版本**：v0.1.0 (DEMO)






