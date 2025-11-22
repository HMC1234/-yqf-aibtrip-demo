# Gemini 3.0 设计系统

基于Google Gemini 3.0的四大设计风格原则，为AI智能商旅系统创建的完整设计系统。

---

## 🎨 设计原则

### 1. 交互式可视化的直观沟通风
**核心理念**：通过可视化元素直观地传达信息，降低认知负担
- ✅ 数据可视化（图表、统计卡片）
- ✅ 交互式元素（hover状态、点击反馈）
- ✅ 清晰的视觉层次
- ✅ 即时反馈（加载状态、操作结果）

### 2. 多模态深度融合的沉浸创作风
**核心理念**：多种元素无缝融合，创造沉浸式体验
- ✅ 卡片式布局（深度、阴影）
- ✅ 渐变和材质设计
- ✅ 流畅的过渡动画
- ✅ 丰富的视觉层次

### 3. 极简输入与精准输出的高效适配风
**核心理念**：简化输入流程，精准呈现结果
- ✅ 极简的表单设计
- ✅ 智能自动填充
- ✅ 清晰的结果展示
- ✅ 高效的信息架构

### 4. 全生态兼容的灵活拓展风
**核心理念**：适配各种设备和场景，灵活扩展
- ✅ 响应式设计（PC/平板/手机）
- ✅ 灵活的组件系统
- ✅ 可扩展的布局
- ✅ 无障碍设计支持

---

## 🎨 设计令牌（Design Tokens）

### 颜色系统

#### 主色板（Primary Colors）
```css
--gemini-primary: #4285F4;        /* Google蓝 - 主品牌色 */
--gemini-primary-light: #E8F0FE;  /* 浅蓝色 - 背景/强调 */
--gemini-primary-dark: #1967D2;   /* 深蓝色 - hover/激活 */

--gemini-secondary: #34A853;      /* 绿色 - 成功/确认 */
--gemini-secondary-light: #E6F4EA; /* 浅绿色 */
--gemini-secondary-dark: #137333;  /* 深绿色 */

--gemini-accent: #EA4335;         /* 红色 - 警告/错误 */
--gemini-accent-light: #FCE8E6;   /* 浅红色 */
--gemini-warning: #FBBC04;        /* 黄色 - 警告 */
--gemini-warning-light: #FEF7E0;  /* 浅黄色 */
```

#### 中性色（Neutral Colors）
```css
--gemini-gray-50: #FAFAFA;   /* 背景色 */
--gemini-gray-100: #F5F5F5;  /* 浅背景 */
--gemini-gray-200: #EEEEEE;  /* 边框 */
--gemini-gray-300: #E0E0E0;  /* 分割线 */
--gemini-gray-400: #BDBDBD;  /* 禁用文本 */
--gemini-gray-500: #9E9E9E;  /* 次要文本 */
--gemini-gray-600: #757575;  /* 正文文本 */
--gemini-gray-700: #616161;  /* 强调文本 */
--gemini-gray-800: #424242;  /* 标题文本 */
--gemini-gray-900: #212121;  /* 主标题 */
```

#### 语义化颜色（Semantic Colors）
```css
--gemini-success: #34A853;
--gemini-info: #4285F4;
--gemini-warning: #FBBC04;
--gemini-error: #EA4335;
```

---

### 字体系统

#### 字体家族
```css
--gemini-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                      'Roboto', 'Helvetica Neue', Arial, sans-serif,
                      'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';

--gemini-font-mono: 'Roboto Mono', 'SF Mono', Monaco, 
                    'Cascadia Code', 'Courier New', monospace;
```

#### 字号（Typography Scale）
```css
/* 标题 */
--gemini-h1: 32px / 1.2;      /* 页面主标题 */
--gemini-h2: 28px / 1.25;     /* 章节标题 */
--gemini-h3: 24px / 1.3;      /* 小节标题 */
--gemini-h4: 20px / 1.4;      /* 卡片标题 */
--gemini-h5: 18px / 1.5;      /* 小标题 */
--gemini-h6: 16px / 1.5;      /* 微型标题 */

/* 正文 */
--gemini-body-large: 16px / 1.6;   /* 正文大 */
--gemini-body: 14px / 1.6;         /* 正文 */
--gemini-body-small: 12px / 1.5;   /* 正文小 */

/* 特殊用途 */
--gemini-caption: 12px / 1.4;      /* 说明文字 */
--gemini-label: 14px / 1.4;        /* 标签 */
--gemini-button: 14px / 1.4;       /* 按钮文字 */
```

#### 字重（Font Weight）
```css
--gemini-font-light: 300;
--gemini-font-regular: 400;
--gemini-font-medium: 500;
--gemini-font-semibold: 600;
--gemini-font-bold: 700;
```

---

### 间距系统（Spacing Scale）

基于8px网格系统：
```css
--gemini-space-1: 4px;    /* 0.25rem */
--gemini-space-2: 8px;    /* 0.5rem */
--gemini-space-3: 12px;   /* 0.75rem */
--gemini-space-4: 16px;   /* 1rem */
--gemini-space-5: 20px;   /* 1.25rem */
--gemini-space-6: 24px;   /* 1.5rem */
--gemini-space-8: 32px;   /* 2rem */
--gemini-space-10: 40px;  /* 2.5rem */
--gemini-space-12: 48px;  /* 3rem */
--gemini-space-16: 64px;  /* 4rem */
--gemini-space-20: 80px;  /* 5rem */
--gemini-space-24: 96px;  /* 6rem */
```

---

### 圆角系统（Border Radius）

```css
--gemini-radius-sm: 4px;      /* 小元素 */
--gemini-radius-md: 8px;      /* 按钮、输入框 */
--gemini-radius-lg: 12px;     /* 卡片 */
--gemini-radius-xl: 16px;     /* 大卡片 */
--gemini-radius-2xl: 24px;    /* 特殊卡片 */
--gemini-radius-full: 9999px; /* 圆形 */
```

---

### 阴影系统（Elevation）

基于Material Design的Elevation：
```css
--gemini-shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--gemini-shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
                    0 1px 2px 0 rgba(0, 0, 0, 0.06);
--gemini-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                    0 2px 4px -1px rgba(0, 0, 0, 0.06);
--gemini-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
                    0 4px 6px -2px rgba(0, 0, 0, 0.05);
--gemini-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
                    0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

---

### 动画系统（Animation）

#### 过渡时长
```css
--gemini-duration-fast: 150ms;
--gemini-duration-normal: 250ms;
--gemini-duration-slow: 350ms;
```

#### 缓动函数
```css
--gemini-ease-in: cubic-bezier(0.4, 0, 1, 1);
--gemini-ease-out: cubic-bezier(0, 0, 0.2, 1);
--gemini-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--gemini-ease-spring: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

---

## 📱 响应式断点

```css
/* 移动端 */
--gemini-breakpoint-xs: 0px;
--gemini-breakpoint-sm: 640px;    /* 手机横屏 */

/* 平板 */
--gemini-breakpoint-md: 768px;    /* 平板竖屏 */
--gemini-breakpoint-lg: 1024px;   /* 平板横屏 */

/* 桌面 */
--gemini-breakpoint-xl: 1280px;   /* 桌面 */
--gemini-breakpoint-2xl: 1536px;  /* 大桌面 */
```

---

## 🧩 组件设计规范

### 按钮（Button）
- **主要按钮**：实心背景，主色
- **次要按钮**：边框样式，透明背景
- **文本按钮**：无边框，仅文字
- **圆角**：`--gemini-radius-md` (8px)
- **高度**：40px (移动端) / 44px (桌面端)
- **内边距**：水平 16px，垂直 12px

### 输入框（Input）
- **高度**：40px (移动端) / 44px (桌面端)
- **圆角**：`--gemini-radius-md` (8px)
- **边框**：1px solid `--gemini-gray-300`
- **焦点状态**：2px solid `--gemini-primary`
- **占位符**：`--gemini-gray-400`

### 卡片（Card）
- **圆角**：`--gemini-radius-lg` (12px)
- **阴影**：`--gemini-shadow-md`
- **内边距**：`--gemini-space-6` (24px)
- **背景**：白色
- **悬停效果**：轻微提升阴影

### 统计卡片（Stat Card）
- **图标区域**：圆形背景，主色
- **数值**：大号字体，粗体
- **标签**：小号字体，灰色
- **渐变背景**：可选

---

## 🎯 页面布局规范

### 最大宽度
- **桌面**：1200px - 1400px
- **平板**：100% (有内边距)
- **手机**：100% (有内边距)

### 内边距
- **桌面**：24px - 32px
- **平板**：16px - 24px
- **手机**：12px - 16px

### 网格系统
- **桌面**：12列网格
- **平板**：8列网格
- **手机**：4列网格

---

## 📱 移动端适配规范

### 触控目标
- **最小尺寸**：44x44px (iOS标准)
- **推荐尺寸**：48x48px (Android标准)
- **间距**：至少8px

### 手势支持
- **滑动**：列表、卡片
- **下拉刷新**：列表页面
- **上拉加载**：无限滚动

### 导航
- **底部导航栏**：移动端主要导航
- **侧边栏**：桌面端导航，移动端抽屉
- **面包屑**：复杂层级导航

---

## ✨ 动画规范

### 页面过渡
- **时长**：250ms - 350ms
- **缓动**：`ease-in-out`

### 组件动画
- **淡入淡出**：150ms - 250ms
- **滑动**：250ms - 350ms
- **缩放**：200ms - 300ms

### 微交互
- **悬停效果**：150ms
- **点击反馈**：100ms
- **加载动画**：无限循环

---

## 🔧 实现指南

### CSS变量使用
```css
.button {
  background-color: var(--gemini-primary);
  border-radius: var(--gemini-radius-md);
  padding: var(--gemini-space-4) var(--gemini-space-6);
  transition: all var(--gemini-duration-normal) var(--gemini-ease-out);
}
```

### Ant Design主题定制
```javascript
const geminiTheme = {
  token: {
    colorPrimary: '#4285F4',
    borderRadius: 8,
    // ... 更多配置
  }
}
```

---

**设计系统创建日期**：2025-11-21  
**版本**：1.0.0  
**基于**：Google Gemini 3.0 设计原则


