import React, { useState, useRef, useEffect } from 'react';
import { Grid } from './Grid/Grid';
import { Chart } from './Chart/Chart';
import { Toolbar } from './Toolbar/Toolbar';
import { TaskCreator } from './Editor/TaskCreator';
import { TaskEditor } from './Editor/TaskEditor';
import { DependencyEditor } from './Editor/DependencyEditor';
import { ContextMenu } from './Gantt/ContextMenu';
import type { GanttConfig, DropIndicator, ZoomLevel, Baseline, Column, Scale } from './types';
import { formatDate, addToDate, getStartOfDay } from './utils/dateUtils';
import { useUndoRedo } from './Gantt/UndoRedo';
import * as AutoScheduler from './Gantt/AutoScheduler';
import { createBaseline } from './Gantt/Baselines';
import * as ExportUtils from './Gantt/ExportUtils';
import { applyFilters } from './Toolbar/FilterSearch';
import type { FilterOptions } from './Toolbar/FilterSearch';
import type { Task, Link } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
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

const defaultColumns: Column[] = [
  { name: 'text', label: 'Task Name', width: 300, align: 'left', resize: true },
  { name: 'start', label: 'Start Date', width: 120, align: 'left' },
  { name: 'duration', label: 'Duration', width: 100, align: 'left' },
  { name: 'add', label: '', width: 40, align: 'center' },
];

const defaultScales: Scale[] = [
  { unit: 'month', step: 1, format: 'MMM' },
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
    updateTask,
    createTask: createTaskWithHistory,
    deleteTask: deleteTaskWithHistory,
    saveState,
  } = useUndoRedo(initialTasks, initialLinks);

  // State management
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showTaskCreator, setShowTaskCreator] = useState(false);
  const [showDependencyEditor, setShowDependencyEditor] = useState(false);
  const [dependencyEditTask, setDependencyEditTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [reorderTask, setReorderTask] = useState<{ id: string; initialIndex: number; currentY: number; descendantIds: string[] } | null>(null);
  const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; task: Task | null } | null>(null);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(1);
  const [baselines, setBaselines] = useState<Map<string, Baseline>>(new Map());
  const [showBaselines, setShowBaselines] = useState(false);
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

  const ganttConfig: GanttConfig = {
    columns: defaultColumns,
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
    baselines: showBaselines,
    weekends: true,
    holidays: [],
    theme: currentTheme,
    locale: 'en',
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
          let newParentId: string | undefined = dropIndicator.position === 'inside' ? targetTask.id : targetTask.parent;
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

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reorderTask) {
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
    }
  };

  const handleMouseUp = () => {
    if (reorderTask) handleTaskDragEnd();
  };

  const handleCreateTask = (newTaskData: Omit<Task, 'id'>) => {
    const newTask: Task = { ...newTaskData, id: `task-${Date.now()}` };
    createTaskWithHistory(newTask);
    if (onTaskCreate) onTaskCreate(newTask);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    updateTask(updatedTask);
    if (onTaskUpdate) onTaskUpdate(updatedTask);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTaskWithHistory(taskId);
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

  const toggleBaselines = () => {
    if (!showBaselines && baselines.size === 0) {
      const newBaselines = createBaseline(tasks);
      setBaselines(newBaselines);
      setShowBaselines(true);
    } else setShowBaselines(!showBaselines);
  };

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


  return (
    <div className={`gantt-page-wrapper theme-${currentTheme}`}>
      <div className="gantt-page-header">
        <div className="gantt-page-header-left"><h1 className="gantt-page-title">Iris Gantt</h1></div>
      </div>

      <div className={`gantt-container theme-${ganttConfig.theme}`}>
        <Toolbar
          zoomLevel={zoomLevel}
          setZoomLevel={setZoomLevel}
          onBaselineToggle={toggleBaselines}
          showBaselines={showBaselines}
          onExport={(type) => {
            if (type === 'csv') ExportUtils.exportToCSV(tasks);
            if (type === 'excel') ExportUtils.exportToExcel(tasks);
            if (type === 'json') ExportUtils.exportToJSON(tasks, links);
            if (type === 'pdf') ExportUtils.exportToPDF(tasks);
          }}
          onFilterChange={(f: FilterOptions) => setFilters(f)}
          owners={owners}
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
            onAddTask={() => setShowTaskCreator(true)}
            dropIndicator={dropIndicator}
            reorderTask={reorderTask}
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
            baselines={showBaselines ? baselines : new Map()}
          />
        </div>

        {showTaskCreator && <TaskCreator onCreateTask={handleCreateTask} onClose={() => setShowTaskCreator(false)} />}
        {editingTask && <TaskEditor task={editingTask} onUpdate={handleUpdateTask} onDelete={handleDeleteTask} onClose={() => setEditingTask(null)} />}
        {showDependencyEditor && dependencyEditTask && (
          <DependencyEditor
            task={dependencyEditTask}
            allTasks={tasks}
            links={links}
            onAddDependency={handleAddDependency}
            onRemoveDependency={handleRemoveDependency}
            onClose={() => { setShowDependencyEditor(false); setDependencyEditTask(null); }}
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
                    default: return (task as any)[column.name] || '';
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
