import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gantt } from '../components/Gantt/Gantt';
import type { Task, Link } from '../components/types';

const meta: Meta<typeof Gantt> = {
  title: 'Gantt/17. Task Dependencies',
  component: Gantt,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Gantt>;

// Sample tasks for dependencies demo
const tasksWithDependencies: Task[] = [
  {
    id: '1',
    text: 'Project Planning',
    start: new Date(2024, 5, 3),
    end: new Date(2024, 5, 7),
    duration: 4,
    progress: 100,
    type: 'task',
    owner: 'Alice',
    priority: 'high',
  },
  {
    id: '2',
    text: 'Requirements Analysis',
    start: new Date(2024, 5, 8),
    end: new Date(2024, 5, 14),
    duration: 6,
    progress: 100,
    type: 'task',
    owner: 'Bob',
    priority: 'high',
  },
  {
    id: '3',
    text: 'Design Phase',
    start: new Date(2024, 5, 15),
    end: new Date(2024, 5, 21),
    duration: 6,
    progress: 75,
    type: 'task',
    owner: 'Charlie',
    priority: 'medium',
  },
  {
    id: '4',
    text: 'Development - Frontend',
    start: new Date(2024, 5, 22),
    end: new Date(2024, 6, 5),
    duration: 13,
    progress: 40,
    type: 'task',
    owner: 'David',
    priority: 'high',
  },
  {
    id: '5',
    text: 'Development - Backend',
    start: new Date(2024, 5, 22),
    end: new Date(2024, 6, 5),
    duration: 13,
    progress: 35,
    type: 'task',
    owner: 'Eve',
    priority: 'high',
  },
  {
    id: '6',
    text: 'Testing & QA',
    start: new Date(2024, 6, 6),
    end: new Date(2024, 6, 12),
    duration: 6,
    progress: 0,
    type: 'task',
    owner: 'Frank',
    priority: 'high',
  },
  {
    id: '7',
    text: 'Deployment',
    start: new Date(2024, 6, 13),
    end: new Date(2024, 6, 15),
    duration: 2,
    progress: 0,
    type: 'milestone',
    owner: 'Alice',
    priority: 'high',
  },
];

// Different dependency types
const finishToStartLinks: Link[] = [
  {
    id: 'link-1',
    source: '1',
    target: '2',
    type: 'e2s', // Finish-to-Start (FS): Requirements start after Planning finishes
  },
  {
    id: 'link-2',
    source: '2',
    target: '3',
    type: 'e2s', // Finish-to-Start: Design starts after Requirements finish
  },
  {
    id: 'link-3',
    source: '3',
    target: '4',
    type: 'e2s', // Frontend starts after Design finishes
  },
  {
    id: 'link-4',
    source: '3',
    target: '5',
    type: 'e2s', // Backend starts after Design finishes
  },
  {
    id: 'link-5',
    source: '4',
    target: '6',
    type: 'e2s', // Testing starts after Frontend finishes
  },
  {
    id: 'link-6',
    source: '5',
    target: '6',
    type: 'e2s', // Testing starts after Backend finishes
  },
  {
    id: 'link-7',
    source: '6',
    target: '7',
    type: 'e2s', // Deployment starts after Testing finishes
  },
];

const startToStartLinks: Link[] = [
  {
    id: 'link-1',
    source: '1',
    target: '2',
    type: 'e2s',
  },
  {
    id: 'link-2',
    source: '2',
    target: '3',
    type: 'e2s',
  },
  {
    id: 'link-3',
    source: '3',
    target: '4',
    type: 's2s', // Start-to-Start: Frontend and Backend start together
  },
  {
    id: 'link-4',
    source: '3',
    target: '5',
    type: 's2s',
  },
  {
    id: 'link-5',
    source: '4',
    target: '6',
    type: 'e2s',
  },
  {
    id: 'link-6',
    source: '5',
    target: '6',
    type: 'e2s',
  },
  {
    id: 'link-7',
    source: '6',
    target: '7',
    type: 'e2s',
  },
];

const finishToFinishLinks: Link[] = [
  {
    id: 'link-1',
    source: '1',
    target: '2',
    type: 'e2s',
  },
  {
    id: 'link-2',
    source: '2',
    target: '3',
    type: 'e2s',
  },
  {
    id: 'link-3',
    source: '3',
    target: '4',
    type: 's2s',
  },
  {
    id: 'link-4',
    source: '3',
    target: '5',
    type: 's2s',
  },
  {
    id: 'link-5',
    source: '4',
    target: '6',
    type: 'e2e', // Finish-to-Finish: Frontend and Testing finish together
  },
  {
    id: 'link-6',
    source: '5',
    target: '6',
    type: 'e2e', // Backend and Testing finish together
  },
  {
    id: 'link-7',
    source: '6',
    target: '7',
    type: 'e2s',
  },
];

const linksWithLag: Link[] = [
  {
    id: 'link-1',
    source: '1',
    target: '2',
    type: 'e2s',
    lag: 2, // 2 days lag (delay)
  },
  {
    id: 'link-2',
    source: '2',
    target: '3',
    type: 'e2s',
    lag: -3, // 3 days lead (overlap)
  },
  {
    id: 'link-3',
    source: '3',
    target: '4',
    type: 'e2s',
    lag: 1,
  },
  {
    id: 'link-4',
    source: '3',
    target: '5',
    type: 'e2s',
    lag: 1,
  },
  {
    id: 'link-5',
    source: '4',
    target: '6',
    type: 'e2s',
  },
  {
    id: 'link-6',
    source: '5',
    target: '6',
    type: 'e2s',
  },
  {
    id: 'link-7',
    source: '6',
    target: '7',
    type: 'e2s',
    lag: 0,
  },
];

/**
 * ## Basic Dependencies
 * 
 * Demonstrates **Finish-to-Start (FS)** dependencies - the most common type.
 * Each task must finish before its successor can start.
 * 
 * **How to use:**
 * 1. Select any task in the grid
 * 2. Click the "Dependencies" button in the toolbar
 * 3. Add, edit, or remove dependencies
 * 
 * **Dependency Flow:**
 * - Planning → Requirements → Design → Development → Testing → Deployment
 */
export const FinishToStart: Story = {
  args: {
    tasks: tasksWithDependencies,
    links: finishToStartLinks,
    config: {
      weekends: true,
      theme: 'light',
    },
  },
};

/**
 * ## Start-to-Start Dependencies
 * 
 * Shows **Start-to-Start (SS)** dependencies where tasks start at the same time.
 * 
 * **Example:** Frontend and Backend development start together after Design is complete.
 * 
 * **Use cases:**
 * - Parallel workstreams
 * - Team coordination
 * - Concurrent activities
 */
export const StartToStart: Story = {
  args: {
    tasks: tasksWithDependencies,
    links: startToStartLinks,
    config: {
      weekends: true,
      theme: 'light',
    },
  },
};

/**
 * ## Finish-to-Finish Dependencies
 * 
 * Demonstrates **Finish-to-Finish (FF)** dependencies where tasks finish together.
 * 
 * **Example:** Frontend, Backend, and Testing all complete at the same time.
 * 
 * **Use cases:**
 * - Synchronized completion
 * - Milestone coordination
 * - Phase gates
 */
export const FinishToFinish: Story = {
  args: {
    tasks: tasksWithDependencies,
    links: finishToFinishLinks,
    config: {
      weekends: true,
      theme: 'light',
    },
  },
};

/**
 * ## Lead and Lag Times
 * 
 * Shows how **lead time** (negative lag) and **lag time** (positive lag) work:
 * 
 * - **Lag Time (positive):** Adds a delay between tasks
 *   - Example: +2d lag means wait 2 days after predecessor finishes
 * - **Lead Time (negative):** Allows overlap between tasks
 *   - Example: -3d lead means start 3 days before predecessor finishes
 * 
 * **In this example:**
 * - Planning → Requirements: +2 days lag (delay)
 * - Requirements → Design: -3 days lead (overlap)
 * - Design → Development: +1 day lag
 * 
 * **Keyboard shortcut format:**
 * `[TaskID][Type]+/-[Days]d`
 * 
 * Examples:
 * - `3FS+10d` = Task 3, Finish-to-Start, 10 days lag
 * - `2SS-5d` = Task 2, Start-to-Start, 5 days lead
 */
export const LeadAndLag: Story = {
  args: {
    tasks: tasksWithDependencies,
    links: linksWithLag,
    config: {
      weekends: true,
      theme: 'light',
    },
  },
};

/**
 * ## Critical Path
 * 
 * Shows the **critical path** - the longest sequence of dependent tasks that determines the project finish date.
 * 
 * **Features:**
 * - Toggle the "🎯 Critical Path" button to highlight critical tasks in red
 * - Critical tasks have no scheduling flexibility (zero float)
 * - Any delay in critical tasks delays the entire project
 * 
 * **How to identify critical path:**
 * 1. Click "Critical Path" in the toolbar
 * 2. Critical tasks are highlighted in red
 * 3. These tasks require the most attention
 * 
 * **In this example, the critical path is:**
 * Planning → Requirements → Design → Frontend Development → Testing → Deployment
 */
export const CriticalPath: Story = {
  args: {
    tasks: tasksWithDependencies,
    links: finishToStartLinks,
    config: {
      weekends: true,
      theme: 'light',
      criticalPath: true,
    },
  },
};

/**
 * ## Complex Dependencies
 * 
 * Real-world scenario with mixed dependency types:
 * - Finish-to-Start for sequential work
 * - Start-to-Start for parallel work
 * - Lead/lag times for realistic scheduling
 * 
 * **Try it out:**
 * 1. Select "Development - Frontend" task
 * 2. Click "Dependencies" button
 * 3. View existing dependencies
 * 4. Add new dependency to "Testing & QA"
 * 5. Try different dependency types
 * 6. Add lead/lag times
 * 
 * **Dependency Types Explained:**
 * 
 * | Type | Code | Description | Example |
 * |------|------|-------------|---------|
 * | Finish-to-Start | FS (e2s) | Successor starts after predecessor finishes | Build → Test |
 * | Start-to-Start | SS (s2s) | Both tasks start together | Design UI → Design UX |
 * | Finish-to-Finish | FF (e2e) | Both tasks finish together | Development → Documentation |
 * | Start-to-Finish | SF (s2e) | Successor finishes when predecessor starts | Night shift → Day shift |
 */
export const ComplexDependencies: Story = {
  args: {
    tasks: [
      ...tasksWithDependencies,
      {
        id: '8',
        text: 'Performance Monitoring',
        start: new Date(2024, 6, 16),
        end: new Date(2024, 6, 22),
        duration: 6,
        progress: 0,
        type: 'task',
        owner: 'Grace',
        priority: 'medium',
      },
      {
        id: '9',
        text: 'Documentation',
        start: new Date(2024, 6, 6),
        end: new Date(2024, 6, 15),
        duration: 9,
        progress: 0,
        type: 'task',
        owner: 'Henry',
        priority: 'low',
      },
    ],
    links: [
      ...linksWithLag,
      {
        id: 'link-8',
        source: '7',
        target: '8',
        type: 'e2s',
      },
      {
        id: 'link-9',
        source: '5',
        target: '9',
        type: 's2s', // Documentation starts with Backend
      },
      {
        id: 'link-10',
        source: '9',
        target: '7',
        type: 'e2e', // Documentation finishes when Deployment finishes
      },
    ],
    config: {
      weekends: true,
      theme: 'light',
    },
  },
};

/**
 * ## Auto-Scheduling with Dependencies
 * 
 * Demonstrates **automatic scheduling** based on dependencies.
 * 
 * **How it works:**
 * 1. Modify a task's dates (drag or edit)
 * 2. Click "⚡ Auto-Schedule" button
 * 3. All dependent tasks are automatically rescheduled
 * 
 * **Rules:**
 * - Respects dependency types (FS, SS, FF, SF)
 * - Accounts for lead/lag times
 * - Skips weekends if configured
 * - Maintains task durations
 * 
 * **Try it:**
 * 1. Edit "Project Planning" dates
 * 2. Click "Auto-Schedule"
 * 3. Watch all dependent tasks reschedule automatically
 */
export const AutoScheduling: Story = {
  args: {
    tasks: tasksWithDependencies,
    links: finishToStartLinks,
    config: {
      weekends: true,
      theme: 'light',
      autoSchedule: true,
    },
  },
};

/**
 * ## Dark Theme with Dependencies
 * 
 * All dependency features work beautifully in dark mode.
 * 
 * **Features available:**
 * - Dependency editor
 * - Lead/lag times
 * - Critical path visualization
 * - All dependency types
 */
export const DarkTheme: Story = {
  args: {
    tasks: tasksWithDependencies,
    links: linksWithLag,
    config: {
      weekends: true,
      theme: 'dark',
      criticalPath: true,
    },
  },
};
