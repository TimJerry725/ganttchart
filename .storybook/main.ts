import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../packages/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../apps/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  core: {
    builder: '@storybook/builder-vite',
  },
  viteFinal: async (config) => {
    // Ensure proper path resolution
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@gantt/core': path.resolve(__dirname, '../packages/gantt-core/src'),
        '@gantt/renderer': path.resolve(__dirname, '../packages/gantt-renderer/src'),
        '@gantt/react': path.resolve(__dirname, '../packages/gantt-react/src'),
        '@gantt/compat-svar': path.resolve(__dirname, '../packages/gantt-compat-svar/src'),
        '@gantt/antd': path.resolve(__dirname, '../packages/gantt-antd/src'),
      };
    }
    
    // Ensure React is properly resolved - use dedupe to force single React instance
    if (!config.resolve) {
      config.resolve = {};
    }
    config.resolve.dedupe = ['react', 'react-dom'];
    
    // Optimize dependencies
    if (!config.optimizeDeps) {
      config.optimizeDeps = {};
    }
    config.optimizeDeps.include = [
      ...(config.optimizeDeps.include || []),
      'react',
      'react-dom',
    ];
    config.optimizeDeps.exclude = [
      ...(config.optimizeDeps.exclude || []),
    ];
    
    return config;
  },
};

export default config;
