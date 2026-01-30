import type { Task, Link } from '../types';

export interface CriticalPathResult {
  criticalTasks: Set<string>;
  taskFloats: Map<string, number>;
  projectDuration: number;
}

export const calculateCriticalPath = (tasks: Task[], links: Link[]): CriticalPathResult => {
  const criticalTasks = new Set<string>();
  const taskFloats = new Map<string, number>();

  // Build dependency graph
  const graph = new Map<string, string[]>();
  const reverseGraph = new Map<string, string[]>();

  tasks.forEach(task => {
    graph.set(task.id, []);
    reverseGraph.set(task.id, []);
  });

  links.forEach(link => {
    if (link.type === 'e2s') {
      graph.get(link.source)?.push(link.target);
      reverseGraph.get(link.target)?.push(link.source);
    }
  });

  // Calculate Early Start (ES) and Early Finish (EF) - Forward pass
  const earlyStart = new Map<string, number>();
  const earlyFinish = new Map<string, number>();

  const calculateEarlyDates = (taskId: string, visited: Set<string> = new Set()): void => {
    if (visited.has(taskId)) return;
    visited.add(taskId);

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const predecessors = reverseGraph.get(taskId) || [];

    if (predecessors.length === 0) {
      // No predecessors - start at day 0
      earlyStart.set(taskId, 0);
      earlyFinish.set(taskId, task.duration);
    } else {
      // Calculate based on predecessors
      let maxEF = 0;
      predecessors.forEach(predId => {
        calculateEarlyDates(predId, visited);
        const predEF = earlyFinish.get(predId) || 0;
        maxEF = Math.max(maxEF, predEF);
      });
      earlyStart.set(taskId, maxEF);
      earlyFinish.set(taskId, maxEF + task.duration);
    }
  };

  tasks.forEach(task => calculateEarlyDates(task.id));

  // Calculate Late Start (LS) and Late Finish (LF) - Backward pass
  const lateStart = new Map<string, number>();
  const lateFinish = new Map<string, number>();

  // Find project end date
  const projectEnd = Math.max(...Array.from(earlyFinish.values()));

  const calculateLateDates = (taskId: string, visited: Set<string> = new Set()): void => {
    if (visited.has(taskId)) return;
    visited.add(taskId);

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const successors = graph.get(taskId) || [];

    if (successors.length === 0) {
      // No successors - must finish by project end
      lateFinish.set(taskId, projectEnd);
      lateStart.set(taskId, projectEnd - task.duration);
    } else {
      // Calculate based on successors
      let minLS = Infinity;
      successors.forEach(succId => {
        calculateLateDates(succId, visited);
        const succLS = lateStart.get(succId) || 0;
        minLS = Math.min(minLS, succLS);
      });
      lateFinish.set(taskId, minLS);
      lateStart.set(taskId, minLS - task.duration);
    }
  };

  tasks.forEach(task => calculateLateDates(task.id));

  // Calculate float and identify critical tasks
  tasks.forEach(task => {
    const es = earlyStart.get(task.id) || 0;
    const ls = lateStart.get(task.id) || 0;
    const float = ls - es;

    taskFloats.set(task.id, float);

    // Task is critical if float is 0 (or very close to 0)
    if (Math.abs(float) < 0.01) {
      criticalTasks.add(task.id);
    }
  });

  return {
    criticalTasks,
    taskFloats,
    projectDuration: projectEnd,
  };
};

export const isCriticalTask = (taskId: string, criticalPath: CriticalPathResult): boolean => {
  return criticalPath.criticalTasks.has(taskId);
};

export const getTaskFloat = (taskId: string, criticalPath: CriticalPathResult): number => {
  return criticalPath.taskFloats.get(taskId) || 0;
};
