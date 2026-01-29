import React, { useState, useRef, useEffect } from 'react';
import { Grid } from './Grid';
import { Chart } from './Chart';
import { Toolbar } from './Toolbar';
import { TaskCreator } from './TaskCreator';
import { TaskEditor } from './TaskEditor';
import { DependencyEditor } from './DependencyEditor';
import { ContextMenu } from './ContextMenu';
import type { GanttConfig, DropIndicator, ZoomLevel, Baseline, Column, Scale, GanttUIConfig, GanttStyleConfig, GanttIconConfig } from './types';
import { formatDate, addToDate, getStartOfDay } from './utils/dateUtils';
import { useUndoRedo } from './UndoRedo';
import * as AutoScheduler from './features/AutoScheduler';
import { createBaseline } from './features/baselineUtils';
import * as ExportUtils from './features/ExportUtils';
import { applyFilters } from './features/filterUtils';
import type { FilterOptions } from './features/filterUtils';
import type { Task, Link } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import './gantt.css';

export interface GanttProps {
  tasks: Task[];
  links?: Link[];
  config?: Partial<GanttConfig>;
  uiConfig?: Partial<GanttUIConfig>;
  styleConfig?: Partial<GanttStyleConfig>; // Colors, fonts, spacing
  iconConfig?: Partial<GanttIconConfig>; // Custom icons
  onTaskUpdate?: (task: Task) => void;
  onTaskCreate?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
  onLinkCreate?: (link: Link) => void;
  onLinkDelete?: (linkId: string) => void;

  // Storybook helper props (ignored by component but required for build)
  cellWidth?: number;
  cellHeight?: number;
  scaleHeight?: number;
  primaryUnit?: string;
  primaryStep?: number;
  primaryFormat?: string;
  secondaryUnit?: string;
  secondaryStep?: number;
  secondaryFormat?: string;
  showVerticalBorders?: boolean;
  showHorizontalBorders?: boolean;
  borderStyle?: string;
  borderColor?: string;
  showStartDate?: boolean;
  showEndDate?: boolean;
  startDateWidth?: number;
  endDateWidth?: number;
  startDateFormat?: string;
  endDateFormat?: string;
}

const getDefaultColumns = (uiConfig?: Partial<GanttUIConfig>): Column[] => [
  { name: 'index', label: '', width: 40, align: 'center' },
  { name: 'text', label: uiConfig?.columnLabels?.name || 'Name', width: 250, align: 'left', resize: true },
  { name: 'predecessors', label: uiConfig?.columnLabels?.dependsOn || 'Depends on', width: 120, align: 'left' },
  { name: 'duration', label: uiConfig?.columnLabels?.duration || 'Duration', width: 110, align: 'left' },
  { name: 'start', label: uiConfig?.columnLabels?.start || 'Start', width: 130, align: 'left' },
  { name: 'add', label: '', width: 50, align: 'center' },
];

const defaultScales: Scale[] = [
  { unit: 'month', step: 1, format: 'MMM' },
  { unit: 'day', step: 1, format: 'D' },
];

// Default UI configuration
const defaultUIConfig: GanttUIConfig = {
  headerTitle: 'Iris Gantt',
  showHeader: true,
  showAddTaskButton: true,
  showBaselineButton: false, // Baselines are always visible, no button needed
  showZoomButtons: true,
  showExportButtons: true,
  showFilterSearch: true,
  addTaskButtonText: 'New Task',
  baselineButtonText: 'Set Baseline',
  baselineButtonTextActive: 'Baselines',
  zoomOutTooltip: 'Zoom Out',
  zoomInTooltip: 'Zoom In',
  resetZoomTooltip: 'Reset Zoom',
  exportCSVTooltip: 'Export to CSV',
  exportExcelTooltip: 'Export to Excel',
  exportJSONTooltip: 'Export to JSON',
  exportPDFTooltip: 'Export to PDF',
  hideBaselinesTooltip: 'Hide Baselines',
  showBaselinesTooltip: 'Show Baselines',
  taskCreatorTitle: 'Create New Task',
  taskCreatorOkText: 'Create Task',
  taskCreatorCancelText: 'Cancel',
  taskNameLabel: 'Task Name',
  taskNamePlaceholder: 'Enter task name',
  typeLabel: 'Type',
  priorityLabel: 'Priority',
  startDateLabel: 'Start Date',
  durationLabel: 'Duration (days)',
  colorLabel: 'Color',
  progressLabel: 'Progress (%)',
  ownerLabel: 'Owner',
  ownerPlaceholder: 'Assign to...',
  detailsLabel: 'Details',
  detailsPlaceholder: 'Add task description...',
  taskTypeOptions: {
    task: 'Task',
    milestone: 'Milestone',
    project: 'Project',
  },
  priorityOptions: {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  },
  taskEditorTitle: 'Edit Task',
  taskEditorSaveText: 'Save Changes',
  taskEditorCancelText: 'Cancel',
  taskEditorDeleteText: 'Delete',
  deleteConfirmTitle: 'Delete Task',
  deleteConfirmContent: 'This action cannot be undone.',
  deleteConfirmOkText: 'Yes, Delete',
  deleteConfirmCancelText: 'No',
  searchPlaceholder: 'Search tasks...',
  allOwnersText: 'All Owners',
  allStatusText: 'All Status',
  allPriorityText: 'All Priority',
  clearFiltersText: 'Clear',
  statusOptions: {
    all: 'All Status',
    notStarted: 'Not Started',
    inProgress: 'In Progress',
    completed: 'Completed',
  },
  priorityFilterOptions: {
    all: 'All Priority',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  },
  columnLabels: {
    name: 'Name',
    dependsOn: 'Depends on',
    duration: 'Duration',
    start: 'Start',
  },
  taskNameRequired: 'Please enter task name',
};

export const Gantt: React.FC<GanttProps> = ({
  tasks: initialTasks = [],
  links: initialLinks = [],
  config = {},
  uiConfig = {},
  styleConfig = {},
  iconConfig = {},
  onTaskUpdate,
  onTaskCreate,
  onTaskDelete,
  onLinkCreate,
  onLinkDelete,
}) => {
  // Merge UI config with defaults
  const ui: GanttUIConfig = { ...defaultUIConfig, ...uiConfig };

  // Apply style config via CSS variables
  const styleVariables: React.CSSProperties = React.useMemo(() => {
    const vars: Record<string, string> = {};

    if (styleConfig.primary) vars['--wx-gantt-primary'] = styleConfig.primary;
    if (styleConfig.primarySelected) vars['--wx-gantt-primary-selected'] = styleConfig.primarySelected;
    if (styleConfig.success) vars['--wx-gantt-success'] = styleConfig.success;
    if (styleConfig.warning) vars['--wx-gantt-warning'] = styleConfig.warning;
    if (styleConfig.danger) vars['--wx-gantt-danger'] = styleConfig.danger;
    if (styleConfig.background) vars['--wx-gantt-background'] = styleConfig.background;
    if (styleConfig.backgroundAlt) vars['--wx-gantt-background-alt'] = styleConfig.backgroundAlt;
    if (styleConfig.backgroundHover) vars['--wx-gantt-background-hover'] = styleConfig.backgroundHover;
    if (styleConfig.selectColor) vars['--wx-gantt-select-color'] = styleConfig.selectColor;
    if (styleConfig.taskColor) vars['--wx-gantt-task-color'] = styleConfig.taskColor;
    if (styleConfig.taskFillColor) vars['--wx-gantt-task-fill-color'] = styleConfig.taskFillColor;
    if (styleConfig.projectColor) vars['--wx-gantt-project-color'] = styleConfig.projectColor;
    if (styleConfig.milestoneColor) vars['--wx-gantt-milestone-color'] = styleConfig.milestoneColor;
    if (styleConfig.fontColor) vars['--wx-gantt-font-color'] = styleConfig.fontColor;
    if (styleConfig.fontColorAlt) vars['--wx-gantt-font-color-alt'] = styleConfig.fontColorAlt;
    if (styleConfig.iconColor) vars['--wx-gantt-icon-color'] = styleConfig.iconColor;
    if (styleConfig.borderColor) vars['--wx-gantt-border-color'] = styleConfig.borderColor;

    if (styleConfig.fontFamily) vars['--wx-gantt-font-family'] = styleConfig.fontFamily;
    if (styleConfig.fontMono) vars['--wx-gantt-font-mono'] = styleConfig.fontMono;
    if (styleConfig.fontSize) vars['--wx-gantt-font-size'] = styleConfig.fontSize;
    if (styleConfig.fontWeight) vars['--wx-gantt-font-weight'] = String(styleConfig.fontWeight);
    if (styleConfig.lineHeight) vars['--wx-gantt-line-height'] = String(styleConfig.lineHeight);

    if (styleConfig.spacingXS) vars['--gantt-spacing-xs'] = styleConfig.spacingXS;
    if (styleConfig.spacingSM) vars['--gantt-spacing-sm'] = styleConfig.spacingSM;
    if (styleConfig.spacingMD) vars['--gantt-spacing-md'] = styleConfig.spacingMD;
    if (styleConfig.spacingLG) vars['--gantt-spacing-lg'] = styleConfig.spacingLG;

    // Custom CSS variables
    if (styleConfig.customCSSVariables) {
      Object.entries(styleConfig.customCSSVariables).forEach(([key, value]) => {
        vars[key.startsWith('--') ? key : `--${key}`] = value;
      });
    }

    return vars as React.CSSProperties;
  }, [styleConfig]);
  // Defensive checks
  const safeTasks = Array.isArray(initialTasks) ? initialTasks : [];
  const safeLinks = Array.isArray(initialLinks) ? initialLinks : [];
  // Undo/Redo system
  const {
    tasks,
    links,
    setTasks,
    setLinks,
    undo,
    redo,
    updateTask,
    createTask: createTaskWithHistory,
    deleteTask: deleteTaskWithHistory,
    saveState,
  } = useUndoRedo(safeTasks, safeLinks);

  // State management
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showTaskCreator, setShowTaskCreator] = useState(false);
  const [taskCreatorParentId, setTaskCreatorParentId] = useState<string | undefined>(undefined);
  const [taskCreatorParentName, setTaskCreatorParentName] = useState<string | undefined>(undefined);
  const [showDependencyEditor, setShowDependencyEditor] = useState(false);
  const [dependencyEditTask, setDependencyEditTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [reorderTask, setReorderTask] = useState<{ id: string; initialIndex: number; currentY: number; descendantIds: string[] } | null>(null);
  const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; task: Task | null } | null>(null);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(1);
  // Baselines are always visible - auto-created when tasks are first created
  // Baselines represent the original plan and remain fixed even when tasks are moved/resized
  const [baselines, setBaselines] = useState<Map<string, Baseline>>(() => {
    // Initialize baselines from initial tasks (only for tasks that don't have baselines yet)
    // This captures the original plan when tasks are first loaded
    if (safeTasks.length > 0) {
      return createBaseline(safeTasks);
    }
    return new Map();
  });

  const [currentTheme] = useState<'light' | 'dark'>((config.theme as 'light' | 'dark') || 'light');
  const [filters, setFilters] = useState<FilterOptions>({
    searchText: '',
    status: 'all',
    priority: 'all',
    owner: '',
  });

  const timelineRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  const ganttConfig: GanttConfig = {
    columns: config.columns || getDefaultColumns(uiConfig),
    scales: defaultScales,
    readonly: false,
    editable: true,
    taskHeight: 28,
    rowHeight: 44,
    scaleHeight: 28,
    columnWidth: 80,
    minColumnWidth: 60,
    autoSchedule: false,
    criticalPath: false,
    baselines: true, // Always enabled
    weekends: true,
    holidays: [],
    theme: currentTheme,
    locale: 'en',
    // Today and Project Start lines - enabled by default, labels visible by default
    showTodayLine: config.showTodayLine !== false, // Default: true
    todayLineColor: config.todayLineColor || '#ff4d4f', // Red
    todayLineLabel: config.todayLineLabel !== undefined ? config.todayLineLabel : 'Today', // Default: 'Today'
    todayLineWidth: config.todayLineWidth || 1, // Line width in pixels (default: 1px for thin line)
    todayLineStyle: config.todayLineStyle || 'solid', // 'solid' | 'dashed' | 'dotted'
    todayLineOpacity: config.todayLineOpacity !== undefined ? config.todayLineOpacity : 1, // 0-1
    todayLineLabelStyle: config.todayLineLabelStyle, // Custom label styles
    showTodayLineMarker: config.showTodayLineMarker !== false, // Default: true
    todayLineMarkerSize: config.todayLineMarkerSize || 8, // Marker size in pixels
    todayLineMarkerStyle: config.todayLineMarkerStyle || 'triangle', // Marker style
    showProjectStartLine: config.showProjectStartLine !== false, // Default: true
    projectStartDate: config.projectStartDate, // Will be calculated from tasks if not provided
    projectStartLineColor: config.projectStartLineColor || '#40a9ff', // Light blue
    projectStartLineLabel: config.projectStartLineLabel !== undefined ? config.projectStartLineLabel : 'Start Project', // Default: 'Start Project'
    projectStartLineWidth: config.projectStartLineWidth || 1, // Line width in pixels (default: 1px for thin line)
    projectStartLineStyle: config.projectStartLineStyle || 'solid', // 'solid' | 'dashed' | 'dotted'
    projectStartLineOpacity: config.projectStartLineOpacity !== undefined ? config.projectStartLineOpacity : 1, // 0-1
    projectStartLineLabelStyle: config.projectStartLineLabelStyle, // Custom label styles
    showProjectStartLineMarker: config.showProjectStartLineMarker !== false, // Default: true
    projectStartLineMarkerSize: config.projectStartLineMarkerSize || 8, // Marker size in pixels
    projectStartLineMarkerStyle: config.projectStartLineMarkerStyle || 'triangle', // Marker style
    ...config,
  };

  // Update filtered tasks when filters or tasks change
  useEffect(() => {
    const userFiltered = applyFilters(tasks, filters);

    const getVisibleTasks = (allTasks: Task[]) => {
      const visibleTasks: Task[] = [];
      const isParentClosed = (taskId?: string): boolean => {
        if (!taskId) return false;
        const parent = allTasks.find(t => t.id === taskId);
        if (parent && !parent.open && parent.type === 'project') return true;
        return isParentClosed(parent?.parent);
      };

      allTasks.forEach(task => {
        if (!isParentClosed(task.parent)) {
          visibleTasks.push(task);
        }
      });
      return visibleTasks;
    };

    setFilteredTasks(getVisibleTasks(userFiltered));
  }, [tasks, filters]);

  // Safely extract owners with defensive checks
  const owners = React.useMemo(() => {
    if (!tasks || !Array.isArray(tasks)) return [];
    try {
      return Array.from(new Set(tasks.map(t => t?.owner).filter(Boolean))) as string[];
    } catch (error) {
      console.warn('Error extracting owners:', error);
      return [];
    }
  }, [tasks]);

  const getTimelineRange = () => {
    const activeTasks = filteredTasks.length > 0 ? filteredTasks : tasks;
    if (activeTasks.length === 0) {
      const today = new Date();
      return {
        start: getStartOfDay(addToDate(today, -30, 'day')),
        end: getStartOfDay(addToDate(today, 60, 'day')),
      };
    }
    const starts = activeTasks.map(t => t.start.getTime());
    const ends = activeTasks.map(t => t.end.getTime());
    const minStart = new Date(Math.min(...starts));
    const maxEnd = new Date(Math.max(...ends));
    return {
      start: getStartOfDay(addToDate(minStart, -7, 'day')),
      end: getStartOfDay(maxEnd),
    };
  };

  const range = getTimelineRange();

  const handleTaskClick = (taskId: string) => {
    setSelectedTask(taskId);
  };

  const handleContextMenu = (e: React.MouseEvent, taskId: string) => {
    if (ganttConfig.readonly) return;
    e.preventDefault();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setContextMenu({ x: e.clientX, y: e.clientY, task });
    }
  };

  const handleCopyTask = () => {
    if (!contextMenu?.task) return;
    const task = contextMenu.task;
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      text: `${task.text} (Copy)`,
      start: addToDate(task.start, 7, 'day'),
      end: addToDate(task.end, 7, 'day'),
    };
    createTaskWithHistory(newTask);
    if (onTaskCreate) onTaskCreate(newTask);
  };

  const handleConvertTaskType = (newType: 'task' | 'milestone' | 'project') => {
    if (!contextMenu?.task) return;
    const updatedTask = { ...contextMenu.task, type: newType };
    updateTask(updatedTask);
    if (onTaskUpdate) onTaskUpdate(updatedTask);
  };

  const handleTaskDragStart = (taskId: string, _clientX: number, clientY: number, type?: 'reorder') => {
    if (ganttConfig.readonly) return;
    if (type === 'reorder') {
      const index = filteredTasks.findIndex(t => t.id === taskId);
      const getDescendantIds = (parentId: string, allTasks: Task[]): string[] => {
        let ids: string[] = [];
        const children = allTasks.filter(t => t.parent === parentId);
        children.forEach(child => {
          ids.push(child.id);
          ids = [...ids, ...getDescendantIds(child.id, allTasks)];
        });
        return ids;
      };
      const descendantIds = getDescendantIds(taskId, tasks);
      setReorderTask({ id: taskId, initialIndex: index, currentY: clientY, descendantIds });
      document.body.classList.add('gantt-dragging');
    } else {
      setDraggedTask(taskId);
    }
  };

  const handleTaskDragEnd = () => {
    if (reorderTask && dropIndicator) {
      const sourceTask = tasks.find(t => t.id === reorderTask.id);
      const targetTask = tasks.find(t => t.id === dropIndicator.taskId);
      if (sourceTask && targetTask && sourceTask.id !== targetTask.id) {
        const groupToMoveIds = [sourceTask.id, ...reorderTask.descendantIds];
        if (!groupToMoveIds.includes(targetTask.id)) {
          const newTasks = [...tasks];
          const newParentId: string | undefined = dropIndicator.position === 'inside' ? targetTask.id : targetTask.parent;
          const sourceIdxInFull = newTasks.findIndex(t => t.id === sourceTask.id);
          if (sourceIdxInFull !== -1) newTasks[sourceIdxInFull] = { ...newTasks[sourceIdxInFull], parent: newParentId };
          const currentGroupTasks = newTasks.filter(t => groupToMoveIds.includes(t.id));
          const remainingTasks = newTasks.filter(t => !groupToMoveIds.includes(t.id));
          let insertIdx = remainingTasks.findIndex(t => t.id === targetTask.id);
          if (dropIndicator.position === 'inside') {
            const children = remainingTasks.filter(t => t.parent === targetTask.id);
            if (children.length > 0) insertIdx = remainingTasks.findIndex(t => t.id === children[children.length - 1].id) + 1;
            else insertIdx++;
          } else if (dropIndicator.position === 'below') {
            const getDescendantIds = (parentId: string, allTasks: Task[]): string[] => {
              let ids: string[] = [];
              const children = allTasks.filter(t => t.parent === parentId);
              children.forEach(child => {
                ids.push(child.id);
                ids = [...ids, ...getDescendantIds(child.id, allTasks)];
              });
              return ids;
            };
            const targetDescendants = getDescendantIds(targetTask.id, remainingTasks);
            if (targetDescendants.length > 0) insertIdx = remainingTasks.findIndex(t => t.id === targetDescendants[targetDescendants.length - 1]) + 1;
            else insertIdx++;
          }
          const beforeState = { tasks: [...tasks], links: [...links] };
          remainingTasks.splice(insertIdx, 0, ...currentGroupTasks);
          setTasks(remainingTasks);
          saveState('task_update', beforeState, { tasks: remainingTasks, links });
        }
      }
    }
    setDraggedTask(null);
    setReorderTask(null);
    setDropIndicator(null);
    document.body.classList.remove('gantt-dragging');
  };

  // Throttle mouse move for performance
  const mouseMoveTimeoutRef = useRef<number | null>(null);
  const handleMouseMove = React.useCallback((e: React.MouseEvent) => {
    if (reorderTask) {
      // Throttle to 16ms (60fps) for smooth performance
      if (mouseMoveTimeoutRef.current) {
        cancelAnimationFrame(mouseMoveTimeoutRef.current);
      }
      mouseMoveTimeoutRef.current = requestAnimationFrame(() => {
        const rowHeight = ganttConfig.rowHeight || 44;
        const gridBody = gridContainerRef.current?.querySelector('.gantt-grid-body');
        if (!gridBody) return;
        const rect = gridBody.getBoundingClientRect();
        const relativeY = e.clientY - rect.top;
        let index = Math.floor(relativeY / rowHeight);
        index = Math.max(0, Math.min(index, filteredTasks.length - 1));
        const taskAtPointer = filteredTasks[index];
        if (taskAtPointer) {
          const offsetInRow = relativeY - (index * rowHeight);
          let position: 'above' | 'below' | 'inside' = 'above';
          if (taskAtPointer.type === 'project') {
            if (offsetInRow < rowHeight * 0.3) position = 'above';
            else if (offsetInRow > rowHeight * 0.7) position = 'below';
            else position = 'inside';
          } else {
            position = offsetInRow < rowHeight / 2 ? 'above' : 'below';
          }
          if (taskAtPointer.id !== reorderTask.id) setDropIndicator({ taskId: taskAtPointer.id, position });
          else setDropIndicator(null);
        }
        setReorderTask(prev => prev ? { ...prev, currentY: e.clientY } : null);
      });
    }
  }, [reorderTask, filteredTasks, ganttConfig.rowHeight]);

  const handleMouseUp = () => {
    if (reorderTask) handleTaskDragEnd();
  };

  const handleCreateTask = (newTaskData: Omit<Task, 'id'>, parentId?: string) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      parent: parentId, // Set parent if provided (for subtasks)
    };
    createTaskWithHistory(newTask);

    // Automatically create baseline for new task with its initial dates
    // This baseline will remain fixed even when the task is moved/resized
    // The baseline represents the "original plan" and only the actual task bar will change
    const newBaseline: Baseline = {
      taskId: newTask.id,
      start: new Date(newTask.start), // Capture original start date
      end: new Date(newTask.end), // Capture original end date
    };
    setBaselines(prev => {
      const updated = new Map(prev);
      updated.set(newTask.id, newBaseline);
      return updated;
    });

    if (onTaskCreate) onTaskCreate(newTask);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    updateTask(updatedTask);
    if (onTaskUpdate) onTaskUpdate(updatedTask);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTaskWithHistory(taskId);
    // Remove baseline when task is deleted
    setBaselines(prev => {
      const updated = new Map(prev);
      updated.delete(taskId);
      return updated;
    });
    if (onTaskDelete) onTaskDelete(taskId);
  };

  const handleAddDependency = (sourceId: string, targetId: string, type: Link['type'], lag?: number) => {
    const newLink: Link = { id: `link-${Date.now()}`, source: sourceId, target: targetId, type, lag };
    setLinks([...links, newLink]);
    if (onLinkCreate) onLinkCreate(newLink);
  };

  const handleRemoveDependency = (linkId: string) => {
    const newLinks = links.filter(l => l.id !== linkId);
    setLinks(newLinks);
    if (onLinkDelete) onLinkDelete(linkId);
  };

  // Auto-create baselines ONLY for new tasks when they are first created
  // Baselines represent the original plan and should NOT change when tasks are moved/resized
  // Only create baselines for tasks that don't have one yet
  useEffect(() => {
    const newBaselines = new Map(baselines);
    let hasNewBaselines = false;

    tasks.forEach(task => {
      // Only create baseline if task doesn't have one yet
      if (!baselines.has(task.id)) {
        newBaselines.set(task.id, {
          taskId: task.id,
          start: new Date(task.start), // Capture original start date
          end: new Date(task.end), // Capture original end date
        });
        hasNewBaselines = true;
      }
      // Do NOT update existing baselines - they remain fixed at original task dates
    });

    // Remove baselines for deleted tasks
    const taskIds = new Set(tasks.map(t => t.id));
    baselines.forEach((_baseline, taskId) => {
      if (!taskIds.has(taskId)) {
        newBaselines.delete(taskId);
        hasNewBaselines = true;
      }
    });

    if (hasNewBaselines) {
      setBaselines(newBaselines);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]); // Only depend on tasks, not baselines to avoid loops

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
        else if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) { e.preventDefault(); redo(); }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // Synchronize vertical scrolling between Grid and Timeline
  useEffect(() => {
    const gridBody = gridContainerRef.current?.querySelector('.gantt-grid-body');
    const timelineBody = timelineRef.current?.querySelector('.gantt-timeline-body');

    if (!gridBody || !timelineBody) return;

    const handleGridScroll = () => {
      if (!isScrollingRef.current) {
        isScrollingRef.current = true;
        timelineBody.scrollTop = gridBody.scrollTop;
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = window.setTimeout(() => {
          isScrollingRef.current = false;
        }, 150);
      }
    };

    const handleTimelineScroll = () => {
      if (!isScrollingRef.current) {
        isScrollingRef.current = true;
        gridBody.scrollTop = timelineBody.scrollTop;
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = window.setTimeout(() => {
          isScrollingRef.current = false;
        }, 150);
      }
    };

    gridBody.addEventListener('scroll', handleGridScroll, { passive: true });
    timelineBody.addEventListener('scroll', handleTimelineScroll, { passive: true });

    return () => {
      gridBody.removeEventListener('scroll', handleGridScroll);
      timelineBody.removeEventListener('scroll', handleTimelineScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [filteredTasks]);


  // Apply responsive container styles
  const containerStyle: React.CSSProperties = {
    height: config.containerHeight || '100%',
    minHeight: config.containerMinHeight || '400px',
  };

  // Apply grid width if specified
  const gridWidthStyle = config.gridWidth ? { '--gantt-grid-width': config.gridWidth } as React.CSSProperties : {};

  return (
    <div
      className={`gantt-page-wrapper theme-${currentTheme}`}
      style={{ ...containerStyle, ...styleVariables }}
    >
      {ui.showHeader && (
        <div className="gantt-page-header">
          <div className="gantt-page-header-left"><h1 className="gantt-page-title">{ui.headerTitle}</h1></div>
        </div>
      )}

      <div
        className={`gantt-container theme-${ganttConfig.theme}`}
        style={gridWidthStyle}
      >
        <Toolbar
          zoomLevel={zoomLevel}
          setZoomLevel={setZoomLevel}
          onExport={(type) => {
            if (type === 'csv') ExportUtils.exportToCSV(tasks);
            if (type === 'excel') ExportUtils.exportToExcel(tasks);
            if (type === 'json') ExportUtils.exportToJSON(tasks, links);
            if (type === 'pdf') ExportUtils.exportToPDF(tasks);
          }}
          onFilterChange={(f: FilterOptions) => setFilters(f)}
          owners={owners || []}
          onAddTask={(parentId) => {
            if (parentId) {
              const parentTask = tasks.find(t => t.id === parentId);
              setTaskCreatorParentId(parentId);
              setTaskCreatorParentName(parentTask?.text);
            } else {
              setTaskCreatorParentId(undefined);
              setTaskCreatorParentName(undefined);
            }
            setShowTaskCreator(true);
          }}
          uiConfig={ui}
          iconConfig={iconConfig}
          styleConfig={styleConfig}
        />

        <div className="gantt-layout" ref={layoutRef} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
          <Grid
            ref={gridContainerRef}
            tasks={filteredTasks}
            columns={ganttConfig.columns || []}
            selectedTask={selectedTask}
            onTaskClick={handleTaskClick}
            onTaskContextMenu={handleContextMenu}
            onTaskUpdate={handleUpdateTask}
            onTaskDragStart={handleTaskDragStart}
            onAddTask={(parentId) => {
              if (parentId) {
                const parentTask = tasks.find(t => t.id === parentId);
                setTaskCreatorParentId(parentId);
                setTaskCreatorParentName(parentTask?.text);
              } else {
                setTaskCreatorParentId(undefined);
                setTaskCreatorParentName(undefined);
              }
              setShowTaskCreator(true);
            }}
            onAddDependency={handleAddDependency}
            onRemoveDependency={handleRemoveDependency}
            onDependencyClick={(taskId) => {
              const task = tasks.find(t => t.id === taskId);
              if (task) {
                setDependencyEditTask(task);
                setShowDependencyEditor(true);
              }
            }}
            links={links}
            allTasks={tasks}
            dropIndicator={dropIndicator}
            reorderTask={reorderTask}
            iconConfig={iconConfig}
            styleConfig={styleConfig}
          />
          <Chart
            ref={timelineRef}
            tasks={filteredTasks}
            links={links}
            range={range}
            scales={ganttConfig.scales!}
            config={ganttConfig}
            selectedTask={selectedTask}
            draggedTask={draggedTask}
            onTaskClick={() => { }}
            onTaskDragStart={() => { }}
            onTaskDragEnd={() => { }}
            onTaskUpdate={(id, updates) => {
              const task = tasks.find(t => t.id === id);
              if (task) handleUpdateTask({ ...task, ...updates });
            }}
            zoomLevel={zoomLevel}
            baselines={baselines}
          />
        </div>

        {showTaskCreator && (
          <TaskCreator
            onCreateTask={handleCreateTask}
            onClose={() => {
              setShowTaskCreator(false);
              setTaskCreatorParentId(undefined);
              setTaskCreatorParentName(undefined);
            }}
            uiConfig={ui}
            parentId={taskCreatorParentId}
            parentTaskName={taskCreatorParentName}
            styleConfig={styleConfig}
          />
        )}
        {editingTask && <TaskEditor task={editingTask} onUpdate={handleUpdateTask} onDelete={handleDeleteTask} onClose={() => setEditingTask(null)} uiConfig={ui} styleConfig={styleConfig} />}
        {showDependencyEditor && dependencyEditTask && (
          <DependencyEditor
            task={dependencyEditTask}
            allTasks={tasks}
            links={links}
            onAddDependency={handleAddDependency}
            onRemoveDependency={handleRemoveDependency}
            onClose={() => { setShowDependencyEditor(false); setDependencyEditTask(null); }}
            styleConfig={styleConfig}
          />
        )}

        {contextMenu && (
          <>
            <div className="gantt-context-menu-overlay" onClick={() => setContextMenu(null)} onContextMenu={(e) => { e.preventDefault(); setContextMenu(null); }} />
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              task={contextMenu.task}
              onEdit={() => { if (contextMenu.task) setEditingTask(contextMenu.task); }}
              onDelete={() => { if (contextMenu.task) handleDeleteTask(contextMenu.task.id); }}
              onCopy={handleCopyTask}
              onDependencies={() => { if (contextMenu.task) { setDependencyEditTask(contextMenu.task); setShowDependencyEditor(true); } }}
              onConvertToMilestone={() => handleConvertTaskType('milestone')}
              onConvertToTask={() => handleConvertTaskType('task')}
              onConvertToProject={() => handleConvertTaskType('project')}
              onClose={() => setContextMenu(null)}
              onAutoSchedule={() => {
                const scheduled = AutoScheduler.autoSchedule(tasks, links, { mode: 'forward' });
                setTasks(scheduled);
                setContextMenu(null);
              }}
              iconConfig={iconConfig}
              styleConfig={styleConfig}
            />
          </>
        )}

        {reorderTask && (
          <div
            className="gantt-grid-row ghost-row"
            style={{
              height: ganttConfig.rowHeight,
              top: reorderTask.currentY - (ganttConfig.rowHeight || 48) / 2,
              left: gridContainerRef.current?.getBoundingClientRect().left,
              position: 'fixed',
              pointerEvents: 'none',
              opacity: 0.8,
              zIndex: 9999,
              width: gridContainerRef.current?.offsetWidth,
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              border: '1px solid #2196F3',
              display: 'flex'
            }}
          >
            {ganttConfig.columns?.map((column) => (
              <div key={`ghost-${column.name}`} className="gantt-grid-cell" style={{ width: column.width, textAlign: column.align || 'left' }}>
                {(() => {
                  const task = tasks.find(t => t.id === reorderTask.id);
                  if (!task) return null;
                  if (column.template) return column.template(task);
                  switch (column.name) {
                    case 'text':
                      return (
                        <div className="gantt-grid-cell-text">
                          <FontAwesomeIcon icon={faGripVertical} style={{ marginRight: 8, color: '#adb5bd' }} />
                          <span className="gantt-task-name-text">{task.text}{reorderTask.descendantIds.length > 0 && <span> +{reorderTask.descendantIds.length} subtasks</span>}</span>
                        </div>
                      );
                    case 'start': return formatDate(task.start, 'DD MMM YYYY');
                    case 'duration': return `${task.duration}`;
                    default: return (task as unknown as Record<string, unknown>)[column.name] as string || '';
                  }
                })()}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
