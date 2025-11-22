# UI主题系统

## 概述

本项目支持多UI主题切换功能，用户可以在个人中心选择不同的UI设计风格。

## 主题列表

### UI1 - Navan风格（当前默认）

- **状态**：✅ 已实现
- **描述**：现代简洁的Navan风格设计，采用紫色主题
- **位置**：样式文件在 `src/styles/`，主题文档在 `src/themes/UI1/`

### UI2 - 待开发

- **状态**：🚧 待开发
- **描述**：新的UI设计方案，即将推出

### UI3 - 待开发

- **状态**：🚧 待开发
- **描述**：新的UI设计方案，即将推出

## 主题管理

### 主题Store

主题状态管理通过 `src/store/themeStore.ts` 实现：

- 使用Zustand进行状态管理
- 使用localStorage持久化用户选择
- 支持主题切换和应用

### 主题切换

用户可以在个人中心（`/profile`）的"UI主题设置"标签页中选择和切换主题。

## 开发新主题

### 步骤1：创建主题目录

在 `src/themes/` 下创建新主题目录，例如 `UI2/`。

### 步骤2：创建样式文件

在新主题目录中创建对应的CSS和主题配置文件：

```
src/themes/UI2/
├── variables.css       # CSS变量
├── theme.ts           # Ant Design主题配置
├── components.css     # 组件样式
└── README.md          # 主题说明文档
```

### 步骤3：更新主题Store

在 `src/store/themeStore.ts` 中：
1. 添加新主题类型（如果类型定义在store中）
2. 更新 `themeInfo` 对象，添加新主题的名称和描述

### 步骤4：更新App.tsx

在 `src/App.tsx` 中：
1. 导入新主题的样式文件
2. 在 `getAntdTheme()` 函数中添加新主题的配置

### 步骤5：更新Profile页面

在 `src/pages/Profile/Profile.tsx` 中，新主题会自动显示在主题选择列表中。

## 主题切换流程

1. 用户在个人中心选择新主题
2. `themeStore.setTheme()` 被调用
3. 主题状态更新并保存到localStorage
4. 应用主题样式（通过CSS类或动态加载样式文件）
5. 页面刷新以完全应用新主题

## 注意事项

- 当前UI1主题的样式文件直接放在 `src/styles/` 目录中
- 未来新主题（UI2、UI3等）应放在各自的 `src/themes/UI2/`、`src/themes/UI3/` 目录中
- 主题切换可能需要页面刷新才能完全生效（特别是CSS变量的改变）
- 建议在开发新主题时，先复制UI1的主题文件作为基础模板


