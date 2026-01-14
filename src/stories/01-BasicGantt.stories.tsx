import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gantt } from '../components';
import type { Task, Link } from '../components/types';
import '../components/gantt.css';

const meta = {
  title: 'Gantt/Basic Gantt',
  component: Gantt,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Gantt>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic project data matching the reference image
const basicTasks: Task[] = [
  // Project Planning
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
  
  // Project Management
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
  
  // Development
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
  
  // Testing
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
  {
    id: '4.2',
    parent: '4',
    text: 'Testing basic functionality',
    start: new Date(2026, 3, 15),
    end: new Date(2026, 3, 21),
    duration: 6,
    progress: 70,
    color: '#42A5F5',
  },
  {
    id: '4.3',
    parent: '4',
    text: 'Testing MVA',
    start: new Date(2026, 3, 30),
    end: new Date(2026, 4, 3),
    duration: 3,
    progress: 0,
    color: '#42A5F5',
  },
  {
    id: '4.4',
    parent: '4',
    text: 'Beta testing',
    start: new Date(2026, 3, 23),
    end: new Date(2026, 4, 3),
    duration: 10,
    progress: 20,
    color: '#42A5F5',
  },
  
  // Release
  {
    id: '5',
    text: 'Release 1.0.0',
    start: new Date(2026, 4, 3),
    end: new Date(2026, 4, 3),
    duration: 0,
    progress: 0,
    type: 'milestone',
  },
];

const basicLinks: Link[] = [
  { id: 'l1', source: '1.1', target: '1.2', type: 'e2s' },
  { id: 'l2', source: '1.2', target: '1.3', type: 'e2s' },
  { id: 'l3', source: '2.1', target: '2.2', type: 'e2s' },
  { id: 'l4', source: '2.2', target: '2.3', type: 'e2s' },
  { id: 'l5', source: '2.3', target: '2.4', type: 'e2s' },
  { id: 'l6', source: '3.1', target: '3.2', type: 'e2s' },
  { id: 'l7', source: '3.2', target: '3.3', type: 'e2s' },
  { id: 'l8', source: '4.1', target: '4.2', type: 'e2s' },
  { id: 'l9', source: '4.2', target: '4.3', type: 'e2s' },
  { id: 'l10', source: '3.3', target: '4.3', type: 'e2s' },
  { id: 'l11', source: '4.3', target: '5', type: 'e2s' },
];

/**
 * Basic Gantt Chart
 * 
 * A standard Gantt chart with:
 * - Hierarchical task structure
 * - Project phases with subtasks
 * - Task dependencies
 * - Milestones
 * - Progress indicators
 * - Color-coded tasks
 */
export const Default: Story = {
  args: {
    tasks: basicTasks,
    links: basicLinks,
    config: {
      weekends: true,
      theme: 'light',
    },
  },
};

/**
 * Dark Theme
 */
export const DarkTheme: Story = {
  args: {
    tasks: basicTasks,
    links: basicLinks,
    config: {
      weekends: true,
      theme: 'dark',
    },
  },
};
