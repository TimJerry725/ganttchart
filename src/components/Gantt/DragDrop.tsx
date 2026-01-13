import { useState, useCallback } from 'react';
import { Task } from '../types';
import { getDaysBetween, addToDate } from '../utils/dateUtils';

export interface DragState {
  taskId: string | null;
  initialX: number;
  initialStart: Date;
  initialEnd: Date;
  type: 'move' | 'resize-left' | 'resize-right' | null;
}

export const useDragDrop = (
  tasks: Task[],
  onTaskUpdate?: (task: Task) => void,
  columnWidth: number = 60,
  timelineStart: Date = new Date()
) => {
  const [dragState, setDragState] = useState<DragState>({
    taskId: null,
    initialX: 0,
    initialStart: new Date(),
    initialEnd: new Date(),
    type: null,
  });

  const handleDragStart = useCallback((
    taskId: string,
    clientX: number,
    type: 'move' | 'resize-left' | 'resize-right'
  ) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setDragState({
      taskId,
      initialX: clientX,
      initialStart: new Date(task.start),
      initialEnd: new Date(task.end),
      type,
    });
  }, [tasks]);

  const handleDrag = useCallback((clientX: number): Task | null => {
    if (!dragState.taskId || !dragState.type) return null;

    const task = tasks.find(t => t.id === dragState.taskId);
    if (!task) return null;

    const deltaX = clientX - dragState.initialX;
    const daysMoved = Math.round(deltaX / columnWidth);

    let newStart = new Date(dragState.initialStart);
    let newEnd = new Date(dragState.initialEnd);

    switch (dragState.type) {
      case 'move':
        newStart = addToDate(dragState.initialStart, daysMoved, 'day');
        newEnd = addToDate(dragState.initialEnd, daysMoved, 'day');
        break;
      
      case 'resize-left':
        newStart = addToDate(dragState.initialStart, daysMoved, 'day');
        // Ensure start doesn't go past end
        if (newStart >= newEnd) {
          newStart = addToDate(newEnd, -1, 'day');
        }
        break;
      
      case 'resize-right':
        newEnd = addToDate(dragState.initialEnd, daysMoved, 'day');
        // Ensure end doesn't go before start
        if (newEnd <= newStart) {
          newEnd = addToDate(newStart, 1, 'day');
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
      initialStart: new Date(),
      initialEnd: new Date(),
      type: null,
    });
  }, [onTaskUpdate]);

  return {
    dragState,
    handleDragStart,
    handleDrag,
    handleDragEnd,
  };
};
