import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gantt } from '../components/Gantt';
import type { Task } from '../components/types';
import '../components/Gantt/gantt.css';

const meta = {
  title: 'Gantt/Calendar: rules changes (PRO)',
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
 * Calendar Rules Changes
 * 
 * Dynamic calendar rules that can change based on date ranges.
 * Useful for varying work schedules, seasonal changes, or project phases.
 */
export const Default: Story = {
  args: {
    tasks,
    config: {
      weekends: true,
      holidays: [],
      theme: 'light',
    },
  },
};
