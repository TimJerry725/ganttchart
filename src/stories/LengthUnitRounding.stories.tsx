import { Gantt } from '../components/Gantt/Gantt';
import type { Task } from '../components/types';

export default {
  title: 'Gantt/Length Unit (rounding)',
  component: Gantt,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};


const tasks: Task[] = [
  {
    id: '1',
    text: 'Task 1 (2.3 days)',
    start: new Date(2026, 3, 2, 9, 0),
    end: new Date(2026, 3, 4, 16, 0),
    duration: 2.3,
    progress: 100,
    color: '#26A69A',
  },
  {
    id: '2',
    text: 'Task 2 (5.7 days)',
    start: new Date(2026, 3, 4, 16, 0),
    end: new Date(2026, 3, 10, 14, 0),
    duration: 5.7,
    progress: 60,
    color: '#42A5F5',
  },
  {
    id: '3',
    text: 'Task 3 (3.5 days)',
    start: new Date(2026, 3, 10, 14, 0),
    end: new Date(2026, 3, 14, 2, 0),
    duration: 3.5,
    progress: 30,
    color: '#FF7043',
  },
];

/**
 * Length Unit Rounding
 * 
 * Controls how fractional durations are displayed:
 * - Exact: Shows precise decimal values (2.3 days, 5.7 days)
 * - Rounded up: Rounds to next whole number (3 days, 6 days)
 * - Rounded down: Rounds to previous whole number (2 days, 5 days)
 * - Nearest: Rounds to nearest whole number (2 days, 6 days)
 * 
 * Useful when tasks don't align to exact day boundaries.
 */
export const ExactDuration = {
  args: {
    tasks: tasks,
    config: {
      weekends: true,
      theme: 'light',
    },
  },
};

const roundedTasks: Task[] = [
  {
    id: '1',
    text: 'Task 1 (rounded to 2 days)',
    start: new Date(2026, 3, 2),
    end: new Date(2026, 3, 4),
    duration: 2,
    progress: 100,
    color: '#26A69A',
  },
  {
    id: '2',
    text: 'Task 2 (rounded to 6 days)',
    start: new Date(2026, 3, 4),
    end: new Date(2026, 3, 10),
    duration: 6,
    progress: 60,
    color: '#42A5F5',
  },
  {
    id: '3',
    text: 'Task 3 (rounded to 4 days)',
    start: new Date(2026, 3, 10),
    end: new Date(2026, 3, 14),
    duration: 4,
    progress: 30,
    color: '#FF7043',
  },
];

export const RoundedDuration = {
  args: {
    tasks: roundedTasks,
    config: {
      weekends: true,
      theme: 'light',
    },
  },
};
