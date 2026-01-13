import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gantt } from '../components/Gantt';
import type { Task } from '../components/types';
import '../components/Gantt/gantt.css';

const meta = {
  title: 'Gantt/Tooltips',
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
    text: 'Project Planning',
    start: new Date(2026, 3, 1),
    end: new Date(2026, 3, 15),
    duration: 14,
    progress: 100,
    color: '#26A69A',
    details: 'Initial project planning phase including requirements gathering and stakeholder meetings.',
    owner: 'John Doe',
    priority: 'high',
  },
  {
    id: '2',
    text: 'Development',
    start: new Date(2026, 3, 15),
    end: new Date(2026, 4, 15),
    duration: 30,
    progress: 60,
    color: '#42A5F5',
    details: 'Main development phase with iterative sprints.',
    owner: 'Jane Smith',
    priority: 'high',
  },
  {
    id: '3',
    text: 'Testing',
    start: new Date(2026, 4, 15),
    end: new Date(2026, 5, 1),
    duration: 16,
    progress: 30,
    color: '#FF7043',
    details: 'Comprehensive testing including unit, integration, and user acceptance testing.',
    owner: 'Bob Johnson',
    priority: 'medium',
  },
];

/**
 * Tooltips on Task Bars
 * 
 * Hover over task bars to see tooltips with:
 * - Task name
 * - Start and end dates
 * - Duration
 * - Progress percentage
 * - Owner
 * - Priority
 * - Additional details
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
