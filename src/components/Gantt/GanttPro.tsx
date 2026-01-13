import React, { useState, useRef, useEffect } from 'react';
import { Task, Link, GanttConfig, Column, Scale, Marker } from '../types';
import { Grid } from './Grid';
import { Timeline } from './Timeline';
import { TaskCreator } from './TaskCreator';
import { TaskEditor } from './TaskEditor';
import { FilterSearch, applyFilters, FilterOptions } from './FilterSearch';
import { useUndoRedo } from './UndoRedo';
import { calculateCriticalPath } from './CriticalPath';
import { autoSchedule, levelResources } from './AutoScheduler';
import { exportToCSV, exportToExcel, exportToJSON, exportToPDF } from './ExportUtils';
import { createBaseline } from './Baselines';
import { addToDate, getStartOfDay } from '../utils/dateUtils';
import './gantt.css';

interface GanttProProps {
  tasks: Task[];
  links?: Link[];
  config?: Partial<GanttConfig>;
  onTaskUpdate?: (task: Task) => void;
  onTaskCreate?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
  onLinkCreate?: (link: Link) => void;
  onLinkDelete?: (linkId: string) => void;
}

const defaultColumns: Column[] = [
  { name: 'text', label: 'Task Name', width: 250, align: 'left', resize: true },
  { name: 'start', label: 'Start Date', width: 100, align: 'center' },
  { name: 'duration', label: 'Duration', width: 80, align: 'center' },
  { name: 'progress', label: 'Progress', width: 80, align: 'center' },
];

const defaultScales: Scale[] = [
  { unit: 'month', step: 1, format: 'MMMM YYYY' },
  { unit: 'day', step: 1, format: 'D' },
];

export const GanttPro: React.FC<GanttProProps> = ({
  tasks: initialTasks,
  links: initialLinks = [],
  config = {},
  onTaskUpdate,
  onTaskCreate,
  onTaskDelete,
  onLinkCreate,
  onLinkDelete,
}) => {
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

  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showTaskCreator, setShowTaskCreator] = useState(false);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showCriticalPath, setShowCriticalPath] = useState(false);
  const [baselines, setBaselines] = useState<Map<string, any>>(new Map());
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
    baselines: false,
    weekends: true,
    holidays: [],
    theme: 'light',
    locale: 'en',
    ...config,
  };

  // Update filtered tasks when filters or tasks change
  useEffect(() => {
    setFilteredTasks(applyFilters(tasks, filters));
  }, [tasks, filters]);

  // Calculate critical path
  const criticalPathResult = showCriticalPath ? calculateCriticalPath(tasks, links) : null;

  // Get unique owners for filter
  const owners = Array.from(new Set(tasks.map(t => t.owner).filter(Boolean))) as string[];

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

  const handleTaskDoubleClick = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setEditingTask(task);
    }
  };

  const handleTaskDragStart = (taskId: string) => {
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

  const handleAutoSchedule = () => {
    const scheduled = autoSchedule(tasks, links, { mode: 'forward' });
    setTasks(scheduled);
  };

  const handleLevelResources = () => {
    const leveled = levelResources(tasks);
    setTasks(leveled);
  };

  const handleCreateBaseline = () => {
    const newBaselines = createBaseline(tasks);
    setBaselines(newBaselines);
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
    <div className={`gantt-container theme-${ganttConfig.theme}`}>
      {/* Filter and Search */}
      <FilterSearch
        onFilterChange={setFilters}
        owners={owners}
      />

      <div className="gantt-layout">
        <Grid
          ref={gridRef}
          tasks={filteredTasks}
          columns={ganttConfig.columns!}
          rowHeight={ganttConfig.rowHeight!}
          selectedTask={selectedTask}
          onTaskClick={handleTaskClick}
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
        />
      </div>

      {/* Enhanced Toolbar */}
      <div className="gantt-toolbar">
        <div className="gantt-toolbar-left">
          <button onClick={() => setShowTaskCreator(true)}>+ Add Task</button>
          <div className="gantt-toolbar-separator" />
          <button onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">↶ Undo</button>
          <button onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)">↷ Redo</button>
          <div className="gantt-toolbar-separator" />
          <button onClick={handleAutoSchedule} title="Auto-schedule tasks">⚡ Auto-Schedule</button>
          <button onClick={handleLevelResources} title="Level resources">📊 Level Resources</button>
          <button
            onClick={() => setShowCriticalPath(!showCriticalPath)}
            className={showCriticalPath ? 'active' : ''}
            title="Show critical path"
          >
            🎯 Critical Path
          </button>
          <button onClick={handleCreateBaseline} title="Create baseline">📍 Set Baseline</button>
        </div>

        <div className="gantt-toolbar-right">
          <button onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}>🔍− Zoom Out</button>
          <button onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.25))}>🔍+ Zoom In</button>
          <button onClick={() => setZoomLevel(1)}>↺ Reset</button>
          <div className="gantt-toolbar-separator" />
          <button onClick={() => exportToCSV(tasks)}>💾 CSV</button>
          <button onClick={() => exportToExcel(tasks)}>📊 Excel</button>
          <button onClick={() => exportToJSON(tasks, links)}>📄 JSON</button>
          <button onClick={() => exportToPDF(tasks)}>📋 PDF</button>
        </div>
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
    </div>
  );
};
