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
  argTypes: {
    primaryUnit: {
      control: { type: 'select' },
      options: ['hour', 'day', 'week', 'month', 'quarter', 'year'],
      description: 'Primary scale time unit',
      table: {
        category: 'Primary Scale',
        defaultValue: { summary: 'month' },
      },
    },
    primaryStep: {
      control: { type: 'number', min: 1, max: 12, step: 1 },
      description: 'Primary scale step size',
      table: {
        category: 'Primary Scale',
        defaultValue: { summary: '1' },
      },
    },
    primaryFormat: {
      control: { type: 'text' },
      description: 'Primary scale date format (e.g., MMMM YYYY, D, Week W)',
      table: {
        category: 'Primary Scale',
        defaultValue: { summary: 'MMMM YYYY' },
      },
    },
    secondaryUnit: {
      control: { type: 'select' },
      options: ['hour', 'day', 'week', 'month', 'quarter', 'year'],
      description: 'Secondary scale time unit',
      table: {
        category: 'Secondary Scale',
        defaultValue: { summary: 'day' },
      },
    },
    secondaryStep: {
      control: { type: 'number', min: 1, max: 12, step: 1 },
      description: 'Secondary scale step size',
      table: {
        category: 'Secondary Scale',
        defaultValue: { summary: '1' },
      },
    },
    secondaryFormat: {
      control: { type: 'text' },
      description: 'Secondary scale date format (e.g., D, HH:mm, Week W)',
      table: {
        category: 'Secondary Scale',
        defaultValue: { summary: 'D' },
      },
    },
  },
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
  {
    id: '3',
    text: 'Testing',
    start: new Date(2026, 3, 9),
    end: new Date(2026, 4, 3),
    duration: 24,
    progress: 40,
    type: 'project',
    color: '#26A69A',
  },
];

/**
 * Custom Scales - Interactive Controls
 * 
 * Customize the timeline scales with interactive controls:
 * 
 * **Primary Scale** (Top row):
 * - Unit: hour, day, week, month, quarter, or year
 * - Step: Number of units per cell (1-12)
 * - Format: Date format string (e.g., "MMMM YYYY", "D", "Week W")
 * 
 * **Secondary Scale** (Bottom row):
 * - Unit: hour, day, week, month, quarter, or year
 * - Step: Number of units per cell (1-12)
 * - Format: Date format string (e.g., "D", "HH:mm", "MMM")
 * 
 * **Format Examples:**
 * - `YYYY` - Full year (2026)
 * - `MMMM` - Full month name (April)
 * - `MMM` - Short month (Apr)
 * - `D` - Day of month (1-31)
 * - `HH:mm` - 24-hour time (09:00)
 * - `Week W` - Week number
 * - `[Q]Q` - Quarter (Q1, Q2, etc.)
 * 
 * Use the Controls panel below to adjust all settings in real-time!
 */
export const Default: Story = {
  args: {
    tasks,
    primaryUnit: 'month',
    primaryStep: 1,
    primaryFormat: 'MMMM YYYY',
    secondaryUnit: 'day',
    secondaryStep: 1,
    secondaryFormat: 'D',
  },
  render: (args) => {
    const {
      primaryUnit,
      primaryStep,
      primaryFormat,
      secondaryUnit,
      secondaryStep,
      secondaryFormat,
      ...rest
    } = args;

    const scales: Scale[] = [
      {
        unit: (primaryUnit as Scale['unit']) || 'month',
        step: primaryStep || 1,
        format: primaryFormat,
      },
      {
        unit: (secondaryUnit as Scale['unit']) || 'day',
        step: secondaryStep || 1,
        format: secondaryFormat,
      },
    ];

    return (
      <Gantt
        {...rest}
        tasks={tasks}
        config={{
          scales,
          weekends: true,
          theme: 'light',
        }}
      />
    );
  },
};

/**
 * Hour Scale
 * 
 * Primary: Days | Secondary: Hours
 * Perfect for detailed daily planning and hourly task tracking.
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
      {
        id: '3',
        text: 'Code Review',
        start: new Date(2026, 3, 15, 17, 0),
        end: new Date(2026, 3, 15, 18, 0),
        duration: 1,
        progress: 0,
        color: '#FF7043',
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
 * 
 * Primary: Months | Secondary: Weeks
 * Ideal for project planning and sprint management.
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
 * 
 * Primary: Years | Secondary: Months
 * Best for long-term planning and annual roadmaps.
 */
export const MonthlyView: Story = {
  args: {
    tasks: [
      {
        id: '1',
        text: 'Q1 Planning',
        start: new Date(2026, 0, 1),
        end: new Date(2026, 3, 1),
        duration: 90,
        progress: 100,
        color: '#26A69A',
      },
      {
        id: '2',
        text: 'Q2 Development',
        start: new Date(2026, 3, 1),
        end: new Date(2026, 6, 1),
        duration: 91,
        progress: 60,
        color: '#42A5F5',
      },
      {
        id: '3',
        text: 'Q3 Testing',
        start: new Date(2026, 6, 1),
        end: new Date(2026, 9, 1),
        duration: 92,
        progress: 30,
        color: '#FF7043',
      },
    ],
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
 * 
 * Primary: Years | Secondary: Quarters
 * Perfect for quarterly business planning and OKRs.
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
        duration: 91,
        progress: 60,
        color: '#42A5F5',
      },
      {
        id: '3',
        text: 'Q3 Objectives',
        start: new Date(2026, 6, 1),
        end: new Date(2026, 9, 1),
        duration: 92,
        progress: 30,
        color: '#FF7043',
      },
      {
        id: '4',
        text: 'Q4 Objectives',
        start: new Date(2026, 9, 1),
        end: new Date(2027, 0, 1),
        duration: 92,
        progress: 0,
        color: '#9C27B0',
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

/**
 * Bi-Weekly Scale
 * 
 * Primary: Months | Secondary: 2-Week Periods
 * Useful for bi-weekly sprints and pay periods.
 */
export const BiWeeklyView: Story = {
  args: {
    tasks,
    config: {
      scales: [
        { unit: 'month', step: 1, format: 'MMMM YYYY' },
        { unit: 'week', step: 2, format: 'Week W' },
      ] as Scale[],
      weekends: true,
      theme: 'light',
    },
  },
};

/**
 * Custom Format Examples
 * 
 * Shows various date format combinations:
 * - Custom month format
 * - Custom day format
 * - Custom week format
 */
export const CustomFormats: Story = {
  args: {
    tasks,
    config: {
      scales: [
        { unit: 'month', step: 1, format: 'MMM YYYY' },
        { unit: 'day', step: 1, format: 'DD/MM' },
      ] as Scale[],
      weekends: true,
      theme: 'light',
    },
  },
};
