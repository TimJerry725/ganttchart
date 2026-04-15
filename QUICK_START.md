# Quick Start Guide

## Installation

```bash
npm install iris-gantt
```

## Install Peer Dependencies

```bash
npm install react@^18.3.1 react-dom@^18.3.1 antd@^5.29.3 dayjs@^1.11.0 @fortawesome/fontawesome-svg-core@^7.1.0 @fortawesome/free-solid-svg-icons@^7.1.0 @fortawesome/react-fontawesome@^3.1.0
```

## Basic Usage

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

## CSS Import

**Important:** Always import the CSS file!

```tsx
// Option 1 (preferred)
import 'iris-gantt/gantt.css'

// Option 2 (if Option 1 doesn't work)
import 'iris-gantt/dist/gantt.css'
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
        }}
        onTaskUpdate={(task) => {
          setTasks(tasks.map(t => t.id === task.id ? task : t))
        }}
      />
    </div>
  )
}

export default ProjectGantt
```

## Customization

### Customize Text & Buttons

```tsx
<Gantt
  tasks={tasks}
  uiConfig={{
    headerTitle: 'My Project',
    addTaskButtonText: 'Add Task',
    showAddTaskButton: true,
    showZoomButtons: true,
    // ... see USAGE.md for all options
  }}
/>
```

### Customize Colors & Fonts

```tsx
<Gantt
  tasks={tasks}
  styleConfig={{
    primary: '#your-color',
    fontFamily: 'Your Font, sans-serif',
    // ... see USAGE.md for all options
  }}
/>
```

### Responsive Design

```tsx
<Gantt
  tasks={tasks}
  config={{
    containerHeight: '100%',
    containerMinHeight: '400px',
    gridWidth: 'clamp(280px, 30vw, 720px)', // Responsive
  }}
/>
```

### Customize Date Formats

```tsx
<Gantt
  tasks={tasks}
  config={{
    timelineView: 'week',
    timelineViewScales: {
      day: [
        { unit: 'month', step: 1, format: 'MMMM YYYY' },
        { unit: 'day', step: 1, format: 'D' },
      ],
      week: [
        { unit: 'month', step: 1, format: 'MMM YYYY' },
        { unit: 'week', step: 1, format: 'Week W' },
      ],
      month: [
        { unit: 'year', step: 1, format: 'YYYY' },
        { unit: 'month', step: 1, format: 'MMM' },
      ],
    },
    relativeDayNumbering: false,
  }}
/>
```

For all supported date tokens and more examples, see [DATE_FORMATTING_GUIDE.md](./DATE_FORMATTING_GUIDE.md).

## Troubleshooting

### CSS Import Error
```tsx
// Try this instead
import 'iris-gantt/gantt.css'
// or
import 'iris-gantt/dist/gantt.css'
```

### Default Import Error
```tsx
// Use named import instead
import { Gantt } from 'iris-gantt'
```

### Runtime Error: recentlyCreatedOwnerStacks
This is a cached code issue. Clear caches:
```bash
rm -rf node_modules package-lock.json .next .cache dist build
npm cache clean --force
npm install
```

## Next Steps

- Read [USAGE.md](./USAGE.md) for complete documentation
- Read [DATE_FORMATTING_GUIDE.md](./DATE_FORMATTING_GUIDE.md) for timeline header date formats
- Read [RESPONSIVE_STYLING.md](./RESPONSIVE_STYLING.md) for responsive design
- Read [CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md) for advanced customization
