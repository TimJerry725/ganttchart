/**
 * Storybook stories for Iris Gantt
 * Professional examples
 */

import type { Meta, StoryObj } from '@storybook/react';
import { IrisGantt } from '../src/IrisGantt';
import type { Task, Link, GanttConfig } from '../src/types';

const meta: Meta<typeof IrisGantt> = {
  title: 'Iris Gantt/Basic',
  component: IrisGantt,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof IrisGantt>;

const sampleTasks: Task[] = [
  {
    id: 1,
    name: 'Phase 1',
    start: new Date('2024-01-01'),
    end: new Date('2024-01-10'),
    duration: 10,
    progress: 100,
  },
  {
    id: 2,
    name: 'Phase 2',
    start: new Date('2024-01-11'),
    end: new Date('2024-01-20'),
    duration: 10,
    progress: 50,
  },
  {
    id: 3,
    name: 'Phase 3',
    start: new Date('2024-01-21'),
    end: new Date('2024-01-30'),
    duration: 10,
    progress: 0,
  },
];

const sampleLinks: Link[] = [
  {
    id: '1',
    source: 1,
    target: 2,
    type: 'finish-to-start',
  },
  {
    id: '2',
    source: 2,
    target: 3,
    type: 'finish-to-start',
  },
];

export const Basic: Story = {
  args: {
    tasks: sampleTasks,
    links: sampleLinks,
    width: 1200,
    height: 600,
  },
};

export const WithDependencies: Story = {
  args: {
    tasks: sampleTasks,
    links: sampleLinks,
    width: 1400,
    height: 700,
  },
};

export const WithCustomConfig: Story = {
  args: {
    tasks: sampleTasks,
    links: sampleLinks,
    width: 1200,
    height: 600,
    config: {
      rowHeight: 50,
      barHeight: 30,
      showTodayMarker: true,
      showWeekends: true,
      showProgress: true,
      scaleWidth: 30,
    } as GanttConfig,
  },
};

export const Empty: Story = {
  args: {
    tasks: [],
    links: [],
    width: 1200,
    height: 600,
  },
};

export const Readonly: Story = {
  args: {
    tasks: sampleTasks,
    links: sampleLinks,
    width: 1200,
    height: 600,
    readonly: true,
  },
};
