# Navan风格设计系统

基于 Navan.com 的完整设计风格，为AI智能商旅系统创建的设计系统。

**参考网站**：https://navan.com/  
**创建日期**：2025-11-21

---

## 🎨 核心设计原则

### 1. 专业商务风格
- 深蓝色主色调，传达专业和可信
- 清晰的视觉层次
- 高质量的内容展示

### 2. 极简现代主义
- 大量留白，呼吸感
- 简洁的界面元素
- 聚焦核心内容

### 3. 沉浸式体验
- 大背景视觉
- 流畅的动画过渡
- 互动式元素

### 4. 数据驱动展示
- 清晰的统计卡片
- 可视化数据展示
- 直观的信息传达

---

## 🎨 颜色系统

### 主色调（Primary Palette）

```css
/* Navan深蓝色系统 */
--navan-primary: #0A2540;        /* 深蓝色 - 主品牌色、标题 */
--navan-primary-dark: #051725;   /* 更深蓝 - 导航栏背景 */
--navan-primary-light: #1A3A5C;  /* 浅深蓝 - 次要元素 */

/* Navan亮蓝色系统 */
--navan-accent: #0066FF;         /* 亮蓝色 - 链接、CTA按钮 */
--navan-accent-hover: #0052CC;   /* 悬停状态 */
--navan-accent-light: #E6F2FF;   /* 浅蓝色背景 */

/* 渐变蓝色 */
--navan-gradient-start: #0A2540;
--navan-gradient-end: #1A3A5C;
```

### 中性色（Neutral Colors）

```css
--navan-white: #FFFFFF;          /* 白色背景 */
--navan-gray-50: #F8F9FA;        /* 最浅灰 - 页面背景 */
--navan-gray-100: #F5F7FA;       /* 浅灰 - 卡片背景 */
--navan-gray-200: #E5E7EB;       /* 边框、分割线 */
--navan-gray-300: #D1D5DB;       /* 输入框边框 */
--navan-gray-400: #9CA3AF;       /* 禁用文本 */
--navan-gray-500: #6B7280;       /* 次要文本 */
--navan-gray-600: #4B5563;       /* 正文文本 */
--navan-gray-700: #374151;       /* 强调文本 */
--navan-gray-800: #1F2937;       /* 标题文本 */
--navan-gray-900: #111827;       /* 主标题 */
```

### 功能色彩（Semantic Colors）

```css
--navan-success: #00C853;        /* 成功/确认 */
--navan-success-light: #E8F5E9;  /* 成功背景 */
--navan-warning: #FF9800;        /* 警告 */
--navan-warning-light: #FFF3E0;  /* 警告背景 */
--navan-error: #EA4335;          /* 错误 */
--navan-error-light: #FCE8E6;    /* 错误背景 */
--navan-info: #0066FF;           /* 信息 */
--navan-info-light: #E6F2FF;     /* 信息背景 */
```

---

## 📐 间距系统

### 基于8px网格

```css
--navan-space-1: 4px;     /* 0.25rem */
--navan-space-2: 8px;     /* 0.5rem */
--navan-space-3: 12px;    /* 0.75rem */
--navan-space-4: 16px;    /* 1rem */
--navan-space-5: 20px;    /* 1.25rem */
--navan-space-6: 24px;    /* 1.5rem */
--navan-space-8: 32px;    /* 2rem */
--navan-space-10: 40px;   /* 2.5rem */
--navan-space-12: 48px;   /* 3rem */
--navan-space-16: 64px;   /* 4rem */
--navan-space-20: 80px;   /* 5rem */
--navan-space-24: 96px;   /* 6rem */
--navan-space-32: 128px;  /* 8rem */

/* 大间距（区块之间） */
--navan-section-padding: 60px;   /* 移动端 */
--navan-section-padding-lg: 100px; /* 桌面端 */
```

---

## 🔤 字体系统

### 字体家族

```css
--navan-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 
                     'Segoe UI', 'Roboto', 'Helvetica Neue', 
                     Arial, sans-serif;

--navan-font-mono: 'SF Mono', 'Monaco', 'Cascadia Code', 
                   'Courier New', monospace;
```

### 字号层级（Navan风格）

```css
/* Hero标题 */
--navan-hero: 64px / 1.1;        /* 超大标题 */

/* 标题 */
--navan-h1: 48px / 1.2;          /* 页面主标题 */
--navan-h2: 36px / 1.2;          /* 章节标题 */
--navan-h3: 28px / 1.3;          /* 小节标题 */
--navan-h4: 24px / 1.3;          /* 卡片标题 */
--navan-h5: 20px / 1.4;          /* 小标题 */
--navan-h6: 18px / 1.4;          /* 微型标题 */

/* 正文 */
--navan-body-large: 18px / 1.6;  /* 大正文 */
--navan-body: 16px / 1.6;        /* 正文 */
--navan-body-small: 14px / 1.5;  /* 小正文 */

/* 特殊用途 */
--navan-caption: 12px / 1.4;     /* 说明文字 */
--navan-label: 14px / 1.4;       /* 标签 */
--navan-button: 16px / 1.4;      /* 按钮文字 */
```

### 字重

```css
--navan-font-light: 300;
--navan-font-regular: 400;
--navan-font-medium: 500;        /* 按钮、标签 */
--navan-font-semibold: 600;      /* 小标题 */
--navan-font-bold: 700;          /* 标题、强调 */
```

---

## 🎭 组件规范

### 按钮（Buttons）

#### 主要按钮（Primary）
```css
/* 样式 */
background: var(--navan-accent);
color: var(--navan-white);
border-radius: 8px;
padding: 16px 24px;
height: 48px;
font-size: 16px;
font-weight: 500;
box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);

/* 悬停 */
background: var(--navan-accent-hover);
box-shadow: 0 6px 16px rgba(0, 102, 255, 0.4);
transform: translateY(-1px);
```

#### 次要按钮（Secondary）
```css
background: transparent;
color: var(--navan-accent);
border: 2px solid var(--navan-accent);
border-radius: 8px;
padding: 14px 24px;
height: 48px;
```

#### 文本按钮（Text）
```css
background: transparent;
color: var(--navan-accent);
border: none;
text-decoration: underline;
padding: 8px 0;
```

### 卡片（Cards）

#### 基础卡片
```css
background: var(--navan-white);
border-radius: 12px;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
padding: 32px;
border: none;

/* 悬停 */
box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
transform: translateY(-4px);
transition: all 0.3s ease;
```

#### 统计卡片
```css
.icon-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--navan-accent-light);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: var(--navan-gray-900);
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: var(--navan-gray-600);
  margin-top: 8px;
}
```

### 输入框（Input Fields）

```css
height: 48px;
border-radius: 8px;
border: 1px solid var(--navan-gray-300);
padding: 12px 16px;
font-size: 16px;
background: var(--navan-white);

/* 焦点 */
border-color: var(--navan-accent);
box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
outline: none;
```

---

## ✨ 动画系统

### 过渡时长

```css
--navan-duration-fast: 150ms;
--navan-duration-normal: 300ms;
--navan-duration-slow: 500ms;
```

### 缓动函数

```css
--navan-ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--navan-ease-in-out: cubic-bezier(0.42, 0, 0.58, 1);
--navan-ease-spring: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### 常用动画

```css
/* 淡入 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 向上滑入 */
@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

/* 卡片悬停提升 */
.card-hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}
```

---

## 📱 响应式断点

```css
--navan-breakpoint-xs: 0px;
--navan-breakpoint-sm: 640px;    /* 手机横屏 */
--navan-breakpoint-md: 768px;    /* 平板竖屏 */
--navan-breakpoint-lg: 1024px;   /* 平板横屏/小桌面 */
--navan-breakpoint-xl: 1280px;   /* 桌面 */
--navan-breakpoint-2xl: 1440px;  /* 大桌面 */
```

---

## 🎯 布局规范

### 容器最大宽度

```css
--navan-container-max: 1400px;
--navan-container-padding-mobile: 16px;
--navan-container-padding-tablet: 24px;
--navan-container-padding-desktop: 32px;
```

### Hero区域

```css
min-height: 60vh;        /* 移动端 */
min-height: 80vh;        /* 桌面端 */
display: flex;
align-items: center;
justify-content: center;
background: linear-gradient(135deg, var(--navan-gradient-start), var(--navan-gradient-end));
```

---

## 📊 阴影系统

```css
--navan-shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
--navan-shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
--navan-shadow-md: 0 2px 8px rgba(0, 0, 0, 0.08);
--navan-shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.1);
--navan-shadow-xl: 0 8px 16px rgba(0, 0, 0, 0.12);
--navan-shadow-2xl: 0 12px 24px rgba(0, 0, 0, 0.15);
```

---

## ✅ 实施步骤

1. ✅ 分析Navan设计风格
2. ⏳ 创建Navan风格CSS变量文件
3. ⏳ 更新Ant Design主题配置
4. ⏳ 重构主要组件
5. ⏳ 应用新样式到所有页面

---

**创建日期**：2025-11-21  
**基于**：Navan.com 设计风格


