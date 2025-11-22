// Navan风格 Ant Design主题配置
import type { ThemeConfig } from 'antd'

export const navanTheme: ThemeConfig = {
  token: {
    // 主色（使用Navan的紫色作为主色）
    colorPrimary: '#9333EA',
    colorSuccess: '#00C853',
    colorWarning: '#FF9800',
    colorError: '#EA4335',
    colorInfo: '#9333EA',
    
    // 圆角
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 4,
    
    // 字体
    fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                 'Roboto', 'Helvetica Neue', Arial, sans-serif,
                 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'`,
    fontSize: 16,
    fontSizeLG: 18,
    fontSizeSM: 14,
    
    // 间距
    padding: 16,
    paddingLG: 32,
    paddingSM: 12,
    paddingXS: 8,
    
    // 阴影（更柔和的Navan风格）
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    boxShadowSecondary: '0 4px 12px rgba(0, 0, 0, 0.1)',
    
    // 动画
    motionDurationFast: '0.15s',
    motionDurationMid: '0.3s',
    motionDurationSlow: '0.5s',
    motionEaseInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
    
    // 线宽
    lineWidth: 1,
    lineWidthBold: 2,
    
    // 颜色填充
    colorFill: '#F5F7FA',
    colorFillSecondary: '#F8F9FA',
    colorBorder: '#E5E7EB',
    colorBorderSecondary: '#D1D5DB',
    
    // 文本颜色
    colorText: '#111827',
    colorTextSecondary: '#4B5563',
    colorTextTertiary: '#6B7280',
    colorTextQuaternary: '#9CA3AF',
  },
  components: {
    // 按钮（Navan风格 - 更高、更明显）
    Button: {
      borderRadius: 8,
      paddingInline: 24,
      paddingBlock: 16,
      controlHeight: 48,
      primaryShadow: '0 4px 12px rgba(147, 51, 234, 0.3)',
      defaultShadow: 'none',
    },
    // 输入框（48px高度，更友好的触控）
    Input: {
      borderRadius: 8,
      paddingInline: 16,
      paddingBlock: 12,
      controlHeight: 48,
      activeBorderColor: '#9333EA',
      hoverBorderColor: '#E5E7EB',
      colorBgContainer: '#FFFFFF',
      colorBorder: '#D1D5DB',
      colorText: '#111827',
      colorTextPlaceholder: '#9CA3AF',
    },
    // 卡片（更柔和的阴影，更大的圆角）
    Card: {
      borderRadius: 12,
      paddingLG: 32,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      headerBg: '#FFFFFF',
      colorBorderSecondary: '#E5E7EB',
    },
    // 菜单（Navan风格导航）
    Menu: {
      borderRadius: 8,
      itemBorderRadius: 8,
      itemMarginInline: 8,
      itemMarginBlock: 4,
      itemHoverBg: '#E9D5FF',
      itemSelectedBg: '#E9D5FF',
      itemSelectedColor: '#9333EA',
      itemColor: '#4B5563',
      itemHoverColor: '#9333EA',
      fontSize: 16,
    },
    // 布局
    Layout: {
      bodyBg: '#F8F9FA',
      headerBg: '#FFFFFF',
      headerHeight: 80,
      headerPadding: '0 32px',
      siderBg: '#FFFFFF',
    },
    // 统计卡片（大数字，清晰展示）
    Statistic: {
      titleFontSize: 14,
      contentFontSize: 36,
    },
    // 表格（清晰的边框，易读）
    Table: {
      borderRadius: 12,
      headerBg: '#F5F7FA',
      headerColor: '#111827',
      rowHoverBg: '#F8F9FA',
    },
    // 标签（柔和的背景色）
    Tag: {
      borderRadius: 4,
      fontSizeSM: 12,
      lineHeightSM: 20,
    },
    // 消息提示（更柔和的样式）
    Message: {
      borderRadius: 8,
      contentPadding: '12px 16px',
      fontSize: 16,
    },
    // 表单（更好的间距）
    Form: {
      labelFontSize: 14,
      labelColor: '#111827',
      itemMarginBottom: 24,
    },
  },
}
