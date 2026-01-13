import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gantt } from '../components/Gantt';
import type { Task, Link, Baseline } from '../components/types';
import '../components/Gantt/gantt.css';

const meta = {
  title: 'Gantt/Baselines (PRO)',
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
    text: 'On Schedule Task',
    start: new Date(2024, 2, 1),
    end: new Date(2024, 2, 10),
    duration: 9,
    progress: 100,
    color: '#26A69A',
  },
  {
    id: '2',
    text: 'Delayed Task',
    start: new Date(2024, 2, 5),
    end: new Date(2024, 2, 20),
    duration: 15,
    progress: 60,
    color: '#FF7043',
  },
  {
    id: '3',
    text: 'Ahead of Schedule',
    start: new Date(2024, 2, 15),
    end: new Date(2024, 2, 22),
    duration: 7,
    progress: 90,
    color: '#42A5F5',
  },
];

const baselines = new Map<string, Baseline>([
  ['1', { taskId: '1', start: new Date(2024, 2, 1), end: new Date(2024, 2, 10) }],
  ['2', { taskId: '2', start: new Date(2024, 2, 5), end: new Date(2024, 2, 15) }],
  ['3', { taskId: '3', start: new Date(2024, 2, 18), end: new Date(2024, 2, 28) }],
]);

/**
 * Baselines - Track Variance
 * 
 * Shows the original planned schedule (baseline) vs actual schedule.
 * Gray bars below tasks indicate the baseline plan.
 * 
 * Use the "📍 Set Baseline" button to create a baseline snapshot.
 */
export const WithBaselines: Story = {
  args: {
    tasks,
    config: {
      weekends: true,
      theme: 'light',
      baselines: true,
    },
  },
};

/**
 * Dark Theme with Baselines
 */
export const DarkThemeBaselines: Story = {
  args: {
    tasks,
    config: {
      weekends: true,
      theme: 'dark',
      baselines: true,
    },
  },
};
