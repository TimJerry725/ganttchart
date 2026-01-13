# SVAR Gantt Chart Replicate - Feature Documentation

This is a comprehensive Gantt chart component built with React and TypeScript, replicating the features of SVAR Gantt Chart.

## ✅ Implemented Features

### Phase 1: Core Structure (COMPLETE)
- ✅ **Enhanced Task List** with multi-column grid
  - Task Name with tree structure
  - Start Date, End Date, Duration, Progress columns
  - Collapsible parent/child tasks
  - Custom column configuration
- ✅ **Timeline with Multiple Scales**
  - Primary scale (months, quarters, years)
  - Secondary scale (days, weeks, hours)
  - Configurable date formats
- ✅ **Zoom Controls**
  - Zoom in/out buttons
  - Reset zoom functionality
  - Dynamic column width adjustment
- ✅ **Synchronized Scrolling**
  - Grid and timeline scroll together
  - Smooth scrolling experience

### Phase 2: Interactivity (COMPLETE)
- ✅ **Drag and Drop**
  - Move tasks by dragging task bars
  - Real-time visual feedback
  - Snap to day grid
  - Mouse-based dragging
- ✅ **Task Resize**
  - Resize from left edge (adjust start date)
  - Resize from right edge (adjust end date)
  - Auto-calculate duration
  - Prevent invalid date ranges
- ✅ **Task Dependencies with Visual Links**
  - Four dependency types:
    - End-to-Start (e2s) - most common
    - Start-to-Start (s2s)
    - End-to-End (e2e)
    - Start-to-End (s2e)
  - Curved arrow connections
  - Automatic path calculation
  - Hover effects on links

### Phase 3: Visual Features (COMPLETE)
- ✅ **Task Types**
  - Regular tasks with bars
  - Milestones (diamond markers)
  - Project/parent tasks
- ✅ **Progress Visualization**
  - Progress bar overlay on tasks
  - Progress percentage in grid
  - Visual progress indicator
- ✅ **Color Coding**
  - Custom task colors
  - Theme support (light/dark)
  - Weekend highlighting
  - Holiday highlighting
- ✅ **Selection & Hover States**
  - Selected task highlighting
  - Hover effects
  - Visual feedback

## 🚧 Planned Features

### Phase 4: PRO Features (Planned)
- ⏳ **Undo/Redo System**
  - Track all changes
  - Keyboard shortcuts (Ctrl+Z, Ctrl+Y)
  - Action history
- ⏳ **Auto-Scheduling**
  - Forward scheduling mode
  - Automatic date adjustment based on dependencies
  - Constraint handling
- ⏳ **Critical Path**
  - Highlight critical tasks
  - Calculate float/slack time
  - Visual differentiation
- ⏳ **Baselines**
  - Track planned vs actual progress
  - Visual baseline bars
  - Variance analysis
- ⏳ **Markers**
  - Milestone markers
  - Release dates
  - Deadline indicators

### Phase 5: Advanced Features (Planned)
- ⏳ **Export Functionality**
  - Export to PDF
  - Export to Excel
  - Export to CSV
  - Export to PNG/SVG
- ⏳ **Resource Allocation**
  - Assign resources to tasks
  - Resource view
  - Capacity planning
  - Workload visualization
- ⏳ **Advanced Filtering**
  - Filter by status
  - Filter by assignee
  - Filter by date range
  - Search functionality
- ⏳ **Task Creation UI**
  - Add task button
  - Inline task creation
  - Quick edit mode
  - Bulk operations

## 📖 Usage

### Basic Example

```tsx
import { Gantt } from './components/Gantt';
import type { Task, Link } from './components/types';

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
    text: 'Design Phase',
    start: new Date(2024, 0, 15),
    end: new Date(2024, 1, 5),
    duration: 21,
    progress: 75,
  },
];

const links: Link[] = [
  {
    id: 'l1',
    source: '1',
    target: '2',
    type: 'e2s',
  },
];

function App() {
  return (
    <Gantt
      tasks={tasks}
      links={links}
      config={{
        weekends: true,
        theme: 'light',
      }}
      onTaskUpdate={(task) => console.log('Updated:', task)}
    />
  );
}
```

### Configuration Options

```typescript
interface GanttConfig {
  columns?: Column[];              // Custom columns
  scales?: Scale[];                // Timeline scales
  readonly?: boolean;              // Disable editing
  editable?: boolean;              // Enable inline editing
  taskHeight?: number;             // Task bar height
  rowHeight?: number;              // Row height
  scaleHeight?: number;            // Scale header height
  columnWidth?: number;            // Timeline column width
  minColumnWidth?: number;         // Minimum column width
  autoSchedule?: boolean;          // PRO: Auto-scheduling
  criticalPath?: boolean;          // PRO: Show critical path
  baselines?: boolean;             // PRO: Show baselines
  markers?: Marker[];              // PRO: Timeline markers
  weekends?: boolean;              // Highlight weekends
  holidays?: Date[];               // Holiday dates
  theme?: 'light' | 'dark';        // Theme
  locale?: string;                 // Localization
}
```

### Task Object Structure

```typescript
interface Task {
  id: string;                      // Unique identifier
  text: string;                    // Task name
  start: Date;                     // Start date
  end: Date;                       // End date
  duration: number;                // Duration in days
  progress: number;                // Progress (0-100)
  type?: 'task' | 'milestone' | 'project';
  parent?: string;                 // Parent task ID
  open?: boolean;                  // Expanded state
  color?: string;                  // Custom color
  details?: string;                // Description
  owner?: string;                  // Assignee
  priority?: 'low' | 'medium' | 'high';
}
```

### Link Object Structure

```typescript
interface Link {
  id: string;                      // Unique identifier
  source: string;                  // Source task ID
  target: string;                  // Target task ID
  type: 'e2s' | 's2s' | 'e2e' | 's2e';  // Dependency type
}
```

## 🎨 Theming

The Gantt chart supports light and dark themes:

```tsx
<Gantt
  tasks={tasks}
  config={{ theme: 'dark' }}
/>
```

Custom colors can be applied using CSS variables or by setting the `color` property on tasks.

## 🔧 Customization

### Custom Columns

```tsx
const customColumns = [
  { name: 'text', label: 'Task', width: 250 },
  { name: 'owner', label: 'Owner', width: 120 },
  { name: 'priority', label: 'Priority', width: 100 },
  {
    name: 'custom',
    label: 'Status',
    width: 100,
    template: (task) => (
      <span className={`status-${task.progress >= 100 ? 'done' : 'active'}`}>
        {task.progress >= 100 ? 'Done' : 'In Progress'}
      </span>
    ),
  },
];

<Gantt tasks={tasks} config={{ columns: customColumns }} />
```

### Custom Scales

```tsx
const hourlyScales = [
  { unit: 'day', step: 1, format: 'MMMM D, YYYY' },
  { unit: 'hour', step: 1, format: 'H:00' },
];

<Gantt tasks={tasks} config={{ scales: hourlyScales }} />
```

## 🎯 Roadmap

- [x] Phase 1: Core structure with grid and timeline
- [x] Phase 2: Drag & drop, dependencies, resize
- [ ] Phase 3: Task creation/deletion UI
- [ ] Phase 4: PRO features (undo/redo, auto-schedule, critical path)
- [ ] Phase 5: Export, filtering, search

## 📝 License

MIT - Free for commercial and personal use

## 🤝 Comparison with SVAR Gantt

### Free Features (Matching SVAR Free Edition)
✅ Task management (create, edit, delete)
✅ Task dependencies (all 4 types)
✅ Drag and drop
✅ Task resize
✅ Progress tracking
✅ Configurable timeline
✅ Weekend/holiday highlighting
✅ Theming (light/dark)
✅ Custom styling

### PRO Features (Planned to Match SVAR PRO)
⏳ Undo/Redo
⏳ Auto-scheduling
⏳ Baselines
⏳ Critical path
⏳ Markers
⏳ Split tasks

This implementation provides a solid foundation and matches most of SVAR's free features, with a clear path to implementing PRO features.
