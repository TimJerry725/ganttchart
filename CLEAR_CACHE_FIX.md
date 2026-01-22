# Quick Fix for "recentlyCreatedOwnerStacks" Error

## The Problem

You're getting this error because your project is using **cached/old bundled code** from the iris-gantt package. The property `recentlyCreatedOwnerStacks` doesn't exist in the current codebase.

## Quick Fix (5 minutes)

### Step 1: In Your Project (where you're using iris-gantt)

```bash
# Navigate to your project
cd /path/to/your/project

# Remove all caches and dependencies
rm -rf node_modules
rm -rf package-lock.json
rm -rf .next              # Next.js
rm -rf .cache             # Vite/Webpack
rm -rf dist               # Build output
rm -rf build              # Build output

# Clear npm cache
npm cache clean --force

# If using yarn
yarn cache clean
```

### Step 2: Rebuild iris-gantt Package

```bash
# Navigate to iris-gantt package
cd /Users/tim/Desktop/Iris\ Suite\ Projects/Gantt

# Clean and rebuild
rm -rf dist node_modules/.cache
npm run build

# Verify build
ls -la dist/
# Should see: iris-gantt.js, iris-gantt.umd.cjs, gantt.css, index.d.ts
```

### Step 3: Reinstall in Your Project

```bash
# Back to your project
cd /path/to/your/project

# If using local package
npm install /Users/tim/Desktop/Iris\ Suite\ Projects/Gantt

# Or if using npm link
npm link /Users/tim/Desktop/Iris\ Suite\ Projects/Gantt

# Or if published to npm
npm install iris-gantt@latest

# Install dependencies
npm install
```

### Step 4: Restart Dev Server

```bash
# Stop your dev server (Ctrl+C)
# Then restart
npm start
# or
npm run dev
```

## Alternative: Force Rebuild Everything

If the above doesn't work, force a complete rebuild:

```bash
# In your project
rm -rf node_modules package-lock.json .next .cache dist build
npm cache clean --force

# In iris-gantt package
cd /Users/tim/Desktop/Iris\ Suite\ Projects/Gantt
rm -rf dist node_modules/.cache
npm run build

# Back to your project
cd /path/to/your/project
npm install
npm start
```

## Verify It's Fixed

After clearing caches, check:

1. **Check package version:**
   ```bash
   npm list iris-gantt
   ```
   Should show version 1.0.2 or later

2. **Check the error is gone:**
   - Open your browser console
   - The error should no longer appear
   - The Gantt chart should render

## If Still Not Working

1. **Check your import:**
   ```tsx
   // Make sure you're importing correctly
   import { Gantt } from 'iris-gantt'
   import 'iris-gantt/gantt.css'
   ```

2. **Check your usage:**
   ```tsx
   // Ensure tasks is always an array
   <Gantt tasks={tasks || []} />
   ```

3. **Hard refresh browser:**
   - Chrome/Edge: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Firefox: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

4. **Check bundler cache:**
   - Webpack: Delete `.cache` folder
   - Vite: Delete `node_modules/.vite`
   - Next.js: Delete `.next` folder

## Why This Happens

- Bundlers cache compiled code for performance
- When you update a package, old cached code can still be used
- The error occurs because old code references properties that no longer exist
- Clearing caches forces a fresh build with the latest code

## Prevention

After fixing, to prevent this in the future:

1. **Always clear cache when updating packages:**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Use version pinning:**
   ```json
   {
     "dependencies": {
       "iris-gantt": "^1.0.2"
     }
   }
   ```

3. **Rebuild after package updates:**
   ```bash
   npm run build
   ```
