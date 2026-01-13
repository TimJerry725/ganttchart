import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gantt } from '../components/Gantt';
import type { Task, Link } from '../components/types';
import '../components/Gantt/gantt.css';

const meta = {
  title: 'Gantt/Start/end dates',
  component: Gantt,
  parameters: {
    layout: 'fullscreen',
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
    type: 'project',
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
  {
    id: '3',
    text: 'Testing',
    start: new Date(2026, 4, 15),
    end: new Date(2026, 5, 1),
    duration: 16,
    progress: 30,
    color: '#FF7043',
  },
];

/**
 * Start and End Dates
 * 
 * Displays task start and end dates in the grid columns.
 * The dates define when each task begins and completes.
 * 
 * Format: MM-DD-YYYY
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
