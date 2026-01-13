import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gantt } from '../components/Gantt';
import type { Task, Scale } from '../components/types';
import '../components/Gantt/gantt.css';

const meta = {
  title: 'Gantt/Custom scales',
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
 * Hour Scale
 */
export const HourlyView: Story = {
  args: {
    tasks: [
      {
        id: '1',
        text: 'Morning Meeting',
        start: new Date(2026, 3, 15, 9, 0),
        end: new Date(2026, 3, 15, 11, 0),
        duration: 2,
        progress: 100,
        color: '#26A69A',
      },
      {
        id: '2',
        text: 'Development Sprint',
        start: new Date(2026, 3, 15, 11, 0),
        end: new Date(2026, 3, 15, 17, 0),
        duration: 6,
        progress: 50,
        color: '#42A5F5',
      },
    ],
    config: {
      scales: [
        { unit: 'day', step: 1, format: 'D MMM' },
        { unit: 'hour', step: 1, format: 'HH:mm' },
      ] as Scale[],
      weekends: false,
      theme: 'light',
    },
  },
};

/**
 * Week Scale
 */
export const WeeklyView: Story = {
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

/**
 * Month Scale
 */
export const MonthlyView: Story = {
  args: {
    tasks,
    config: {
      scales: [
        { unit: 'year', step: 1, format: 'YYYY' },
        { unit: 'month', step: 1, format: 'MMM' },
      ] as Scale[],
      weekends: false,
      theme: 'light',
    },
  },
};

/**
 * Quarter Scale
 */
export const QuarterlyView: Story = {
  args: {
    tasks: [
      {
        id: '1',
        text: 'Q1 Objectives',
        start: new Date(2026, 0, 1),
        end: new Date(2026, 3, 1),
        duration: 90,
        progress: 100,
        color: '#26A69A',
      },
      {
        id: '2',
        text: 'Q2 Objectives',
        start: new Date(2026, 3, 1),
        end: new Date(2026, 6, 1),
        duration: 90,
        progress: 60,
        color: '#42A5F5',
      },
    ],
    config: {
      scales: [
        { unit: 'year', step: 1, format: 'YYYY' },
        { unit: 'quarter', step: 1, format: '[Q]Q' },
      ] as Scale[],
      weekends: false,
      theme: 'light',
    },
  },
};
