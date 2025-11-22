import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yqf.aibtrip',
  appName: '一起飞商旅',
  webDir: 'build',
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#FFFFFF'
    },
    StatusBar: {
      style: 'default',
      backgroundColor: '#9333EA'
    }
  }
};

export default config;
