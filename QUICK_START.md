# Quick Start Guide

Get started with the Gantt chart library in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A React project (or create one with `npx create-react-app my-app`)

## Installation

### Step 1: Install the library

Since it's not on npm yet, install from GitHub:

```bash
npm install github:TimJerry725/ganttchart#main
```

Or with pnpm:
```bash
pnpm add github:TimJerry725/ganttchart#main
```

### Step 2: Build the library (if needed)

If the `dist` folders don't exist, you'll need to build:

```bash
# Clone and build
git clone https://github.com/TimJerry725/ganttchart.git
cd ganttchart
npm install -g pnpm  # if needed
pnpm install
pnpm build
```

Then in your project, you can import from the local build or use the GitHub link.

## Basic Example

```tsx
import React from 'react';
import { Gantt } from '@gantt/react';

function App() {
  const tasks = [
    {
      id: 1,
      name: 'Project Setup',
      start: new Date('2024-01-01'),
      end: new Date('2024-01-05'),
      duration: 5,
      progress: 100,
    },
    {
      id: 2,
      name: 'Development',
      start: new Date('2024-01-06'),
      end: new Date('2024-01-20'),
      duration: 15,
      progress: 50,
    },
  ];

  const links = [
    {
      id: '1',
      source: 1,
      target: 2,
      type: 'finish-to-start' as const,
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>My Gantt Chart</h1>
      <Gantt
        tasks={tasks}
        links={links}
        height={600}
        width={1200}
        onTaskClick={(id) => {
          console.log('Task clicked:', id);
        }}
      />
    </div>
  );
}

export default App;
```

## With Ant Design

```bash
npm install antd @gantt/antd
```

```tsx
import React, { useState } from 'react';
import { Gantt } from '@gantt/react';
import { GanttToolbar } from '@gantt/antd';
import type { TimeScale } from '@gantt/renderer';

function App() {
  const [timeScale, setTimeScale] = useState<TimeScale>({
    unit: 'day',
    pixelsPerUnit: 20,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-02-01'),
  });

  return (
    <div>
      <GanttToolbar
        timeScale={timeScale}
        onZoomIn={() => {
          setTimeScale(prev => ({
            ...prev,
            pixelsPerUnit: Math.min(prev.pixelsPerUnit * 1.5, 200)
          }));
        }}
        onZoomOut={() => {
          setTimeScale(prev => ({
            ...prev,
            pixelsPerUnit: Math.max(prev.pixelsPerUnit / 1.5, 5)
          }));
        }}
      />
      <Gantt
        tasks={tasks}
        links={links}
        timeScale={timeScale}
      />
    </div>
  );
}
```

## Next Steps

- Read the full [Installation Guide](./INSTALLATION.md)
- Check out the [demo app](./apps/demo/src/App.tsx)
- See [API documentation](./docs/)
