/**
 * Ant Design theming integration
 */

import { ConfigProvider } from 'antd';
import type { ThemeConfig } from 'antd';
import type { GanttAntdTheme } from './types';

export function createGanttTheme(theme: GanttAntdTheme): ThemeConfig {
  return {
    ...theme,
    token: {
      ...theme.token,
    },
  };
}

export function GanttThemeProvider({
  theme,
  children,
}: {
  theme?: GanttAntdTheme;
  children: React.ReactNode;
}) {
  return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
}
