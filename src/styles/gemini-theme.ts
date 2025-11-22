// Gemini 3.0 Ant Design主题配置
import type { ThemeConfig } from 'antd'

export const geminiTheme: ThemeConfig = {
  token: {
    // 主色
    colorPrimary: '#4285F4',
    colorSuccess: '#34A853',
    colorWarning: '#FBBC04',
    colorError: '#EA4335',
    colorInfo: '#4285F4',
    
    // 圆角
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 4,
    
    // 字体
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
                 'Helvetica Neue', Arial, sans-serif,
                 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'`,
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,
    
    // 间距
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    
    // 阴影
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    boxShadowSecondary: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    
    // 动画
    motionDurationFast: '0.15s',
    motionDurationMid: '0.25s',
    motionDurationSlow: '0.35s',
    motionEaseInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    
    // 线宽
    lineWidth: 1,
    lineWidthBold: 2,
  },
  components: {
    // 按钮
    Button: {
      borderRadius: 8,
      paddingInline: 16,
      paddingBlock: 8,
      controlHeight: 44,
      fontWeight: 500,
      primaryShadow: '0 2px 4px rgba(66, 133, 244, 0.2)',
    },
    // 输入框
    Input: {
      borderRadius: 8,
      paddingInline: 12,
      paddingBlock: 10,
      controlHeight: 44,
      activeBorderColor: '#4285F4',
      hoverBorderColor: '#E0E0E0',
    },
    // 卡片
    Card: {
      borderRadius: 12,
      paddingLG: 24,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      headerBg: '#ffffff',
    },
    // 菜单
    Menu: {
      borderRadius: 8,
      itemBorderRadius: 8,
      itemMarginInline: 8,
      itemMarginBlock: 4,
      itemHoverBg: '#E8F0FE',
      itemSelectedBg: '#E8F0FE',
      itemSelectedColor: '#4285F4',
    },
    // 布局
    Layout: {
      bodyBg: '#FAFAFA',
      headerBg: '#ffffff',
      siderBg: '#ffffff',
    },
    // 统计卡片
    Statistic: {
      titleFontSize: 14,
      contentFontSize: 24,
      fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'`,
    },
    // 表格
    Table: {
      borderRadius: 8,
      headerBg: '#F5F5F5',
      headerColor: '#424242',
    },
    // 标签
    Tag: {
      borderRadius: 4,
      fontSizeSM: 12,
      lineHeightSM: 20,
    },
    // 消息提示
    Message: {
      borderRadius: 8,
      contentPadding: '12px 16px',
    },
  },
}


