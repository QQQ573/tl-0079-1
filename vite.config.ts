import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import { traeBadgePlugin } from 'vite-plugin-trae-solo-badge';

// https://vite.dev/config/
export default defineConfig({
  build: {
    sourcemap: 'hidden',
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    traeBadgePlugin({
      variant: 'dark',
      position: 'bottom-right',
      prodOnly: true,
      clickable: true,
      clickUrl: 'https://www.trae.ai/solo?showJoin=1',
      autoTheme: true,
      autoThemeTarget: '#root'
    }), 
    tsconfigPaths()
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'src/store/**/*.ts',
        'src/utils/**/*.ts',
        'src/types/**/*.ts',
        'src/components/**/*.tsx',
      ],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
        'src/test/**',
        'src/utils/exportPng.ts',
      ],
      thresholds: {
        'src/utils/colorMapping.ts': {
          lines: 90,
          functions: 90,
          branches: 80,
          statements: 90,
        },
        'src/types/index.ts': {
          lines: 90,
          functions: 90,
          statements: 90,
        },
        'src/store/useAppStore.ts': {
          statements: 65,
        },
      },
    },
  },
})
