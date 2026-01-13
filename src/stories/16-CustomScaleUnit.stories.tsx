import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gantt } from '../components/Gantt';
import type { Task, Scale } from '../components/types';
import '../components/Gantt/gantt.css';

const meta = {
  title: 'Gantt/Custom scale unit',
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
 * Custom Scale Unit
 * 
 * Customize the time scale units displayed in the timeline header.
 * Supports multiple unit combinations for different views.
 */
export const DayScale: Story = {
  args: {
    tasks,
    config: {
      scales: [
        { unit: 'month', step: 1, format: 'MMMM' },
        { unit: 'day', step: 1, format: 'D' },
      ] as Scale[],
      weekends: true,
      theme: 'light',
    },
  },
};

export const WeekScale: Story = {
  args: {
    tasks,
    config: {
      scales: [
        { unit: 'month', step: 1, format: 'MMMM YYYY' },
        { unit: 'week', step: 1, format: 'Week W' },
      ] as Scale[],
      weekends: true,
      theme: 'light',
    },
  },
};
