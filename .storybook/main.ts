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
      config.resolve.alias = {
        ...config.resolve.alias,
        '@gantt/core': new URL('../packages/gantt-core/src', import.meta.url).pathname,
        '@gantt/renderer': new URL('../packages/gantt-renderer/src', import.meta.url).pathname,
        '@gantt/react': new URL('../packages/gantt-react/src', import.meta.url).pathname,
        '@gantt/compat-svar': new URL('../packages/gantt-compat-svar/src', import.meta.url).pathname,
        '@gantt/antd': new URL('../packages/gantt-antd/src', import.meta.url).pathname,
      };
    }
    return config;
  },
};

export default config;
