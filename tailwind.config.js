/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './stories/**/*.{js,jsx,ts,tsx}',
    './.storybook/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gantt: {
          primary: '#1890ff',
          critical: '#ff4d4f',
          baseline: '#999999',
          weekend: '#f5f5f5',
          today: '#faad14',
        },
      },
    },
  },
  plugins: [],
};
