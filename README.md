# SVAR Gantt Chart - Complete React Implementation

A comprehensive, production-ready Gantt chart component built with React and TypeScript, featuring all FREE and PRO capabilities from SVAR Gantt in a single, unified component.

![Gantt Chart Demo](https://img.shields.io/badge/React-19.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![Storybook](https://img.shields.io/badge/Storybook-10.1.11-ff69b4)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🎯 Core Features
- ✅ **Multi-column Task Grid** - Name, dates, duration, progress
- ✅ **Hierarchical Structure** - Parent/child tasks with expand/collapse
- ✅ **Configurable Timeline** - Hour/day/week/month/quarter/year scales
- ✅ **Zoom Controls** - In, out, reset with smooth transitions
- ✅ **Synchronized Scrolling** - Grid and timeline stay in sync
- ✅ **Weekend & Holiday Highlighting** - Visual differentiation
- ✅ **Light & Dark Themes** - Professional styling

### 🎨 Interactive Features
- ✅ **Drag & Drop** - Move tasks by dragging bars
- ✅ **Task Resize** - Adjust start/end dates from edges
- ✅ **Dependencies** - 4 types with curved arrows (e2s, s2s, e2e, s2e)
- ✅ **Progress Tracking** - Visual indicators on bars
- ✅ **Task Types** - Regular tasks, milestones, projects
- ✅ **Color Coding** - Custom colors per task

### 💎 PRO Features
- ✅ **Undo/Redo System** - 50-action history with Ctrl+Z/Y
- ✅ **Critical Path Analysis** - Automatic calculation and highlighting
- ✅ **Auto-Scheduling** - Forward/backward scheduling modes
- ✅ **Baselines** - Visual variance tracking with purple bars
- ✅ **Resource Leveling** - Prevent overallocation
- ✅ **Task Creation UI** - Beautiful modal form
- ✅ **Task Editing UI** - Double-click to edit
- ✅ **Advanced Filtering** - By status, priority, owner
- ✅ **Search** - Real-time across all fields
- ✅ **Export** - CSV, Excel, JSON, PDF

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Run Storybook

```bash
npm run storybook
```

Or use the helper script:

```bash
./run-storybook.sh
```

Visit http://localhost:6006 to see all demos!

## 📖 Usage

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
];

const links: Link[] = [
  { id: 'l1', source: '1', target: '2', type: 'e2s' },
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
      onTaskCreate={(task) => console.log('Created:', task)}
      onTaskDelete={(id) => console.log('Deleted:', id)}
    />
  );
}
```

## 🎨 Storybook Demos

The project includes comprehensive Storybook demos:

- **Gantt Chart/Basic Examples** - Simple projects and use cases
- **Gantt Chart/Advanced Features** - All PRO features in action
- **Gantt Chart/Baselines** - Baseline tracking demonstrations

## 🛠️ Configuration

```tsx
interface GanttConfig {
  columns?: Column[];              // Custom columns
  scales?: Scale[];                // Timeline scales
  readonly?: boolean;              // Disable editing
  editable?: boolean;              // Enable inline editing
  taskHeight?: number;             // Task bar height
  rowHeight?: number;              // Row height
  columnWidth?: number;            // Timeline column width
  weekends?: boolean;              // Highlight weekends
  holidays?: Date[];               // Holiday dates
  theme?: 'light' | 'dark';        // Theme
}
```

## 🎯 Interactive Controls

### Toolbar Buttons
- **+ Add Task** - Create new tasks
- **↶ Undo / ↷ Redo** - Undo/redo with Ctrl+Z/Y
- **⚡ Auto-Schedule** - Auto-schedule based on dependencies
- **📊 Level Resources** - Balance workload
- **🎯 Critical Path** - Highlight critical tasks
- **📍 Baselines** - Create and toggle baselines
- **🔍 Zoom** - Zoom in/out/reset
- **💾 Export** - CSV, Excel, JSON, PDF

### Keyboard Shortcuts
- **Ctrl+Z** - Undo
- **Ctrl+Y** or **Ctrl+Shift+Z** - Redo
- **Double-click task** - Edit task

### Mouse Actions
- **Drag task bar** - Move task
- **Drag task edges** - Resize (adjust dates)
- **Click task** - Select
- **Hover dependencies** - Highlight relationships

## 📁 Project Structure

```
src/
├── components/
│   ├── Gantt/
│   │   ├── Gantt.tsx              # Main unified component
│   │   ├── Grid.tsx               # Task list grid
│   │   ├── Timeline.tsx           # Timeline rendering
│   │   ├── TaskBar.tsx            # Task visualization
│   │   ├── TaskCreator.tsx        # Task creation modal
│   │   ├── TaskEditor.tsx         # Task editing modal
│   │   ├── LinkRenderer.tsx       # Dependency arrows
│   │   ├── DragDrop.tsx           # Drag & drop logic
│   │   ├── FilterSearch.tsx       # Filtering system
│   │   ├── UndoRedo.tsx           # Undo/redo system
│   │   ├── CriticalPath.tsx       # Critical path algorithm
│   │   ├── AutoScheduler.tsx      # Auto-scheduling
│   │   ├── Baselines.tsx          # Baseline tracking
│   │   ├── ExportUtils.tsx        # Export functionality
│   │   └── gantt.css              # All styles
│   ├── types.ts                   # TypeScript interfaces
│   └── utils/
│       └── dateUtils.ts           # Date calculations
└── stories/
    ├── AdvancedGantt.stories.tsx  # Basic examples
    ├── GanttProFeatures.stories.tsx # Advanced features
    └── BaselinesDemo.stories.tsx   # Baseline demos
```

## 🎭 Task Types

```tsx
interface Task {
  id: string;
  text: string;
  start: Date;
  end: Date;
  duration: number;
  progress: number;
  type?: 'task' | 'milestone' | 'project';
  parent?: string;
  color?: string;
  owner?: string;
  priority?: 'low' | 'medium' | 'high';
  details?: string;
}
```

## 🔗 Dependency Types

- **e2s** (End-to-Start) - Task B starts when Task A ends
- **s2s** (Start-to-Start) - Tasks start together
- **e2e** (End-to-End) - Tasks end together
- **s2e** (Start-to-End) - Task B ends when Task A starts

## 🎨 Theming

```tsx
<Gantt
  tasks={tasks}
  config={{ theme: 'dark' }}  // or 'light'
/>
```

Custom colors can be applied per task:
```tsx
{
  id: '1',
  text: 'High Priority',
  color: '#E74C3C',  // Red
  // ...
}
```

## 📊 Export Formats

- **CSV** - Simple comma-separated values
- **Excel** - .xls format with UTF-8 BOM
- **JSON** - Complete project data (can be imported)
- **PDF** - Text report (can be enhanced with jsPDF)

## 🤝 Comparison with SVAR Gantt

This implementation provides **ALL** features from both SVAR Free and PRO editions in a single component:

| Feature | SVAR Free | SVAR PRO | This Implementation |
|---------|-----------|----------|---------------------|
| Task Management | ✅ | ✅ | ✅ |
| Dependencies | ✅ | ✅ | ✅ |
| Drag & Drop | ✅ | ✅ | ✅ |
| Progress Tracking | ✅ | ✅ | ✅ |
| Undo/Redo | ❌ | ✅ | ✅ |
| Auto-Scheduling | ❌ | ✅ | ✅ |
| Critical Path | ❌ | ✅ | ✅ |
| Baselines | ❌ | ✅ | ✅ |
| Resource Leveling | ❌ | ✅ | ✅ |
| Export | ❌ | ✅ | ✅ |
| Filtering | ❌ | ✅ | ✅ |

## 📝 License

MIT - Free for commercial and personal use

## 🙏 Acknowledgments

- Inspired by [SVAR Gantt Chart](https://svar.dev/demos/react/gantt/)
- Built with React 19, TypeScript 5.9, and Storybook 10

## 🔗 Links

- [GitHub Repository](https://github.com/TimJerry725/ganttchart)
- [Documentation](./GANTT_FEATURES.md)
- [Storybook Demos](http://localhost:6006)

---

**Made with ❤️ using React + TypeScript**
