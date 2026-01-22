# Installation & Usage Guide

This guide makes it super easy to install and use iris-gantt.

## 🎯 One-Command Installation

The easiest way to install everything:

```bash
npm install iris-gantt react react-dom antd@^5.29.3 dayjs @fortawesome/react-fontawesome@^3.1.0 @fortawesome/fontawesome-svg-core@^7.1.0 @fortawesome/free-solid-svg-icons@^7.1.0
```

## 📝 Step-by-Step

### 1. Install the Package

```bash
npm install iris-gantt
```

### 2. Install Peer Dependencies

These are required for the component to work:

```bash
npm install react react-dom antd@^5.29.3 dayjs @fortawesome/react-fontawesome@^3.1.0 @fortawesome/fontawesome-svg-core@^7.1.0 @fortawesome/free-solid-svg-icons@^7.1.0
```

### 3. Import and Use

```tsx
import { Gantt } from 'iris-gantt'
import 'iris-gantt/gantt.css'  // Don't forget this!

function App() {
  const tasks = [
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
```

## ✅ Verification Checklist

After installation, verify:

- [ ] Package installed: `iris-gantt` is in `node_modules`
- [ ] Peer dependencies installed: Check `package.json` has all required packages
- [ ] CSS imported: `import 'iris-gantt/gantt.css'` is in your component
- [ ] Component imported: `import { Gantt } from 'iris-gantt'`
- [ ] Tasks are Date objects: `start: new Date(...)` not strings

## 🚨 Common Installation Issues

### Issue: "Module not found"

**Solution:** Make sure you've installed all peer dependencies:
```bash
npm install react react-dom antd@^5.29.3 dayjs @fortawesome/react-fontawesome@^3.1.0 @fortawesome/fontawesome-svg-core@^7.1.0 @fortawesome/free-solid-svg-icons@^7.1.0
```

### Issue: Styles not working

**Solution:** Import the CSS file:
```tsx
import 'iris-gantt/gantt.css'
```

### Issue: TypeScript errors

**Solution:** Make sure TypeScript is installed and types are imported:
```tsx
import type { Task, Link } from 'iris-gantt'
```

## 📚 Next Steps

- Check out [QUICK_START.md](./QUICK_START.md) for a 2-minute setup
- See [USAGE.md](./USAGE.md) for complete documentation
- Copy [EXAMPLE.tsx](./EXAMPLE.tsx) for a working example

## 🔗 Package Information

- **Package Name:** `iris-gantt`
- **Version:** Check npm for latest version
- **License:** MIT
- **Repository:** [GitHub](https://github.com/TimJerry725/ganttchart)
