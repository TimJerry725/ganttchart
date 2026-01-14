import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gantt } from '../components';
import type { Task, Scale } from '../components/types';
import '../components/gantt.css';

const meta = {
  title: 'Gantt/Custom minimal scale unit',
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
 * Custom Minimal Scale Unit
 * 
 * Sets the minimum time unit displayed on the timeline.
 * Prevents zooming below this granularity level.
 */
export const MinimalDay: Story = {
  args: {
    tasks,
    config: {
      scales: [
        { unit: 'month', step: 1, format: 'MMMM' },
        { unit: 'day', step: 1, format: 'D' },
      ] as Scale[],
      minColumnWidth: 40,
      weekends: true,
      theme: 'light',
    },
  },
};
