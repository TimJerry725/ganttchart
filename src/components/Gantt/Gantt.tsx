import React, { useState, useRef, useEffect } from 'react';
import { Task, Link, GanttConfig, Column, Scale } from '../types';
import { Grid } from './Grid';
import { Timeline } from './Timeline';
import { TaskBar } from './TaskBar';
import { addToDate, getStartOfDay } from '../utils/dateUtils';
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

export const Gantt: React.FC<GanttProps> = ({
  tasks,
  links = [],
  config = {},
  onTaskUpdate,
  onTaskCreate,
  onTaskDelete,
  onLinkCreate,
  onLinkDelete,
}) => {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
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

  // Calculate timeline range
  const getTimelineRange = () => {
    if (tasks.length === 0) {
      const today = new Date();
      return {
        start: getStartOfDay(addToDate(today, -30, 'day')),
        end: getStartOfDay(addToDate(today, 60, 'day')),
      };
    }

    const starts = tasks.map(t => t.start.getTime());
    const ends = tasks.map(t => t.end.getTime());
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

  const handleTaskDragStart = (taskId: string) => {
    if (!ganttConfig.readonly) {
      setDraggedTask(taskId);
    }
  };

  const handleTaskDragEnd = () => {
    setDraggedTask(null);
  };

  return (
    <div className={`gantt-container theme-${ganttConfig.theme}`}>
      <div className="gantt-layout">
        <Grid
          ref={gridRef}
          tasks={tasks}
          columns={ganttConfig.columns!}
          rowHeight={ganttConfig.rowHeight!}
          selectedTask={selectedTask}
          onTaskClick={handleTaskClick}
          onScroll={handleGridScroll}
          onTaskUpdate={onTaskUpdate}
        />
        <Timeline
          ref={timelineRef}
          tasks={tasks}
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
          onTaskUpdate={onTaskUpdate}
          zoomLevel={zoomLevel}
        />
      </div>
      <div className="gantt-toolbar">
        <button onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}>Zoom Out</button>
        <button onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.25))}>Zoom In</button>
        <button onClick={() => setZoomLevel(1)}>Reset Zoom</button>
      </div>
    </div>
  );
};
