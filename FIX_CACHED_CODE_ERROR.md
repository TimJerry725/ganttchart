# Fix for "recentlyCreatedOwnerStacks" Error in Other Project

## The Problem

You're getting this error because your **other project** is using **cached/old bundled code** from the iris-gantt package. The property `recentlyCreatedOwnerStacks` doesn't exist in the current codebase (version 1.0.4+).

## Quick Fix (Do this in your OTHER project)

### Step 1: Navigate to Your Other Project

```bash
cd /path/to/your/other/project
```

### Step 2: Clear ALL Caches

```bash
# Remove dependencies
rm -rf node_modules
rm -rf package-lock.json

# Remove bundler caches
rm -rf .next              # Next.js
rm -rf .cache             # Vite/Webpack
rm -rf dist               # Build output
rm -rf build              # Build output
rm -rf node_modules/.cache # General cache

# Clear npm cache
npm cache clean --force

# If using yarn
yarn cache clean
```

### Step 3: Update the Package

```bash
# Option 1: If using from npm
npm install iris-gantt@latest

# Option 2: If using local package
npm install /Users/tim/Desktop/Iris\ Suite\ Projects/Gantt

# Option 3: If using npm link
npm unlink iris-gantt
cd /Users/tim/Desktop/Iris\ Suite\ Projects/Gantt
npm run build
npm link
cd /path/to/your/other/project
npm link iris-gantt
```

### Step 4: Reinstall Everything

```bash
npm install
```

### Step 5: Restart Dev Server

```bash
# Stop server (Ctrl+C)
# Then restart
npm start
# or
npm run dev
```

## Verify It's Fixed

1. **Check package version:**
   ```bash
   npm list iris-gantt
   # Should show: iris-gantt@1.0.4
   ```

2. **Hard refresh browser:**
   - Chrome/Edge: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Firefox: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

3. **Check browser console:**
   - The error should be gone
   - Gantt chart should render

## If Still Not Working

### Option 1: Force Reinstall

```bash
# In your other project
rm -rf node_modules package-lock.json .next .cache dist build
npm cache clean --force

# Rebuild iris-gantt package first
cd /Users/tim/Desktop/Iris\ Suite\ Projects/Gantt
rm -rf dist
npm run build

# Back to your project
cd /path/to/your/other/project
npm install
npm start
```

### Option 2: Check Your Import

Make sure you're importing correctly:

```tsx
// ✅ Correct
import { Gantt } from 'iris-gantt'
import 'iris-gantt/gantt.css'

// ❌ Wrong
import Gantt from 'iris-gantt'  // Only if default export works
```

### Option 3: Verify Package Files

Check that the installed package has the correct files:

```bash
# In your other project
ls -la node_modules/iris-gantt/dist/

# Should see:
# - iris-gantt.js
# - iris-gantt.umd.cjs
# - gantt.css
# - index.d.ts
```

### Option 4: Check Package Version in node_modules

```bash
cat node_modules/iris-gantt/package.json | grep version
# Should show: "version": "1.0.4"
```

## Why This Happens

1. **Bundler caching** - Webpack/Vite caches compiled code
2. **Old package version** - Using an older version with the bug
3. **npm cache** - npm caches package files
4. **Browser cache** - Browser caches JavaScript bundles

## Prevention

After fixing, to prevent this:

1. **Always clear cache when updating:**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Use specific version:**
   ```json
   {
     "dependencies": {
       "iris-gantt": "^1.0.4"
     }
   }
   ```

3. **Clear bundler cache regularly:**
   ```bash
   rm -rf .next .cache dist build
   ```

## Still Having Issues?

1. **Check npm registry:**
   ```bash
   npm view iris-gantt version
   # Should show: 1.0.4
   ```

2. **Verify you own the package:**
   ```bash
   npm view iris-gantt maintainers
   ```

3. **Try a fresh install:**
   ```bash
   # Create a new test project
   npx create-react-app test-gantt
   cd test-gantt
   npm install iris-gantt@latest react@^18.3.1 react-dom@^18.3.1
   # Test if it works there
   ```

4. **Check for conflicting packages:**
   ```bash
   npm list | grep -i gantt
   # Should only show iris-gantt
   ```

## Summary

The error is from **cached code in your other project**, not from the iris-gantt package itself. The fix is to:

1. ✅ Clear all caches
2. ✅ Update to latest version (1.0.4+)
3. ✅ Reinstall dependencies
4. ✅ Restart dev server
5. ✅ Hard refresh browser

The property `recentlyCreatedOwnerStacks` was never in the codebase - it's a bundler cache artifact.
