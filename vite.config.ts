import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// Library + Storybook / demo build config
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/components/index.ts'),
      name: 'IrisGantt',
      fileName: 'iris-gantt',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      // Externalize peer deps for library build
      external: [
        'react',
        'react-dom',
        'antd',
        '@fortawesome/react-fontawesome',
        '@fortawesome/fontawesome-svg-core',
        '@fortawesome/free-solid-svg-icons',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          antd: 'antd',
          '@fortawesome/react-fontawesome': 'ReactFontawesome',
          '@fortawesome/fontawesome-svg-core': 'FontAwesomeCore',
          '@fortawesome/free-solid-svg-icons': 'FontAwesomeSolid',
        },
      },
    },
  },
})
