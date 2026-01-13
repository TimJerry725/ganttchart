import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gantt } from '../components/Gantt';
import type { Task, Link } from '../components/types';
import '../components/Gantt/gantt.css';

const meta = {
  title: 'Gantt Chart/Complete Demo',
  component: Gantt,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    config: {
      description: 'Configuration options for the Gantt chart',
    },
  },
} satisfies Meta<typeof Gantt>;

export default meta;
type Story = StoryObj<typeof meta>;

// Comprehensive project data showcasing all features
const comprehensiveTasks: Task[] = [
  // Phase 1: Planning
  {
    id: '1',
    text: '📋 Phase 1: Planning',
    start: new Date(2024, 2, 1),
    end: new Date(2024, 2, 15),
    duration: 14,
    progress: 100,
    type: 'project',
    color: '#9C27B0',
    owner: 'Sarah Johnson',
    priority: 'high',
    details: 'Initial project planning and requirements gathering',
  },
  {
    id: '1.1',
    parent: '1',
    text: 'Requirements Analysis',
    start: new Date(2024, 2, 1),
    end: new Date(2024, 2, 7),
    duration: 7,
    progress: 100,
    owner: 'Sarah Johnson',
    priority: 'high',
    color: '#9C27B0',
  },
  {
    id: '1.2',
    parent: '1',
    text: 'Technical Design',
    start: new Date(2024, 2, 8),
    end: new Date(2024, 2, 15),
    duration: 7,
    progress: 100,
    owner: 'Michael Chen',
    priority: 'high',
    color: '#9C27B0',
  },
  {
    id: '1.3',
    parent: '1',
    text: 'Kickoff Meeting',
    start: new Date(2024, 2, 1),
    end: new Date(2024, 2, 1),
    duration: 0,
    progress: 100,
    type: 'milestone',
    owner: 'Sarah Johnson',
    priority: 'high',
  },

  // Phase 2: Design
  {
    id: '2',
    text: '🎨 Phase 2: Design',
    start: new Date(2024, 2, 15),
    end: new Date(2024, 3, 5),
    duration: 21,
    progress: 85,
    type: 'project',
    color: '#2196F3',
    owner: 'Emily Davis',
    priority: 'high',
    details: 'UI/UX design and prototyping',
  },
  {
    id: '2.1',
    parent: '2',
    text: 'Wireframing',
    start: new Date(2024, 2, 15),
    end: new Date(2024, 2, 22),
    duration: 7,
    progress: 100,
    owner: 'Emily Davis',
    priority: 'high',
    color: '#2196F3',
  },
  {
    id: '2.2',
    parent: '2',
    text: 'UI Design',
    start: new Date(2024, 2, 22),
    end: new Date(2024, 2, 29),
    duration: 7,
    progress: 90,
    owner: 'Emily Davis',
    priority: 'high',
    color: '#2196F3',
  },
  {
    id: '2.3',
    parent: '2',
    text: 'Design Review',
    start: new Date(2024, 2, 29),
    end: new Date(2024, 3, 5),
    duration: 7,
    progress: 60,
    owner: 'Sarah Johnson',
    priority: 'medium',
    color: '#2196F3',
  },
  {
    id: '2.4',
    parent: '2',
    text: 'Design Approval',
    start: new Date(2024, 3, 5),
    end: new Date(2024, 3, 5),
    duration: 0,
    progress: 0,
    type: 'milestone',
    owner: 'Sarah Johnson',
    priority: 'high',
  },

  // Phase 3: Development
  {
    id: '3',
    text: '💻 Phase 3: Development',
    start: new Date(2024, 3, 5),
    end: new Date(2024, 4, 10),
    duration: 35,
    progress: 65,
    type: 'project',
    color: '#4CAF50',
    owner: 'Development Team',
    priority: 'high',
    details: 'Core application development',
  },
  {
    id: '3.1',
    parent: '3',
    text: 'Backend Development',
    start: new Date(2024, 3, 5),
    end: new Date(2024, 3, 26),
    duration: 21,
    progress: 80,
    owner: 'Michael Chen',
    priority: 'high',
    color: '#4CAF50',
  },
  {
    id: '3.2',
    parent: '3',
    text: 'Frontend Development',
    start: new Date(2024, 3, 12),
    end: new Date(2024, 4, 3),
    duration: 21,
    progress: 70,
    owner: 'Alex Rivera',
    priority: 'high',
    color: '#4CAF50',
  },
  {
    id: '3.3',
    parent: '3',
    text: 'API Integration',
    start: new Date(2024, 3, 26),
    end: new Date(2024, 4, 10),
    duration: 14,
    progress: 45,
    owner: 'Michael Chen',
    priority: 'high',
    color: '#4CAF50',
  },
  {
    id: '3.4',
    parent: '3',
    text: 'Database Setup',
    start: new Date(2024, 3, 5),
    end: new Date(2024, 3, 12),
    duration: 7,
    progress: 100,
    owner: 'Michael Chen',
    priority: 'high',
    color: '#4CAF50',
  },

  // Phase 4: Testing
  {
    id: '4',
    text: '🧪 Phase 4: Testing',
    start: new Date(2024, 4, 10),
    end: new Date(2024, 4, 31),
    duration: 21,
    progress: 30,
    type: 'project',
    color: '#FF9800',
    owner: 'QA Team',
    priority: 'high',
    details: 'Quality assurance and testing',
  },
  {
    id: '4.1',
    parent: '4',
    text: 'Unit Testing',
    start: new Date(2024, 4, 10),
    end: new Date(2024, 4, 17),
    duration: 7,
    progress: 50,
    owner: 'Jennifer Lee',
    priority: 'high',
    color: '#FF9800',
  },
  {
    id: '4.2',
    parent: '4',
    text: 'Integration Testing',
    start: new Date(2024, 4, 17),
    end: new Date(2024, 4, 24),
    duration: 7,
    progress: 20,
    owner: 'Jennifer Lee',
    priority: 'high',
    color: '#FF9800',
  },
  {
    id: '4.3',
    parent: '4',
    text: 'User Acceptance Testing',
    start: new Date(2024, 4, 24),
    end: new Date(2024, 4, 31),
    duration: 7,
    progress: 0,
    owner: 'Sarah Johnson',
    priority: 'medium',
    color: '#FF9800',
  },
  {
    id: '4.4',
    parent: '4',
    text: 'Testing Complete',
    start: new Date(2024, 4, 31),
    end: new Date(2024, 4, 31),
    duration: 0,
    progress: 0,
    type: 'milestone',
    owner: 'QA Team',
    priority: 'high',
  },

  // Phase 5: Deployment
  {
    id: '5',
    text: '🚀 Phase 5: Deployment',
    start: new Date(2024, 4, 31),
    end: new Date(2024, 5, 14),
    duration: 14,
    progress: 0,
    type: 'project',
    color: '#E91E63',
    owner: 'DevOps Team',
    priority: 'high',
    details: 'Production deployment and launch',
  },
  {
    id: '5.1',
    parent: '5',
    text: 'Staging Deployment',
    start: new Date(2024, 4, 31),
    end: new Date(2024, 5, 7),
    duration: 7,
    progress: 0,
    owner: 'David Park',
    priority: 'high',
    color: '#E91E63',
  },
  {
    id: '5.2',
    parent: '5',
    text: 'Production Deployment',
    start: new Date(2024, 5, 7),
    end: new Date(2024, 5, 14),
    duration: 7,
    progress: 0,
    owner: 'David Park',
    priority: 'high',
    color: '#E91E63',
  },
  {
    id: '5.3',
    parent: '5',
    text: 'Go Live!',
    start: new Date(2024, 5, 14),
    end: new Date(2024, 5, 14),
    duration: 0,
    progress: 0,
    type: 'milestone',
    owner: 'Sarah Johnson',
    priority: 'high',
  },
];

// Comprehensive dependencies showing all link types
const comprehensiveLinks: Link[] = [
  // Planning dependencies
  { id: 'l1', source: '1.1', target: '1.2', type: 'e2s' }, // End-to-Start
  
  // Design dependencies
  { id: 'l2', source: '1.2', target: '2.1', type: 'e2s' },
  { id: 'l3', source: '2.1', target: '2.2', type: 'e2s' },
  { id: 'l4', source: '2.2', target: '2.3', type: 'e2s' },
  
  // Development dependencies
  { id: 'l5', source: '2.3', target: '3.1', type: 'e2s' },
  { id: 'l6', source: '2.3', target: '3.2', type: 'e2s' },
  { id: 'l7', source: '3.4', target: '3.1', type: 'e2s' }, // DB setup before backend
  { id: 'l8', source: '3.1', target: '3.2', type: 's2s' }, // Start together
  { id: 'l9', source: '3.1', target: '3.3', type: 'e2s' },
  { id: 'l10', source: '3.2', target: '3.3', type: 'e2s' },
  
  // Testing dependencies
  { id: 'l11', source: '3.3', target: '4.1', type: 'e2s' },
  { id: 'l12', source: '4.1', target: '4.2', type: 'e2s' },
  { id: 'l13', source: '4.2', target: '4.3', type: 'e2s' },
  
  // Deployment dependencies
  { id: 'l14', source: '4.3', target: '5.1', type: 'e2s' },
  { id: 'l15', source: '5.1', target: '5.2', type: 'e2s' },
];

/**
 * Complete Demo - ALL Features in One View
 * 
 * This story showcases EVERY feature of the Gantt component:
 * - ✅ Hierarchical tasks (parents & children)
 * - ✅ All task types (tasks, milestones, projects)
 * - ✅ Dependencies with arrows (e2s, s2s, e2e, s2e)
 * - ✅ Drag & drop (move tasks)
 * - ✅ Task resize (adjust dates)
 * - ✅ Progress indicators
 * - ✅ Color coding per task
 * - ✅ Owners and priorities
 * - ✅ Toolbar with ALL controls
 * - ✅ Filter & search panel
 * - ✅ Undo/Redo (Ctrl+Z/Y)
 * - ✅ Auto-scheduling
 * - ✅ Critical path
 * - ✅ Resource leveling
 * - ✅ Baselines (click "Set Baseline" button)
 * - ✅ Export (CSV, Excel, JSON, PDF)
 * - ✅ Task creation (+ Add Task)
 * - ✅ Task editing (double-click any task)
 * - ✅ Zoom controls
 * - ✅ Weekend highlighting
 * 
 * Try these interactions:
 * 1. Click "+ Add Task" to create new tasks
 * 2. Double-click any task to edit it
 * 3. Drag task bars to move them
 * 4. Drag task edges to resize
 * 5. Click "🎯 Critical Path" to highlight critical tasks
 * 6. Click "📍 Set Baseline" to create a baseline snapshot
 * 7. Use filters to search by status, priority, or owner
 * 8. Click "⚡ Auto-Schedule" to auto-arrange tasks
 * 9. Use Ctrl+Z to undo and Ctrl+Y to redo
 * 10. Export data using the export buttons
 */
export const AllFeatures: Story = {
  args: {
    tasks: comprehensiveTasks,
    links: comprehensiveLinks,
    config: {
      weekends: true,
      theme: 'light',
    },
    onTaskUpdate: (task) => console.log('Task updated:', task),
    onTaskCreate: (task) => console.log('Task created:', task),
    onTaskDelete: (taskId) => console.log('Task deleted:', taskId),
  },
};

/**
 * Dark Theme - All Features
 * 
 * Same comprehensive demo but with dark theme enabled.
 */
export const AllFeaturesDarkTheme: Story = {
  args: {
    tasks: comprehensiveTasks,
    links: comprehensiveLinks,
    config: {
      weekends: true,
      theme: 'dark',
    },
    onTaskUpdate: (task) => console.log('Task updated:', task),
    onTaskCreate: (task) => console.log('Task created:', task),
    onTaskDelete: (taskId) => console.log('Task deleted:', taskId),
  },
};

/**
 * Simple Project - Quick Start
 * 
 * A minimal example showing the basics.
 */
const simpleTasks: Task[] = [
  {
    id: '1',
    text: 'Project Planning',
    start: new Date(2024, 2, 1),
    end: new Date(2024, 2, 10),
    duration: 10,
    progress: 100,
    owner: 'John Doe',
    priority: 'high',
  },
  {
    id: '2',
    text: 'Development',
    start: new Date(2024, 2, 10),
    end: new Date(2024, 2, 25),
    duration: 15,
    progress: 60,
    owner: 'Jane Smith',
    priority: 'high',
  },
  {
    id: '3',
    text: 'Testing',
    start: new Date(2024, 2, 25),
    end: new Date(2024, 3, 5),
    duration: 10,
    progress: 20,
    owner: 'Bob Johnson',
    priority: 'medium',
  },
];

const simpleLinks: Link[] = [
  { id: 'l1', source: '1', target: '2', type: 'e2s' },
  { id: 'l2', source: '2', target: '3', type: 'e2s' },
];

export const SimpleProject: Story = {
  args: {
    tasks: simpleTasks,
    links: simpleLinks,
    config: {
      weekends: true,
      theme: 'light',
    },
  },
};
