import { useState, useCallback } from 'react';
import { Task, Link } from '../types';

export interface HistoryState {
  tasks: Task[];
  links: Link[];
}

export interface HistoryAction {
  type: 'task_update' | 'task_create' | 'task_delete' | 'link_create' | 'link_delete';
  before: HistoryState;
  after: HistoryState;
  timestamp: number;
}

export const useUndoRedo = (initialTasks: Task[], initialLinks: Link[] = []) => {
  const [history, setHistory] = useState<HistoryAction[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [links, setLinks] = useState<Link[]>(initialLinks);

  const saveState = useCallback((
    type: HistoryAction['type'],
    beforeState: HistoryState,
    afterState: HistoryState
  ) => {
    const newAction: HistoryAction = {
      type,
      before: beforeState,
      after: afterState,
      timestamp: Date.now(),
    };

    // Remove any actions after current index (when user undid then made new action)
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newAction);

    // Limit history size to 50 actions
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setCurrentIndex(currentIndex + 1);
    }

    setHistory(newHistory);
  }, [history, currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex < 0) return;

    const action = history[currentIndex];
    setTasks(action.before.tasks);
    setLinks(action.before.links);
    setCurrentIndex(currentIndex - 1);
  }, [history, currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex >= history.length - 1) return;

    const action = history[currentIndex + 1];
    setTasks(action.after.tasks);
    setLinks(action.after.links);
    setCurrentIndex(currentIndex + 1);
  }, [history, currentIndex]);

  const canUndo = currentIndex >= 0;
  const canRedo = currentIndex < history.length - 1;

  const updateTask = useCallback((updatedTask: Task) => {
    const beforeState = { tasks, links };
    const newTasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    const afterState = { tasks: newTasks, links };
    
    saveState('task_update', beforeState, afterState);
    setTasks(newTasks);
  }, [tasks, links, saveState]);

  const createTask = useCallback((newTask: Task) => {
    const beforeState = { tasks, links };
    const newTasks = [...tasks, newTask];
    const afterState = { tasks: newTasks, links };
    
    saveState('task_create', beforeState, afterState);
    setTasks(newTasks);
  }, [tasks, links, saveState]);

  const deleteTask = useCallback((taskId: string) => {
    const beforeState = { tasks, links };
    const newTasks = tasks.filter(t => t.id !== taskId);
    const newLinks = links.filter(l => l.source !== taskId && l.target !== taskId);
    const afterState = { tasks: newTasks, links: newLinks };
    
    saveState('task_delete', beforeState, afterState);
    setTasks(newTasks);
    setLinks(newLinks);
  }, [tasks, links, saveState]);

  return {
    tasks,
    links,
    setTasks,
    setLinks,
    undo,
    redo,
    canUndo,
    canRedo,
    updateTask,
    createTask,
    deleteTask,
    history,
  };
};
