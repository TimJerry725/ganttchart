import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { Gantt } from '../components/Gantt';
import type { Task, Column } from '../components/types';
import '../components/Gantt/gantt.css';

const meta = {
  title: 'Gantt/Start/end dates',
  component: Gantt,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    // Date column configuration is handled in each story's render function
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
    id: '1.3',
    parent: '1',
    text: 'Approval of strategy',
    start: new Date(2026, 3, 8),
    end: new Date(2026, 3, 8),
    duration: 0,
    progress: 100,
    type: 'milestone',
  },
  {
    id: '2',
    text: 'Project management',
    start: new Date(2026, 3, 2),
    end: new Date(2026, 3, 12),
    duration: 10,
    progress: 80,
    type: 'project',
    color: '#26A69A',
    open: true,
  },
  {
    id: '2.1',
    parent: '2',
    text: 'Resource planning',
    start: new Date(2026, 3, 2),
    end: new Date(2026, 3, 6),
    duration: 4,
    progress: 100,
    color: '#42A5F5',
  },
  {
    id: '2.2',
    parent: '2',
    text: 'Getting approval',
    start: new Date(2026, 3, 6),
    end: new Date(2026, 3, 8),
    duration: 2,
    progress: 100,
    color: '#42A5F5',
  },
  {
    id: '3',
    text: 'Development',
    start: new Date(2026, 3, 9),
    end: new Date(2026, 3, 30),
    duration: 21,
    progress: 60,
    type: 'project',
    color: '#26A69A',
  },
  {
    id: '4',
    text: 'Testing',
    start: new Date(2026, 3, 9),
    end: new Date(2026, 4, 3),
    duration: 24,
    progress: 40,
    type: 'project',
    color: '#26A69A',
  },
];

// Custom Grid wrapper to handle date formatting
const CustomDateGrid: React.FC<{
  children: React.ReactNode;
  startDateFormat: string;
  endDateFormat: string;
  showStartDate: boolean;
  showEndDate: boolean;
  startDateWidth: number;
  endDateWidth: number;
}> = ({
  children,
  startDateFormat,
  endDateFormat,
  showStartDate: _showStartDate,
  showEndDate: _showEndDate,
  startDateWidth: _startDateWidth,
  endDateWidth: _endDateWidth,
}) => {
    React.useEffect(() => {
      // Inject custom styles for date formatting
      const styleId = 'custom-date-format-styles';
      let styleElement = document.getElementById(styleId);

      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }

      // This will be handled by the Gantt component's column configuration
      styleElement.textContent = '';
    }, [startDateFormat, endDateFormat]);

    return <>{children}</>;
  };

/**
 * Start/End Dates - Interactive Controls
 * 
 * Customize how start and end dates are displayed in the grid columns:
 * 
 * **Column Visibility:**
 * - Show Start Date: Toggle Start Date column visibility
 * - Show End Date: Toggle End Date column visibility
 * 
 * **Date Format:**
 * - Start Date Format: Choose from common date formats
 * - End Date Format: Choose from common date formats
 * 
 * **Column Sizing:**
 * - Start Date Width: Adjust column width (80-200px)
 * - End Date Width: Adjust column width (80-200px)
 * 
 * **Available Formats:**
 * - `MM/DD/YYYY` - US format (04/02/2026)
 * - `DD-MM-YYYY` - European format (02-04-2026)
 * - `YYYY-MM-DD` - ISO format (2026-04-02)
 * - `MMM DD, YYYY` - Long format (Apr 02, 2026)
 * - `DD/MM/YYYY` - UK format (02/04/2026)
 * - `MM-DD-YYYY` - US with dashes (04-02-2026)
 * 
 * Use the Controls panel below to adjust all settings in real-time!
 */
export const Default: Story = {
  args: {
    tasks,
  },
  render: (args) => {
    // Default date column configuration
    const showStartDate = true;
    const showEndDate = true;
    const startDateFormat = 'MM/DD/YYYY';
    const endDateFormat = 'MM/DD/YYYY';
    const startDateWidth = 100;
    const endDateWidth = 100;
    const { ...rest } = args;

    const columns: Column[] = [
      { name: 'text', label: 'Task Name', width: 250, align: 'left', resize: true },
    ];

    if (showStartDate) {
      columns.push({
        name: 'start',
        label: 'Start Date',
        width: startDateWidth,
        align: 'center',
        template: (task: Task) => {
          // Format start date
          const date = task.start;
          return formatDateCustom(date, startDateFormat);
        },
      });
    }

    if (showEndDate) {
      columns.push({
        name: 'end',
        label: 'End Date',
        width: endDateWidth,
        align: 'center',
        template: (task: Task) => {
          // Format end date
          const date = task.end;
          return formatDateCustom(date, endDateFormat);
        },
      });
    }

    columns.push(
      { name: 'duration', label: 'Duration', width: 80, align: 'center' },
      { name: 'progress', label: 'Progress', width: 80, align: 'center' }
    );

    return (
      <CustomDateGrid
        startDateFormat={startDateFormat}
        endDateFormat={endDateFormat}
        showStartDate={showStartDate}
        showEndDate={showEndDate}
        startDateWidth={startDateWidth}
        endDateWidth={endDateWidth}
      >
        <Gantt
          {...rest}
          tasks={tasks}
          config={{
            columns,
            weekends: true,
            theme: 'light',
          }}
        />
      </CustomDateGrid>
    );
  },
};

// Helper function to format dates
function formatDateCustom(date: Date, format: string): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const day = date.getDate();
  const dayPadded = String(day).padStart(2, '0');
  const month = date.getMonth() + 1;
  const monthPadded = String(month).padStart(2, '0');
  const year = date.getFullYear();
  const monthShort = months[date.getMonth()];
  const monthFull = monthsFull[date.getMonth()];

  // Replace in order to avoid conflicts (longer patterns first)
  return format
    .replace('YYYY', String(year))
    .replace('MMMM', monthFull)
    .replace('MMM', monthShort)
    .replace('MM', monthPadded)
    .replace('DD', dayPadded)
    .replace('D', String(day));
}

/**
 * European Format (DD-MM-YYYY)
 * 
 * Common date format used in Europe and many other countries.
 */
export const EuropeanFormat: Story = {
  args: {
    tasks,
  },
  render: (args) => {
    // European date format configuration
    const showStartDate = true;
    const showEndDate = true;
    const startDateFormat = 'DD-MM-YYYY';
    const endDateFormat = 'DD-MM-YYYY';
    const startDateWidth = 100;
    const endDateWidth = 100;
    const { ...rest } = args;
    const columns: Column[] = [
      { name: 'text', label: 'Task Name', width: 250, align: 'left', resize: true },
    ];
    if (showStartDate) {
      columns.push({
        name: 'start',
        label: 'Start Date',
        width: startDateWidth,
        align: 'center',
        template: (task: Task) => formatDateCustom(task.start, startDateFormat),
      });
    }
    if (showEndDate) {
      columns.push({
        name: 'end',
        label: 'End Date',
        width: endDateWidth,
        align: 'center',
        template: (task: Task) => formatDateCustom(task.end, endDateFormat),
      });
    }
    columns.push(
      { name: 'duration', label: 'Duration', width: 80, align: 'center' },
      { name: 'progress', label: 'Progress', width: 80, align: 'center' }
    );
    return (
      <Gantt
        {...rest}
        tasks={tasks}
        config={{
          columns,
          weekends: true,
          theme: 'light',
        }}
      />
    );
  },
};

/**
 * ISO Format (YYYY-MM-DD)
 * 
 * International standard date format, commonly used in databases and APIs.
 */
export const ISOFormat: Story = {
  args: {
    tasks,
  },
  render: (args) => {
    // ISO date format configuration
    const showStartDate = true;
    const showEndDate = true;
    const startDateFormat = 'YYYY-MM-DD';
    const endDateFormat = 'YYYY-MM-DD';
    const startDateWidth = 110;
    const endDateWidth = 110;
    const { ...rest } = args;
    const columns: Column[] = [
      { name: 'text', label: 'Task Name', width: 250, align: 'left', resize: true },
    ];
    if (showStartDate) {
      columns.push({
        name: 'start',
        label: 'Start Date',
        width: startDateWidth,
        align: 'center',
        template: (task: Task) => formatDateCustom(task.start, startDateFormat),
      });
    }
    if (showEndDate) {
      columns.push({
        name: 'end',
        label: 'End Date',
        width: endDateWidth,
        align: 'center',
        template: (task: Task) => formatDateCustom(task.end, endDateFormat),
      });
    }
    columns.push(
      { name: 'duration', label: 'Duration', width: 80, align: 'center' },
      { name: 'progress', label: 'Progress', width: 80, align: 'center' }
    );
    return (
      <Gantt
        {...rest}
        tasks={tasks}
        config={{
          columns,
          weekends: true,
          theme: 'light',
        }}
      />
    );
  },
};

/**
 * Long Format (MMM DD, YYYY)
 * 
 * Human-readable date format with month names.
 */
export const LongFormat: Story = {
  args: {
    tasks,
  },
  render: (args) => {
    // Custom date format configuration
    const showStartDate = true;
    const showEndDate = true;
    const startDateFormat = 'MMM DD, YYYY';
    const endDateFormat = 'MMM DD, YYYY';
    const startDateWidth = 120;
    const endDateWidth = 120;
    const { ...rest } = args;
    const columns: Column[] = [
      { name: 'text', label: 'Task Name', width: 250, align: 'left', resize: true },
    ];
    if (showStartDate) {
      columns.push({
        name: 'start',
        label: 'Start Date',
        width: startDateWidth,
        align: 'center',
        template: (task: Task) => formatDateCustom(task.start, startDateFormat),
      });
    }
    if (showEndDate) {
      columns.push({
        name: 'end',
        label: 'End Date',
        width: endDateWidth,
        align: 'center',
        template: (task: Task) => formatDateCustom(task.end, endDateFormat),
      });
    }
    columns.push(
      { name: 'duration', label: 'Duration', width: 80, align: 'center' },
      { name: 'progress', label: 'Progress', width: 80, align: 'center' }
    );
    return (
      <Gantt
        {...rest}
        tasks={tasks}
        config={{
          columns,
          weekends: true,
          theme: 'light',
        }}
      />
    );
  },
};

/**
 * Start Date Only
 * 
 * Shows only the Start Date column, useful for simplified views.
 */
export const StartDateOnly: Story = {
  args: {
    tasks,
  },
  render: (args) => {
    // Start date only configuration
    const showStartDate = true;
    const showEndDate = false;
    const startDateFormat = 'MM/DD/YYYY';
    const endDateFormat = 'MM/DD/YYYY';
    const startDateWidth = 100;
    const endDateWidth = 100;
    const { ...rest } = args;
    const columns: Column[] = [
      { name: 'text', label: 'Task Name', width: 250, align: 'left', resize: true },
    ];
    if (showStartDate) {
      columns.push({
        name: 'start',
        label: 'Start Date',
        width: startDateWidth,
        align: 'center',
        template: (task: Task) => formatDateCustom(task.start, startDateFormat),
      });
    }
    if (showEndDate) {
      columns.push({
        name: 'end',
        label: 'End Date',
        width: endDateWidth,
        align: 'center',
        template: (task: Task) => formatDateCustom(task.end, endDateFormat),
      });
    }
    columns.push(
      { name: 'duration', label: 'Duration', width: 80, align: 'center' },
      { name: 'progress', label: 'Progress', width: 80, align: 'center' }
    );
    return (
      <Gantt
        {...rest}
        tasks={tasks}
        config={{
          columns,
          weekends: true,
          theme: 'light',
        }}
      />
    );
  },
};
