import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gantt } from '../components';
import type { Task } from '../components/types';
import '../components/gantt.css';

const meta = {
  title: 'Gantt/Zoom',
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
  },
  {
    id: '2',
    text: 'Development',
    start: new Date(2026, 3, 15),
    end: new Date(2026, 4, 15),
    duration: 30,
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
 * Zoom Controls
 * 
 * Use the toolbar buttons to:
 * - 🔍+ Zoom In - Increase detail
 * - 🔍- Zoom Out - See more tasks
 * - ↺ Reset Zoom - Return to default
 * 
 * Zoom affects the timeline column width and detail level.
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
