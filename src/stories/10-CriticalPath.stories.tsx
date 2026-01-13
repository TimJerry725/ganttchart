import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gantt } from '../components/Gantt';
import type { Task, Link } from '../components/types';
import '../components/Gantt/gantt.css';

const meta = {
  title: 'Gantt/Critical Path (PRO)',
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
    text: 'Planning',
    start: new Date(2026, 3, 1),
    end: new Date(2026, 3, 5),
    duration: 4,
    progress: 100,
    color: '#26A69A',
  },
  {
    id: '2',
    text: 'Design',
    start: new Date(2026, 3, 5),
    end: new Date(2026, 3, 12),
    duration: 7,
    progress: 100,
    color: '#42A5F5',
  },
  {
    id: '3',
    text: 'Development - Feature A',
    start: new Date(2026, 3, 12),
    end: new Date(2026, 3, 22),
    duration: 10,
    progress: 80,
    color: '#42A5F5',
  },
  {
    id: '4',
    text: 'Development - Feature B',
    start: new Date(2026, 3, 12),
    end: new Date(2026, 3, 19),
    duration: 7,
    progress: 90,
    color: '#42A5F5',
  },
  {
    id: '5',
    text: 'Testing',
    start: new Date(2026, 3, 22),
    end: new Date(2026, 3, 29),
    duration: 7,
    progress: 30,
    color: '#FF7043',
  },
  {
    id: '6',
    text: 'Deployment',
    start: new Date(2026, 3, 29),
    end: new Date(2026, 4, 3),
    duration: 4,
    progress: 0,
    color: '#9C27B0',
  },
];

const links: Link[] = [
  { id: 'l1', source: '1', target: '2', type: 'e2s' },
  { id: 'l2', source: '2', target: '3', type: 'e2s' },
  { id: 'l3', source: '2', target: '4', type: 'e2s' },
  { id: 'l4', source: '3', target: '5', type: 'e2s' },
  { id: 'l5', source: '4', target: '5', type: 'e2s' },
  { id: 'l6', source: '5', target: '6', type: 'e2s' },
];

/**
 * Critical Path Analysis
 * 
 * Click the "🎯 Critical Path" button to highlight tasks that
 * directly impact the project completion date.
 * 
 * Critical tasks have no slack/float time - any delay will
 * delay the entire project.
 * 
 * In this example, the critical path is:
 * Planning → Design → Development A → Testing → Deployment
 * 
 * Feature B has slack time and is not on the critical path.
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
