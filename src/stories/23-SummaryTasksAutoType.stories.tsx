import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gantt } from '../components/Gantt';
import type { Task } from '../components/types';
import '../components/Gantt/gantt.css';

const meta = {
  title: 'Gantt/Summary tasks: auto type (PRO)',
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
    text: 'Project Phase (Auto-detected as Summary)',
    start: new Date(2026, 3, 2),
    end: new Date(2026, 3, 16),
    duration: 14,
    progress: 85,
    type: 'project', // Automatically set based on children
    color: '#26A69A',
    open: true,
  },
  {
    id: '1.1',
    parent: '1',
    text: 'Subtask 1',
    start: new Date(2026, 3, 2),
    end: new Date(2026, 3, 5),
    duration: 3,
    progress: 100,
    color: '#42A5F5',
  },
  {
    id: '1.2',
    parent: '1',
    text: 'Subtask 2',
    start: new Date(2026, 3, 5),
    end: new Date(2026, 3, 10),
    duration: 5,
    progress: 80,
    color: '#42A5F5',
  },
  {
    id: '2',
    text: 'Regular Task (No Children)',
    start: new Date(2026, 3, 16),
    end: new Date(2026, 3, 25),
    duration: 9,
    progress: 60,
    type: 'task', // Regular task without children
    color: '#42A5F5',
  },
];

/**
 * Summary Tasks with Auto Type
 * 
 * Tasks are automatically classified based on their structure:
 * - Tasks WITH children → type='project' (summary/parent task)
 * - Tasks WITHOUT children → type='task' (regular task)
 * 
 * The visual representation (bar style, color) adjusts accordingly.
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
