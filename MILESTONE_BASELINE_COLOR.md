# Milestone Baseline Color Feature

## How It Works

When a task is marked as a **milestone** (by setting `type: 'milestone'`), its baseline bar automatically changes to **purple** (#9b59b6).

## Implementation

### 1. Task Type Property
```typescript
interface Task {
  type?: 'task' | 'milestone' | 'project';
  // ... other properties
}
```

### 2. Timeline Rendering
The Timeline component checks the task type and adds the `milestone` class to the baseline bar:

```tsx
<div
  className={`gantt-baseline-bar ${task.type === 'milestone' ? 'milestone' : ''}`}
  style={{
    left: `${baselinePosition.left}px`,
    width: `${baselinePosition.width}px`,
  }}
/>
```

### 3. CSS Styling
```css
.gantt-baseline-bar {
  background-color: var(--wx-gantt-baseline-color); /* Default gray */
  /* ... other styles */
}

.gantt-baseline-bar.milestone {
  background-color: #9b59b6; /* Purple for milestones */
  opacity: 1;
}
```

## Usage Example

```typescript
const tasks: Task[] = [
  {
    id: '1',
    text: 'Regular Task',
    start: new Date(2026, 3, 1),
    end: new Date(2026, 3, 10),
    type: 'task', // ← Gray baseline
    // ...
  },
  {
    id: '2',
    text: 'Project Kickoff',
    start: new Date(2026, 3, 15),
    end: new Date(2026, 3, 15),
    type: 'milestone', // ← Purple baseline
    // ...
  },
];
```

## Testing in Storybook

1. **Navigate to**: `http://localhost:6006/`
2. **Open story**: "Gantt / Milestone Baselines"
3. **Click**: "📍 Set Baseline" button
4. **Observe**:
   - Regular tasks → Gray baseline bars
   - Milestones → **Purple baseline bars** (#9b59b6)

## When Creating/Editing Tasks

When you create or edit a task in the checklist:

1. **Set type to 'milestone'**:
   ```typescript
   task.type = 'milestone';
   ```

2. **Baseline automatically turns purple**:
   - The Timeline component detects `task.type === 'milestone'`
   - Adds the `.milestone` class to the baseline bar
   - CSS applies purple background color

## Visual Indicators

| Task Type | Bar Color | Baseline Color |
|-----------|-----------|----------------|
| Regular Task | Blue/Custom | Gray |
| **Milestone** | Red/Orange | **Purple** 🟣 |
| Project | Green | Gray |

## Notes

- ✅ **Automatic**: No manual color setting needed
- ✅ **Dynamic**: Changes immediately when task type changes
- ✅ **Consistent**: All milestones use the same purple color
- ✅ **Visible**: Purple color (#9b59b6) stands out clearly

## Troubleshooting

If purple baselines aren't showing:

1. **Check task type**: Ensure `task.type === 'milestone'`
2. **Enable baselines**: Set `config.baselines = true`
3. **Set baseline**: Click "📍 Set Baseline" button
4. **Refresh browser**: Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
5. **Check Storybook**: Ensure Storybook is running fresh instance
