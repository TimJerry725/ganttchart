/**
 * Ant Design integration types
 */

import type { ThemeConfig } from 'antd';

export interface GanttAntdTheme extends ThemeConfig {
  gantt?: {
    rowHeight?: number;
    barHeight?: number;
    barColor?: string;
    criticalPathColor?: string;
    baselineColor?: string;
  };
}
