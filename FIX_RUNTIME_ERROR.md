# Fix for "recentlyCreatedOwnerStacks" Runtime Error

## Error Message

```
Cannot read properties of undefined (reading 'recentlyCreatedOwnerStacks')
```

## Root Cause

This error occurs when the component tries to access a property that doesn't exist. The property `recentlyCreatedOwnerStacks` is not part of the current codebase, suggesting:

1. **Cached/bundled code** - Your bundler may be using cached or old code
2. **Version mismatch** - You might be using an older version of the package
3. **Build artifacts** - Old build files might be interfering

## Solutions

### Solution 1: Clear All Caches and Rebuild

```bash
# In your project directory
rm -rf node_modules package-lock.json
rm -rf .next          # If using Next.js
rm -rf .cache         # If using other bundlers
rm -rf dist           # If exists
rm -rf build          # If exists

# Clear npm cache
npm cache clean --force

# Reinstall
npm install

# Rebuild
npm run build
# or
npm start
```

### Solution 2: Update the Package

If you're using the package from npm:

```bash
npm update iris-gantt
# or
npm install iris-gantt@latest
```

If you're using it locally:

```bash
# In the iris-gantt package directory
cd /path/to/iris-gantt
npm run build

# Then in your project
npm install /path/to/iris-gantt
# or link it
npm link /path/to/iris-gantt
```

### Solution 3: Verify Your Import

Make sure you're importing correctly:

```tsx
// ✅ Correct
import { Gantt } from 'iris-gantt'
import 'iris-gantt/gantt.css'

// ❌ Wrong - Don't use default import if it causes issues
// import Gantt from 'iris-gantt'
```

### Solution 4: Check Your Component Usage

Ensure you're passing valid props:

```tsx
function GanttView() {
  const tasks = [
    {
      id: '1',
      text: 'Task 1',
      start: new Date(2024, 0, 1),  // Must be Date object
      end: new Date(2024, 0, 10),   // Must be Date object
      duration: 9,
      progress: 50,
    },
  ]

  // Ensure tasks is always an array
  return <Gantt tasks={tasks || []} />
}
```

### Solution 5: Add Defensive Checks (Temporary Fix)

If the error persists, you can wrap the component:

```tsx
import { Gantt } from 'iris-gantt'
import 'iris-gantt/gantt.css'
import { ErrorBoundary } from 'react-error-boundary'

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function GanttView() {
  const tasks = [] // Your tasks

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Gantt tasks={tasks || []} />
    </ErrorBoundary>
  )
}
```

## What Was Fixed

The latest version includes defensive checks for:

1. **Owners array** - Now handles undefined/null gracefully
2. **Tasks array** - Validates before processing
3. **FilterSearch component** - Defaults to empty array if owners is undefined

## Verification

After applying fixes, verify:

1. **Check package version:**
   ```bash
   npm list iris-gantt
   ```

2. **Check for TypeScript errors:**
   ```bash
   npm run type-check
   # or
   tsc --noEmit
   ```

3. **Test the component:**
   ```tsx
   import { Gantt } from 'iris-gantt'
   import 'iris-gantt/gantt.css'

   const tasks = [
     {
       id: '1',
       text: 'Test',
       start: new Date(),
       end: new Date(),
       duration: 1,
       progress: 0,
     },
   ]

   // Should render without errors
   <Gantt tasks={tasks} />
   ```

## Still Having Issues?

1. **Check your bundler version** - Update webpack/vite/next.js
2. **Check React version** - Must be React 18+ or 19+
3. **Check for conflicting packages** - Other Gantt libraries might conflict
4. **Open an issue** with:
   - Your package version
   - Your bundler (webpack, vite, etc.)
   - Your React version
   - The full error stack trace

## Quick Checklist

- [ ] Cleared `node_modules` and reinstalled
- [ ] Cleared bundler cache (`.next`, `.cache`, etc.)
- [ ] Updated to latest `iris-gantt` version
- [ ] Verified imports are correct
- [ ] Tasks array is always defined (use `tasks || []`)
- [ ] All dates are `Date` objects, not strings
- [ ] React version is 18+ or 19+
