/**
 * Iris Gantt Type Definitions
 */

export type TaskId = string | number;

export type TaskType = 'task' | 'milestone' | 'project' | 'summary';

export type LinkType = 'finish-to-start' | 'start-to-start' | 'finish-to-finish' | 'start-to-finish';

export type TimeUnit = 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';

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
  description?: string;
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
  scale: TimeUnit;
}

export interface GanttConfig {
  // Grid configuration
  gridWidth?: number;
  rowHeight?: number;
  showGrid?: boolean;
  showTree?: boolean;
  
  // Timeline configuration
  scale?: TimeUnit;
  scaleWidth?: number;
  showTodayMarker?: boolean;
  showWeekends?: boolean;
  showHolidays?: boolean;
  
  // Visual configuration
  barHeight?: number;
  barRadius?: number;
  showProgress?: boolean;
  showDependencies?: boolean;
  showCriticalPath?: boolean;
  
  // Interaction configuration
  allowDrag?: boolean;
  allowResize?: boolean;
  allowEdit?: boolean;
  allowDelete?: boolean;
  
  // Theme
  theme?: 'light' | 'dark';
}

export interface ColumnConfig {
  id: string;
  label: string;
  width: number;
  field?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  resizable?: boolean;
  render?: (task: Task) => React.ReactNode;
  headerRender?: () => React.ReactNode;
}

export interface IrisGanttProps {
  // Data
  tasks: Task[];
  links?: Link[];
  resources?: Resource[];
  
  // Configuration
  config?: Partial<GanttConfig>;
  columns?: ColumnConfig[];
  
  // State
  selection?: TaskId[];
  viewState?: Partial<ViewState>;
  
  // Callbacks
  onTasksChange?: (tasks: Task[]) => void;
  onLinksChange?: (links: Link[]) => void;
  onSelectionChange?: (selection: TaskId[]) => void;
  onViewStateChange?: (viewState: ViewState) => void;
  onTaskClick?: (task: Task) => void;
  onTaskDoubleClick?: (task: Task) => void;
  onLinkClick?: (link: Link) => void;
  
  // Styling
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  
  // Behavior
  readonly?: boolean;
  loading?: boolean;
  
  // Templates (for customization)
  taskBarTemplate?: (task: Task) => React.ReactNode;
  taskTooltipTemplate?: (task: Task) => React.ReactNode;
  gridCellTemplate?: (task: Task, column: ColumnConfig) => React.ReactNode;
}
