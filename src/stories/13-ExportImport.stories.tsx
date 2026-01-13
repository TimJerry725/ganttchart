import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gantt } from '../components/Gantt';
import type { Task, Link } from '../components/types';
import '../components/Gantt/gantt.css';

const meta = {
  title: 'Gantt/Export & Import (PRO)',
  component: Gantt,
  parameters: {
    layout: 'fullscreen',
    badges: ['PRO'],
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
    owner: 'John Doe',
    priority: 'high',
  },
  {
    id: '2',
    text: 'Development',
    start: new Date(2026, 3, 15),
    end: new Date(2026, 4, 15),
    duration: 30,
    progress: 60,
    color: '#42A5F5',
    owner: 'Jane Smith',
    priority: 'high',
  },
  {
    id: '3',
    text: 'Testing',
    start: new Date(2026, 4, 15),
    end: new Date(2026, 5, 1),
    duration: 16,
    progress: 30,
    color: '#FF7043',
    owner: 'Bob Johnson',
    priority: 'medium',
  },
];

const links: Link[] = [
  { id: 'l1', source: '1', target: '2', type: 'e2s' },
  { id: 'l2', source: '2', target: '3', type: 'e2s' },
];

/**
 * Export & Import Data
 * 
 * Use the export buttons in the toolbar to download project data:
 * 
 * - CSV - Simple comma-separated format (tasks only)
 * - 📊 Excel - .xls file with task data
 * - 📄 JSON - Complete project data (tasks + links, can be re-imported)
 * - 📋 PDF - Printable task report
 * 
 * JSON export includes all task properties and dependencies,
 * allowing you to backup and restore complete project state.
 */
export const Default: Story = {
  args: {
    tasks,
    links,
    config: {
      weekends: true,
      theme: 'light',
    },
  },
};
