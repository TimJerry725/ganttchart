# Iris Gantt - Complete Usage Guide

## Installation

```bash
npm install iris-gantt
```

## Quick Start

```tsx
import { Gantt } from 'iris-gantt'
import 'iris-gantt/gantt.css'

function MyGantt() {
  const tasks = [
    {
      id: '1',
      text: 'My Task',
      start: new Date(2024, 0, 1),
      end: new Date(2024, 0, 10),
      duration: 9,
      progress: 50,
    },
  ]

  return <Gantt tasks={tasks} />
}
```

## Import Options

### Named Import (Recommended)
```tsx
import { Gantt } from 'iris-gantt'
import 'iris-gantt/gantt.css'
```

### Default Import
```tsx
import Gantt from 'iris-gantt'
import 'iris-gantt/gantt.css'
```

### CSS Import
```tsx
// Option 1 (preferred)
import 'iris-gantt/gantt.css'

// Option 2 (if Option 1 doesn't work)
import 'iris-gantt/dist/gantt.css'
```

## Basic Usage

```tsx
import { Gantt } from 'iris-gantt'
import 'iris-gantt/gantt.css'
import type { Task, Link } from 'iris-gantt'

function MyGantt() {
  const tasks: Task[] = [
    {
      id: '1',
      text: 'Project Planning',
      start: new Date(2024, 0, 1),
      end: new Date(2024, 0, 15),
      duration: 14,
      progress: 100,
      type: 'project',
    },
    {
      id: '2',
      text: 'Development',
      start: new Date(2024, 0, 15),
      end: new Date(2024, 1, 15),
      duration: 31,
      progress: 60,
      type: 'task',
    },
  ]

  const links: Link[] = [
    { id: 'l1', source: '1', target: '2', type: 'e2s' },
  ]

  return (
    <Gantt
      tasks={tasks}
      links={links}
      onTaskUpdate={(task) => console.log('Updated:', task)}
    />
  )
}
```

## Complete Props Configuration

### Main Props

```tsx
<Gantt
  // Required
  tasks={Task[]}
  
  // Optional
  links={Link[]}
  config={GanttConfig}
  uiConfig={GanttUIConfig}
  styleConfig={GanttStyleConfig}
  iconConfig={GanttIconConfig}
  taskTooltipConfig={TaskTooltipConfig}
  onHoldPeriods={OnHoldPeriodInput[]}
  
  // Event Handlers
  onTaskUpdate={(task: Task) => void}
  onTaskDragUpdate={(payload: TaskDragUpdatePayload) => void}
  onTaskCreate={(task: Task) => void}
  onTaskDelete={(taskId: string) => void}
  onLinkCreate={(link: Link) => void}
  onLinkDelete={(linkId: string) => void}
/>
```

`onTaskDragUpdate` is fired after timeline drag/resize with both previous and updated task data, so you can sync your backend API directly.

### Tooltip Props (API-ready)

```tsx
<Gantt
  tasks={tasks}
  taskTooltipConfig={{
    showTaskName: true,
    showPlannedDates: true,
    showActualDates: true,
    showStatus: true,
    showDependencyRule: true,
    showProgress: true,
    showOwner: true,
    taskNameAccessor: (task) => task.text,
    statusAccessor: (task) => task.status,
    progressAccessor: (task) => task.progress,
    dependencyRuleAccessor: (task, generatedRules) => task.dependencyRule || generatedRules,
  }}
/>
```

## UI Configuration (uiConfig)

All text, labels, and button visibility can be customized:

```tsx
<Gantt
  tasks={tasks}
  uiConfig={{
    // Header
    headerTitle: 'My Project Gantt',
    showHeader: true,
    
    // Toolbar Buttons Visibility
    showAddTaskButton: true,
    showBaselineButton: false, // Baselines are always visible, no button needed
    showZoomButtons: true,
    showExportButtons: true,
    showFilterSearch: true,
    
    // Toolbar Button Labels
    addTaskButtonText: 'Add New Task',
    zoomOutTooltip: 'Zoom Out',
    zoomInTooltip: 'Zoom In',
    resetZoomTooltip: 'Reset Zoom',
    exportCSVTooltip: 'Export to CSV',
    exportExcelTooltip: 'Export to Excel',
    exportJSONTooltip: 'Export to JSON',
    exportPDFTooltip: 'Export to PDF',
    
    // Task Creator Modal
    taskCreatorTitle: 'Create New Task',
    taskCreatorOkText: 'Create',
    taskCreatorCancelText: 'Cancel',
    taskNameLabel: 'Task Name',
    taskNamePlaceholder: 'Enter task name',
    typeLabel: 'Type',
    priorityLabel: 'Priority',
    startDateLabel: 'Start Date',
    durationLabel: 'Duration (days)',
    colorLabel: 'Color',
    progressLabel: 'Progress (%)',
    ownerLabel: 'Owner',
    ownerPlaceholder: 'Assign to...',
    detailsLabel: 'Details',
    detailsPlaceholder: 'Add task description...',
    taskTypeOptions: {
      task: 'Task',
      milestone: 'Milestone',
      project: 'Project',
    },
    priorityOptions: {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
    },
    
    // Task Editor Modal
    taskEditorTitle: 'Edit Task',
    taskEditorSaveText: 'Save',
    taskEditorCancelText: 'Cancel',
    taskEditorDeleteText: 'Delete',
    deleteConfirmTitle: 'Delete Task',
    deleteConfirmContent: 'This action cannot be undone.',
    deleteConfirmOkText: 'Yes, Delete',
    deleteConfirmCancelText: 'No',
    
    // Filter Search
    searchPlaceholder: 'Search tasks...',
    allOwnersText: 'All Owners',
    allStatusText: 'All Status',
    allPriorityText: 'All Priority',
    clearFiltersText: 'Clear',
    statusOptions: {
      all: 'All Status',
      notStarted: 'Not Started',
      inProgress: 'In Progress',
      completed: 'Completed',
    },
    priorityFilterOptions: {
      all: 'All Priority',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
    },
    
    // Column Labels
    columnLabels: {
      name: 'Name',
      dependsOn: 'Depends on',
      duration: 'Duration',
      start: 'Start',
    },
    
    // Validation
    taskNameRequired: 'Please enter task name',
  }}
/>
```

## Style Configuration (styleConfig)

Customize colors, fonts, and spacing to match your project:

```tsx
<Gantt
  tasks={tasks}
  styleConfig={{
    // Colors
    primary: '#37a9ef',
    primarySelected: '#d5eaf7',
    success: '#77d257',
    warning: '#fcba2e',
    danger: '#fe6158',
    background: '#ffffff',
    backgroundAlt: '#f2f3f7',
    backgroundHover: '#eaedf5',
    selectColor: '#eaedf5',
    taskColor: '#37a9ef',
    taskFillColor: 'rgba(0, 0, 0, 0.15)',
    projectColor: '#81C784',
    milestoneColor: '#9c27b0',
    fontColor: '#333333',
    fontColorAlt: '#9fa1ae',
    iconColor: '#9fa1ae',
    borderColor: '#e6e6e6',
    
    // Fonts
    fontFamily: 'Inter, sans-serif',
    fontMono: 'Fira Code, monospace',
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '1.5',
    
    // Spacing
    spacingXS: '4px',
    spacingSM: '8px',
    spacingMD: '12px',
    spacingLG: '16px',
    
    // Custom CSS Variables (advanced)
    customCSSVariables: {
      '--my-custom-var': 'value',
    },
  }}
/>
```

## Icon Configuration (iconConfig)

Customize icons throughout the component:

```tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'

<Gantt
  tasks={tasks}
  iconConfig={{
    // Toolbar icons
    addTask: <FontAwesomeIcon icon={faPlus} />,
    zoomIn: 'search-plus', // FontAwesome icon name
    zoomOut: <CustomIcon />, // Custom React component
    resetZoom: faRotateLeft,
    exportCSV: faFileCsv,
    exportExcel: faFileExcel,
    exportJSON: faFileCode,
    exportPDF: faFilePdf,
    
    // Grid icons
    gripVertical: faGripVertical,
    chevronRight: faChevronRight,
    chevronDown: faChevronDown,
    plus: faPlus,
    
    // Context menu icons
    edit: faEdit,
    delete: faTrash,
    copy: faCopy,
    link: faLink,
    flag: faFlag,
    folder: faFolder,
    tasks: faTasks,
    rotateLeft: faRotateLeft,
  }}
/>
```

## Configuration (config)

```tsx
<Gantt
  tasks={tasks}
  config={{
    // Layout
    columns: Column[], // Custom columns
    scales: Scale[], // Timeline scales
    readonly: false,
    editable: true,
    
    // Sizing
    taskHeight: 28,
    rowHeight: 44,
    scaleHeight: 28,
    columnWidth: 80,
    minColumnWidth: 60,
    
    // Features
    autoSchedule: false,
    criticalPath: false,
    baselines: true, // Always enabled - automatically created
    weekends: true,
    holidays: [],
    
    // Theme
    theme: 'light' | 'dark',
    locale: 'en',
    
    // Responsive
    containerHeight: '100%', // or '600px', '50vh', etc.
    containerMinHeight: '400px',
    gridWidth: 'clamp(280px, 30vw, 720px)', // Responsive width
  }}
/>
```

## Responsive Design

The component is fully responsive and adapts to:
- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile Landscape (480px - 768px)
- ✅ Mobile Portrait (< 480px)

### Responsive Configuration

```tsx
<Gantt
  tasks={tasks}
  config={{
    // Responsive container
    containerHeight: '100%',
    containerMinHeight: '400px',
    
    // Responsive grid width
    gridWidth: 'clamp(280px, 30vw, 720px)', // Adapts to viewport
    // or fixed: '720px'
    // or percentage: '30vw'
  }}
/>
```

### Style Integration

Override CSS variables to match your project:

```css
/* In your project's CSS */
.my-gantt-wrapper {
  /* Colors - Match your brand */
  --wx-gantt-primary: #your-brand-color;
  --wx-gantt-background: var(--your-bg-color, #ffffff);
  --wx-gantt-font-color: var(--your-text-color, #333);
  
  /* Fonts - Use your project fonts */
  --wx-gantt-font-family: 'Your Font', -apple-system, sans-serif;
  --wx-gantt-font-size: 14px;
  
  /* Layout - Responsive sizing */
  --gantt-container-height: 100%;
  --gantt-container-min-height: 400px;
  --gantt-grid-width: clamp(280px, 30vw, 720px);
  --gantt-row-height: 44px;
}
```

## Baselines

Baselines are **always visible** and **automatically created** when tasks are set or updated. No button is needed - baselines are automatically generated from the current task state.

```tsx
// Baselines are automatically created and displayed
<Gantt
  tasks={tasks}
  config={{
    baselines: true, // Always enabled
  }}
/>
```

## Event Handlers

```tsx
<Gantt
  tasks={tasks}
  onTaskUpdate={(task) => {
    console.log('Task updated:', task)
    // Save to your backend
  }}
  onTaskCreate={(task) => {
    console.log('Task created:', task)
    // Add to your backend
  }}
  onTaskDelete={(taskId) => {
    console.log('Task deleted:', taskId)
    // Remove from your backend
  }}
  onLinkCreate={(link) => {
    console.log('Link created:', link)
    // Save dependency to your backend
  }}
  onLinkDelete={(linkId) => {
    console.log('Link deleted:', linkId)
    // Remove dependency from your backend
  }}
/>
```

## Complete Example

```tsx
import React, { useState } from 'react'
import { Gantt } from 'iris-gantt'
import 'iris-gantt/gantt.css'
import type { Task, Link } from 'iris-gantt'

function ProjectGantt() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      text: 'Project Planning',
      start: new Date(2024, 0, 1),
      end: new Date(2024, 0, 15),
      duration: 14,
      progress: 100,
      type: 'project',
      color: '#81C784',
    },
    {
      id: '2',
      text: 'Development',
      start: new Date(2024, 0, 15),
      end: new Date(2024, 1, 15),
      duration: 31,
      progress: 60,
      type: 'task',
      color: '#37a9ef',
      owner: 'John Doe',
      priority: 'high',
    },
  ])

  const [links, setLinks] = useState<Link[]>([
    { id: 'l1', source: '1', target: '2', type: 'e2s' },
  ])

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Gantt
        tasks={tasks}
        links={links}
        config={{
          theme: 'light',
          weekends: true,
          containerHeight: '100%',
          containerMinHeight: '500px',
          gridWidth: 'clamp(300px, 35vw, 800px)',
        }}
        uiConfig={{
          headerTitle: 'My Project Timeline',
          addTaskButtonText: 'New Task',
          showHeader: true,
        }}
        styleConfig={{
          primary: '#6366f1',
          fontFamily: 'Inter, sans-serif',
        }}
        onTaskUpdate={(task) => {
          setTasks(tasks.map(t => t.id === task.id ? task : t))
        }}
        onTaskCreate={(task) => {
          setTasks([...tasks, task])
        }}
        onTaskDelete={(taskId) => {
          setTasks(tasks.filter(t => t.id !== taskId))
        }}
        onLinkCreate={(link) => {
          setLinks([...links, link])
        }}
        onLinkDelete={(linkId) => {
          setLinks(links.filter(l => l.id !== linkId))
        }}
      />
    </div>
  )
}

export default ProjectGantt
```

## Troubleshooting

### CSS Import Error

If you get: `Module not found: Error: Package path ./dist/gantt.css is not exported`

**Solution:**
```tsx
// Try this instead
import 'iris-gantt/gantt.css'
// or
import 'iris-gantt/dist/gantt.css'
```

### Default Import Error

If you get: `export 'default' was not found`

**Solution:**
```tsx
// Use named import instead
import { Gantt } from 'iris-gantt'
```

### Runtime Error: recentlyCreatedOwnerStacks

This is a **cached code issue** in your project, not the package.

**Solution:**
```bash
# In your project directory
rm -rf node_modules package-lock.json .next .cache dist build
npm cache clean --force
npm install
npm start
```

## TypeScript Support

Full TypeScript support is included:

```tsx
import { Gantt } from 'iris-gantt'
import type { Task, Link, GanttConfig, GanttUIConfig, GanttStyleConfig } from 'iris-gantt'

const tasks: Task[] = [...]
const config: GanttConfig = {...}
const uiConfig: GanttUIConfig = {...}
const styleConfig: GanttStyleConfig = {...}
```

## Peer Dependencies

Make sure you have these installed:

```bash
npm install react@^18.3.1 react-dom@^18.3.1
npm install antd@^5.29.3
npm install dayjs@^1.11.0
npm install @fortawesome/fontawesome-svg-core@^7.1.0
npm install @fortawesome/free-solid-svg-icons@^7.1.0
npm install @fortawesome/react-fontawesome@^3.1.0
```

## API Reference

### Task Interface

```tsx
interface Task {
  id: string
  text: string
  start: Date
  end: Date
  plannedStart?: Date
  plannedEnd?: Date
  actualStart?: Date
  actualEnd?: Date
  duration: number
  progress: number
  type?: 'task' | 'milestone' | 'project'
  parent?: string
  open?: boolean
  color?: string
  details?: string
  owner?: string
  priority?: 'low' | 'medium' | 'high'
  status?: string
  onHoldPeriods?: { start: Date; end: Date }[]
  dependencies?: string[]
  dependencyRule?: string[]
  segments?: TaskSegment[]
}
```

### Link Interface

```tsx
interface Link {
  id: string
  source: string
  target: string
  type: 'e2s' | 's2s' | 'e2e' | 's2e'
  lag?: number
  lagUnit?: 'day' | 'hour' | 'week' | 'month'
}
```

## Best Practices

1. **Always import CSS**: `import 'iris-gantt/gantt.css'`
2. **Use TypeScript**: Full type support is available
3. **Handle events**: Use `onTaskUpdate`, `onTaskCreate`, etc. to sync with your backend
4. **Customize styles**: Use `styleConfig` and CSS variables to match your project
5. **Responsive design**: Use `clamp()` for truly responsive widths
6. **Test on mobile**: The component is responsive, test on all devices

## Support

For issues, questions, or contributions, please visit:
- GitHub: https://github.com/TimJerry725/ganttchart.git
