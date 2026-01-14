import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gantt } from '../components';
import type { Task, Link } from '../components/types';
import '../components/gantt.css';

const meta = {
  title: 'Gantt/Auto-Scheduling (PRO)',
  component: Gantt,
  parameters: {
    layout: 'fullscreen',
    badges: ['PRO'],
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Gantt>;

export default meta;
type Story = StoryObj<typeof meta>;

const tasks: Task[] = [
  {
    id: '1',
    text: 'Task 1',
    start: new Date(2026, 3, 1),
    end: new Date(2026, 3, 10),
    duration: 9,
    progress: 100,
    color: '#26A69A',
  },
  {
    id: '2',
    text: 'Task 2 (depends on Task 1)',
    start: new Date(2026, 3, 5), // Will be auto-adjusted
    end: new Date(2026, 3, 15),
    duration: 10,
    progress: 50,
    color: '#42A5F5',
  },
  {
    id: '3',
    text: 'Task 3 (depends on Task 2)',
    start: new Date(2026, 3, 10), // Will be auto-adjusted
    end: new Date(2026, 3, 20),
    duration: 10,
    progress: 20,
    color: '#FF7043',
  },
];

const links: Link[] = [
  { id: 'l1', source: '1', target: '2', type: 'e2s' },
  { id: 'l2', source: '2', target: '3', type: 'e2s' },
];

/**
 * Auto-Scheduling
 * 
 * Click the "⚡ Auto-Schedule" button to automatically adjust
 * task dates based on their dependencies.
 * 
 * This ensures all tasks respect their dependency constraints:
 * - Task 2 will start after Task 1 ends
 * - Task 3 will start after Task 2 ends
 * 
 * Useful when you've changed dates and need to propagate changes.
 */
export const Default: Story = {
  args: {
    tasks,
    links,
    config: {
      weekends: true,
      theme: 'light',
    },
  },
};
