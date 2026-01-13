/**
 * Iris Gantt - Main React Component
 */

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { TaskModel } from './model/task';
import { LinkModel } from './model/link';
import { Scheduler } from './engine/scheduler';
import { LayoutEngine } from './render/layout';
import { GridRenderer } from './render/grid-renderer';
import { TimelineRenderer } from './render/timeline-renderer';
import { VirtualizationManager } from './virtual/virtualization';
import type { IrisGanttProps, TaskId, ViewState } from './types';
import type { GridColumn } from './render/grid-renderer';

const DEFAULT_COLUMNS: GridColumn[] = [
  { id: 'name', label: 'Task Name', width: 200, field: 'name' },
  { id: 'start', label: 'Start', width: 100, field: 'start' },
  { id: 'end', label: 'End', width: 100, field: 'end' },
  { id: 'duration', label: 'Duration', width: 80, field: 'duration' },
  { id: 'progress', label: 'Progress', width: 80, field: 'progress' },
];

export const IrisGantt: React.FC<IrisGanttProps> = (props) => {
  const {
    tasks,
    links = [],
    selection = [],
    viewState: viewStateProp,
    onTasksChange,
    onLinksChange,
    onSelectionChange,
    onViewStateChange,
    width = '100%',
    height = 600,
    className,
    readonly = false,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ x: 0, y: 0, width: 1200, height: 600 });
  const [expandedTasks, setExpandedTasks] = useState<Set<TaskId>>(new Set());
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<TaskId>>(new Set(selection));

  const taskModel = useMemo(() => new TaskModel(tasks), [tasks]);
  const linkModel = useMemo(() => new LinkModel(links), [links]);
  const scheduler = useMemo(() => new Scheduler(tasks, links), [tasks, links]);
  const layoutEngine = useMemo(() => new LayoutEngine(), []);
  const virtualizationManager = useMemo(() => new VirtualizationManager(), []);

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
        unit: 'day' as const,
        pixelsPerUnit: 20,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      };
    }

    const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));
    const days = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));

    return {
      unit: (viewStateProp?.scale || 'day') as 'day' | 'week' | 'month' | 'quarter' | 'year',
      pixelsPerUnit: 20,
      startDate: minDate,
      endDate: maxDate,
    };
  }, [tasks, viewStateProp?.scale]);

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
  }, [viewport]);

  const handleTaskClick = useCallback((taskId: TaskId) => {
    if (readonly) return;
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
  }, [readonly, onSelectionChange]);

  const gridWidth = DEFAULT_COLUMNS.reduce((sum, col) => sum + col.width, 0);
  const timelineWidth = typeof viewport.width === 'number' ? viewport.width - gridWidth : 800;

  return (
    <div
      ref={containerRef}
      className={`iris-gantt ${className || ''}`}
      style={{ width, height, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div className="flex" style={{ width: Math.max(viewport.width, timelineWidth + gridWidth) }}>
        <GridRenderer
          columns={DEFAULT_COLUMNS}
          tasks={tasks}
          rows={layout.rows}
          selectedTaskIds={selectedTaskIds}
          onTaskClick={handleTaskClick}
        />
        <div className="flex-1 relative" style={{ width: timelineWidth }}>
          <TimelineRenderer
            tasks={tasks}
            bars={layout.bars}
            links={layout.links}
            timeScale={timeScale}
            viewport={{ ...viewport, width: timelineWidth }}
            criticalPath={criticalPath}
            onBarClick={handleTaskClick}
          />
        </div>
      </div>
    </div>
  );
};
