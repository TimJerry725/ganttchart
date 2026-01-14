import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gantt } from '../components';
import type { Task } from '../components/types';
import '../components/gantt.css';

const meta = {
  title: 'Gantt/Split tasks (PRO)',
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
    text: 'Development (Split Task)',
    start: new Date(2026, 3, 16),
    end: new Date(2026, 4, 15),
    duration: 29,
    progress: 60,
    color: '#42A5F5',
    details: 'Task with interruptions - work periods separated by gaps',
  },
];

/**
 * Split Tasks
 * 
 * Tasks that are interrupted or have gaps in their execution.
 * Useful for representing work that happens in multiple phases
 * or is paused and resumed.
 * 
 * Example: A task starting April 16, paused for a week, 
 * then resuming May 1.
 */
export const Default: Story = {
  args: {
    tasks,
    config: {
      weekends: true,
      theme: 'light',
    },
  },
};
