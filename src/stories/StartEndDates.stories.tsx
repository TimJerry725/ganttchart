
import { Gantt } from '../components/Gantt/Gantt';
import type { Task, Column } from '../components/types';
import { basicTasks } from './data';
import { CustomDateGrid } from './common';
import { formatDateCustom } from './storyUtils';

export default {
  title: 'Gantt/Start And End Dates',
  component: Gantt,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};


/**
 * Start/End Dates - Interactive Controls
 * 
 * Customize how start and end dates are displayed in the grid columns.
 */
export const Default = {
  args: {
    tasks: basicTasks,
  },
  render: (args: any) => {
    const startDateFormat = 'MM/DD/YYYY';
    const endDateFormat = 'MM/DD/YYYY';

    const columns: Column[] = [
      { name: 'text', label: 'Task Name', width: 250, align: 'left', resize: true },
      {
        name: 'start',
        label: 'Start Date',
        width: 100,
        align: 'center',
        template: (task: Task) => formatDateCustom(task.start, startDateFormat),
      },
      {
        name: 'end',
        label: 'End Date',
        width: 100,
        align: 'center',
        template: (task: Task) => formatDateCustom(task.end, endDateFormat),
      },
      { name: 'duration', label: 'Duration', width: 80, align: 'center' },
      { name: 'progress', label: 'Progress', width: 80, align: 'center' }
    ];

    return (
      <CustomDateGrid
        startDateFormat={startDateFormat}
        endDateFormat={endDateFormat}
      >
        <Gantt
          {...args}
          tasks={basicTasks}
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

export const EuropeanFormat = {
  args: {
    tasks: basicTasks,
  },
  render: (args: any) => {
    const startDateFormat = 'DD-MM-YYYY';
    const columns: Column[] = [
      { name: 'text', label: 'Task Name', width: 250, align: 'left', resize: true },
      {
        name: 'start',
        label: 'Start Date',
        width: 100,
        align: 'center',
        template: (task: Task) => formatDateCustom(task.start, startDateFormat),
      },
      { name: 'duration', label: 'Duration', width: 80, align: 'center' }
    ];
    return (
      <Gantt
        {...args}
        tasks={basicTasks}
        config={{
          columns,
          weekends: true,
          theme: 'light',
        }}
      />
    );
  },
};

export const ISOFormat = {
  args: {
    tasks: basicTasks,
  },
  render: (args: any) => {
    const startDateFormat = 'YYYY-MM-DD';
    const columns: Column[] = [
      { name: 'text', label: 'Task Name', width: 250, align: 'left', resize: true },
      {
        name: 'start',
        label: 'Start Date',
        width: 110,
        align: 'center',
        template: (task: Task) => formatDateCustom(task.start, startDateFormat),
      },
      { name: 'duration', label: 'Duration', width: 80, align: 'center' }
    ];
    return (
      <Gantt
        {...args}
        tasks={basicTasks}
        config={{
          columns,
          weekends: true,
          theme: 'light',
        }}
      />
    );
  },
};
