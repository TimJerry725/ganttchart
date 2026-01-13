/**
 * Main React Gantt component
 */

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { GanttModel } from '@gantt/core';
import { Scheduler } from '@gantt/core';
import { LayoutEngine } from '@gantt/renderer';
import { GridRenderer } from '@gantt/renderer';
import { TimelineRenderer } from '@gantt/renderer';
import { VirtualizationManager } from '@gantt/renderer';
import type { GanttProps, TaskId } from './types';
import type { Task, Link } from '@gantt/core';
import type { TimeScale, Viewport, GridColumn } from '@gantt/renderer';

const DEFAULT_COLUMNS: GridColumn[] = [
  { id: 'name', label: 'Task Name', width: 200, field: 'name' },
  { id: 'start', label: 'Start', width: 100, field: 'start' },
  { id: 'end', label: 'End', width: 100, field: 'end' },
  { id: 'duration', label: 'Duration', width: 80, field: 'duration' },
  { id: 'progress', label: 'Progress', width: 80, field: 'progress' },
];

const DEFAULT_TIME_SCALE: TimeScale = {
  unit: 'day',
  pixelsPerUnit: 20,
  startDate: new Date(),
  endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
};

export const Gantt: React.FC<GanttProps> = (props) => {
  const {
    tasks,
    links = [],
    calendars = [],
    resources = [],
    columns = DEFAULT_COLUMNS,
    timeScale: timeScaleConfig,
    rowHeight = 40,
    barHeight = 24,
    selectedTaskIds = [],
    expandedTaskIds = [],
    viewport: viewportConfig,
    onTaskClick,
    onTaskDoubleClick,
    onTaskSelect,
    onTaskAdd,
    onTaskUpdate,
    onTaskRemove,
    onLinkAdd,
    onLinkUpdate,
    onLinkRemove,
    onViewportChange,
    onZoomChange,
    className,
    style,
    height = 600,
    width = 1200,
  } = props;
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);
  const timelineCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [model] = useState(() => {
    const m = new GanttModel();
    m.loadProject({ tasks, links, calendars, resources });
    return m;
  });

  const [scheduler] = useState(() => new Scheduler(model));
  const [layoutEngine] = useState(() => new LayoutEngine());
  const [gridRenderer] = useState(() => new GridRenderer());
  const [timelineRenderer] = useState(() => new TimelineRenderer());
  const [virtualizationManager] = useState(() => new VirtualizationManager());

  const [viewport, setViewport] = useState<Viewport>(() => ({
    x: viewportConfig?.x || 0,
    y: viewportConfig?.y || 0,
    width: viewportConfig?.width || width,
    height: viewportConfig?.height || height,
  }));

  const [timeScale, setTimeScale] = useState<TimeScale>(() => ({
    ...DEFAULT_TIME_SCALE,
    ...timeScaleConfig,
  }));

  // Update model when props change
  useEffect(() => {
    model.loadProject({ tasks, links, calendars, resources });
  }, [model, tasks, links, calendars, resources]);

  // Calculate layout
  const scheduledTasks = useMemo(() => {
    return scheduler.schedule();
  }, [scheduler, tasks, links]);

  const layout = useMemo(() => {
    const expandedSet = new Set(expandedTaskIds);
    return layoutEngine.calculateLayout(
      tasks,
      links,
      scheduledTasks,
      timeScale,
      viewport,
      expandedSet
    );
  }, [layoutEngine, tasks, links, scheduledTasks, timeScale, viewport, expandedTaskIds]);

  // Setup renderers
  useEffect(() => {
    if (gridCanvasRef.current) {
      gridCanvasRef.current.width = columns.reduce((sum, col) => sum + col.width, 0);
      gridCanvasRef.current.height = layout.totalHeight;
      gridRenderer.setCanvas(gridCanvasRef.current);
    }
  }, [gridRenderer, columns, layout.totalHeight]);

  useEffect(() => {
    if (timelineCanvasRef.current) {
      timelineCanvasRef.current.width = width - columns.reduce((sum, col) => sum + col.width, 0);
      timelineCanvasRef.current.height = layout.totalHeight;
      timelineRenderer.setCanvas(timelineCanvasRef.current);
    }
  }, [timelineRenderer, width, columns, layout.totalHeight]);

  // Render
  useEffect(() => {
    if (gridCanvasRef.current && timelineCanvasRef.current) {
      const selectedSet = new Set(selectedTaskIds);

      gridRenderer.render({
        columns,
        tasks,
        rows: layout.rows,
        selectedTaskIds: selectedSet,
        viewport,
        onTaskClick,
        onTaskSelect: (taskId, multi) => {
          if (onTaskSelect) {
            if (multi) {
              const newSelection = selectedSet.has(taskId)
                ? Array.from(selectedSet).filter((id) => id !== taskId)
                : [...Array.from(selectedSet), taskId];
              onTaskSelect(newSelection);
            } else {
              onTaskSelect([taskId]);
            }
          }
        },
      });

      const criticalPath = new Set(
        Array.from(scheduledTasks.values())
          .filter((task) => task.isCritical)
          .map((task) => task.id)
      );

      timelineRenderer.render({
        tasks,
        bars: layout.bars,
        links: layout.links,
        timeScale,
        viewport,
        criticalPath,
      });
    }
  }, [
    gridRenderer,
    timelineRenderer,
    columns,
    tasks,
    layout,
    selectedTaskIds,
    viewport,
    timeScale,
    scheduledTasks,
    onTaskClick,
    onTaskSelect,
  ]);

  // Handle canvas clicks
  const handleGridClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = gridCanvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top + viewport.y;

      const hit = gridRenderer.hitTest(x, y, layout.rows, viewport);
      if (hit.type === 'task' && hit.taskId) {
        onTaskClick?.(hit.taskId);
      }
    },
    [gridRenderer, layout.rows, viewport, onTaskClick]
  );

  const handleTimelineClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = timelineCanvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left + viewport.x;
      const y = e.clientY - rect.top + viewport.y;

      const hit = timelineRenderer.hitTest(x, y, layout.bars, viewport);
      if (hit.type === 'bar' && hit.taskId) {
        onTaskClick?.(hit.taskId);
      }
    },
    [timelineRenderer, layout.bars, viewport, onTaskClick]
  );

  // Handle scroll
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      const newViewport = {
        ...viewport,
        x: target.scrollLeft,
        y: target.scrollTop,
      };
      setViewport(newViewport);
      onViewportChange?.(newViewport);
    },
    [viewport, onViewportChange]
  );

  const gridWidth = columns.reduce((sum, col) => sum + col.width, 0);
  const timelineWidth = width - gridWidth;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width,
        height,
        overflow: 'auto',
        ...style,
      }}
      onScroll={handleScroll}
    >
      <div style={{ display: 'flex', position: 'relative' }}>
        {/* Grid */}
        <div
          style={{
            position: 'sticky',
            left: 0,
            zIndex: 10,
            backgroundColor: '#fff',
          }}
        >
          <canvas ref={gridCanvasRef} style={{ display: 'block' }} onClick={handleGridClick} />
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>
          <canvas
            ref={timelineCanvasRef}
            style={{ display: 'block' }}
            onClick={handleTimelineClick}
          />
        </div>
      </div>
    </div>
  );
};
