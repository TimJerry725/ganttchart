# Fix for Import Issues

## Issue 1: CSS Import Error

**Error:**
```
Module not found: Error: Package path ./dist/gantt.css is not exported from package
```

**Solution:**

The CSS export has been fixed in `package.json`. After updating the package, use:

```tsx
import 'iris-gantt/gantt.css'
```

If you still get the error after updating:

1. **Clear node_modules and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Verify the package version:**
   Make sure you have the latest version with the fix:
   ```bash
   npm list iris-gantt
   ```

3. **Alternative CSS import (if above doesn't work):**
   Some bundlers might need a different path. Try:
   ```tsx
   // Option 1 (preferred)
   import 'iris-gantt/gantt.css'
   
   // Option 2 (if Option 1 fails)
   import 'iris-gantt/dist/gantt.css'
   ```

## Issue 2: Default Import Error

**Error:**
```
export 'default' (imported as 'IrisGantt') was not found in 'iris-gantt'
```

**Solution:**

The package now supports both default and named imports:

### Option 1: Use Default Import (Now Supported)
```tsx
import IrisGantt from 'iris-gantt'
import 'iris-gantt/gantt.css'

function MyComponent() {
  return <IrisGantt tasks={tasks} />
}
```

### Option 2: Use Named Import (Recommended)
```tsx
import { Gantt } from 'iris-gantt'
import 'iris-gantt/gantt.css'

function MyComponent() {
  return <Gantt tasks={tasks} />
}
```

## Complete Working Example

```tsx
import React from 'react'
import { Gantt } from 'iris-gantt'  // or: import Gantt from 'iris-gantt'
import 'iris-gantt/gantt.css'
import type { Task } from 'iris-gantt'

function GanttView() {
  const tasks: Task[] = [
    {
      id: '1',
      text: 'My Task',
      start: new Date(2024, 0, 1),
      end: new Date(2024, 0, 10),
      duration: 9,
      progress: 50,
    },
  ]

  return <Gantt tasks={tasks} />
}

export default GanttView
```

## If Issues Persist

1. **Update the package:**
   ```bash
   npm update iris-gantt
   # or
   npm install iris-gantt@latest
   ```

2. **Clear all caches:**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Clear webpack/bundler cache
   rm -rf node_modules/.cache
   rm -rf .next  # if using Next.js
   rm -rf .cache # if using other bundlers
   ```

3. **Rebuild your project:**
   ```bash
   # For Create React App
   npm start
   
   # For Next.js
   npm run dev
   
   # For Vite
   npm run dev
   ```

4. **Check package.json in node_modules:**
   Verify the installed package has the correct exports:
   ```bash
   cat node_modules/iris-gantt/package.json | grep -A 10 "exports"
   ```

   Should show:
   ```json
   "exports": {
     ".": {
       "import": { ... },
       "require": { ... }
     },
     "./gantt.css": {
       "default": "./dist/gantt.css"
     }
   }
   ```

## Verification

After fixing, verify the imports work:

```tsx
// Test 1: Named import
import { Gantt } from 'iris-gantt'
console.log('Gantt:', typeof Gantt) // Should be 'function'

// Test 2: Default import
import GanttDefault from 'iris-gantt'
console.log('Default:', typeof GanttDefault) // Should be 'function'

// Test 3: CSS import
import 'iris-gantt/gantt.css'
// Should not throw an error
```

## Still Having Issues?

1. Check that you're using the latest version: `npm list iris-gantt`
2. Verify all peer dependencies are installed
3. Check your bundler configuration (webpack, vite, etc.)
4. Open an issue on GitHub with:
   - Your package version
   - Your bundler (webpack, vite, etc.)
   - The exact error message
   - Your import statements
