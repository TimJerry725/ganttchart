# UI Customization Guide

Complete guide to customizing all text, labels, and buttons in the Gantt component.

## Overview

The `uiConfig` prop allows you to:
- ✅ Customize all text labels and placeholders
- ✅ Show/hide any button with boolean props
- ✅ Customize tooltips
- ✅ Customize modal titles and button text
- ✅ Customize form labels and validation messages

## Basic Usage

```tsx
import { Gantt } from 'iris-gantt'
import 'iris-gantt/gantt.css'
import type { GanttUIConfig } from 'iris-gantt'

const uiConfig: Partial<GanttUIConfig> = {
  headerTitle: 'My Project Timeline',
  showHeader: true,
  showAddTaskButton: true,
  showBaselineButton: false,
  addTaskButtonText: 'Add New Task',
}

function App() {
  return (
    <Gantt
      tasks={tasks}
      uiConfig={uiConfig}
    />
  )
}
```

## Complete UI Configuration

### Header

```tsx
{
  headerTitle?: string        // Default: 'Iris Gantt'
  showHeader?: boolean         // Default: true
}
```

### Toolbar Buttons (Show/Hide)

```tsx
{
  showAddTaskButton?: boolean      // Default: true
  showBaselineButton?: boolean     // Default: true
  showZoomButtons?: boolean        // Default: true
  showExportButtons?: boolean      // Default: true
  showFilterSearch?: boolean       // Default: true
}
```

### Toolbar Button Labels

```tsx
{
  addTaskButtonText?: string           // Default: 'New Task'
  baselineButtonText?: string          // Default: 'Set Baseline'
  baselineButtonTextActive?: string    // Default: 'Baselines'
  zoomOutTooltip?: string              // Default: 'Zoom Out'
  zoomInTooltip?: string               // Default: 'Zoom In'
  resetZoomTooltip?: string            // Default: 'Reset Zoom'
  exportCSVTooltip?: string            // Default: 'Export to CSV'
  exportExcelTooltip?: string          // Default: 'Export to Excel'
  exportJSONTooltip?: string           // Default: 'Export to JSON'
  exportPDFTooltip?: string            // Default: 'Export to PDF'
  hideBaselinesTooltip?: string        // Default: 'Hide Baselines'
  showBaselinesTooltip?: string        // Default: 'Show Baselines'
}
```

### Task Creator Modal

```tsx
{
  taskCreatorTitle?: string            // Default: 'Create New Task'
  taskCreatorOkText?: string           // Default: 'Create Task'
  taskCreatorCancelText?: string      // Default: 'Cancel'
  taskNameLabel?: string               // Default: 'Task Name'
  taskNamePlaceholder?: string         // Default: 'Enter task name'
  typeLabel?: string                   // Default: 'Type'
  priorityLabel?: string               // Default: 'Priority'
  startDateLabel?: string              // Default: 'Start Date'
  durationLabel?: string               // Default: 'Duration (days)'
  colorLabel?: string                  // Default: 'Color'
  progressLabel?: string               // Default: 'Progress (%)'
  ownerLabel?: string                  // Default: 'Owner'
  ownerPlaceholder?: string            // Default: 'Assign to...'
  detailsLabel?: string                // Default: 'Details'
  detailsPlaceholder?: string         // Default: 'Add task description...'
  taskNameRequired?: string            // Default: 'Please enter task name'
}
```

### Task Type & Priority Options

```tsx
{
  taskTypeOptions?: {
    task?: string          // Default: 'Task'
    milestone?: string     // Default: 'Milestone'
    project?: string       // Default: 'Project'
  },
  priorityOptions?: {
    low?: string           // Default: 'Low'
    medium?: string       // Default: 'Medium'
    high?: string         // Default: 'High'
  }
}
```

### Task Editor Modal

```tsx
{
  taskEditorTitle?: string              // Default: 'Edit Task'
  taskEditorSaveText?: string          // Default: 'Save Changes'
  taskEditorCancelText?: string        // Default: 'Cancel'
  taskEditorDeleteText?: string        // Default: 'Delete'
  deleteConfirmTitle?: string          // Default: 'Delete Task'
  deleteConfirmContent?: string        // Default: 'This action cannot be undone.'
  deleteConfirmOkText?: string         // Default: 'Yes, Delete'
  deleteConfirmCancelText?: string     // Default: 'No'
}
```

### Filter Search

```tsx
{
  searchPlaceholder?: string           // Default: 'Search tasks...'
  allOwnersText?: string               // Default: 'All Owners'
  allStatusText?: string               // Default: 'All Status'
  allPriorityText?: string            // Default: 'All Priority'
  clearFiltersText?: string            // Default: 'Clear'
  statusOptions?: {
    all?: string                       // Default: 'All Status'
    notStarted?: string               // Default: 'Not Started'
    inProgress?: string               // Default: 'In Progress'
    completed?: string                 // Default: 'Completed'
  },
  priorityFilterOptions?: {
    all?: string                       // Default: 'All Priority'
    low?: string                      // Default: 'Low'
    medium?: string                   // Default: 'Medium'
    high?: string                     // Default: 'High'
  }
}
```

### Column Labels

```tsx
{
  columnLabels?: {
    name?: string                      // Default: 'Name'
    dependsOn?: string                  // Default: 'Depends on'
    duration?: string                   // Default: 'Duration'
    start?: string                      // Default: 'Start'
  }
}
```

## Examples

### Example 1: Hide All Buttons Except Add Task

```tsx
<Gantt
  tasks={tasks}
  uiConfig={{
    showBaselineButton: false,
    showZoomButtons: false,
    showExportButtons: false,
    showFilterSearch: false,
    addTaskButtonText: 'Add Task',
  }}
/>
```

### Example 2: Customize All Text

```tsx
<Gantt
  tasks={tasks}
  uiConfig={{
    headerTitle: 'Project Timeline',
    addTaskButtonText: 'Create Task',
    baselineButtonText: 'Save Baseline',
    taskCreatorTitle: 'New Task',
    taskNameLabel: 'Task Title',
    taskNamePlaceholder: 'Enter task title',
    typeLabel: 'Task Type',
    priorityLabel: 'Priority Level',
  }}
/>
```

### Example 3: Internationalization (i18n)

```tsx
const frenchUIConfig: Partial<GanttUIConfig> = {
  headerTitle: 'Diagramme de Gantt',
  addTaskButtonText: 'Nouvelle Tâche',
  baselineButtonText: 'Définir la Baseline',
  taskCreatorTitle: 'Créer une Nouvelle Tâche',
  taskNameLabel: 'Nom de la Tâche',
  taskNamePlaceholder: 'Entrez le nom de la tâche',
  typeLabel: 'Type',
  priorityLabel: 'Priorité',
  startDateLabel: 'Date de Début',
  durationLabel: 'Durée (jours)',
  progressLabel: 'Progression (%)',
  ownerLabel: 'Responsable',
  detailsLabel: 'Détails',
  taskTypeOptions: {
    task: 'Tâche',
    milestone: 'Jalon',
    project: 'Projet',
  },
  priorityOptions: {
    low: 'Faible',
    medium: 'Moyenne',
    high: 'Élevée',
  },
}

<Gantt tasks={tasks} uiConfig={frenchUIConfig} />
```

### Example 4: Minimal UI (Hide Everything)

```tsx
<Gantt
  tasks={tasks}
  uiConfig={{
    showHeader: false,
    showAddTaskButton: false,
    showBaselineButton: false,
    showZoomButtons: false,
    showExportButtons: false,
    showFilterSearch: false,
  }}
/>
```

### Example 5: Custom Button Text Only

```tsx
<Gantt
  tasks={tasks}
  uiConfig={{
    addTaskButtonText: '➕ Add',
    baselineButtonText: '📅 Baseline',
    zoomOutTooltip: 'Zoomer',
    zoomInTooltip: 'Dézoomer',
  }}
/>
```

## Complete Example

```tsx
import { Gantt } from 'iris-gantt'
import 'iris-gantt/gantt.css'
import type { GanttUIConfig } from 'iris-gantt'

function MyGantt() {
  const uiConfig: Partial<GanttUIConfig> = {
    // Header
    headerTitle: 'My Project',
    showHeader: true,

    // Buttons visibility
    showAddTaskButton: true,
    showBaselineButton: true,
    showZoomButtons: true,
    showExportButtons: true,
    showFilterSearch: true,

    // Button labels
    addTaskButtonText: 'Add Task',
    baselineButtonText: 'Baseline',
    baselineButtonTextActive: 'Hide Baseline',

    // Tooltips
    zoomOutTooltip: 'Zoom Out',
    zoomInTooltip: 'Zoom In',
    resetZoomTooltip: 'Reset',
    exportCSVTooltip: 'Export CSV',
    exportExcelTooltip: 'Export Excel',
    exportJSONTooltip: 'Export JSON',
    exportPDFTooltip: 'Export PDF',

    // Task Creator
    taskCreatorTitle: 'Create Task',
    taskCreatorOkText: 'Create',
    taskCreatorCancelText: 'Cancel',
    taskNameLabel: 'Task Name',
    taskNamePlaceholder: 'Enter name',
    typeLabel: 'Type',
    priorityLabel: 'Priority',
    startDateLabel: 'Start',
    durationLabel: 'Duration',
    colorLabel: 'Color',
    progressLabel: 'Progress',
    ownerLabel: 'Owner',
    ownerPlaceholder: 'Assign to',
    detailsLabel: 'Description',
    detailsPlaceholder: 'Add description',

    // Options
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

    // Task Editor
    taskEditorTitle: 'Edit Task',
    taskEditorSaveText: 'Save',
    taskEditorCancelText: 'Cancel',
    taskEditorDeleteText: 'Delete',
    deleteConfirmTitle: 'Confirm Delete',
    deleteConfirmContent: 'Are you sure?',
    deleteConfirmOkText: 'Delete',
    deleteConfirmCancelText: 'Cancel',

    // Filters
    searchPlaceholder: 'Search...',
    allOwnersText: 'All',
    clearFiltersText: 'Clear',
    statusOptions: {
      all: 'All',
      notStarted: 'Not Started',
      inProgress: 'In Progress',
      completed: 'Done',
    },
  }

  return (
    <Gantt
      tasks={tasks}
      links={links}
      uiConfig={uiConfig}
      onTaskUpdate={(task) => console.log('Updated:', task)}
    />
  )
}
```

## TypeScript Support

All UI config options are fully typed:

```tsx
import type { GanttUIConfig } from 'iris-gantt'

const uiConfig: Partial<GanttUIConfig> = {
  // TypeScript will autocomplete all available options
  headerTitle: 'My Gantt',
  showAddTaskButton: true,
  // ...
}
```

## Notes

- All props are **optional** - if not provided, defaults are used
- Use `Partial<GanttUIConfig>` to only specify what you need
- Boolean props default to `true` (buttons shown by default)
- Text props default to English labels
- You can mix and match - only customize what you need

## See Also

- [USAGE.md](./USAGE.md) - Complete usage documentation
- [README.md](./README.md) - Quick start guide
