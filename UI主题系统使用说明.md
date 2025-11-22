# UI主题系统使用说明

## 概述

本项目已经实现了UI主题管理系统，支持用户在个人中心选择和切换不同的UI设计风格。当前UI设计风格被命名为"UI1"，未来可以添加"UI2"、"UI3"等新的UI设计方案。

## 已完成的功能

### 1. UI主题管理系统 ✅

- **位置**：`src/store/themeStore.ts`
- **功能**：
  - 主题状态管理（使用Zustand）
  - 主题持久化（使用localStorage）
  - 支持UI1、UI2、UI3三种主题类型
  - 主题切换和应用逻辑

### 2. UI1主题（当前默认主题）✅

- **命名**：UI1 - Navan风格
- **描述**：现代简洁的Navan风格设计，采用紫色主题
- **样式文件位置**：`src/styles/`
  - `navan-variables.css` - CSS变量
  - `navan-theme.ts` - Ant Design主题配置
  - `navan-components.css` - 组件样式
  - `page-container.css` - 页面容器
  - `tag-optimized.css` - 标签优化
- **文档位置**：`src/themes/UI1/README.md`

### 3. 个人中心UI切换器 ✅

- **位置**：`src/pages/Profile/Profile.tsx`
- **功能**：
  - 显示当前主题
  - 提供UI1、UI2、UI3三个选项（UI2、UI3暂时禁用）
  - 切换主题后自动刷新页面以应用新样式
  - 用户选择会保存到localStorage

### 4. 主题自动应用 ✅

- **位置**：`src/App.tsx`
- **功能**：
  - 根据当前主题自动加载对应的Ant Design主题配置
  - 支持未来扩展UI2、UI3主题

## 使用方法

### 用户端

1. 登录系统后，点击右上角用户菜单，选择"个人中心"
2. 在个人中心页面，切换到"UI主题设置"标签页
3. 选择一个UI主题（当前只有UI1可用）
4. 选择后，系统会显示成功消息并自动刷新页面以应用新主题
5. 您的选择会被保存，下次登录时仍会使用您选择的主题

### 开发端

#### 添加新的UI主题（UI2、UI3等）

**步骤1：创建主题目录**
```bash
mkdir -p src/themes/UI2
```

**步骤2：创建主题文件**
在 `src/themes/UI2/` 目录下创建：
- `variables.css` - 新主题的CSS变量
- `theme.ts` - 新主题的Ant Design配置
- `components.css` - 新主题的组件样式
- `README.md` - 新主题的说明文档

**步骤3：更新主题Store**
在 `src/store/themeStore.ts` 中的 `themeInfo` 对象中添加新主题的信息：
```typescript
UI2: {
  name: 'UI2 - 新主题名称',
  description: '新主题的描述',
},
```

**步骤4：更新App.tsx**
1. 导入新主题的样式文件
2. 在 `getAntdTheme()` 函数中添加新主题的配置：
```typescript
case 'UI2':
  return ui2Theme  // 导入的新主题配置
```

**步骤5：更新Profile页面**
新主题会自动显示在主题选择列表中（如果已更新themeStore）。

#### 修改现有UI主题（UI1）

直接修改 `src/styles/` 目录下的相关文件即可，包括：
- `navan-variables.css` - 修改颜色、字体、间距等变量
- `navan-theme.ts` - 修改Ant Design组件配置
- `navan-components.css` - 修改组件样式

## 文件结构

```
src/
├── store/
│   └── themeStore.ts          # 主题管理Store
├── styles/                    # UI1主题样式文件
│   ├── navan-variables.css
│   ├── navan-theme.ts
│   ├── navan-components.css
│   └── ...
├── themes/                    # 主题文档和未来主题目录
│   ├── README.md              # 主题系统说明
│   └── UI1/
│       └── README.md          # UI1主题说明
├── pages/
│   └── Profile/
│       └── Profile.tsx        # 个人中心（包含UI切换器）
└── App.tsx                    # 主应用（主题应用逻辑）
```

## 技术细节

### 主题持久化

- 使用Zustand的persist中间件
- 数据存储在localStorage中，key为`ui-theme-storage`
- 用户选择的主题会在浏览器本地保存

### 主题切换流程

1. 用户在Profile页面选择新主题
2. `themeStore.setTheme()` 被调用
3. 主题状态更新并保存到localStorage
4. 页面刷新以完全应用新主题样式
5. 下次访问时从localStorage恢复用户选择

### CSS变量系统

UI1主题使用CSS变量系统（定义在`navan-variables.css`），包括：
- 颜色变量（--navan-purple, --navan-gray-*等）
- 字体变量（--navan-font-family等）
- 间距变量（--navan-space-*等）
- 阴影变量（--navan-shadow-*等）

未来新主题可以定义自己的CSS变量系统。

## 注意事项

1. **页面刷新**：切换主题后需要刷新页面才能完全应用新样式（特别是CSS变量的改变）
2. **默认主题**：系统默认使用UI1主题
3. **向后兼容**：添加新主题时，需要确保不影响现有UI1的功能
4. **样式隔离**：未来新主题的样式文件应该放在各自的主题目录中，避免与UI1样式冲突

## 未来计划

- [ ] 开发UI2主题
- [ ] 开发UI3主题
- [ ] 实现主题预览功能（无需刷新即可预览）
- [ ] 支持主题自定义（用户自定义颜色等）

## 相关文档

- `src/themes/README.md` - 主题系统开发指南
- `src/themes/UI1/README.md` - UI1主题详细说明


