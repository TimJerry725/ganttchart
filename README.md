# Iris Gantt

A comprehensive, production-ready Gantt chart component built with React and TypeScript. Easy to install, simple to use, fully customizable, and responsive.

## 🆕 Version 1.3.7 (Latest)

### Included Changes
- Added direct OnHold support in `tasks` props for API payloads.
- `tasks` now accepts `onHoldPeriods` and `on_hold_periods`.
- OnHold date fields now accept `Date`, ISO date strings, or timestamps and are normalized internally.
- Improved dependency arrow routing with cleaner orthogonal bends between rows.
- Updated arrowheads from filled triangles to open chevrons.
- Reduced line-to-arrowhead gap for tighter arrow joins.
- Adjusted arrow anchors to improve source/target alignment on bars.
- Synced rendered row height with drag/link math to prevent arrow misalignment across rows.

## ✨ Features

### Core Features
- ✅ Interactive task management
- ✅ Drag & drop task bars
- ✅ Task dependencies with 4 link types (end-to-start, start-to-start, end-to-end, start-to-end)
- ✅ Hierarchical tasks (parent/child)
- ✅ Progress tracking
- ✅ Multiple task types (task, milestone, project)
- ✅ Customizable timeline scales
- ✅ Light & dark themes

### Advanced Features
- ✅ Auto-scheduling
- ✅ Critical path analysis
- ✅ **Baselines (always visible, automatically created)**
- ✅ Undo/Redo (Ctrl+Z/Y)
- ✅ Export (CSV, Excel, JSON, PDF)
- ✅ Filtering & search
- ✅ Resource leveling
- ✅ **Fully responsive** (desktop, tablet, mobile)
- ✅ **Fully customizable** (all text, buttons, colors, fonts)

## 📦 Installation

```bash
npm install iris-gantt
```

### Peer Dependencies

Make sure you have these installed:

```bash
npm install react@^18.3.1 react-dom@^18.3.1
npm install antd@^5.29.3
npm install dayjs@^1.11.0
npm install @fortawesome/fontawesome-svg-core@^7.1.0
npm install @fortawesome/free-solid-svg-icons@^7.1.0
npm install @fortawesome/react-fontawesome@^3.1.0
```

## 🚀 Quick Start

```tsx
import { Gantt } from 'iris-gantt'
import 'iris-gantt/gantt.css'

function MyGantt() {
  const tasks = [
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
    },
  ]

  return <Gantt tasks={tasks} />
}
```

## 📚 Documentation

- **[Complete Usage Guide](./USAGE.md)** - Comprehensive documentation with all props and examples
- **[API Reference](./USAGE.md#api-reference)** - Full TypeScript API
- **[Responsive Design Guide](./RESPONSIVE_STYLING.md)** - How to make it responsive and match your project styles
- **[Customization Guide](./CUSTOMIZATION_GUIDE.md)** - Advanced customization options

## 🎯 Common Imports

```tsx
// Main component (named import - recommended)
import { Gantt } from 'iris-gantt'

// Main component (default import - also works)
import Gantt from 'iris-gantt'

// Types
import type { Task, Link, GanttConfig, GanttUIConfig, GanttStyleConfig } from 'iris-gantt'

// CSS (required!)
import 'iris-gantt/gantt.css'
```

## 🔧 Basic Configuration

```tsx
<Gantt
  tasks={tasks}
  links={links}
  config={{
    theme: 'light',
    weekends: true,
    containerHeight: '100%',
    containerMinHeight: '400px',
  }}
  onTaskUpdate={(task) => console.log('Updated:', task)}
/>
```

## ⏸️ OnHold In `tasks` Props

You can pass paused periods directly inside each task using either:
- `onHoldPeriods` (camelCase)
- `on_hold_periods` (snake_case API style)

Date values can be `Date`, ISO date string, or timestamp number.

```tsx
<Gantt
  tasks={[
    {
      id: 1,
      text: 'Development',
      start: '2026-02-01',
      end: '2026-02-20',
      duration: 19,
      progress: 45,
      on_hold_periods: [
        { start: '2026-02-06', end: '2026-02-09' },
        { start: '2026-02-12', end: '2026-02-13' },
      ],
    },
  ]}
/>
```

## 🎨 Full Customization

### UI Configuration (All Text & Buttons)

```tsx
<Gantt
  tasks={tasks}
  uiConfig={{
    // Header
    headerTitle: 'My Project Gantt',
    showHeader: true,
    
    // Toolbar Buttons
    showAddTaskButton: true,
    showZoomButtons: true,
    showExportButtons: true,
    showFilterSearch: true,
    addTaskButtonText: 'Add New Task',
    
    // All labels, placeholders, tooltips are configurable
    // See USAGE.md for complete list
  }}
/>
```

### Style Configuration (Colors & Fonts)

```tsx
<Gantt
  tasks={tasks}
  styleConfig={{
    // Colors - Match your brand
    primary: '#37a9ef',
    success: '#77d257',
    warning: '#fcba2e',
    danger: '#fe6158',
    background: '#ffffff',
    fontColor: '#333333',
    
    // Fonts - Use your project fonts
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    
    // See USAGE.md for complete list
  }}
/>
```

### Responsive Design

```tsx
<Gantt
  tasks={tasks}
  config={{
    // Responsive container
    containerHeight: '100%',
    containerMinHeight: '400px',
    
    // Responsive grid width
    gridWidth: 'clamp(280px, 30vw, 720px)', // Adapts to viewport
  }}
/>
```

### Style Integration (CSS Variables)

```css
/* In your project's CSS */
.my-gantt-wrapper {
  /* Match your brand colors */
  --wx-gantt-primary: #your-brand-color;
  --wx-gantt-background: var(--your-bg-color);
  --wx-gantt-font-color: var(--your-text-color);
  
  /* Use your project fonts */
  --wx-gantt-font-family: 'Your Font', sans-serif;
  
  /* Responsive sizing */
  --gantt-grid-width: clamp(280px, 30vw, 720px);
}
```

## 📱 Responsive

The component is fully responsive and adapts to:
- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile Landscape (480px - 768px)
- ✅ Mobile Portrait (< 480px)

## 🎯 Baselines

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

## 🔄 Event Handlers

```tsx
<Gantt
  tasks={tasks}
  onTaskUpdate={(task) => {
    // Save to your backend
  }}
  onTaskCreate={(task) => {
    // Add to your backend
  }}
  onTaskDelete={(taskId) => {
    // Remove from your backend
  }}
  onLinkCreate={(link) => {
    // Save dependency to your backend
  }}
  onLinkDelete={(linkId) => {
    // Remove dependency from your backend
  }}
/>
```

## 🐛 Troubleshooting

### CSS Import Error

If you get: `Module not found: Error: Package path ./dist/gantt.css is not exported`

**Solution:**
```tsx
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

## 📖 Complete Example

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

## 📝 TypeScript Support

Full TypeScript support is included:

```tsx
import { Gantt } from 'iris-gantt'
import type { Task, Link, GanttConfig, GanttUIConfig, GanttStyleConfig } from 'iris-gantt'

const tasks: Task[] = [...]
const config: GanttConfig = {...}
const uiConfig: GanttUIConfig = {...}
const styleConfig: GanttStyleConfig = {...}
```

## 🎨 Customization Highlights

- ✅ **All text is configurable** - buttons, labels, placeholders, tooltips
- ✅ **All buttons are toggleable** - show/hide any button
- ✅ **All colors are customizable** - match your brand
- ✅ **All fonts are customizable** - use your project fonts
- ✅ **Fully responsive** - adapts to all screen sizes
- ✅ **Style integration** - uses CSS variables that inherit from your project

## 📚 More Documentation

- **[USAGE.md](./USAGE.md)** - Complete usage guide with all props
- **[RESPONSIVE_STYLING.md](./RESPONSIVE_STYLING.md)** - Responsive design guide
- **[CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md)** - Advanced customization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT

## 🔗 Links

- GitHub: https://github.com/TimJerry725/ganttchart.git
