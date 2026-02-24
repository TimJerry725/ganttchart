import { useState, useCallback } from 'react';
import type { Task, TaskDragUpdateMeta } from './types';
import { getDaysBetween, addToDate } from './utils/dateUtils';

export interface DragState {
  taskId: string | null;
  initialX: number;
  initialY: number;
  initialStart: Date;
  initialEnd: Date;
  type: 'move' | 'resize-left' | 'resize-right' | 'reorder' | null;
  dragDeltaX: number;
  dragDeltaY: number;
}

type ScaleUnit = 'day' | 'hour' | 'week' | 'month' | 'quarter' | 'year';

export const useDragDrop = (
  tasks: Task[],
  onTaskUpdate?: (id: string, updates: Partial<Task>, meta?: TaskDragUpdateMeta) => void,
  columnWidth: number = 60,
  unit: ScaleUnit = 'day',
  step: number = 1
) => {
  const [dragState, setDragState] = useState<DragState>({
    taskId: null,
    initialX: 0,
    initialY: 0,
    initialStart: new Date(),
    initialEnd: new Date(),
    type: null,
    dragDeltaX: 0,
    dragDeltaY: 0,
  });

  const handleDragStart = useCallback((
    taskId: string,
    clientX: number,
    clientY: number,
    type: 'move' | 'resize-left' | 'resize-right' | 'reorder'
  ) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setDragState({
      taskId,
      initialX: clientX,
      initialY: clientY,
      initialStart: new Date(task.start),
      initialEnd: new Date(task.end),
      type,
      dragDeltaX: 0,
      dragDeltaY: 0,
    });
  }, [tasks]);

  const handleDrag = useCallback((clientX: number, clientY: number): Task | null => {
    if (!dragState.taskId || !dragState.type) return null;

    const deltaX = clientX - dragState.initialX;
    const deltaY = clientY - dragState.initialY;

    setDragState(prev => ({
      ...prev,
      dragDeltaX: deltaX,
      dragDeltaY: deltaY
    }));

    if (dragState.type === 'reorder') return null;

    const task = tasks.find(t => t.id === dragState.taskId);
    if (!task) return null;

    // Use stepsMoved but allow smooth rendering if needed
    // Iris behavior: real-time update with snapping
    const stepsMoved = Math.round(deltaX / columnWidth);

    let newStart = new Date(dragState.initialStart);
    let newEnd = new Date(dragState.initialEnd);

    switch (dragState.type) {
      case 'move':
        newStart = addToDate(dragState.initialStart, stepsMoved * step, unit);
        newEnd = addToDate(dragState.initialEnd, stepsMoved * step, unit);
        break;

      case 'resize-left':
        newStart = addToDate(dragState.initialStart, stepsMoved * step, unit);
        // Ensure start doesn't go past end
        if (newStart >= newEnd) {
          newStart = addToDate(newEnd, -step, unit);
        }
        break;

      case 'resize-right':
        newEnd = addToDate(dragState.initialEnd, stepsMoved * step, unit);
        // Ensure end doesn't go before start
        if (newEnd <= newStart) {
          newEnd = addToDate(newStart, step, unit);
        }
        break;
    }

    const duration = getDaysBetween(newStart, newEnd);

    return {
      ...task,
      start: newStart,
      end: newEnd,
      duration,
    };
  }, [dragState, tasks, columnWidth, step, unit]);

  const handleDragEnd = useCallback((updatedTask: Task | null) => {
    if (updatedTask && onTaskUpdate) {
      const { id, ...updates } = updatedTask;
      const dragType = dragState.type;
      if (dragType && dragType !== 'reorder') {
        const meta: TaskDragUpdateMeta = {
          dragType,
          previousStart: new Date(dragState.initialStart),
          previousEnd: new Date(dragState.initialEnd),
          previousDuration: getDaysBetween(dragState.initialStart, dragState.initialEnd),
        };
        onTaskUpdate(id, updates, meta);
      } else {
        onTaskUpdate(id, updates);
      }
    }

    setDragState({
      taskId: null,
      initialX: 0,
      initialY: 0,
      initialStart: new Date(),
      initialEnd: new Date(),
      type: null,
      dragDeltaX: 0,
      dragDeltaY: 0,
    });
  }, [onTaskUpdate, dragState]);

  return {
    dragState,
    handleDragStart,
    handleDrag,
    handleDragEnd,
  };
};
