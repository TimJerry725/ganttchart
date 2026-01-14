import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gantt } from '../components';
import type { Task } from '../components/types';
import '../components/gantt.css';

const meta = {
  title: 'Gantt/Calendar (PRO)',
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
    text: 'Development',
    start: new Date(2026, 3, 16),
    end: new Date(2026, 4, 15),
    duration: 29,
    progress: 60,
    color: '#42A5F5',
  },
];

/**
 * Calendar with Working Days
 * 
 * Define custom working hours and non-working days.
 * Tasks are automatically scheduled around the calendar rules.
 */
export const Default: Story = {
  args: {
    tasks,
    config: {
      weekends: true,
      holidays: [
        new Date(2026, 3, 10),
        new Date(2026, 3, 25),
        new Date(2026, 4, 1),
      ],
      theme: 'light',
    },
  },
};
