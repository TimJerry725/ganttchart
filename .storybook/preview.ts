import type { Preview } from '@storybook/react-vite';

// Ant Design CSS
import 'antd/dist/reset.css';

// IBM Plex Fonts
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/600.css';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/600.css';

// Custom Gantt styles
import '../src/components/Gantt/gantt.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1e1e1e',
        },
      ],
    },
  },
};

export default preview;
