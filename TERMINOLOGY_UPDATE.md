# Terminology Update: Task → Stage, Subtask → Checklist

## Overview
Updated the Gantt component UI to use "Stage" and "Checklist" terminology instead of "Task" and "Subtask".

## Files Modified

### 1. **TaskCreator.tsx**
- Modal title: "Create New Task" → **"Create New Stage"**
- Modal title (with parent): "Create Subtask" → **"Create Checklist"**
- OK button: "Create Task" → **"Create Stage"**
- Field label: "Task Name" → **"Stage Name"**
- Placeholder: "Enter task name" → **"Enter stage name"**
- Validation: "Please enter task name" → **"Please enter stage name"**
- Type option: "Task" → **"Stage"**
- Details placeholder: "Add task description..." → **"Add stage description..."**

### 2. **TaskEditor.tsx**
- Modal title: "Edit Task" → **"Edit Stage"**
- Field label: "Task Name" → **"Stage Name"**
- Placeholder: "Enter task name" → **"Enter stage name"**
- Validation: "Please enter task name" → **"Please enter stage name"**
- Type option: "Task" → **"Stage"**
- Details placeholder: "Add task description..." → **"Add stage description..."**

### 3. **Toolbar.tsx**
- Add button text: "New Task" → **"New Stage"**

### 4. **FilterSearch.tsx**
- Search placeholder: "Search tasks..." → **"Search stages..."**

### 5. **DependencyPopover.tsx**
- Select placeholder: "Select checklist" (already set)
- Diagram label: "Task X" → **"Stage X"**
- Empty state: "Select a task from the list..." → **"Select a checklist from the list to see how it will relate to the current stage."**
- Descriptions:
  - "Task X starts after Task Y finishes" → **"Stage X starts after Stage Y finishes"**
  - "Task X starts when Task Y starts" → **"Stage X starts when Stage Y starts"**
  - "Task X finishes when Task Y finishes" → **"Stage X finishes when Stage Y finishes"**
  - "Task X finishes when Task Y starts" → **"Stage X finishes when Stage Y starts"**

## UI Configuration Override

All these changes are **default values**. Users can still override them using the `uiConfig` prop:

```tsx
<Gantt
  tasks={tasks}
  uiConfig={{
    addTaskButtonText: "Custom Text",
    taskCreatorTitle: "Custom Title",
    taskNameLabel: "Custom Label",
    // ... etc
  }}
/>
```

## Terminology Mapping

| Old Term | New Term | Context |
|----------|----------|---------|
| Task | **Stage** | Top-level items |
| Subtask | **Checklist** | Child items |
| "Add Task" | **"New Stage"** | Toolbar button |
| "Create Task" | **"Create Stage"** | Modal actions |
| "Edit Task" | **"Edit Stage"** | Modal title |
| "Search tasks" | **"Search stages"** | Search placeholder |

## Notes

- The internal data model still uses `Task` interface and `task` properties
- Only user-facing text has been updated
- All changes maintain backward compatibility through `uiConfig` overrides
- TypeScript types remain unchanged to avoid breaking changes
