/**
 * Iris Gantt - Main React Component
 * Professional Gantt chart component
 */

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { Scheduler } from './engine/scheduler';
import { LayoutEngine } from './render/layout';
import { GridRenderer } from './render/grid-renderer';
import { TimelineRenderer } from './render/timeline-renderer';
import type { IrisGanttProps, TaskId, ColumnConfig, GanttConfig } from './types';

const DEFAULT_CONFIG: GanttConfig = {
  gridWidth: 300,
  rowHeight: 40,
  showGrid: true,
  showTree: true,
  scale: 'day',
  scaleWidth: 20,
  showTodayMarker: true,
  showWeekends: true,
  barHeight: 24,
  barRadius: 4,
  showProgress: true,
  showDependencies: true,
  allowDrag: true,
  allowResize: true,
  allowEdit: true,
  theme: 'light',
};

const DEFAULT_COLUMNS: ColumnConfig[] = [
  { 
    id: 'name', 
    label: 'Task Name', 
    width: 250, 
    field: 'name',
    sortable: true,
  },
  { 
    id: 'start', 
    label: 'Start', 
    width: 120, 
    field: 'start',
    align: 'center',
    sortable: true,
  },
  { 
    id: 'end', 
    label: 'End', 
    width: 120, 
    field: 'end',
    align: 'center',
    sortable: true,
  },
  { 
    id: 'duration', 
    label: 'Duration', 
    width: 100, 
    field: 'duration',
    align: 'center',
    sortable: true,
  },
  { 
    id: 'progress', 
    label: 'Progress', 
    width: 100, 
    field: 'progress',
    align: 'center',
    sortable: true,
    render: (task) => (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${task.progress || 0}%` }}
          />
        </div>
        <span className="text-xs text-gray-600 w-8 text-right">
          {task.progress || 0}%
        </span>
      </div>
    ),
  },
];

export const IrisGantt: React.FC<IrisGanttProps> = (props) => {
  const {
    tasks,
    links = [],
    selection = [],
    viewState: viewStateProp,
    config: configProp,
    columns: columnsProp,
    onTasksChange,
    onLinksChange,
    onSelectionChange,
    onViewStateChange,
    onTaskClick,
    onTaskDoubleClick,
    width = '100%',
    height = 600,
    className,
    style,
    readonly = false,
    loading = false,
    gridCellTemplate,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ x: 0, y: 0, width: 1200, height: 600 });
  const [expandedTasks, setExpandedTasks] = useState<Set<TaskId>>(new Set());
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<TaskId>>(new Set(selection));

  const config = useMemo(() => ({ ...DEFAULT_CONFIG, ...configProp }), [configProp]);
  const columns = useMemo(() => columnsProp || DEFAULT_COLUMNS, [columnsProp]);

  const scheduler = useMemo(() => new Scheduler(tasks, links), [tasks, links]);
  const layoutEngine = useMemo(() => new LayoutEngine(), []);

  const scheduledTasks = useMemo(() => scheduler.schedule(), [scheduler]);
  const criticalPath = useMemo(() => {
    const critical = new Set<TaskId>();
    for (const [taskId, task] of scheduledTasks.entries()) {
      if (task.isCritical) {
        critical.add(taskId);
      }
    }
    return critical;
  }, [scheduledTasks]);

  const timeScale = useMemo(() => {
    const allDates = tasks
      .map((t) => [t.start, t.end])
      .flat()
      .filter((d): d is Date => d !== undefined);
    
    if (allDates.length === 0) {
      return {
        unit: config.scale || 'day',
        pixelsPerUnit: config.scaleWidth || 20,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      };
    }

    const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));
    const days = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));

    return {
      unit: (viewStateProp?.scale || config.scale || 'day') as 'day' | 'week' | 'month' | 'quarter' | 'year',
      pixelsPerUnit: config.scaleWidth || 20,
      startDate: minDate,
      endDate: maxDate,
    };
  }, [tasks, viewStateProp?.scale, config.scale, config.scaleWidth]);

  const layout = useMemo(() => {
    return layoutEngine.calculateLayout(
      tasks,
      scheduledTasks,
      links,
      timeScale,
      expandedTasks
    );
  }, [layoutEngine, tasks, scheduledTasks, links, timeScale, expandedTasks]);

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setViewport((prev) => ({
        ...prev,
        width: rect.width,
        height: rect.height,
      }));
    }
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const newViewport = {
      ...viewport,
      x: target.scrollLeft,
      y: target.scrollTop,
    };
    setViewport(newViewport);
    onViewStateChange?.({
      zoom: 1,
      scrollX: target.scrollLeft,
      scrollY: target.scrollTop,
      scale: timeScale.unit,
    });
  }, [viewport, onViewStateChange, timeScale.unit]);

  const handleTaskClick = useCallback((taskId: TaskId) => {
    if (readonly) return;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    setSelectedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      onSelectionChange?.(Array.from(next));
      return next;
    });

    onTaskClick?.(task);
  }, [readonly, tasks, onSelectionChange, onTaskClick]);

  const handleTaskExpand = useCallback((taskId: TaskId) => {
    setExpandedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  }, []);

  const gridWidth = config.gridWidth || columns.reduce((sum, col) => sum + col.width, 0);
  const timelineWidth = typeof viewport.width === 'number' ? viewport.width - gridWidth : 800;

  if (loading) {
    return (
      <div className="iris-gantt-container iris-gantt-loading" style={{ width, height, ...style }}>
        <div className="iris-gantt-loading-spinner" />
      </div>
    );
  }

  // Calculate total timeline width needed
  const totalTimelineWidth = useMemo(() => {
    if (timeScale.endDate && timeScale.startDate) {
      const days = Math.ceil((timeScale.endDate.getTime() - timeScale.startDate.getTime()) / (1000 * 60 * 60 * 24));
      return days * timeScale.pixelsPerUnit;
    }
    return 2000;
  }, [timeScale]);

  return (
    <div
      ref={containerRef}
      className={`iris-gantt iris-gantt-container iris-gantt-scrollbar ${className || ''}`}
      style={{ width, height, overflow: 'auto', ...style }}
      onScroll={handleScroll}
    >
      <div className="flex" style={{ minWidth: gridWidth + totalTimelineWidth }}>
        <div style={{ width: gridWidth, flexShrink: 0 }}>
          <GridRenderer
            columns={columns}
            tasks={tasks}
            rows={layout.rows}
            selectedTaskIds={selectedTaskIds}
            rowHeight={config.rowHeight}
            onTaskClick={handleTaskClick}
            onTaskExpand={handleTaskExpand}
            gridCellTemplate={gridCellTemplate}
          />
        </div>
        <div className="relative iris-gantt-timeline" style={{ width: totalTimelineWidth, minWidth: timelineWidth }}>
          <TimelineRenderer
            bars={layout.bars}
            links={layout.links}
            timeScale={timeScale}
            viewport={{ ...viewport, width: Math.max(timelineWidth, totalTimelineWidth) }}
            criticalPath={config.showCriticalPath ? criticalPath : undefined}
            showTodayMarker={config.showTodayMarker}
            showWeekends={config.showWeekends}
            barHeight={config.barHeight}
            showProgress={config.showProgress}
          />
        </div>
      </div>
    </div>
  );
};
