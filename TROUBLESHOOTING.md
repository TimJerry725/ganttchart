# Troubleshooting Guide

## Common Import/Export Errors

### Error: "Element type is invalid: expected a string... but got: undefined"

This error means the `Gantt` component is not being imported correctly.

#### Solution 1: Check Your Import Statement

Make sure you're using a **named import**, not a default import:

```tsx
// ✅ Correct
import { Gantt } from 'iris-gantt'

// ❌ Wrong - Don't use default import
import Gantt from 'iris-gantt'
```

#### Solution 2: Verify Package Installation

Check that the package is installed:

```bash
npm list iris-gantt
```

If not installed:
```bash
npm install iris-gantt
```

#### Solution 3: Check Peer Dependencies

Make sure all peer dependencies are installed:

```bash
npm install react react-dom antd dayjs @fortawesome/react-fontawesome @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons
```

#### Solution 4: Clear Cache and Reinstall

Sometimes npm cache can cause issues:

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Solution 5: Check Build Output

If you're using the package locally (not from npm), make sure it's built:

```bash
cd iris-gantt
npm run build
```

#### Solution 6: Verify Import Path

Make sure you're importing from the correct package name:

```tsx
// ✅ Correct
import { Gantt } from 'iris-gantt'

// ❌ Wrong - Don't use relative paths if installed from npm
import { Gantt } from './iris-gantt'
```

### Error: "Module not found: Can't resolve 'iris-gantt'"

#### Solution: Install the Package

```bash
npm install iris-gantt
```

### Error: "Cannot find module 'iris-gantt/gantt.css'"

#### Solution: The CSS file is included in the package

Make sure you're importing it correctly:

```tsx
import 'iris-gantt/gantt.css'
```

If the error persists, check that the package was built correctly and includes the `dist/gantt.css` file.

### Error: "React is not defined" or "ReactDOM is not defined"

#### Solution: Install React and ReactDOM

```bash
npm install react react-dom
```

### Error: TypeScript Errors

#### Solution 1: Install TypeScript Types

```bash
npm install --save-dev @types/react @types/react-dom
```

#### Solution 2: Import Types Explicitly

```tsx
import { Gantt } from 'iris-gantt'
import type { Task, Link, GanttProps } from 'iris-gantt'
```

### Error: Styles Not Applied

#### Solution: Import the CSS File

**This is required!** Don't forget to import the CSS:

```tsx
import { Gantt } from 'iris-gantt'
import 'iris-gantt/gantt.css'  // ← Required!
```

### Error: Tasks Not Rendering

#### Solution 1: Check Date Format

Dates must be `Date` objects, not strings:

```tsx
// ✅ Correct
start: new Date(2024, 0, 1)

// ❌ Wrong
start: '2024-01-01'
```

#### Solution 2: Verify Task Structure

Make sure your tasks have all required fields:

```tsx
const task = {
  id: '1',                    // Required: unique string
  text: 'Task Name',          // Required: string
  start: new Date(...),       // Required: Date object
  end: new Date(...),         // Required: Date object
  duration: 10,               // Required: number (days)
  progress: 50,               // Required: number (0-100)
}
```

### Error: "Cannot read property 'X' of undefined"

This usually means a peer dependency is missing or the wrong version.

#### Solution: Check Peer Dependency Versions

Make sure you have compatible versions:

```json
{
  "react": "^18.0.0 || ^19.0.0",
  "react-dom": "^18.0.0 || ^19.0.0",
  "antd": "^6.0.0",
  "dayjs": "^1.11.0"
}
```

## Debugging Steps

### 1. Verify Installation

```bash
# Check if package is installed
npm list iris-gantt

# Check installed version
npm list iris-gantt --depth=0
```

### 2. Check Package Exports

```tsx
// In your component, try logging the import
import * as IrisGantt from 'iris-gantt'
console.log('Available exports:', Object.keys(IrisGantt))
console.log('Gantt component:', IrisGantt.Gantt)
```

### 3. Verify Build

If using the package locally, check the build:

```bash
cd iris-gantt
npm run build
ls -la dist/
```

You should see:
- `iris-gantt.js` (ES module)
- `iris-gantt.umd.cjs` (UMD module)
- `gantt.css` (styles)
- `index.d.ts` (TypeScript declarations)

### 4. Check Browser Console

Open your browser's developer console and check for:
- Import errors
- Missing dependency warnings
- Type errors

### 5. Minimal Test Case

Try this minimal example to isolate the issue:

```tsx
import React from 'react'
import { Gantt } from 'iris-gantt'
import 'iris-gantt/gantt.css'

function Test() {
  const tasks = [
    {
      id: '1',
      text: 'Test',
      start: new Date(2024, 0, 1),
      end: new Date(2024, 0, 10),
      duration: 9,
      progress: 0,
    },
  ]

  return <Gantt tasks={tasks} />
}

export default Test
```

## Still Having Issues?

1. **Check the GitHub Issues**: [GitHub Issues](https://github.com/TimJerry725/ganttchart/issues)
2. **Verify Package Version**: Make sure you're using the latest version
3. **Check React Version**: Ensure you're using React 18+ or 19+
4. **Review Documentation**: See [USAGE.md](./USAGE.md) for complete examples

## Common Mistakes

### ❌ Wrong: Default Import
```tsx
import Gantt from 'iris-gantt'  // Wrong!
```

### ✅ Correct: Named Import
```tsx
import { Gantt } from 'iris-gantt'  // Correct!
```

### ❌ Wrong: String Dates
```tsx
start: '2024-01-01'  // Wrong!
```

### ✅ Correct: Date Objects
```tsx
start: new Date(2024, 0, 1)  // Correct!
```

### ❌ Wrong: Missing CSS Import
```tsx
import { Gantt } from 'iris-gantt'
// Missing CSS import!
```

### ✅ Correct: Include CSS
```tsx
import { Gantt } from 'iris-gantt'
import 'iris-gantt/gantt.css'  // Required!
```
