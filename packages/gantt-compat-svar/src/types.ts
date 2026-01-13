/**
 * SVAR Gantt API compatibility types
 * Based on SVAR Gantt API structure
 */

import type { Task, Link, TaskId } from '@gantt/core';

export interface SvarTask extends Task {
  id: string | number;
  text: string; // SVAR uses 'text' instead of 'name'
  start_date: string; // ISO date string
  end_date?: string; // ISO date string
  duration?: number;
  progress?: number;
  parent?: string | number;
  type?: 'task' | 'milestone' | 'project';
  open?: boolean; // expanded state
  readonly?: boolean;
}

export interface SvarLink {
  id: string | number;
  source: string | number;
  target: string | number;
  type: 0 | 1 | 2 | 3; // 0=FS, 1=SS, 2=FF, 3=SF
  lag?: number;
}

export interface SvarColumn {
  name: string;
  label: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  tree?: boolean;
  template?: (task: SvarTask) => string;
}

export interface SvarConfig {
  container?: string | HTMLElement;
  tasks?: SvarTask[];
  links?: SvarLink[];
  columns?: SvarColumn[];
  scales?: Array<{
    unit: 'day' | 'week' | 'month';
    step: number;
    format?: string;
  }>;
  readonly?: boolean;
  auto_scheduling?: boolean;
  auto_scheduling_mode?: 'day' | 'week' | 'month';
  work_time?: boolean;
  skip_off_time?: boolean;
  min_column_width?: number;
  row_height?: number;
  bar_height?: number;
  grid_resize?: boolean;
  sort?: boolean;
  drag_links?: boolean;
  drag_progress?: boolean;
  drag_tasks?: boolean;
  click_link?: boolean;
  select_task?: boolean;
  multiselect?: boolean;
  keyboard_navigation?: boolean;
  tooltips?: boolean;
  highlight_critical_path?: boolean;
  highlight_weekend?: boolean;
  today_marker?: boolean;
  markers?: Array<{
    start_date: string;
    text: string;
    css?: string;
  }>;
}

export interface SvarEvents {
  onTaskClick?: (id: TaskId, e: MouseEvent) => void;
  onTaskDblClick?: (id: TaskId, e: MouseEvent) => void;
  onTaskSelected?: (id: TaskId) => void;
  onTaskUnselected?: (id: TaskId) => void;
  onAfterTaskAdd?: (id: TaskId, task: SvarTask) => void;
  onAfterTaskUpdate?: (id: TaskId, task: SvarTask) => void;
  onAfterTaskDelete?: (id: TaskId) => void;
  onAfterLinkAdd?: (id: string, link: SvarLink) => void;
  onAfterLinkUpdate?: (id: string, link: SvarLink) => void;
  onAfterLinkDelete?: (id: string) => void;
  onAfterTaskDrag?: (id: TaskId, mode: 'move' | 'resize', e: MouseEvent) => void;
  onAfterTaskProgressDrag?: (id: TaskId, progress: number) => void;
  onScaleChange?: (scale: string) => void;
  onScroll?: (x: number, y: number) => void;
}
