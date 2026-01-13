import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@gantt/core': path.resolve(__dirname, '../../packages/gantt-core/src'),
      '@gantt/renderer': path.resolve(__dirname, '../../packages/gantt-renderer/src'),
      '@gantt/react': path.resolve(__dirname, '../../packages/gantt-react/src'),
      '@gantt/compat-svar': path.resolve(__dirname, '../../packages/gantt-compat-svar/src'),
      '@gantt/antd': path.resolve(__dirname, '../../packages/gantt-antd/src'),
    },
  },
});
