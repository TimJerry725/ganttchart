import { Gantt } from '../components/Gantt/Gantt';
import type { Task, Scale } from '../components/types';

export default {
  title: 'Gantt/Custom Minimal Scale Unit',
  component: Gantt,
  parameters: {
    layout: 'fullscreen',
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
    progress: 100,
    color: '#26A69A',
  },
  {
    id: '2',
    text: 'Development',
    start: new Date(2026, 3, 16),
    end: new Date(2026, 4, 15),
    duration: 29,
    progress: 60,
    color: '#42A5F5',
  },
];

/**
 * Custom Minimal Scale Unit
 * 
 * Sets the minimum time unit displayed on the timeline.
 * Prevents zooming below this granularity level.
 */
export const MinimalDay = {
  args: {
    tasks: tasks,
    config: {
      scales: [
        { unit: 'month', step: 1, format: 'MMMM' },
        { unit: 'day', step: 1, format: 'D' },
      ] as Scale[],
      minColumnWidth: 40,
      weekends: true,
      theme: 'light',
    },
  },
};
