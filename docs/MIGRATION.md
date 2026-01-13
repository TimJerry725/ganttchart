# Migration Guide: SVAR Gantt to @gantt/react

This guide helps you migrate from SVAR Gantt to this library.

## Installation

```bash
npm install @gantt/react @gantt/compat-svar @gantt/antd
```

## Basic Migration

### Before (SVAR)

```javascript
import { Gantt } from 'svar-gantt';

const gantt = new Gantt('#gantt-container', {
  tasks: [
    {
      id: 1,
      text: 'Task 1',
      start_date: '2024-01-01',
      duration: 5,
    },
  ],
  links: [
    {
      id: 1,
      source: 1,
      target: 2,
      type: 0,
    },
  ],
});
```

### After (This Library)

```javascript
import { SvarGantt } from '@gantt/compat-svar';

<SvarGantt
  tasks={[
    {
      id: 1,
      text: 'Task 1',
      start_date: '2024-01-01',
      duration: 5,
    },
  ]}
  links={[
    {
      id: 1,
      source: 1,
      target: 2,
      type: 0,
    },
  ]}
/>
```

## Using Native API

For better performance and more features, consider using the native API:

```javascript
import { Gantt } from '@gantt/react';

<Gantt
  tasks={tasks}
  links={links}
  onTaskClick={(id) => console.log('Task clicked:', id)}
  onTaskUpdate={(id, updates) => {
    // Update task
  }}
/>
```

## Event Handling

### Before (SVAR)

```javascript
gantt.attachEvent('onTaskClick', (id, e) => {
  console.log('Task clicked:', id);
});
```

### After (This Library)

```javascript
<SvarGantt
  onTaskClick={(id, e) => {
    console.log('Task clicked:', id);
  }}
/>
```

## API Methods

Most SVAR API methods are available through the compatibility layer:

```javascript
import { createSvarGantt } from '@gantt/compat-svar';

const gantt = createSvarGantt('#container', config, events);

// All SVAR methods work the same
gantt.addTask({ id: 1, text: 'New Task', start_date: '2024-01-01' });
gantt.updateTask(1, { text: 'Updated Task' });
gantt.removeTask(1);
```

## Differences

1. **React-based**: This library is React-first, while SVAR is framework-agnostic
2. **TypeScript**: Full TypeScript support out of the box
3. **Modular**: Import only what you need
4. **OSS**: Fully open-source with MIT license

## Need Help?

- Check the [API Documentation](../API.md)
- See [Examples](../examples/)
- Open an issue on GitHub
