# Iris Gantt

A comprehensive, production-ready Gantt chart component built with React and TypeScript. Easy to install, simple to use, fully customizable, and responsive.

## 🆕 Version 1.5.8 (Latest)

### Improvements
- **Strict Header Height Synchronization** — Headers on both the left (Grid) and right (Timeline) are now explicitly tethered to the same pixel height. This ensures that even when rows are hidden (like Month/Year), the "day" labels and "Name" labels stay perfectly aligned and the overall header height reduces as expected.

## 🆕 Version 1.5.7

### Features
- **Hide Month/Year Heading** — Added `showMonthHeading` to the top-level `<Gantt>` props and config. You can pass `showMonthHeading={false}` to specifically hide the topmost Month/Year row while leaving the calendar intact.

## 🔖 Version 1.5.4

### Features
- **Configurable Timeline Header Visibility** — Added `showTimelineHeader: boolean` to completely show or hide the calendar header row.
- **Prop-driven calendar view bounds** — Documented how to completely remove month/week/day layers via `timelineViewScales` arrays.

## 🔖 Version 1.5.3

### Bug Fixes
- **Responsive Timeline Viewport Scaling:** Fixed an issue where the timeline left empty white spaces or rendered comically fat cell columns on horizontally wide screens—especially when swapping down to 'Month' view. The chart now dynamically calculates its layout boundaries and pads the display timeframe organically to perfectly fill your viewport screen width while maintaining standard element ratios.

## 🔖 Version 1.5.2

### Improvements
- **Prop-driven day/week/month timeline switcher** — You can now expose a calendar view switcher in the toolbar and control the available `day`, `week`, and `month` views through props.
- **Configurable timeline view props** — Use `timelineView`, `timelineViews`, and `timelineViewScales` in `config`, plus `timelineViewLabels` in `uiConfig`, to customize the calendar view experience.

## 🔖 Version 1.5.0

### Bug Fixes
- **On-Hold correctly renders over completed tasks** — The grey hatched on-hold overlay now correctly sits *above* the task bar in the DOM tree. Previously, the `status-completed` blue background colour overrode it.
- **On-Hold overlay stays visible on hover** — Raised the CSS `z-index` of `.gantt-on-hold-period` to `101 !important`. The task bar hover state elevates to `z-index: 100`, so the hold pattern will no longer disappear when you mouse over a task.

- **OnHold grey lines now render with project API data** — Fixed a bug where on-hold grey bars were not visible when tasks used API field names (`workGroupName`, `plannedStartDate`, `plannedEndDate`). The normalizer now recognises these aliases, so dates are correctly resolved and the hold period overlap is detected.

### New API Field Aliases

The `tasks` prop now accepts the following additional field names used by common project APIs:

| New alias          | Maps to             |
| ------------------ | ------------------- |
| `workGroupName`    | Task display name   |
| `plannedStartDate` | Task bar start date |
| `plannedEndDate`   | Task bar end date   |

## 🔖 Version 1.4.6

### Bug Fixes

- **Baselines now show by default** — Fixed a critical bug where baselines were not rendering because the `config` spread was overriding the default `baselines: true` with `undefined`. Baselines are now always enabled unless you explicitly pass `config={{ baselines: false }}`.
- **`on_hold_periods` snake_case prop supported** — The Gantt component now accepts both `onHoldPeriods` (camelCase) and `on_hold_periods` (snake_case) as a top-level prop for project-level on-hold periods. Previously only the camelCase variant was recognized, causing the feature to silently fail for API-style payloads.

### Improvements

- **Project-level OnHold applied to all tasks** — The `onHoldPeriods` / `on_hold_periods` prop now propagates the grey hatched on-hold bar to **all** task rows including `project`-type tasks. Previously, only child/standalone tasks showed the hold bar; now the entire project hierarchy displays it consistently.
- **Same-height on-hold bars** — The grey on-hold period bar is now the same height (28px) as the task bar.
- **Tasks continue after hold period** — When a project resumes after an on-hold period, all affected tasks continue in sequence after the hold, and remaining days are extended automatically.
- **No hover enlarge/scale effect** — Task bars no longer scale up or brighten on hover.

## 🔖 Version 1.4.2

### Included Changes

- **Per-task tooltip config** — Each task can now carry its own `tooltipConfig` to override global tooltip settings (show/hide fields, labels, accessors, formatters).
- **Unified `onTaskDragUpdate` callback** — Single callback for all drag operations: task bar move/resize AND row reorder (grip icon drag-and-drop).
- **Row reorder API integration** — `onTaskDragUpdate` now fires with `dragType: 'reorder'` and `reorderMeta` (sequence IDs, stage ID) when tasks are reordered via grip icon.
- **`rawId` preserved** — The original API task ID (before string normalization) is now available as `task.rawId` for backend integration.
- **`TaskDragUpdatePayload` type** — Provides `task`, `previousTask`, `dragType`, and optional `reorderMeta` for API calls.
- Added direct OnHold support in `tasks` props for API payloads.
- `tasks` now accepts `onHoldPeriods` and `on_hold_periods`.
- OnHold date fields now accept `Date`, ISO date strings, or timestamps and are normalized internally.
- Task hover tooltip is fully prop-driven (show/hide, labels, accessors, and formatters).
- Tooltip data now supports direct API aliases for planned/actual dates, status, progress, owner, and dependency rule.
- Dependency rule tooltip can be read from API payload (`dependencyRule`/`dependency_rule`) or generated from links.
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
- ✅ **Fully customizable** (all text, buttons, colors, fonts, icons)
- ✅ **Vertical Marker Lines** (Today & Project Start)

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
import { Gantt } from "iris-gantt";
import "iris-gantt/gantt.css";

function MyGantt() {
  const tasks = [
    {
      id: "1",
      text: "Project Planning",
      start: new Date(2024, 0, 1),
      end: new Date(2024, 0, 15),
      duration: 14,
      progress: 100,
      type: "project",
    },
    {
      id: "2",
      text: "Development",
      start: new Date(2024, 0, 15),
      end: new Date(2024, 1, 15),
      duration: 31,
      progress: 60,
    },
  ];

  return <Gantt tasks={tasks} />;
}
```

## 📚 Documentation

- **[Complete Usage Guide](./USAGE.md)** - Comprehensive documentation with all props and examples
- **[API Reference](./USAGE.md#api-reference)** - Full TypeScript API
- **[Props and Types Reference](./PROPS_REFERENCE.md)** - Complete prop/type list from exported interfaces
- **[Responsive Design Guide](./RESPONSIVE_STYLING.md)** - How to make it responsive and match your project styles
- **[Customization Guide](./CUSTOMIZATION_GUIDE.md)** - Advanced customization options

## 🎯 Common Imports

```tsx
// Main component (named import - recommended)
import { Gantt } from "iris-gantt";

// Main component (default import - also works)
import Gantt from "iris-gantt";

// Types
import type {
  Task,
  Link,
  GanttConfig,
  GanttUIConfig,
  GanttStyleConfig,
  TaskTooltipConfig,
  TaskDragUpdatePayload,
  TaskReorderMeta,
} from "iris-gantt";

// CSS (required!)
import "iris-gantt/gantt.css";
```

## 🔧 Basic Configuration

```tsx
<Gantt
  tasks={tasks}
  links={links}
  config={{
    theme: "light",
    weekends: true,
    containerHeight: "100%",
    containerMinHeight: "400px",
    timelineView: "day",
    timelineViews: ["day", "week", "month"],
  }}
  uiConfig={{
    timelineViewLabels: {
      day: "Days",
      week: "Weeks",
      month: "Months",
    },
  }}
  onTaskUpdate={(task) => console.log("Updated:", task)}
/>
```

## View Switcher

Use the toolbar switcher to toggle the calendar between day, week, and month views.

```tsx
<Gantt
  tasks={tasks}
  config={{
    timelineView: "week",
    timelineViews: ["day", "week", "month"],
    timelineViewScales: {
      day: [
        { unit: "month", step: 1, format: "MMM YYYY" },
        { unit: "day", step: 1, format: "D" },
      ],
      week: [
        { unit: "month", step: 1, format: "MMM YYYY" },
        { unit: "week", step: 1, format: "Week W" },
      ],
      month: [
        { unit: "year", step: 1, format: "YYYY" },
        { unit: "month", step: 1, format: "MMM" },
      ],
    },
  }}
  uiConfig={{
    timelineViewLabels: {
      day: "Days",
      week: "Weeks",
      month: "Months",
    },
  }}
/>
```

### 🛠️ Timeline Header Customization

Version 1.5.6 introduces granular control over every row in the timeline header. You can hide specific layers or switch to relative numbering using these new props:

#### 1. Hide the Entire Header
To completely remove the calendar header rows while keeping the actual grid and tasks:
```tsx
<Gantt
  tasks={tasks}
  showTimelineHeader={false}
/>
```

#### 2. Hide Specific Rows
You can independently toggle the top Month/Year heading or the middle Range/Week heading:
```tsx
<Gantt
  tasks={tasks}
  showMonthHeading={false} // Hides the top Month/Year row
  showRangeHeading={false} // Hides the middle Week/Range row
/>
```

#### 3. Relative Day Numbering ("Day 1, 2, 3...")
Perfect for project templates or relative schedules. Replaces calendar dates (10, 11, 12) with sequential day numbers:
```tsx
<Gantt
  tasks={tasks}
  relativeDayNumbering={true}
/>
```

#### 4. Advanced: Custom Header Scales
For complete control over the labels and time units in each row, use `timelineViewScales`:
```tsx
<Gantt
  tasks={tasks}
  config={{
    timelineViewScales: {
      day: [
        { unit: "day", step: 1, format: "D" } // Only shows the day-of-month row
      ]
    }
  }}
/>
```

### Customizing the Header Levels
If you want to show the headers, but completely remove specific layers like the "Month" or "Week" rows (for example, showing only the "Days" row), simply customize the `timelineViewScales` arrays arrays:

```tsx
<Gantt
  tasks={tasks}
  config={{
    timelineView: "day",
    // This only shows the 'day' row, effectively hiding the 'month' row
    timelineViewScales: {
      day: [
        { unit: "day", step: 1, format: "D" }
      ]
    }
  }}
/>
```

## 📍 Vertical Marker Lines

The Gantt chart supports vertical indicator lines for the current date (Today) and the project start date. Both are enabled by default and come with customizable markers and labels.

```tsx
<Gantt
  tasks={tasks}
  config={{
    // Today Line
    showTodayLine: true,
    todayLineColor: "#ff4d4f",
    todayLineLabel: "Today",
    todayLineStyle: "solid", // 'solid' | 'dashed' | 'dotted'
    todayLineWidth: 1,
    todayLineOpacity: 1,
    showTodayLineMarker: true, // Triangle marker at the top
    todayLineMarkerStyle: "triangle", // 'triangle' | 'arrow' | 'dot'

    // Project Start Line
    showProjectStartLine: true,
    projectStartDate: new Date(2024, 0, 1), // Optional: defaults to earliest task
    projectStartLineColor: "#40a9ff",
    projectStartLineLabel: "Kick-off",
    projectStartLineStyle: "dashed",
    showProjectStartLineMarker: true,
  }}
/>
```

## 🎨 Custom Icons

You can replace any UI icon by passing a React component or a string (for font-icon classes) to the `iconConfig` prop. This allows you to match your project's icon library (e.g., Ant Design, Lucide, FontAwesome).

```tsx
<Gantt
  tasks={tasks}
  iconConfig={{
    // Toolbar
    addTask: <PlusCircleOutlined />, // React node
    zoomIn: "fas fa-search-plus", // Font-icon string
    zoomOut: "fas fa-search-minus",
    exportPDF: <FilePdfOutlined />,

    // Grid
    gripVertical: <HolderOutlined />,
    chevronRight: <RightOutlined />,
    chevronDown: <DownOutlined />,

    // Context Menu
    edit: <EditOutlined />,
    delete: <DeleteOutlined />,
    copy: <CopyOutlined />,
  }}
/>
```

### Tooltip As Props (Global)

All task hover fields are configurable via props and can be mapped from API values:

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
    plannedLabel: "Planned start/end",
    actualLabel: "Actual start/end",
    statusLabel: "Current status",
    dependencyRuleLabel: "Dependency rule",
    progressLabel: "Progress",
    ownerLabel: "Owner",
    dateFormat: "MMM D, YYYY",
    taskNameAccessor: (task) => task.text,
    statusAccessor: (task) => task.status,
    progressAccessor: (task) => task.progress,
    dependencyRuleAccessor: (task, generatedRules) =>
      task.dependencyRule || generatedRules,
  }}
/>
```

### Per-Task Tooltip Config

Each task can override the global `taskTooltipConfig` with its own `tooltipConfig`. Task-level settings take priority:

```tsx
<Gantt
  tasks={[
    {
      id: 1,
      text: "Task with custom tooltip",
      start: "2026-01-01",
      end: "2026-01-10",
      duration: 9,
      progress: 50,
      tooltipConfig: {
        showOwner: false,
        showDependencyRule: false,
        showProgress: true,
        showActualDates: true,
        plannedStartAccessor: (task) =>
          customDataMap.get(task.id)?.plannedStart,
        plannedEndAccessor: (task) => customDataMap.get(task.id)?.plannedEnd,
        actualStartAccessor: (task) => customDataMap.get(task.id)?.actualStart,
        actualEndAccessor: (task) => customDataMap.get(task.id)?.actualEnd,
      },
    },
    {
      id: 2,
      text: "Task using global tooltip config",
      start: "2026-01-05",
      end: "2026-01-15",
      duration: 10,
      progress: 30,
      // No tooltipConfig — uses global taskTooltipConfig
    },
  ]}
  taskTooltipConfig={{ showOwner: true, showProgress: true }}
/>
```

API-friendly task aliases accepted in `tasks`:

- Name: `text`, `name`, `title`, `taskName`, `task_name`, `workGroupName`
- Drag/resize handles: `ShowHandle` (boolean), `showHandle` (boolean)
- OnHold periods: `onHoldPeriods`, `on_hold_periods`, `onHold`, `on_hold`, `onhold`
- Timeline dates: `start`, `startDate`, `start_date`, `plannedStartDate`, `end`, `endDate`, `end_date`, `plannedEndDate`
- Planned dates: `plannedStart`, `planned_start`, `planned_start_date`, `plannedEnd`, `planned_end`, `planned_end_date`
- Actual dates: `actualStart`, `actual_start`, `actual_start_date`, `actualEnd`, `actual_end`, `actual_end_date`
- Status: `status`, `currentStatus`, `current_status`
- Progress: `progress`, `progressPercentage`, `progress_percentage`
- Owner: `owner`, `ownerName`, `owner_name`
- Dependencies: `dependencies`, `dependsOn`, `depends_on`
- Dependency rule: `dependencyRule`, `dependency_rule`, `dependencyRuleDescription`, `dependency_rule_description`

## ⏸️ OnHold In `tasks` Props

You can pass paused periods directly inside each task using either:

- `onHoldPeriods` (camelCase)
- `on_hold_periods` (snake_case API style)
- `onHold`, `on_hold`, `onhold` (additional API aliases)

Each alias accepts either:

- An array of periods: `[{ start, end }, ...]`
- A single period object: `{ start, end }`

Date values can be `Date`, ISO date string, or timestamp number.

```tsx
<Gantt
  tasks={[
    {
      id: 1,
      text: "Development",
      start: "2026-02-01",
      end: "2026-02-20",
      duration: 19,
      progress: 45,
      on_hold_periods: [
        { start: "2026-02-06", end: "2026-02-09" },
        { start: "2026-02-12", end: "2026-02-13" },
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
    headerTitle: "My Project Gantt",
    showHeader: true,

    // Toolbar Buttons
    showAddTaskButton: true,
    showZoomButtons: true,
    showExportButtons: true,
    showFilterSearch: true,
    addTaskButtonText: "Add New Task",

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
    primary: "#37a9ef",
    success: "#77d257",
    warning: "#fcba2e",
    danger: "#fe6158",
    background: "#ffffff",
    fontColor: "#333333",

    // Fonts - Use your project fonts
    fontFamily: "Inter, sans-serif",
    fontSize: "14px",

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
    containerHeight: "100%",
    containerMinHeight: "400px",

    // Responsive grid width
    gridWidth: "clamp(280px, 30vw, 720px)", // Adapts to viewport
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
  --wx-gantt-font-family: "Your Font", sans-serif;

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

### `onTaskDragUpdate` — Unified Drag & Reorder API

A single callback for **all** drag operations: task bar move/resize AND row reorder.

```tsx
<Gantt
  tasks={tasks}
  onTaskDragUpdate={async ({ task, previousTask, dragType, reorderMeta }) => {
    // task.rawId preserves the original API ID (before string normalization)
    const taskId = task.rawId ?? task.id;

    if (dragType === "reorder" && reorderMeta) {
      // Row reorder — task was dragged to a new position via grip icon
      await api.reorderTask(taskId, {
        current_sequence_id: reorderMeta.currentSequenceId,
        target_sequence_id: reorderMeta.targetSequenceId,
        target_stage_id: reorderMeta.targetStageId, // parent task ID or null for root
      });
    } else {
      // Task bar drag — move or resize on the timeline
      // dragType: 'move' | 'resize-left' | 'resize-right'
      await api.updateTaskDates(taskId, {
        start_date: task.start.toISOString(),
        end_date: task.end.toISOString(),
        duration: task.duration,
        action: dragType,
        previous_start_date: previousTask.start.toISOString(),
        previous_end_date: previousTask.end.toISOString(),
      });
    }
  }}
/>
```

**`TaskDragUpdatePayload` fields:**

| Field          | Type                                                     | Description                                                                                      |
| -------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `task`         | `Task`                                                   | The updated task (after drag/reorder)                                                            |
| `previousTask` | `Task`                                                   | The task state before the operation                                                              |
| `dragType`     | `'move' \| 'resize-left' \| 'resize-right' \| 'reorder'` | What kind of drag was performed                                                                  |
| `reorderMeta`  | `TaskReorderMeta \| undefined`                           | Only present for `'reorder'` — contains `currentSequenceId`, `targetSequenceId`, `targetStageId` |

### Other Event Handlers

```tsx
<Gantt
  tasks={tasks}
  onTaskUpdate={(task, reorderMeta?) => {
    // General task update (also fires on reorder with reorderMeta)
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
import "iris-gantt/gantt.css";
// or
import "iris-gantt/dist/gantt.css";
```

### Default Import Error

If you get: `export 'default' was not found`

**Solution:**

```tsx
// Use named import instead
import { Gantt } from "iris-gantt";
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
import React, { useState } from "react";
import { Gantt } from "iris-gantt";
import "iris-gantt/gantt.css";
import type { Task, Link } from "iris-gantt";

function ProjectGantt() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      text: "Project Planning",
      start: new Date(2024, 0, 1),
      end: new Date(2024, 0, 15),
      duration: 14,
      progress: 100,
      type: "project",
    },
  ]);

  const [links, setLinks] = useState<Link[]>([
    { id: "l1", source: "1", target: "2", type: "e2s" },
  ]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Gantt
        tasks={tasks}
        links={links}
        config={{
          theme: "light",
          weekends: true,
          containerHeight: "100%",
          containerMinHeight: "500px",
          gridWidth: "clamp(300px, 35vw, 800px)",
        }}
        uiConfig={{
          headerTitle: "My Project Timeline",
          addTaskButtonText: "New Task",
        }}
        styleConfig={{
          primary: "#6366f1",
          fontFamily: "Inter, sans-serif",
        }}
        onTaskUpdate={(task) => {
          setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
        }}
        onTaskCreate={(task) => {
          setTasks([...tasks, task]);
        }}
        onTaskDelete={(taskId) => {
          setTasks(tasks.filter((t) => t.id !== taskId));
        }}
        onLinkCreate={(link) => {
          setLinks([...links, link]);
        }}
        onLinkDelete={(linkId) => {
          setLinks(links.filter((l) => l.id !== linkId));
        }}
      />
    </div>
  );
}

export default ProjectGantt;
```

## 📝 TypeScript Support

Full TypeScript support is included:

```tsx
import { Gantt } from 'iris-gantt'
import type {
  Task, Link, GanttConfig, GanttUIConfig, GanttStyleConfig,
  TaskTooltipConfig, TaskDragUpdatePayload, TaskReorderMeta,
} from 'iris-gantt'

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
