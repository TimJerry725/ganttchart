/**
 * Core types for Gantt chart data model
 */

export type TaskId = string | number;

export type TaskType = 'task' | 'milestone' | 'project' | 'summary';

export type LinkType = 'finish-to-start' | 'start-to-start' | 'finish-to-finish' | 'start-to-finish';

export type ConstraintType =
  | 'as-soon-as-possible'
  | 'as-late-as-possible'
  | 'must-start-on'
  | 'must-finish-on'
  | 'start-no-earlier-than'
  | 'start-no-later-than'
  | 'finish-no-earlier-than'
  | 'finish-no-later-than';

export interface Task {
  id: TaskId;
  name: string;
  type?: TaskType;
  start?: Date;
  end?: Date;
  duration?: number; // in days
  progress?: number; // 0-100
  parent?: TaskId;
  children?: TaskId[];
  constraintType?: ConstraintType;
  constraintDate?: Date;
  calendarId?: string;
  resourceIds?: string[];
  color?: string;
  expanded?: boolean;
  readonly?: boolean;
  [key: string]: unknown; // Allow custom properties
}

export interface Link {
  id: string;
  source: TaskId;
  target: TaskId;
  type: LinkType;
  lag?: number; // in days
}

export interface Calendar {
  id: string;
  name: string;
  workingDays: number[]; // 0-6, Sunday-Saturday
  workingHours: {
    start: number; // 0-23
    end: number; // 0-23
  };
  exceptions?: CalendarException[];
}

export interface CalendarException {
  date: Date;
  working: boolean;
}

export interface Resource {
  id: string;
  name: string;
  capacity?: number; // 0-1 or absolute units
  calendarId?: string;
}

export interface ResourceAssignment {
  taskId: TaskId;
  resourceId: string;
  units?: number; // 0-1 or absolute units
}

export interface Baseline {
  id: string;
  name: string;
  tasks: Map<TaskId, { start: Date; end: Date; progress?: number }>;
  createdAt: Date;
}

export interface GanttProject {
  tasks: Task[];
  links: Link[];
  calendars?: Calendar[];
  resources?: Resource[];
  baselines?: Baseline[];
}
