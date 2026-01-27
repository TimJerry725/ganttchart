# Gantt Bar Color Codes - Quick Reference

## Status-Based Colors

### Completed Tasks
- **Color**: Blue
- **Hex Code**: `#2196F3`
- **RGB**: `rgb(33, 150, 243)`

### In Progress Tasks
- **Color**: Green
- **Hex Code**: `#4CAF50`
- **RGB**: `rgb(76, 175, 80)`

### Delayed Tasks
- **Color**: Red
- **Hex Code**: `#F44336`
- **RGB**: `rgb(244, 67, 54)`

### Not Started Tasks
- **Color**: Gray
- **Hex Code**: `#9E9E9E`
- **RGB**: `rgb(158, 158, 158)`

## Baseline Bar

### Baseline (Original Plan)
- **Color**: Gray
- **Hex Code**: `#BDBDBD`
- **RGB**: `rgb(189, 189, 189)`

---

## Visual Reference

```
┌─────────────────────────────────────────┐
│ Status Colors                           │
├─────────────────────────────────────────┤
│ 🟦 Completed    → Blue   (#2196F3)     │
│ 🟩 In Progress  → Green  (#4CAF50)     │
│ 🟥 Delayed      → Red    (#F44336)     │
│ ⬜ Not Started  → Gray   (#9E9E9E)     │
│                                         │
│ Baseline        → Gray   (#BDBDBD)     │
└─────────────────────────────────────────┘
```

## Implementation

These colors are automatically applied when you set the `status` property on a task:

```typescript
{
  id: '1',
  text: 'Task Name',
  status: 'completed' // Will be blue
}
```

Available status values:
- `'completed'`
- `'in-progress'`
- `'delayed'`
- `'not-started'`
