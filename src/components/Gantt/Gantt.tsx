import React, { useState, useRef, useEffect } from 'react';
import type { Task, Link, GanttConfig, Column, Scale, Baseline } from '../types';
import type { FilterOptions } from './FilterSearch';
import { Grid } from './Grid';
import { Timeline } from './Timeline';
import { TaskCreator } from './TaskCreator';
import { TaskEditor } from './TaskEditor';
import { DependencyEditor } from './DependencyEditor';
import { ContextMenu } from './ContextMenu';
import { FilterSearch, applyFilters } from './FilterSearch';
import { useUndoRedo } from './UndoRedo';
import { autoSchedule, levelResources } from './AutoScheduler';
import { exportToCSV, exportToExcel, exportToJSON, exportToPDF } from './ExportUtils';
import { createBaseline } from './Baselines';
import { addToDate, getStartOfDay } from '../utils/dateUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faLink,
  faRotateLeft,
  faRotateRight,
  faBolt,
  faChartBar,
  faBullseye,
  faMapPin,
  faSearchMinus,
  faSearchPlus,
  faFileCsv,
  faFileExcel,
  faFileCode,
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons';

// Ant Design CSS
import 'antd/dist/reset.css';

// IBM Plex Fonts
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/600.css';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/600.css';

// Custom styles
import './gantt.css';

interface GanttProps {
  tasks: Task[];
  links?: Link[];
  config?: Partial<GanttConfig>;
  onTaskUpdate?: (task: Task) => void;
  onTaskCreate?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
  onLinkCreate?: (link: Link) => void;
  onLinkDelete?: (linkId: string) => void;
  // Storybook helper props (ignored by component)
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

const defaultColumns: Column[] = [
  { name: 'text', label: 'Task Name', width: 300, align: 'left', resize: true },
  { name: 'start', label: 'Start Date', width: 120, align: 'center' },
  { name: 'duration', label: 'Duration', width: 100, align: 'center' },
];

const defaultScales: Scale[] = [
  { unit: 'month', step: 1, format: 'MMMM YYYY' },
  { unit: 'day', step: 1, format: 'D' },
];

export const Gantt: React.FC<GanttProps> = ({
  tasks: initialTasks,
  links: initialLinks = [],
  config = {},
  onTaskUpdate,
  onTaskCreate,
  onTaskDelete,
  onLinkCreate,
  onLinkDelete,
}) => {
  // Undo/Redo system
  const {
    tasks,
    links,
    setTasks,
    setLinks,
    undo,
    redo,
    canUndo,
    canRedo,
    updateTask,
    createTask: createTaskWithHistory,
    deleteTask: deleteTaskWithHistory,
  } = useUndoRedo(initialTasks, initialLinks);

  // State management
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showTaskCreator, setShowTaskCreator] = useState(false);
  const [showDependencyEditor, setShowDependencyEditor] = useState(false);
  const [dependencyEditTask, setDependencyEditTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; task: Task | null } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showCriticalPath, setShowCriticalPath] = useState(false);
  const [baselines, setBaselines] = useState<Map<string, Baseline>>(new Map());
  const [showBaselines, setShowBaselines] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>((config.theme as 'light' | 'dark') || 'light');
  const [filters, setFilters] = useState<FilterOptions>({
    searchText: '',
    status: 'all',
    priority: 'all',
    owner: '',
  });

  const timelineRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const ganttConfig: GanttConfig = {
    columns: defaultColumns,
    scales: defaultScales,
    readonly: false,
    editable: true,
    taskHeight: 32,
    rowHeight: 44,
    scaleHeight: 40,
    columnWidth: 60,
    minColumnWidth: 40,
    autoSchedule: false,
    criticalPath: false,
    baselines: showBaselines,
    weekends: true,
    holidays: [],
    theme: currentTheme,
    locale: 'en',
    ...config,
  };

  // Update filtered tasks when filters or tasks change
  useEffect(() => {
    setFilteredTasks(applyFilters(tasks, filters));
  }, [tasks, filters]);

  // Calculate critical path (used in render if toggle is on)
  // calculateCriticalPath(tasks, links);

  // Get unique owners for filter
  const owners = Array.from(new Set(tasks.map(t => t.owner).filter(Boolean))) as string[];

  // Calculate timeline range
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
      end: getStartOfDay(addToDate(maxEnd, 14, 'day')),
    };
  };

  const range = getTimelineRange();

  // Sync scroll between grid and timeline
  const handleGridScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (timelineRef.current) {
      timelineRef.current.scrollTop = (e.target as HTMLDivElement).scrollTop;
    }
  };

  const handleTimelineScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (gridRef.current) {
      gridRef.current.scrollTop = (e.target as HTMLDivElement).scrollTop;
    }
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTask(taskId);
  };

  const handleContextMenu = (e: React.MouseEvent, taskId: string) => {
    if (ganttConfig.readonly) return;
    e.preventDefault();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        task,
      });
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
    if (onTaskCreate) {
      onTaskCreate(newTask);
    }
  };

  const handleConvertTaskType = (newType: 'task' | 'milestone' | 'project') => {
    if (!contextMenu?.task) return;
    const updatedTask = { ...contextMenu.task, type: newType };
    updateTask(updatedTask);
    if (onTaskUpdate) {
      onTaskUpdate(updatedTask);
    }
  };

  const handleTaskDragStart = (taskId: string, _clientX: number, _clientY: number) => {
    if (!ganttConfig.readonly) {
      setDraggedTask(taskId);
    }
  };

  const handleTaskDragEnd = () => {
    setDraggedTask(null);
  };

  const handleCreateTask = (newTaskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`,
    };

    createTaskWithHistory(newTask);

    if (onTaskCreate) {
      onTaskCreate(newTask);
    }
  };

  const handleUpdateTask = (updatedTask: Task) => {
    updateTask(updatedTask);

    if (onTaskUpdate) {
      onTaskUpdate(updatedTask);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTaskWithHistory(taskId);

    if (onTaskDelete) {
      onTaskDelete(taskId);
    }
  };

  const handleOpenDependencyEditor = (taskId?: string) => {
    const task = taskId ? tasks.find(t => t.id === taskId) : (selectedTask ? tasks.find(t => t.id === selectedTask) : null);
    if (task) {
      setDependencyEditTask(task);
      setShowDependencyEditor(true);
    }
  };

  const handleAddDependency = (sourceId: string, targetId: string, type: Link['type'], lag?: number) => {
    const newLink: Link = {
      id: `link-${Date.now()}`,
      source: sourceId,
      target: targetId,
      type,
      lag,
    };

    setLinks([...links, newLink]);

    if (onLinkCreate) {
      onLinkCreate(newLink);
    }
  };

  const handleRemoveDependency = (linkId: string) => {
    setLinks(links.filter(l => l.id !== linkId));

    if (onLinkDelete) {
      onLinkDelete(linkId);
    }
  };

  const handleAutoSchedule = () => {
    const scheduled = autoSchedule(tasks, links, { mode: 'forward' });
    setTasks(scheduled);
  };

  const handleLevelResources = () => {
    const leveled = levelResources(tasks);
    setTasks(leveled);
  };

  const handleToggleBaselines = () => {
    if (!showBaselines && baselines.size === 0) {
      // Create baseline if none exists
      const newBaselines = createBaseline(tasks);
      setBaselines(newBaselines);
      setShowBaselines(true);
    } else {
      setShowBaselines(!showBaselines);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <div className={`gantt-page-wrapper theme-${currentTheme}`}>
      {/* Page Header - Exact Match to Image */}
      <div className="gantt-page-header">
        <div className="gantt-page-header-left">
          <h1 className="gantt-page-title">React Gantt</h1>
        </div>
        <div className="gantt-page-header-right">
          <div className="gantt-theme-selector">
            <button
              className={currentTheme === 'light' ? 'active' : ''}
              onClick={() => setCurrentTheme('light')}
              title="Light Theme"
            >
              Willow
            </button>
            <button
              className={currentTheme === 'dark' ? 'active' : ''}
              onClick={() => setCurrentTheme('dark')}
              title="Dark Theme"
            >
              Dark
            </button>
          </div>
          <a
            href="https://github.com/TimJerry725/ganttchart"
            target="_blank"
            rel="noopener noreferrer"
            className="gantt-github-link"
          >
            See code on GitHub
          </a>
        </div>
      </div>

      {/* Main Gantt Container */}
      <div className={`gantt-container theme-${ganttConfig.theme}`}>
        {/* Enhanced Toolbar - Always at top */}
        <div className="gantt-toolbar">
          <div className="gantt-toolbar-left">
            {!ganttConfig.readonly && (
              <>
                <button onClick={() => setShowTaskCreator(true)}>
                  <FontAwesomeIcon icon={faPlus} /> Add Task
                </button>
                <button
                  onClick={() => handleOpenDependencyEditor()}
                  disabled={!selectedTask}
                  title="Edit task dependencies"
                >
                  <FontAwesomeIcon icon={faLink} /> Dependencies
                </button>
                <div className="gantt-toolbar-separator" />
              </>
            )}
            <button onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">
              <FontAwesomeIcon icon={faRotateLeft} /> Undo
            </button>
            <button onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)">
              <FontAwesomeIcon icon={faRotateRight} /> Redo
            </button>
            <div className="gantt-toolbar-separator" />
            <button onClick={handleAutoSchedule} title="Auto-schedule tasks based on dependencies">
              <FontAwesomeIcon icon={faBolt} /> Auto-Schedule
            </button>
            <button onClick={handleLevelResources} title="Balance resource allocation">
              <FontAwesomeIcon icon={faChartBar} /> Level Resources
            </button>
            <button
              onClick={() => setShowCriticalPath(!showCriticalPath)}
              className={showCriticalPath ? 'active' : ''}
              title="Highlight critical path"
            >
              <FontAwesomeIcon icon={faBullseye} /> Critical Path
            </button>
            <button
              onClick={handleToggleBaselines}
              className={showBaselines ? 'active' : ''}
              title={baselines.size > 0 ? "Toggle baseline visibility" : "Create baseline snapshot"}
            >
              <FontAwesomeIcon icon={faMapPin} /> {baselines.size > 0 ? 'Baselines' : 'Set Baseline'}
            </button>
          </div>

          <div className="gantt-toolbar-right">
            <button onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}>
              <FontAwesomeIcon icon={faSearchMinus} /> Zoom Out
            </button>
            <button onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.25))}>
              <FontAwesomeIcon icon={faSearchPlus} /> Zoom In
            </button>
            <button onClick={() => setZoomLevel(1)}>
              <FontAwesomeIcon icon={faRotateLeft} /> Reset Zoom
            </button>
            <div className="gantt-toolbar-separator" />
            <button onClick={() => exportToCSV(tasks)} title="Export to CSV">
              <FontAwesomeIcon icon={faFileCsv} /> CSV
            </button>
            <button onClick={() => exportToExcel(tasks)} title="Export to Excel">
              <FontAwesomeIcon icon={faFileExcel} /> Excel
            </button>
            <button onClick={() => exportToJSON(tasks, links)} title="Export to JSON">
              <FontAwesomeIcon icon={faFileCode} /> JSON
            </button>
            <button onClick={() => exportToPDF(tasks)} title="Export to PDF">
              <FontAwesomeIcon icon={faFilePdf} /> PDF
            </button>
          </div>
        </div>

        {/* Filter and Search - Directly below toolbar */}
        <FilterSearch
          onFilterChange={setFilters}
          owners={owners}
        />

        {/* Main Gantt Layout - Grid + Timeline */}
        <div className="gantt-layout">
          <Grid
            ref={gridRef}
            tasks={filteredTasks}
            columns={ganttConfig.columns!}
            rowHeight={ganttConfig.rowHeight!}
            selectedTask={selectedTask}
            onTaskClick={handleTaskClick}
            onTaskContextMenu={handleContextMenu}
            onScroll={handleGridScroll}
            onTaskUpdate={handleUpdateTask}
          />
          <Timeline
            ref={timelineRef}
            tasks={filteredTasks}
            links={links}
            range={range}
            scales={ganttConfig.scales!}
            config={ganttConfig}
            selectedTask={selectedTask}
            draggedTask={draggedTask}
            onTaskClick={handleTaskClick}
            onTaskDragStart={handleTaskDragStart}
            onTaskDragEnd={handleTaskDragEnd}
            onScroll={handleTimelineScroll}
            onTaskUpdate={handleUpdateTask}
            zoomLevel={zoomLevel}
            baselines={baselines}
          />
        </div>

        {/* Task Creator Modal */}
        {showTaskCreator && (
          <TaskCreator
            onCreateTask={handleCreateTask}
            onClose={() => setShowTaskCreator(false)}
          />
        )}

        {/* Task Editor Modal */}
        {editingTask && (
          <TaskEditor
            task={editingTask}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
            onClose={() => setEditingTask(null)}
          />
        )}

        {/* Dependency Editor Modal */}
        {showDependencyEditor && dependencyEditTask && (
          <DependencyEditor
            task={dependencyEditTask}
            allTasks={tasks}
            links={links}
            onAddDependency={handleAddDependency}
            onRemoveDependency={handleRemoveDependency}
            onClose={() => {
              setShowDependencyEditor(false);
              setDependencyEditTask(null);
            }}
          />
        )}

        {/* Context Menu */}
        {contextMenu && (
          <>
            <div
              className="gantt-context-menu-overlay"
              onClick={() => setContextMenu(null)}
              onContextMenu={(e) => {
                e.preventDefault();
                setContextMenu(null);
              }}
            />
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              task={contextMenu.task}
              onEdit={() => {
                if (contextMenu.task) {
                  setEditingTask(contextMenu.task);
                }
              }}
              onDelete={() => {
                if (contextMenu.task) {
                  handleDeleteTask(contextMenu.task.id);
                }
              }}
              onCopy={handleCopyTask}
              onDependencies={() => {
                if (contextMenu.task) {
                  setDependencyEditTask(contextMenu.task);
                  setShowDependencyEditor(true);
                }
              }}
              onConvertToMilestone={() => handleConvertTaskType('milestone')}
              onConvertToTask={() => handleConvertTaskType('task')}
              onConvertToProject={() => handleConvertTaskType('project')}
              onClose={() => setContextMenu(null)}
            />
          </>
        )}
      </div>
    </div>
  );
};
