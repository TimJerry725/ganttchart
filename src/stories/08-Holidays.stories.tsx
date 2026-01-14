import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gantt } from '../components';
import type { Task } from '../components/types';
import '../components/gantt.css';

const meta = {
  title: 'Gantt/Holidays',
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
];

/**
 * Holidays and Non-Working Days
 * 
 * Highlights specific dates as holidays/non-working days.
 * These days are marked differently from regular weekends.
 */
export const WithHolidays: Story = {
  args: {
    tasks,
    config: {
      weekends: true,
      holidays: [
        new Date(2026, 3, 10), // April 10
        new Date(2026, 3, 25), // April 25
        new Date(2026, 4, 1),  // May 1
      ],
      theme: 'light',
    },
  },
};

/**
 * Weekends Only
 */
export const WeekendsOnly: Story = {
  args: {
    tasks,
    config: {
      weekends: true,
      holidays: [],
      theme: 'light',
    },
  },
};

/**
 * No Non-Working Days
 */
export const NoNonWorkingDays: Story = {
  args: {
    tasks,
    config: {
      weekends: false,
      holidays: [],
      theme: 'light',
    },
  },
};
