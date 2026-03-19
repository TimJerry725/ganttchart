import { Gantt } from '../components/Gantt/Gantt';
import type { Task, Scale } from '../components/types';

export default {
  title: 'Gantt/Custom Scale Unit',
  component: Gantt,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    // Scale properties are configured in the render function via config.scales
  },
};


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
 * Custom Scale Unit - Interactive Controls
 * 
 * Customize the time scale units displayed in the timeline header.
 * You can select any combination of time units for primary and secondary scales.
 * 
 * **Primary Scale** (Top row):
 * - Unit: Select from hour, day, week, month, quarter, or year
 * - Step: Number of units per cell (1-12)
 * - Format: Custom format string (e.g., "MMMM YYYY", "D", "Week W")
 * 
 * **Secondary Scale** (Bottom row):
 * - Unit: Select from hour, day, week, month, quarter, year, or none
 * - Step: Number of units per cell (1-12)
 * - Format: Custom format string (e.g., "D", "HH:mm", "MMM")
 * 
 * **Available Units:**
 * - `hour` - Hourly intervals (0-23)
 * - `day` - Daily intervals (1-31)
 * - `week` - Weekly intervals (Week 1, Week 2, etc.)
 * - `month` - Monthly intervals (January, February, etc.)
 * - `quarter` - Quarterly intervals (Q1, Q2, Q3, Q4)
 * - `year` - Yearly intervals (2026, 2027, etc.)
 * 
 * **Format Examples:**
 * - `YYYY` - Full year (2026)
 * - `MMMM` - Full month name (April)
 * - `MMM` - Short month (Apr)
 * - `MM` - Month number (04)
 * - `D` - Day of month (1-31)
 * - `DD` - Padded day (01-31)
 * - `HH:mm` - 24-hour time (09:00)
 * - `Week W` - Week number within the month
 * - `[Q]Q` - Quarter (Q1, Q2, etc.)
 * 
 * **Common Combinations:**
 * - **Daily View**: Month + Day (MMMM YYYY / D)
 * - **Weekly View**: Month + Week (MMMM YYYY / Week W)
 * - **Monthly View**: Year + Month (YYYY / MMM)
 * - **Quarterly View**: Year + Quarter (YYYY / [Q]Q)
 * - **Hourly View**: Day + Hour (D MMM / HH:mm)
 * 
 * Use the Controls panel below to adjust all settings in real-time!
 */
export const Default = {
  args: {
    tasks: tasks,
  },
  render: (args: any) => {
    // Default scale configuration
    const primaryUnit = 'month';
    const primaryStep = 1;
    const primaryFormat = 'MMMM YYYY';
    const secondaryUnit = 'day';
    const secondaryStep = 1;
    const secondaryFormat = 'D';
    const { ...rest } = args;

    const scales: Scale[] = [
      {
        unit: primaryUnit as Scale['unit'],
        step: primaryStep,
        format: primaryFormat,
      },
    ];

    if (secondaryUnit && (secondaryUnit as string) !== 'none') {
      scales.push({
        unit: secondaryUnit as Scale['unit'],
        step: secondaryStep,
        format: secondaryFormat,
      });
    }

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
 * Day Scale Unit
 * 
 * Primary: Month | Secondary: Day
 * Perfect for detailed daily task tracking.
 */
export const DayScale = {
  args: {
    tasks: tasks,
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

/**
 * Week Scale Unit
 * 
 * Primary: Month | Secondary: Week
 * Ideal for sprint planning and weekly milestones.
 */
export const WeekScale = {
  args: {
    tasks: tasks,
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
 * Month Scale Unit
 * 
 * Primary: Year | Secondary: Month
 * Best for long-term planning and annual roadmaps.
 */
export const MonthScale = {
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
 * Quarter Scale Unit
 * 
 * Primary: Year | Secondary: Quarter
 * Perfect for quarterly business planning and OKRs.
 */
export const QuarterScale = {
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
 * Hour Scale Unit
 * 
 * Primary: Day | Secondary: Hour
 * Perfect for detailed hourly scheduling and time tracking.
 */
export const HourScale = {
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
 * Year Scale Unit
 * 
 * Primary: Year only
 * Best for multi-year strategic planning.
 */
export const YearScale = {
  args: {
    tasks: [
      {
        id: '1',
        text: '2026 Initiatives',
        start: new Date(2026, 0, 1),
        end: new Date(2026, 11, 31),
        duration: 365,
        progress: 50,
        color: '#26A69A',
      },
      {
        id: '2',
        text: '2027 Roadmap',
        start: new Date(2027, 0, 1),
        end: new Date(2027, 11, 31),
        duration: 365,
        progress: 10,
        color: '#42A5F5',
      },
    ],
    config: {
      scales: [
        { unit: 'year', step: 1, format: 'YYYY' },
      ] as Scale[],
      weekends: false,
      theme: 'light',
    },
  },
};

/**
 * Single Scale (No Secondary)
 * 
 * Primary: Month only
 * Simplified view with single scale level.
 */
export const SingleScale = {
  args: {
    tasks: tasks,
    config: {
      scales: [
        { unit: 'month', step: 1, format: 'MMMM YYYY' },
      ] as Scale[],
      weekends: true,
      theme: 'light',
    },
  },
};
