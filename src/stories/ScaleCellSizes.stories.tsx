import { Gantt } from '../components/Gantt/Gantt';
import type { Task, Link } from '../components/types';

export default {
  title: 'Gantt/Scale And Cell Sizes',
  component: Gantt,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    cellWidth: {
      control: { type: 'range', min: 30, max: 120, step: 5 },
      description: 'Width of timeline columns in pixels',
      table: {
        category: 'Scale Settings',
        defaultValue: { summary: '60' },
      },
    },
    cellHeight: {
      control: { type: 'range', min: 20, max: 60, step: 4 },
      description: 'Height of task bars in pixels',
      table: {
        category: 'Scale Settings',
        defaultValue: { summary: '32' },
      },
    },
    scaleHeight: {
      control: { type: 'range', min: 30, max: 80, step: 5 },
      description: 'Height of timeline header scales',
      table: {
        category: 'Scale Settings',
        defaultValue: { summary: '40' },
      },
    },
  },
};


// Sample tasks matching the reference image
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
    id: '2.3',
    parent: '2',
    text: 'Team introduction',
    start: new Date(2026, 3, 8),
    end: new Date(2026, 3, 10),
    duration: 2,
    progress: 50,
    color: '#42A5F5',
  },
  {
    id: '2.4',
    parent: '2',
    text: 'Resource management',
    start: new Date(2026, 3, 10),
    end: new Date(2026, 3, 12),
    duration: 2,
    progress: 30,
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
    open: true,
  },
  {
    id: '3.1',
    parent: '3',
    text: 'Prototyping',
    start: new Date(2026, 3, 9),
    end: new Date(2026, 3, 15),
    duration: 6,
    progress: 100,
    color: '#42A5F5',
  },
  {
    id: '3.2',
    parent: '3',
    text: 'Basic functionality',
    start: new Date(2026, 3, 15),
    end: new Date(2026, 3, 23),
    duration: 8,
    progress: 80,
    color: '#42A5F5',
  },
  {
    id: '3.3',
    parent: '3',
    text: 'Finalizing MVA',
    start: new Date(2026, 3, 23),
    end: new Date(2026, 3, 30),
    duration: 7,
    progress: 20,
    color: '#42A5F5',
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
    open: true,
  },
  {
    id: '4.1',
    parent: '4',
    text: 'Testing prototype',
    start: new Date(2026, 3, 9),
    end: new Date(2026, 3, 13),
    duration: 4,
    progress: 100,
    color: '#42A5F5',
  },
];

const links: Link[] = [
  { id: 'l1', sourceId: '1.1', targetId: '1.2', type: 'e2s' },
  { id: 'l2', sourceId: '1.2', targetId: '1.3', type: 'e2s' },
  { id: 'l3', sourceId: '2.1', targetId: '2.2', type: 'e2s' },
  { id: 'l4', sourceId: '2.2', targetId: '2.3', type: 'e2s' },
  { id: 'l5', sourceId: '2.3', targetId: '2.4', type: 'e2s' },
  { id: 'l6', sourceId: '3.1', targetId: '3.2', type: 'e2s' },
  { id: 'l7', sourceId: '3.2', targetId: '3.3', type: 'e2s' },
];

/**
 * Interactive Cell Sizes
 * 
 * Adjust the sliders in the Controls panel to dynamically change:
 * - **Cell width**: Width of timeline columns (30-120px)
 * - **Cell height**: Height of task bars (20-60px)
 * - **Scale height**: Height of timeline header (30-80px)
 * 
 * This allows you to customize the visual density and spacing
 * of the Gantt chart to match your design requirements.
 */
export const Default = {
  args: {
    tasks: tasks,
    links: links,
    cellWidth: 60,
    cellHeight: 32,
    scaleHeight: 40,
  },
  render: (args: any) => {
    const { cellWidth, cellHeight, scaleHeight, ...rest } = args;
    return (
      <Gantt
        {...rest}
        tasks={tasks}
        links={links}
        config={{
          columnWidth: cellWidth,
          taskHeight: cellHeight,
          rowHeight: cellHeight ? cellHeight + 12 : 44,
          scaleHeight: scaleHeight,
          weekends: true,
          theme: 'light',
        }}
      />
    );
  },
};

/**
 * Small Cell Size
 * 
 * Compact view with smaller cells for displaying more information
 * in less space. Good for high-level overviews.
 */
export const SmallCells = {
  args: {
    tasks: tasks,
    links: links,
    cellWidth: 40,
    cellHeight: 24,
    scaleHeight: 35,
  },
  render: (args: any) => {
    const { cellWidth, cellHeight, scaleHeight, ...rest } = args;
    return (
      <Gantt
        {...rest}
        tasks={tasks}
        links={links}
        config={{
          columnWidth: cellWidth,
          taskHeight: cellHeight,
          rowHeight: cellHeight ? cellHeight + 12 : 36,
          scaleHeight: scaleHeight,
          weekends: true,
          theme: 'light',
        }}
      />
    );
  },
};

/**
 * Large Cell Size
 * 
 * Spacious view with larger cells for better readability
 * and easier interaction. Good for detailed task editing.
 */
export const LargeCells = {
  args: {
    tasks: tasks,
    links: links,
    cellWidth: 80,
    cellHeight: 40,
    scaleHeight: 50,
  },
  render: (args: any) => {
    const { cellWidth, cellHeight, scaleHeight, ...rest } = args;
    return (
      <Gantt
        {...rest}
        tasks={tasks}
        links={links}
        config={{
          columnWidth: cellWidth,
          taskHeight: cellHeight,
          rowHeight: cellHeight ? cellHeight + 12 : 52,
          scaleHeight: scaleHeight,
          weekends: true,
          theme: 'light',
        }}
      />
    );
  },
};
