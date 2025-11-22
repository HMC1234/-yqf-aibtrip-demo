# UI1 主题 - Navan风格

## 主题说明

UI1是当前默认的UI设计风格，采用现代简洁的Navan风格设计。

## 主题特点

- **颜色方案**：紫色主题（#9333EA），优雅而现代
- **设计风格**：简洁、专业、注重用户体验
- **响应式**：完美适配PC和移动端
- **组件库**：基于Ant Design 5，深度定制

## 样式文件

UI1主题的样式文件位于 `src/styles/` 目录：

- `navan-variables.css` - CSS变量定义（颜色、字体、间距等）
- `navan-theme.ts` - Ant Design主题配置
- `navan-components.css` - 组件样式定制
- `page-container.css` - 页面容器样式
- `tag-optimized.css` - 标签组件优化样式
- `responsive.css` - 响应式工具类

## 使用方式

UI1主题是默认主题，在 `App.tsx` 中自动加载。用户可以在个人中心的"UI主题设置"中切换不同的主题。

## 未来扩展

当需要创建UI2、UI3等新主题时，可以参考此主题的结构：
1. 创建新的主题目录（如 `src/themes/UI2/`）
2. 在新目录中创建对应的CSS和主题配置文件
3. 在 `themeStore.ts` 中添加新主题的支持
4. 在 `App.tsx` 中为新主题添加对应的主题配置


