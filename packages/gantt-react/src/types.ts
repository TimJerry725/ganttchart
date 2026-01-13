/**
 * React component types
 */

import type { Task, Link, Calendar, Resource, GanttProject } from '@gantt/core';
import type { GridColumn, TimeScale, Viewport } from '@gantt/renderer';

export interface GanttProps {
  // Data
  tasks: Task[];
  links?: Link[];
  calendars?: Calendar[];
  resources?: Resource[];

  // Configuration
  columns?: GridColumn[];
  timeScale?: Partial<TimeScale>;
  rowHeight?: number;
  barHeight?: number;

  // State
  selectedTaskIds?: TaskId[];
  expandedTaskIds?: TaskId[];
  viewport?: Partial<Viewport>;

  // Callbacks
  onTaskClick?: (taskId: TaskId) => void;
  onTaskDoubleClick?: (taskId: TaskId) => void;
  onTaskSelect?: (taskIds: TaskId[]) => void;
  onTaskAdd?: (task: Task) => void;
  onTaskUpdate?: (taskId: TaskId, updates: Partial<Task>) => void;
  onTaskRemove?: (taskId: TaskId) => void;
  onLinkAdd?: (link: Link) => void;
  onLinkUpdate?: (linkId: string, updates: Partial<Link>) => void;
  onLinkRemove?: (linkId: string) => void;
  onViewportChange?: (viewport: Viewport) => void;
  onZoomChange?: (timeScale: TimeScale) => void;

  // Styling
  className?: string;
  style?: React.CSSProperties;
  height?: number;
  width?: number;
}

export type TaskId = string | number;
