# Gantt Chart Color Coding

This document describes the color coding system for Gantt chart task bars.

## Task Bar Colors (Based on Status)

The Gantt chart uses a status-based color coding system to visually indicate the state of each task:

| Status | Color | Hex Code | CSS Variable |
|--------|-------|----------|--------------|
| **Completed** | Blue | `#2196F3` | `--wx-gantt-status-completed` |
| **In Progress** | Green | `#4CAF50` | `--wx-gantt-status-in-progress` |
| **Delayed** | Red | `#F44336` | `--wx-gantt-status-delayed` |
| **Not Started** | Gray | `#9E9E9E` | `--wx-gantt-status-not-started` |

## On-Hold Periods

On-hold periods are rendered as gray diagonal hashed areas (strike-out effect) between active task segments.

| Type | Pattern | Hex Code (Base) | CSS Class |
|------|---------|-----------------|-----------|
| **On-Hold**| Gray Hashed | `#F1F3F4` / `#DADCE0` | `.gantt-on-hold-period` |

## Milestones and Baseline Bar

Milestones have a special color rule:
- **Actual Milestone (Diamond)**: Gray (`#BDBDBD`)
- **Milestone Baseline**: Purple (`#9C27B0`)

Other tasks use the default gray baseline:
- **Standard Baseline**: Gray (`#BDBDBD`) | `--wx-gantt-baseline-color` |


## Usage

To set the status of a task, add the `status` property to the task object:

```typescript
const task: Task = {
  id: '1',
  text: 'My Task',
  start: new Date(),
  end: new Date(),
  duration: 5,
  progress: 50,
  status: 'in-progress' // This will make the task bar green
};
```

## Customization

You can customize these colors by overriding the CSS variables in your application:

```css
:root {
  --wx-gantt-status-completed: #1976D2;     /* Darker blue */
  --wx-gantt-status-in-progress: #388E3C;   /* Darker green */
  --wx-gantt-status-delayed: #D32F2F;       /* Darker red */
  --wx-gantt-status-not-started: #757575;   /* Darker gray */
  --wx-gantt-baseline-color: #9E9E9E;       /* Different gray */
}
```

## Priority Over Custom Colors

If a task has both a `status` and a `color` property, the status-based color will take precedence due to the `!important` flag in the CSS. If you want to use a custom color, don't set the `status` property.
