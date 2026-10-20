import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tahafirat.husu',
  appName: 'Huşu',
  webDir: 'dist',
  backgroundColor: '#080f12',
  ios: {
    // Safe areas are handled in CSS (src/native.css) via env(safe-area-inset-*).
    contentInset: 'never',
    allowsLinkPreview: false,
    preferredContentMode: 'mobile',
    backgroundColor: '#080f12',
  },
  plugins: {
    StatusBar: { overlaysWebView: true, style: 'DARK' },
  },
};

export default config;
