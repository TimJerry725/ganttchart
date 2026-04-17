# iris-gantt

A comprehensive, production-ready Gantt chart component for React with TypeScript support.

## Version 1.6.1

### Updated / Changed
- Day filter now shows a grouped month header row above the day columns.
- Month labels in Day view now use relative format: `Month 0`, `Month 1`, `Month 2`, ...

## 🚀 Quick Install

Install everything in one command:

```bash
npm install iris-gantt react react-dom antd@^5.29.3 dayjs @fortawesome/react-fontawesome@^3.1.0 @fortawesome/fontawesome-svg-core@^7.1.0 @fortawesome/free-solid-svg-icons@^7.1.0
```

Or install separately:

```bash
npm install iris-gantt
npm install react react-dom antd@^5.29.3 dayjs @fortawesome/react-fontawesome@^3.1.0 @fortawesome/fontawesome-svg-core@^7.1.0 @fortawesome/free-solid-svg-icons@^7.1.0
```

## 💻 Basic Usage

**Important:** Don't forget to import the CSS file!

```tsx
import { Gantt } from 'iris-gantt'
import 'iris-gantt/gantt.css'  // ← Required!
import type { Task, Link } from 'iris-gantt'

const tasks: Task[] = [
  {
    id: '1',
    text: 'Project Planning',
    start: new Date(2024, 0, 1),
    end: new Date(2024, 0, 15),
    duration: 14,
    progress: 100,
    type: 'project',
    owner: 'John Smith',
    priority: 'high',
  },
  {
    id: '2',
    text: 'Development',
    start: new Date(2024, 0, 15),
    end: new Date(2024, 1, 15),
    duration: 31,
    progress: 60,
    owner: 'Jane Doe',
    priority: 'high',
  },
]

const links: Link[] = [
  { id: 'l1', source: '1', target: '2', type: 'e2s' },
]

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
      onTaskCreate={(task) => console.log('Created:', task)}
      onTaskDelete={(id) => console.log('Deleted:', id)}
    />
  )
}
```

## Features

### Core Features
- ✅ Multi-column Task Grid
- ✅ Hierarchical Structure (parent/child tasks)
- ✅ Configurable Timeline (hour/day/week/month/quarter/year)
- ✅ Zoom Controls
- ✅ Drag & Drop task bars
- ✅ Task Resize (adjust dates)
- ✅ Dependencies (4 types: e2s, s2s, e2e, s2e)
- ✅ Progress Tracking
- ✅ Task Types (task, milestone, project)
- ✅ Color Coding
- ✅ Light & Dark Themes

### PRO Features
- ✅ Undo/Redo System (Ctrl+Z/Y)
- ✅ Critical Path Analysis
- ✅ Auto-Scheduling
- ✅ Baselines
- ✅ Resource Leveling
- ✅ Task Creation/Editing UI
- ✅ Advanced Filtering & Search
- ✅ Export (CSV, Excel, JSON, PDF)

## API Reference

### Gantt Component Props

```tsx
interface GanttProps {
  tasks: Task[]
  links?: Link[]
  config?: Partial<GanttConfig>
  onTaskUpdate?: (task: Task) => void
  onTaskCreate?: (task: Task) => void
  onTaskDelete?: (taskId: string) => void
  onLinkCreate?: (link: Link) => void
  onLinkDelete?: (linkId: string) => void
  onTimelineViewChange?: (view: 'day' | 'week' | 'month') => void
  showMonthHeading?: boolean
  showRangeHeading?: boolean
  relativeDayNumbering?: boolean
}
```

### Task Interface

```tsx
interface Task {
  id: string
  text: string
  start: Date
  end: Date
  duration: number
  progress: number
  type?: 'task' | 'milestone' | 'project'
  parent?: string
  open?: boolean
  color?: string
  details?: string
  owner?: string
  priority?: 'low' | 'medium' | 'high'
  dependencies?: string[]
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

### GanttConfig Interface

```tsx
interface GanttConfig {
  columns?: Column[]
  scales?: Scale[]
  timelineView?: 'day' | 'week' | 'month'
  timelineViews?: Array<'day' | 'week' | 'month'>
  timelineViewScales?: Partial<Record<'day' | 'week' | 'month', Scale[]>>
  readonly?: boolean
  editable?: boolean
  taskHeight?: number
  rowHeight?: number
  scaleHeight?: number
  columnWidth?: number
  minColumnWidth?: number
  autoSchedule?: boolean
  criticalPath?: boolean
  baselines?: boolean
  markers?: Marker[]
  weekends?: boolean
  holidays?: Date[]
  theme?: 'light' | 'dark'
  locale?: string
  containerHeight?: string
  containerMinHeight?: string
  gridWidth?: string
  showTimelineHeader?: boolean
  showMonthHeading?: boolean
  showRangeHeading?: boolean
  relativeDayNumbering?: boolean
}
```

### Date Formatting

```tsx
<Gantt
  tasks={tasks}
  config={{
    timelineViewScales: {
      day: [
        { unit: 'month', step: 1, format: 'MMMM YYYY' },
        { unit: 'day', step: 1, format: 'D' },
      ],
      week: [
        { unit: 'month', step: 1, format: 'MMM YYYY' },
        { unit: 'week', step: 1, format: 'Week W' },
      ],
    },
  }}
/>
```

See [DATE_FORMATTING_GUIDE.md](./DATE_FORMATTING_GUIDE.md) for the full list of supported date tokens and examples.

## Exports

The package exports the following:

```tsx
// Main component
import { Gantt } from 'iris-gantt'

// Sub-components (if needed)
import { Grid, Chart, Timeline, TaskBar, Toolbar } from 'iris-gantt'

// Utilities
import { useUndoRedo } from 'iris-gantt'
import * as AutoScheduler from 'iris-gantt'
import * as CriticalPath from 'iris-gantt'
import * as ExportUtils from 'iris-gantt'
import { createBaseline } from 'iris-gantt'
import { FilterSearch, applyFilters } from 'iris-gantt'

// Types
import type { Task, Link, GanttConfig, Column, Scale, Marker } from 'iris-gantt'

// CSS (required)
import 'iris-gantt/gantt.css'
```

## Examples

### With Auto-Scheduling

```tsx
<Gantt
  tasks={tasks}
  links={links}
  config={{
    autoSchedule: true,
  }}
/>
```

### With Critical Path

```tsx
<Gantt
  tasks={tasks}
  links={links}
  config={{
    criticalPath: true,
  }}
/>
```

### Dark Theme

```tsx
<Gantt
  tasks={tasks}
  config={{
    theme: 'dark',
  }}
/>
```

## License

MIT

## Links

- [GitHub Repository](https://github.com/TimJerry725/ganttchart)
- [Documentation](./README.md)
- [Date Formatting Guide](./DATE_FORMATTING_GUIDE.md)
