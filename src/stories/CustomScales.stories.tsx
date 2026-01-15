import { Gantt } from '../components/Gantt/Gantt';
import type { Scale } from '../components/types';
import { basicTasks } from './data';

export default {
  title: 'Gantt/Custom Scales',
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
};


/**
 * Custom Scales - Interactive Controls
 * 
 * Customize the timeline scales with interactive controls.
 */
export const Default = {
  args: {
    tasks: basicTasks,
    primaryUnit: 'month',
    primaryStep: 1,
    primaryFormat: 'MMMM YYYY',
    secondaryUnit: 'day',
    secondaryStep: 1,
    secondaryFormat: 'D',
  },
  render: (args: any) => {
    const {
      primaryUnit: primaryUnit,
      primaryStep: primaryStep,
      primaryFormat: primaryFormat,
      secondaryUnit: secondaryUnit,
      secondaryStep: secondaryStep,
      secondaryFormat: secondaryFormat,
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
        tasks={basicTasks}
        config={{
          scales,
          weekends: true,
          theme: 'light',
        }}
      />
    );
  },
};
