import { Gantt } from '../components/Gantt/Gantt';
import type { Task } from '../components/types';

export default {
  title: 'Gantt/Summary Tasks Auto Progress',
  component: Gantt,
  parameters: {
    layout: 'fullscreen',
    badges: ['PRO'],
  },
  tags: ['autodocs'],
};


const tasks: Task[] = [
  {
    id: '1',
    text: 'Project planning',
    start: new Date(2026, 3, 2),
    end: new Date(2026, 3, 16),
    duration: 14,
    progress: 85, // Auto-calculated from children
    type: 'project',
    color: '#26A69A',
    open: true,
  },
  {
    id: '1.1',
    parent: '1',
    text: 'Marketing analysis',
    start: new Date(2026, 3, 2),
    end: new Date(2026, 3, 5),
    duration: 3,
    progress: 100,
    color: '#42A5F5',
  },
  {
    id: '1.2',
    parent: '1',
    text: 'Discussions',
    start: new Date(2026, 3, 5),
    end: new Date(2026, 3, 10),
    duration: 5,
    progress: 80,
    color: '#42A5F5',
  },
  {
    id: '1.3',
    parent: '1',
    text: 'Documentation',
    start: new Date(2026, 3, 10),
    end: new Date(2026, 3, 16),
    duration: 6,
    progress: 75,
    color: '#42A5F5',
  },
];

/**
 * Summary Tasks with Auto Progress
 * 
 * Parent/summary tasks automatically calculate their progress
 * based on the weighted average of their child tasks.
 * 
 * Progress = (Σ(child.progress * child.duration)) / Σ(child.duration)
 * 
 * In this example, the "Project planning" task's progress is
 * automatically calculated from its three subtasks.
 */
export const Default = {
  args: {
    tasks: tasks,
    config: {
      weekends: true,
      theme: 'light',
    },
  },
};
