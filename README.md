# React Gantt Chart Library

A comprehensive, open-source React Gantt chart library built from scratch with SVAR Gantt API compatibility. Features include task management, dependencies, baselines, critical path, resource management, export capabilities, and full Ant Design integration.

## 🚀 Quick Start

### Installation

**Option 1: Install from GitHub (requires building first)**

```bash
# Clone the repository
git clone https://github.com/TimJerry725/ganttchart.git
cd ganttchart

# Install dependencies and build
npm install -g pnpm  # if you don't have pnpm
pnpm install
pnpm build
```

Then in your project, you can link it locally or copy the built packages.

**Option 2: Use in your project directly**

1. Clone this repo locally
2. Build the packages: `pnpm install && pnpm build`
3. In your project, install the built packages:

```bash
# In your project
npm install /path/to/ganttchart/packages/gantt-react
npm install /path/to/ganttchart/packages/gantt-core
npm install /path/to/ganttchart/packages/gantt-renderer
```

**Option 3: Publish to npm (recommended for production)**

See [INSTALLATION.md](./INSTALLATION.md) for detailed publishing instructions.

### Basic Usage

```tsx
import React from 'react';
import { Gantt } from '@gantt/react';

function App() {
  const tasks = [
    {
      id: 1,
      name: 'Task 1',
      start: new Date('2024-01-01'),
      end: new Date('2024-01-05'),
      duration: 5,
      progress: 50,
    },
  ];

  return (
    <Gantt
      tasks={tasks}
      links={[]}
      height={600}
      width={1200}
      onTaskClick={(id) => console.log('Task clicked:', id)}
    />
  );
}
```

📖 **See [QUICK_START.md](./QUICK_START.md) for more examples!**

## 📦 Packages

- `@gantt/core` - Framework-agnostic core engine (data model, scheduling, plugins)
- `@gantt/renderer` - DOM/SVG/Canvas renderer with virtualization
- `@gantt/react` - React component wrapper
- `@gantt/compat-svar` - SVAR Gantt API compatibility layer
- `@gantt/antd` - Ant Design UI components and theming

## 🛠️ Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Run demo app
pnpm dev

# Run Storybook
pnpm storybook
```

## 📚 Documentation

- [Installation Guide](./INSTALLATION.md) - Detailed installation instructions
- [Quick Start](./QUICK_START.md) - Get started in 5 minutes
- [Migration Guide](./docs/MIGRATION.md) - Migrate from SVAR Gantt
- [Feature Parity Matrix](./docs/parity/svar-matrix.md) - SVAR compatibility

## ✨ Features

- ✅ Task management (add, edit, delete, drag & drop)
- ✅ Dependencies and links
- ✅ Auto-scheduling
- ✅ Baselines
- ✅ Critical path calculation
- ✅ Resource management
- ✅ Export (CSV, JSON, PNG, PDF)
- ✅ Undo/Redo
- ✅ Keyboard navigation & accessibility
- ✅ i18n & RTL support
- ✅ Ant Design integration
- ✅ SVAR Gantt API compatibility

## 📄 License

MIT
