# Installation Guide

This guide shows you how to install and use the Gantt chart library in your projects.

## Option 1: Install from GitHub (Recommended for now)

Since the packages aren't published to npm yet, you can install directly from GitHub:

### Using npm:

```bash
npm install TimJerry725/ganttchart#main --save
```

Or add to your `package.json`:

```json
{
  "dependencies": {
    "@gantt/react": "github:TimJerry725/ganttchart#main",
    "@gantt/compat-svar": "github:TimJerry725/ganttchart#main",
    "@gantt/antd": "github:TimJerry725/ganttchart#main"
  }
}
```

### Using pnpm:

```bash
pnpm add TimJerry725/ganttchart#main
```

### Using yarn:

```bash
yarn add TimJerry725/ganttchart#main
```

**Note:** When installing from GitHub, you'll need to build the packages first. See "Building the Library" below.

## Option 2: Install Locally (Development)

If you want to develop or modify the library:

```bash
# Clone the repository
git clone https://github.com/TimJerry725/ganttchart.git
cd ganttchart

# Install dependencies (requires pnpm)
npm install -g pnpm  # if you don't have pnpm
pnpm install

# Build all packages
pnpm build
```

Then in your project, link it:

```bash
# In the ganttchart directory
pnpm link --global

# In your project directory
pnpm link --global @gantt/react @gantt/compat-svar @gantt/antd
```

## Option 3: Publish to npm (For Production Use)

To publish to npm for easier installation:

1. **Set up npm account and authentication:**
   ```bash
   npm login
   ```

2. **Update package names** (if you want your own scope):
   - Edit `packages/*/package.json` files
   - Change `@gantt/*` to your desired scope (e.g., `@yourname/gantt-react`)

3. **Build packages:**
   ```bash
   pnpm build
   ```

4. **Publish:**
   ```bash
   # Publish all packages
   pnpm -r --filter='./packages/*' publish --access public
   ```

   Or use changesets for versioning:
   ```bash
   pnpm changeset
   pnpm version-packages
   pnpm release
   ```

## Building the Library

Before using the library, you need to build it:

```bash
# Install dependencies
pnpm install  # or npm install

# Build all packages
pnpm build    # or npm run build
```

This creates the `dist` folders in each package that contain the compiled code.

## Usage in Your Project

### Basic Usage (React)

```bash
npm install react react-dom
npm install @gantt/react
```

```tsx
import React from 'react';
import { Gantt } from '@gantt/react';
import type { Task, Link } from '@gantt/core';

function MyGantt() {
  const tasks: Task[] = [
    {
      id: 1,
      name: 'Task 1',
      start: new Date('2024-01-01'),
      end: new Date('2024-01-05'),
      duration: 5,
      progress: 50,
    },
  ];

  const links: Link[] = [];

  return (
    <Gantt
      tasks={tasks}
      links={links}
      height={600}
      width={1200}
      onTaskClick={(id) => console.log('Task clicked:', id)}
    />
  );
}
```

### With Ant Design

```bash
npm install antd @gantt/react @gantt/antd
```

```tsx
import React from 'react';
import { Gantt } from '@gantt/react';
import { GanttToolbar } from '@gantt/antd';
import 'antd/dist/reset.css'; // or your Ant Design CSS

function MyGantt() {
  return (
    <div>
      <GanttToolbar
        timeScale={timeScale}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
      <Gantt tasks={tasks} links={links} />
    </div>
  );
}
```

### With SVAR Compatibility

```bash
npm install @gantt/react @gantt/compat-svar
```

```tsx
import React from 'react';
import { SvarGantt } from '@gantt/compat-svar';

function MyGantt() {
  return (
    <SvarGantt
      tasks={[
        {
          id: 1,
          text: 'Task 1',
          start_date: '2024-01-01',
          duration: 5,
        },
      ]}
      links={[]}
      onTaskClick={(id) => console.log('Task clicked:', id)}
    />
  );
}
```

## Requirements

- **Node.js**: >= 18.0.0
- **React**: >= 18.0.0
- **TypeScript**: Recommended (but not required)

## Troubleshooting

### Build Errors

If you get build errors when installing from GitHub:

1. Make sure you have Node.js 18+ installed
2. Install dependencies: `pnpm install` or `npm install`
3. Build packages: `pnpm build` or `npm run build`

### TypeScript Errors

If TypeScript can't find types:

1. Make sure `dist` folders exist (run `pnpm build`)
2. Check that `package.json` has correct `types` field pointing to `dist/index.d.ts`

### Module Resolution Issues

If you get module resolution errors:

1. Make sure all workspace dependencies are built
2. Check that `tsconfig.json` paths are configured correctly
3. Try clearing node_modules and reinstalling

## Next Steps

- See [README.md](./README.md) for more information
- Check [docs/MIGRATION.md](./docs/MIGRATION.md) for SVAR migration guide
- View examples in [apps/demo](./apps/demo)
