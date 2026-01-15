export interface Task {
  id: string;
  text: string;
  start: Date;
  end: Date;
  duration: number;
  progress: number;
  type?: 'task' | 'milestone' | 'project';
  parent?: string;
  open?: boolean;
  color?: string;
  details?: string;
  owner?: string;
  priority?: 'low' | 'medium' | 'high';
  dependencies?: string[]; // Array of task IDs this task depends on
  segments?: TaskSegment[]; // For split tasks
}

export interface TaskSegment {
  start: Date;
  end: Date;
  duration: number;
}

export interface Link {
  id: string;
  source: string;
  target: string;
  type: 'e2s' | 's2s' | 'e2e' | 's2e'; // end-to-start, start-to-start, end-to-end, start-to-end
  lag?: number; // lag time in days (positive = delay, negative = lead time)
  lagUnit?: 'day' | 'hour' | 'week' | 'month'; // unit for lag time (default: 'day')
}

export interface Scale {
  unit: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
  step: number;
  format?: string;
}

export interface Column {
  name: string;
  label: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  resize?: boolean;
  sort?: boolean;
  template?: (task: Task) => string | any;
}

export interface GanttConfig {
  columns?: Column[];
  scales?: Scale[];
  readonly?: boolean;
  editable?: boolean;
  taskHeight?: number;
  rowHeight?: number;
  scaleHeight?: number;
  columnWidth?: number;
  minColumnWidth?: number;
  autoSchedule?: boolean; // PRO
  criticalPath?: boolean; // PRO
  baselines?: boolean; // PRO
  markers?: Marker[]; // PRO
  weekends?: boolean;
  holidays?: Date[];
  theme?: 'light' | 'dark';
  locale?: string;
}

export interface Marker {
  id: string;
  date: Date;
  text: string;
  css?: string;
}

export interface Baseline {
  taskId: string;
  start: Date;
  end: Date;
}

export type ZoomLevel = number;

export interface DropIndicator {
  taskId: string;
  position: 'above' | 'below' | 'inside';
}
