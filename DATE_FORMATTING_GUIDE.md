# Date Formatting Guide - Iris Gantt

You can customize the date formats in the timeline header (calendar header) using the `scales` property within the `config` object.

For multi-view calendars, use `config.timelineViewScales` to define separate formats for `day`, `week`, and `month` views.

Related header controls:
- `config.showTimelineHeader` hides the entire timeline header.
- `showMonthHeading` and `showRangeHeading` can be passed as top-level props or inside `config`.
- `relativeDayNumbering` can be passed as a top-level prop or inside `config`.

## Available Date Tokens
These tokens can be used in your format strings:

| Token | Description | Example |
| :--- | :--- | :--- |
| `MMMM` | Full Month Name | January, February... |
| `MMM` | Short Month Name | Jan, Feb... |
| `MM` | Padded Month Number | 01, 02... |
| `M` | Month Number | 1, 2... |
| `DD` | Padded Day Number | 01, 02... |
| `D` | Day Number | 1, 2... |
| `YYYY` | Full Year | 2024, 2025... |
| `YY` | Two-digit Year | 24, 25... |
| `dddd` | Full Day of Week | Monday, Tuesday... |
| `HH` | Padded Hour (24h) | 09, 13... |
| `mm` | Padded Minutes | 05, 30... |

---

## Implementation Examples

### 1. Using Full Month Names
If you want the top row to show the full month name:

```tsx
<Gantt
  tasks={tasks}
  config={{
    scales: [
      { unit: 'month', step: 1, format: 'MMMM YYYY' }, // Output: "January 2024"
      { unit: 'day', step: 1, format: 'D' }           // Output: "1", "2", "3"...
    ]
  }}
/>
```

### 2. Using Month Numbers
If you prefer numbers for the months instead of names:

```tsx
<Gantt
  tasks={tasks}
  config={{
    scales: [
      { unit: 'month', step: 1, format: 'MM/YYYY' }, // Output: "01/2024"
      { unit: 'day', step: 1, format: 'D' }
    ]
  }}
/>
```

### 3. Relative Day Numbering
If you want relative numbers (e.g., Day 1, Day 2, Day 3 starting from the project start), use the `relativeDayNumbering` flag:

```tsx
<Gantt
  tasks={tasks}
  config={{
    relativeDayNumbering: true, // This overrides the 'day' unit format to 1, 2, 3...
    scales: [
      { unit: 'month', step: 1, format: 'MMMM' },
      { unit: 'day', step: 1 }
    ]
  }}
/>
```

### 4. Customizing per View
If you are using the Timeline View Switcher, you can customize formats for each view (Day, Week, Month):

```tsx
<Gantt
  tasks={tasks}
  config={{
    timelineViewScales: {
      day: [
        { unit: 'month', step: 1, format: 'MMMM' },
        { unit: 'day', step: 1, format: 'D' }
      ],
      week: [
        { unit: 'month', step: 1, format: 'MMM' },
        { unit: 'week', step: 1, format: 'Week W' } // 'W' is a special token for Week of Month
      ],
      month: [
        { unit: 'year', step: 1, format: 'YYYY' },
        { unit: 'month', step: 1, format: 'MMM' }
      ]
    }
  }}
/>
```

### 5. Hiding Header Rows
If you want to keep custom date formats but hide specific header rows:

```tsx
<Gantt
  tasks={tasks}
  showMonthHeading={false}
  showRangeHeading={false}
  config={{
    showTimelineHeader: true,
    timelineViewScales: {
      day: [{ unit: 'day', step: 1, format: 'D' }],
      week: [{ unit: 'week', step: 1, format: 'Week W' }],
      month: [{ unit: 'month', step: 1, format: 'MMM YYYY' }]
    }
  }}
/>
```
