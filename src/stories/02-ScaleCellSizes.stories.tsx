import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gantt } from '../components/Gantt';
import type { Task, Link } from '../components/types';
import '../components/Gantt/gantt.css';

const meta = {
  title: 'Gantt/Scale / cell sizes',
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
    end: new Date(2026, 4, 1),
    duration: 16,
    progress: 60,
    color: '#42A5F5',
  },
];

/**
 * Small Cell Size
 */
export const SmallCells: Story = {
  args: {
    tasks,
    config: {
      taskHeight: 24,
      rowHeight: 36,
      columnWidth: 40,
      weekends: true,
      theme: 'light',
    },
  },
};

/**
 * Medium Cell Size (Default)
 */
export const MediumCells: Story = {
  args: {
    tasks,
    config: {
      taskHeight: 32,
      rowHeight: 44,
      columnWidth: 60,
      weekends: true,
      theme: 'light',
    },
  },
};

/**
 * Large Cell Size
 */
export const LargeCells: Story = {
  args: {
    tasks,
    config: {
      taskHeight: 40,
      rowHeight: 56,
      columnWidth: 80,
      weekends: true,
      theme: 'light',
    },
  },
};
