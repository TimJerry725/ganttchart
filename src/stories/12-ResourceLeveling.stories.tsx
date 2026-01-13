import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gantt } from '../components/Gantt';
import type { Task } from '../components/types';
import '../components/Gantt/gantt.css';

const meta = {
  title: 'Gantt/Resource Leveling (PRO)',
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
    text: 'Task 1 - John',
    start: new Date(2026, 3, 1),
    end: new Date(2026, 3, 10),
    duration: 9,
    progress: 50,
    color: '#26A69A',
    owner: 'John Doe',
  },
  {
    id: '2',
    text: 'Task 2 - John (Overlapping!)',
    start: new Date(2026, 3, 5),
    end: new Date(2026, 3, 15),
    duration: 10,
    progress: 30,
    color: '#42A5F5',
    owner: 'John Doe',
  },
  {
    id: '3',
    text: 'Task 3 - John (Overlapping!)',
    start: new Date(2026, 3, 8),
    end: new Date(2026, 3, 18),
    duration: 10,
    progress: 10,
    color: '#FF7043',
    owner: 'John Doe',
  },
  {
    id: '4',
    text: 'Task 4 - Jane',
    start: new Date(2026, 3, 1),
    end: new Date(2026, 3, 10),
    duration: 9,
    progress: 80,
    color: '#9C27B0',
    owner: 'Jane Smith',
  },
];

/**
 * Resource Leveling
 * 
 * Click the "📊 Level Resources" button to automatically adjust
 * task schedules to prevent resource over-allocation.
 * 
 * In this example, John Doe has 3 overlapping tasks.
 * Resource leveling will reschedule them so they don't overlap,
 * preventing John from being assigned to multiple tasks simultaneously.
 * 
 * Jane Smith has only one task, so her schedule won't change.
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
