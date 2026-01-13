# Iris Gantt

A powerful React Gantt chart component with Tailwind CSS styling, featuring comprehensive project management capabilities.

## Features

- ✅ Task management (add, edit, delete, drag & drop)
- ✅ Dependencies and links
- ✅ Auto-scheduling
- ✅ Baselines
- ✅ Critical path calculation
- ✅ Resource management
- ✅ Export (CSV, XLSX, PNG, PDF)
- ✅ Undo/Redo
- ✅ Keyboard navigation & accessibility
- ✅ i18n & RTL support
- ✅ Tailwind CSS styling

## Installation

```bash
npm install iris-gantt
```

## Usage

```tsx
import { IrisGantt } from 'iris-gantt';
import 'iris-gantt/styles';

function App() {
  const tasks = [
    {
      id: 1,
      name: 'Task 1',
      start: new Date('2024-01-01'),
      end: new Date('2024-01-05'),
      duration: 5,
    },
  ];

  return <IrisGantt tasks={tasks} width={1200} height={600} />;
}
```

## Storybook

View all examples and features in Storybook:

```bash
npm run storybook
```

Or use the convenience script:

```bash
./run-storybook.sh
```

**Note:** Make sure to use `npm run storybook` (not `npm run .storybook`)

## License

MIT
