/**
 * Storybook stories for Gantt component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Gantt } from './Gantt';
import type { Task, Link } from '@gantt/core';

const meta: Meta<typeof Gantt> = {
  title: 'Gantt/React Component',
  component: Gantt,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The main React Gantt chart component with full feature support.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Gantt>;

// Sample data generators
const generateTasks = (count: number, startDate: Date = new Date('2024-01-01')): Task[] => {
  const tasks: Task[] = [];
  for (let i = 1; i <= count; i++) {
    const start = new Date(startDate);
    start.setDate(start.getDate() + (i - 1) * 5);
    const end = new Date(start);
    end.setDate(end.getDate() + 4);
    
    tasks.push({
      id: i,
      name: `Task ${i}`,
      start,
      end,
      duration: 5,
      progress: Math.min(100, i * 20),
    });
  }
  return tasks;
};

const generateLinks = (taskCount: number): Link[] => {
  const links: Link[] = [];
  for (let i = 1; i < taskCount; i++) {
    links.push({
      id: `link-${i}`,
      source: i,
      target: i + 1,
      type: 'finish-to-start',
    });
  }
  return links;
};

// Basic examples
export const Basic: Story = {
  args: {
    tasks: [
      {
        id: 1,
        name: 'Project Setup',
        start: new Date('2024-01-01'),
        end: new Date('2024-01-05'),
        duration: 5,
        progress: 100,
      },
      {
        id: 2,
        name: 'Development',
        start: new Date('2024-01-06'),
        end: new Date('2024-01-20'),
        duration: 15,
        progress: 50,
      },
      {
        id: 3,
        name: 'Testing',
        start: new Date('2024-01-21'),
        end: new Date('2024-01-25'),
        duration: 5,
        progress: 0,
      },
    ],
    links: [
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
    ],
    height: 400,
    width: 1000,
  },
};

export const WithProgress: Story = {
  args: {
    tasks: [
      {
        id: 1,
        name: 'Task with 25% progress',
        start: new Date('2024-01-01'),
        end: new Date('2024-01-10'),
        duration: 10,
        progress: 25,
      },
      {
        id: 2,
        name: 'Task with 50% progress',
        start: new Date('2024-01-11'),
        end: new Date('2024-01-20'),
        duration: 10,
        progress: 50,
      },
      {
        id: 3,
        name: 'Task with 75% progress',
        start: new Date('2024-01-21'),
        end: new Date('2024-01-30'),
        duration: 10,
        progress: 75,
      },
      {
        id: 4,
        name: 'Task with 100% progress',
        start: new Date('2024-01-31'),
        end: new Date('2024-02-09'),
        duration: 10,
        progress: 100,
      },
    ],
    links: [
      { id: '1', source: 1, target: 2, type: 'finish-to-start' },
      { id: '2', source: 2, target: 3, type: 'finish-to-start' },
      { id: '3', source: 3, target: 4, type: 'finish-to-start' },
    ],
    height: 400,
    width: 1200,
  },
};

export const WithHierarchy: Story = {
  args: {
    tasks: [
      {
        id: 1,
        name: 'Project Phase 1',
        type: 'project',
        start: new Date('2024-01-01'),
        end: new Date('2024-01-31'),
        duration: 31,
        expanded: true,
      },
      {
        id: 2,
        name: 'Task 1.1',
        parent: 1,
        start: new Date('2024-01-01'),
        end: new Date('2024-01-10'),
        duration: 10,
        progress: 100,
      },
      {
        id: 3,
        name: 'Task 1.2',
        parent: 1,
        start: new Date('2024-01-11'),
        end: new Date('2024-01-20'),
        duration: 10,
        progress: 50,
      },
      {
        id: 4,
        name: 'Task 1.3',
        parent: 1,
        start: new Date('2024-01-21'),
        end: new Date('2024-01-31'),
        duration: 11,
        progress: 0,
      },
    ],
    links: [
      { id: '1', source: 2, target: 3, type: 'finish-to-start' },
      { id: '2', source: 3, target: 4, type: 'finish-to-start' },
    ],
    height: 500,
    width: 1200,
  },
};

export const WithMilestones: Story = {
  args: {
    tasks: [
      {
        id: 1,
        name: 'Development Task',
        start: new Date('2024-01-01'),
        end: new Date('2024-01-15'),
        duration: 15,
        progress: 60,
      },
      {
        id: 2,
        name: 'Alpha Release',
        type: 'milestone',
        start: new Date('2024-01-15'),
        end: new Date('2024-01-15'),
        duration: 0,
      },
      {
        id: 3,
        name: 'Beta Development',
        start: new Date('2024-01-16'),
        end: new Date('2024-01-30'),
        duration: 15,
        progress: 30,
      },
      {
        id: 4,
        name: 'Beta Release',
        type: 'milestone',
        start: new Date('2024-01-30'),
        end: new Date('2024-01-30'),
        duration: 0,
      },
    ],
    links: [
      { id: '1', source: 1, target: 2, type: 'finish-to-start' },
      { id: '2', source: 2, target: 3, type: 'finish-to-start' },
      { id: '3', source: 3, target: 4, type: 'finish-to-start' },
    ],
    height: 400,
    width: 1200,
  },
};

export const LargeDataset: Story = {
  args: {
    tasks: generateTasks(20),
    links: generateLinks(20),
    height: 800,
    width: 1400,
  },
};

export const DifferentLinkTypes: Story = {
  args: {
    tasks: [
      {
        id: 1,
        name: 'Task 1',
        start: new Date('2024-01-01'),
        end: new Date('2024-01-05'),
        duration: 5,
      },
      {
        id: 2,
        name: 'Task 2 (FS)',
        start: new Date('2024-01-06'),
        end: new Date('2024-01-10'),
        duration: 5,
      },
      {
        id: 3,
        name: 'Task 3 (SS)',
        start: new Date('2024-01-06'),
        end: new Date('2024-01-10'),
        duration: 5,
      },
      {
        id: 4,
        name: 'Task 4 (FF)',
        start: new Date('2024-01-11'),
        end: new Date('2024-01-15'),
        duration: 5,
      },
    ],
    links: [
      { id: '1', source: 1, target: 2, type: 'finish-to-start' },
      { id: '2', source: 1, target: 3, type: 'start-to-start' },
      { id: '3', source: 2, target: 4, type: 'finish-to-finish' },
    ],
    height: 500,
    width: 1200,
  },
};

export const Interactive: Story = {
  args: {
    tasks: [
      {
        id: 1,
        name: 'Clickable Task',
        start: new Date('2024-01-01'),
        end: new Date('2024-01-10'),
        duration: 10,
        progress: 50,
      },
      {
        id: 2,
        name: 'Another Task',
        start: new Date('2024-01-11'),
        end: new Date('2024-01-20'),
        duration: 10,
        progress: 75,
      },
    ],
    links: [
      { id: '1', source: 1, target: 2, type: 'finish-to-start' },
    ],
    height: 400,
    width: 1000,
    onTaskClick: (id) => {
      console.log('Task clicked:', id);
      alert(`Task ${id} clicked!`);
    },
    onTaskDoubleClick: (id) => {
      console.log('Task double-clicked:', id);
      alert(`Task ${id} double-clicked!`);
    },
  },
};

export const CustomColumns: Story = {
  args: {
    tasks: [
      {
        id: 1,
        name: 'Custom Task',
        start: new Date('2024-01-01'),
        end: new Date('2024-01-10'),
        duration: 10,
        progress: 50,
      },
    ],
    links: [],
    columns: [
      { id: 'name', label: 'Task Name', width: 300, field: 'name' },
      { id: 'start', label: 'Start Date', width: 150, field: 'start' },
      { id: 'end', label: 'End Date', width: 150, field: 'end' },
      { id: 'duration', label: 'Days', width: 100, field: 'duration' },
      { id: 'progress', label: '% Complete', width: 120, field: 'progress' },
    ],
    height: 400,
    width: 1200,
  },
};
