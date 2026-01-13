/**
 * Iris Gantt Type Definitions
 */

export type TaskId = string | number;

export type TaskType = 'task' | 'milestone' | 'project' | 'summary';

export type LinkType = 'finish-to-start' | 'start-to-start' | 'finish-to-finish' | 'start-to-finish';

export interface Task {
  id: TaskId;
  name: string;
  type?: TaskType;
  start?: Date;
  end?: Date;
  duration?: number;
  progress?: number;
  parent?: TaskId;
  children?: TaskId[];
  expanded?: boolean;
  readonly?: boolean;
  color?: string;
  [key: string]: unknown;
}

export interface Link {
  id: string;
  source: TaskId;
  target: TaskId;
  type: LinkType;
  lag?: number;
}

export interface Resource {
  id: string;
  name: string;
  capacity?: number;
}

export interface ViewState {
  zoom: number;
  scrollX: number;
  scrollY: number;
  scale: 'day' | 'week' | 'month' | 'quarter' | 'year';
}

export interface IrisGanttProps {
  tasks: Task[];
  links?: Link[];
  resources?: Resource[];
  selection?: TaskId[];
  viewState?: Partial<ViewState>;
  onTasksChange?: (tasks: Task[]) => void;
  onLinksChange?: (links: Link[]) => void;
  onSelectionChange?: (selection: TaskId[]) => void;
  onViewStateChange?: (viewState: ViewState) => void;
  width?: number | string;
  height?: number | string;
  className?: string;
  readonly?: boolean;
}
