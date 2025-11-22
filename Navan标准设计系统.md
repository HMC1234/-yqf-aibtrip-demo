# Navan标准设计系统

**基于**：Navan首页的实际设计  
**应用范围**：整个网站  
**创建日期**：2025-11-21

---

## 🎨 颜色系统（精确Navan风格）

### 主色调

```css
/* 深紫色 - 标题、重要文字 */
--navan-text-primary: #1A1A2E;     /* 深紫色文字 */
--navan-text-secondary: #4C1D95;   /* 次要紫色文字 */

/* 紫色 - 按钮、链接、强调 */
--navan-purple: #9333EA;           /* 主紫色按钮 */
--navan-purple-hover: #7C3AED;     /* 悬停紫色 */
--navan-purple-light: #E9D5FF;     /* 浅紫色背景 */

/* 白色背景 */
--navan-white: #FFFFFF;
--navan-bg: #FFFFFF;               /* 主背景 */

/* 灰色系统 */
--navan-gray-50: #F9FAFB;          /* 浅灰背景 */
--navan-gray-100: #F3F4F6;         /* 非常浅灰 */
--navan-gray-200: #E5E7EB;         /* 边框、分割线 */
--navan-gray-300: #D1D5DB;         /* 输入框边框 */
--navan-gray-400: #9CA3AF;         /* 禁用文字 */
--navan-gray-500: #6B7280;         /* 次要文字 */
--navan-gray-600: #4B5563;         /* 正文文字 */
--navan-gray-700: #374151;         /* 强调文字 */
--navan-gray-800: #1F2937;         /* 标题文字 */
--navan-gray-900: #111827;         /* 主标题 */
```

---

## 🔤 字体系统（Navan风格）

### 字体家族
```css
--navan-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 
                     'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
```

### 字号层级

```css
/* Hero标题（超大） */
--navan-hero: 64px / 1.1;          /* 字重: 700 */

/* 主标题 */
--navan-h1: 48px / 1.1;            /* 字重: 700, 深紫色 */

/* 引导问题 */
--navan-h2: 24px / 1.3;            /* 字重: 500-600 */

/* 卡片标题 */
--navan-h3: 18px / 1.4;            /* 字重: 500-600 */

/* 正文 */
--navan-body: 16px / 1.6;          /* 字重: 400 */
--navan-body-small: 14px / 1.5;    /* 字重: 400 */

/* 辅助文字 */
--navan-caption: 12px / 1.5;       /* 字重: 400, 灰色 */
```

---

## 🎭 组件设计标准

### 1. 导航栏（Header）

```css
.header {
  height: 80px;
  background: var(--navan-white);
  border-bottom: 1px solid var(--navan-gray-200);
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-logo {
  font-size: 24px;
  font-weight: 700;
  color: var(--navan-text-primary);
  letter-spacing: 1px;
}

.header-nav {
  display: flex;
  gap: 32px;
  font-size: 16px;
  font-weight: 500;
  color: var(--navan-gray-700);
}
```

### 2. Hero区域

```css
.hero-section {
  padding: 120px 32px 80px;
  max-width: 1400px;
  margin: 0 auto;
}

.hero-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--navan-gray-500);
  margin-bottom: 24px;
}

.hero-title {
  font-size: 64px;
  font-weight: 700;
  line-height: 1.1;
  color: var(--navan-text-primary);
  margin-bottom: 24px;
}

.hero-subtitle {
  font-size: 24px;
  font-weight: 500;
  color: var(--navan-gray-700);
  margin-bottom: 48px;
}
```

### 3. 交互式卡片（Interactive Cards）

```css
.interactive-card {
  background: var(--navan-white);
  border: 1px solid var(--navan-gray-200);
  border-radius: 12px;
  padding: 24px 32px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.interactive-card:hover {
  border-color: var(--navan-purple);
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.1);
  transform: translateY(-2px);
}

.interactive-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: var(--navan-purple-light);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.interactive-card-text {
  font-size: 18px;
  font-weight: 500;
  color: var(--navan-gray-900);
}
```

### 4. 统计卡片（Stat Cards）

```css
.stat-card {
  background: var(--navan-white);
  border: 1px solid var(--navan-gray-200);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: var(--navan-purple-light);
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
  color: var(--navan-gray-500);
}
```

### 5. 主要按钮（Primary Button）

```css
.btn-primary {
  background: var(--navan-purple);
  color: var(--navan-white);
  border: none;
  border-radius: 8px;
  padding: 16px 24px;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-primary:hover {
  background: var(--navan-purple-hover);
  box-shadow: 0 6px 16px rgba(147, 51, 234, 0.4);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
}
```

---

## 📐 布局规范

### 容器
```css
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 32px;
}

@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }
}
```

### 网格系统

#### 卡片网格（2列大 + 3列小）
```css
.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.cards-grid-small {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 1024px) {
  .cards-grid,
  .cards-grid-small {
    grid-template-columns: 1fr;
  }
}
```

---

## ✨ 动画效果

### 卡片悬停
```css
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}
```

### 页面加载
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}
```

---

## 📱 响应式设计

### 断点
```css
--navan-breakpoint-sm: 640px;
--navan-breakpoint-md: 768px;
--navan-breakpoint-lg: 1024px;
--navan-breakpoint-xl: 1280px;
```

### 移动端适配
- 卡片改为单列
- 字体大小减小
- 间距调整
- 导航改为抽屉菜单

---

## ✅ 设计原则

1. **极简主义**：大量留白，清晰布局
2. **深紫色标题**：专业、权威感
3. **紫色按钮**：明确的行动号召
4. **卡片式设计**：清晰的功能模块
5. **大号字体**：突出重要信息
6. **白色背景**：干净、现代
7. **流畅动画**：提升交互体验

---

**此设计系统将作为整个网站的标准！** 🎨


