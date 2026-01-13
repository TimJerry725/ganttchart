import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gantt } from '../components/Gantt';
import type { Task, Link } from '../components/types';
import '../components/Gantt/gantt.css';

const meta = {
  title: 'Gantt/Chart cell borders',
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
    open: true,
  },
  {
    id: '1.1',
    parent: '1',
    text: 'Marketing analysis',
    start: new Date(2026, 3, 2),
    end: new Date(2026, 3, 5),
    duration: 3,
    progress: 100,
    color: '#42A5F5',
  },
  {
    id: '1.2',
    parent: '1',
    text: 'Discussions',
    start: new Date(2026, 3, 5),
    end: new Date(2026, 3, 7),
    duration: 2,
    progress: 100,
    color: '#42A5F5',
  },
  {
    id: '2',
    text: 'Development',
    start: new Date(2026, 3, 9),
    end: new Date(2026, 3, 30),
    duration: 21,
    progress: 60,
    type: 'project',
    color: '#26A69A',
  },
];

const links: Link[] = [
  { id: 'l1', source: '1.1', target: '1.2', type: 'e2s' },
];

/**
 * Chart Cell Borders
 * 
 * Shows the grid lines and cell borders in the timeline area.
 * This helps visualize the time scale and align tasks precisely.
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
