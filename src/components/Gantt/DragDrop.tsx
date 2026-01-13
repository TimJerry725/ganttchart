import { useState, useCallback } from 'react';
import type { Task } from '../types';
import { getDaysBetween, addToDate } from '../utils/dateUtils';

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

export const useDragDrop = (
  tasks: Task[],
  onTaskUpdate?: (task: Task) => void,
  columnWidth: number = 60,
  unit: string = 'day',
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
    // SVAR behavior: real-time update with snapping
    const stepsMoved = Math.round(deltaX / columnWidth);

    let newStart = new Date(dragState.initialStart);
    let newEnd = new Date(dragState.initialEnd);

    switch (dragState.type) {
      case 'move':
        newStart = addToDate(dragState.initialStart, stepsMoved * step, unit as any);
        newEnd = addToDate(dragState.initialEnd, stepsMoved * step, unit as any);
        break;

      case 'resize-left':
        newStart = addToDate(dragState.initialStart, stepsMoved * step, unit as any);
        // Ensure start doesn't go past end
        if (newStart >= newEnd) {
          newStart = addToDate(newEnd, -step, unit as any);
        }
        break;

      case 'resize-right':
        newEnd = addToDate(dragState.initialEnd, stepsMoved * step, unit as any);
        // Ensure end doesn't go before start
        if (newEnd <= newStart) {
          newEnd = addToDate(newStart, step, unit as any);
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
  }, [dragState, tasks, columnWidth]);

  const handleDragEnd = useCallback((updatedTask: Task | null) => {
    if (updatedTask && onTaskUpdate) {
      onTaskUpdate(updatedTask);
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
  }, [onTaskUpdate]);

  return {
    dragState,
    handleDragStart,
    handleDrag,
    handleDragEnd,
  };
};
