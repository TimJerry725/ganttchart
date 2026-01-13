/**
 * React hooks for Gantt chart
 */

import { useState, useCallback } from 'react';
import type { Task, TaskId, Link } from '@gantt/core';
import type { TimeScale, Viewport } from '@gantt/renderer';

export function useGanttSelection(initialSelection: TaskId[] = []) {
  const [selectedTaskIds, setSelectedTaskIds] = useState<TaskId[]>(initialSelection);

  const selectTask = useCallback((taskId: TaskId, multi = false) => {
    setSelectedTaskIds((prev) => {
      if (multi) {
        return prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId];
      }
      return [taskId];
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedTaskIds([]);
  }, []);

  return {
    selectedTaskIds,
    selectTask,
    clearSelection,
    setSelectedTaskIds,
  };
}

export function useGanttExpansion(initialExpanded: TaskId[] = []) {
  const [expandedTaskIds, setExpandedTaskIds] = useState<Set<TaskId>>(
    new Set(initialExpanded)
  );

  const toggleExpansion = useCallback((taskId: TaskId) => {
    setExpandedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    // Would need task tree to expand all
    // For now, just a placeholder
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedTaskIds(new Set());
  }, []);

  return {
    expandedTaskIds: Array.from(expandedTaskIds),
    toggleExpansion,
    expandAll,
    collapseAll,
    setExpandedTaskIds: (ids: TaskId[]) => setExpandedTaskIds(new Set(ids)),
  };
}

export function useGanttZoom(initialTimeScale?: Partial<TimeScale>) {
  const [timeScale, setTimeScale] = useState<TimeScale>(() => ({
    unit: 'day',
    pixelsPerUnit: 20,
    startDate: new Date(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    ...initialTimeScale,
  }));

  const zoomIn = useCallback(() => {
    setTimeScale((prev) => ({
      ...prev,
      pixelsPerUnit: Math.min(prev.pixelsPerUnit * 1.5, 200),
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setTimeScale((prev) => ({
      ...prev,
      pixelsPerUnit: Math.max(prev.pixelsPerUnit / 1.5, 5),
    }));
  }, []);

  const setZoom = useCallback((unit: TimeScale['unit'], pixelsPerUnit: number) => {
    setTimeScale((prev) => ({
      ...prev,
      unit,
      pixelsPerUnit,
    }));
  }, []);

  return {
    timeScale,
    zoomIn,
    zoomOut,
    setZoom,
    setTimeScale,
  };
}

export function useGanttViewport(initialViewport?: Partial<Viewport>) {
  const [viewport, setViewport] = useState<Viewport>(() => ({
    x: 0,
    y: 0,
    width: 1200,
    height: 600,
    ...initialViewport,
  }));

  const scrollTo = useCallback((x: number, y: number) => {
    setViewport((prev) => ({ ...prev, x, y }));
  }, []);

  const scrollToTask = useCallback((taskId: TaskId) => {
    // Would need layout to calculate task position
    // Placeholder for now
  }, []);

  return {
    viewport,
    setViewport,
    scrollTo,
    scrollToTask,
  };
}
