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
    if (config.resolve) {
      const path = await import('path');
      config.resolve.alias = {
        ...config.resolve.alias,
        '@gantt/core': path.resolve(__dirname, '../packages/gantt-core/src'),
        '@gantt/renderer': path.resolve(__dirname, '../packages/gantt-renderer/src'),
        '@gantt/react': path.resolve(__dirname, '../packages/gantt-react/src'),
        '@gantt/compat-svar': path.resolve(__dirname, '../packages/gantt-compat-svar/src'),
        '@gantt/antd': path.resolve(__dirname, '../packages/gantt-antd/src'),
      };
    }
    return config;
  },
};

export default config;
