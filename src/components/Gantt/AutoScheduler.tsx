import type { Task, Link } from '../types';
import { addToDate, getDaysBetween } from '../utils/dateUtils';

export interface ScheduleOptions {
  mode: 'forward' | 'backward';
  projectStart?: Date;
  projectEnd?: Date;
  respectConstraints?: boolean;
}

export const autoSchedule = (
  tasks: Task[],
  links: Link[],
  options: ScheduleOptions = { mode: 'forward' }
): Task[] => {
  const scheduledTasks = new Map<string, Task>();
  const processed = new Set<string>();
  
  // Build dependency graph
  const dependencies = new Map<string, string[]>();
  const reverseDependencies = new Map<string, string[]>();
  
  tasks.forEach(task => {
    dependencies.set(task.id, []);
    reverseDependencies.set(task.id, []);
  });
  
  links.forEach(link => {
    if (link.type === 'e2s') {
      dependencies.get(link.target)?.push(link.source);
      reverseDependencies.get(link.source)?.push(link.target);
    }
  });
  
  if (options.mode === 'forward') {
    return forwardSchedule(tasks, dependencies, options);
  } else {
    return backwardSchedule(tasks, reverseDependencies, options);
  }
};

const forwardSchedule = (
  tasks: Task[],
  dependencies: Map<string, string[]>,
  options: ScheduleOptions
): Task[] => {
  const scheduledTasks = new Map<string, Task>();
  const processed = new Set<string>();
  
  const projectStart = options.projectStart || new Date();
  
  const scheduleTask = (taskId: string): void => {
    if (processed.has(taskId)) return;
    
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const deps = dependencies.get(taskId) || [];
    
    // Schedule all dependencies first
    deps.forEach(depId => scheduleTask(depId));
    
    // Find the latest end date of all dependencies
    let earliestStart = projectStart;
    
    deps.forEach(depId => {
      const depTask = scheduledTasks.get(depId);
      if (depTask && depTask.end > earliestStart) {
        earliestStart = new Date(depTask.end);
      }
    });
    
    // Schedule this task
    const newStart = new Date(earliestStart);
    const newEnd = addToDate(newStart, task.duration, 'day');
    
    const scheduledTask: Task = {
      ...task,
      start: newStart,
      end: newEnd,
    };
    
    scheduledTasks.set(taskId, scheduledTask);
    processed.add(taskId);
  };
  
  // Schedule all tasks
  tasks.forEach(task => scheduleTask(task.id));
  
  // Return scheduled tasks in original order
  return tasks.map(task => scheduledTasks.get(task.id) || task);
};

const backwardSchedule = (
  tasks: Task[],
  reverseDependencies: Map<string, string[]>,
  options: ScheduleOptions
): Task[] => {
  const scheduledTasks = new Map<string, Task>();
  const processed = new Set<string>();
  
  const projectEnd = options.projectEnd || new Date(
    Math.max(...tasks.map(t => t.end.getTime()))
  );
  
  const scheduleTask = (taskId: string): void => {
    if (processed.has(taskId)) return;
    
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const successors = reverseDependencies.get(taskId) || [];
    
    // Schedule all successors first
    successors.forEach(succId => scheduleTask(succId));
    
    // Find the earliest start date of all successors
    let latestEnd = projectEnd;
    
    successors.forEach(succId => {
      const succTask = scheduledTasks.get(succId);
      if (succTask && succTask.start < latestEnd) {
        latestEnd = new Date(succTask.start);
      }
    });
    
    // Schedule this task
    const newEnd = new Date(latestEnd);
    const newStart = addToDate(newEnd, -task.duration, 'day');
    
    const scheduledTask: Task = {
      ...task,
      start: newStart,
      end: newEnd,
    };
    
    scheduledTasks.set(taskId, scheduledTask);
    processed.add(taskId);
  };
  
  // Schedule all tasks
  tasks.forEach(task => scheduleTask(task.id));
  
  // Return scheduled tasks in original order
  return tasks.map(task => scheduledTasks.get(task.id) || task);
};

// Level resources - distribute tasks to avoid overallocation
export const levelResources = (tasks: Task[]): Task[] => {
  // Group tasks by owner
  const tasksByOwner = new Map<string, Task[]>();
  
  tasks.forEach(task => {
    if (task.owner) {
      if (!tasksByOwner.has(task.owner)) {
        tasksByOwner.set(task.owner, []);
      }
      tasksByOwner.get(task.owner)!.push(task);
    }
  });
  
  const leveledTasks = [...tasks];
  
  // For each owner, check for overlapping tasks
  tasksByOwner.forEach((ownerTasks, owner) => {
    const sorted = ownerTasks.sort((a, b) => a.start.getTime() - b.start.getTime());
    
    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      const previous = sorted[i - 1];
      
      // If tasks overlap, move current task to start after previous
      if (current.start < previous.end) {
        const taskIndex = leveledTasks.findIndex(t => t.id === current.id);
        if (taskIndex >= 0) {
          const newStart = new Date(previous.end);
          const newEnd = addToDate(newStart, current.duration, 'day');
          
          leveledTasks[taskIndex] = {
            ...current,
            start: newStart,
            end: newEnd,
          };
        }
      }
    }
  });
  
  return leveledTasks;
};
