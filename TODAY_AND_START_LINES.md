# Today and Project Start Lines - Complete Configuration

## Overview

The Gantt chart now includes vertical reference lines for "Today" and "Project Start" dates, matching the reference image you provided. All styling is fully configurable via props.

## Configuration Options

All options are available in the `config` prop:

```tsx
<Gantt
  tasks={tasks}
  config={{
    // Today Line Configuration
    showTodayLine: true, // Show/hide today line (default: true)
    todayLineColor: '#ff4d4f', // Line and label color (default: red)
    todayLineLabel: 'Today', // Label text (default: 'Today')
    todayLineWidth: 2, // Line width in pixels (default: 2)
    todayLineStyle: 'solid', // 'solid' | 'dashed' | 'dotted' (default: 'solid')
    todayLineOpacity: 1, // Opacity 0-1 (default: 1)
    todayLineLabelStyle: { // Custom CSS for label
      fontSize: '12px',
      padding: '4px 10px',
      // ... any CSS properties
    },
    
    // Project Start Line Configuration
    showProjectStartLine: true, // Show/hide project start line (default: true)
    projectStartDate: new Date(2024, 0, 1), // Project start date (optional - defaults to earliest task start)
    projectStartLineColor: '#40a9ff', // Line and label color (default: light blue)
    projectStartLineLabel: 'Start Project', // Label text (default: 'Start Project')
    projectStartLineWidth: 2, // Line width in pixels (default: 2)
    projectStartLineStyle: 'solid', // 'solid' | 'dashed' | 'dotted' (default: 'solid')
    projectStartLineOpacity: 1, // Opacity 0-1 (default: 1)
    projectStartLineLabelStyle: { // Custom CSS for label
      fontSize: '12px',
      padding: '4px 10px',
      // ... any CSS properties
    },
  }}
/>
```

## Default Behavior

- **Today Line**: 
  - Enabled by default
  - Red color (#ff4d4f)
  - Label: "Today"
  - 2px solid line
  - Positioned at current date

- **Project Start Line**:
  - Enabled by default
  - Light blue color (#40a9ff)
  - Label: "Start Project"
  - 2px solid line
  - Automatically uses earliest task start date if `projectStartDate` not provided

## Visual Styling

### Labels
- Positioned above the timeline header
- White text on colored background
- Rounded corners (4px border-radius)
- Shadow for depth
- Centered above the vertical line

### Lines
- Full-height vertical lines
- Extend from top to bottom of timeline
- Positioned behind grid but above task bars
- Clean, solid appearance by default
- Support for dashed/dotted styles

## Examples

### Basic Usage (Default)
```tsx
<Gantt tasks={tasks} />
// Today and Project Start lines shown with defaults
```

### Custom Colors
```tsx
<Gantt
  tasks={tasks}
  config={{
    todayLineColor: '#e74c3c',
    projectStartLineColor: '#3498db',
  }}
/>
```

### Hide Lines
```tsx
<Gantt
  tasks={tasks}
  config={{
    showTodayLine: false,
    showProjectStartLine: false,
  }}
/>
```

### Custom Styling
```tsx
<Gantt
  tasks={tasks}
  config={{
    todayLineWidth: 3,
    todayLineStyle: 'dashed',
    todayLineOpacity: 0.8,
    todayLineLabelStyle: {
      fontSize: '14px',
      fontWeight: 700,
      padding: '6px 12px',
    },
    projectStartLineWidth: 3,
    projectStartLineStyle: 'dotted',
    projectStartLineOpacity: 0.7,
  }}
/>
```

### Custom Project Start Date
```tsx
<Gantt
  tasks={tasks}
  config={{
    projectStartDate: new Date(2024, 0, 15), // January 15, 2024
    projectStartLineLabel: 'Project Kickoff',
  }}
/>
```

## All Configurable Properties

### Today Line
- `showTodayLine?: boolean` - Show/hide
- `todayLineColor?: string` - Color
- `todayLineLabel?: string` - Label text
- `todayLineWidth?: number` - Line width (px)
- `todayLineStyle?: 'solid' | 'dashed' | 'dotted'` - Line style
- `todayLineOpacity?: number` - Opacity (0-1)
- `todayLineLabelStyle?: React.CSSProperties` - Custom label CSS

### Project Start Line
- `showProjectStartLine?: boolean` - Show/hide
- `projectStartDate?: Date` - Start date (optional)
- `projectStartLineColor?: string` - Color
- `projectStartLineLabel?: string` - Label text
- `projectStartLineWidth?: number` - Line width (px)
- `projectStartLineStyle?: 'solid' | 'dashed' | 'dotted'` - Line style
- `projectStartLineOpacity?: number` - Opacity (0-1)
- `projectStartLineLabelStyle?: React.CSSProperties` - Custom label CSS

## Notes

- Lines only appear when within the visible date range
- Labels are positioned above the timeline header
- Lines extend the full height of the timeline body
- All styling is fully customizable via props
- Lines are non-interactive (pointer-events: none)
