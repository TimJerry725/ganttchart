/**
 * Iris Gantt - Main entry point
 */

export { IrisGantt } from './IrisGantt';
export type { 
  IrisGanttProps, 
  Task, 
  Link, 
  Resource, 
  TaskId, 
  TaskType, 
  LinkType,
  TimeUnit,
  GanttConfig,
  ColumnConfig,
  ViewState,
} from './types';
export * from './types';
export * from './model';
export * from './engine';
export * from './render';
export * from './command';
export * from './dependencies';
export * from './scheduling';
export * from './baseline';
export * from './resources';
export * from './export';
export * from './undo-redo';
export * from './a11y';

// Export styles
import './styles/index.css';
