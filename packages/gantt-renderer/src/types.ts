/**
 * Renderer types
 */

import type { TaskId } from '@gantt/core';

export interface Viewport {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TimeScale {
  unit: 'day' | 'week' | 'month' | 'quarter' | 'year';
  pixelsPerUnit: number;
  startDate: Date;
  endDate: Date;
}

export interface GridColumn {
  id: string;
  label: string;
  width: number;
  field?: string;
  resizable?: boolean;
  sortable?: boolean;
  render?: (task: unknown) => unknown;
}

export interface RowLayout {
  taskId: TaskId;
  y: number;
  height: number;
  level: number;
}

export interface BarLayout {
  taskId: TaskId;
  x: number;
  width: number;
  y: number;
  height: number;
  progressX?: number;
  progressWidth?: number;
}

export interface LinkLayout {
  linkId: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  type: string;
}

export interface HitTestResult {
  type: 'task' | 'link' | 'bar' | 'progress' | 'resize-handle' | 'none';
  taskId?: TaskId;
  linkId?: string;
  handle?: 'start' | 'end';
}
