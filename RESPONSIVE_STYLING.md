# Responsive Design & Style Integration Guide

Complete guide to making the Gantt component responsive and adaptable to your project's styles.

## Responsive Features

The component is fully responsive and adapts to:
- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile Landscape (480px - 768px)
- ✅ Mobile Portrait (< 480px)
- ✅ Touch devices
- ✅ High DPI displays

## Style Integration

The component uses CSS variables that can be overridden to match your project's design system.

### Override CSS Variables

In your project's CSS, override the variables:

```css
/* In your project's CSS file */
.my-gantt-wrapper {
  /* Colors - Match your brand */
  --wx-gantt-primary: #your-brand-color;
  --wx-gantt-background: var(--your-bg-color, #ffffff);
  --wx-gantt-font-color: var(--your-text-color, #333);
  
  /* Fonts - Use your project fonts */
  --wx-gantt-font-family: 'Your Font', -apple-system, sans-serif;
  --wx-gantt-font-size: 14px;
  
  /* Layout - Responsive sizing */
  --gantt-container-height: 100%;
  --gantt-container-min-height: 400px;
  --gantt-grid-width: clamp(280px, 30vw, 720px);
  --gantt-row-height: 44px;
  --gantt-header-height: 84px;
  
  /* Spacing - Match your spacing scale */
  --gantt-spacing-xs: 4px;
  --gantt-spacing-sm: 8px;
  --gantt-spacing-md: 12px;
  --gantt-spacing-lg: 16px;
}
```

### Example: Match Your Project Theme

```css
/* If your project uses Tailwind or similar */
.my-app .gantt-page-wrapper {
  --wx-gantt-primary: theme('colors.blue.500');
  --wx-gantt-background: theme('colors.white');
  --wx-gantt-font-color: theme('colors.gray.900');
  --wx-gantt-font-family: theme('fontFamily.sans');
  --wx-gantt-border-color: theme('colors.gray.200');
}

/* If your project uses Material-UI */
.MuiContainer .gantt-page-wrapper {
  --wx-gantt-primary: var(--mui-palette-primary-main);
  --wx-gantt-background: var(--mui-palette-background-paper);
  --wx-gantt-font-color: var(--mui-palette-text-primary);
  --wx-gantt-font-family: var(--mui-typography-fontFamily);
}
```

## Responsive Configuration

### Container Sizing

```tsx
<Gantt
  tasks={tasks}
  config={{
    // Responsive container height
    containerHeight: '100%',        // or '600px', '50vh', etc.
    containerMinHeight: '400px',    // Minimum height on mobile
    
    // Responsive grid width
    gridWidth: 'clamp(280px, 30vw, 720px)', // Responsive width
    // or fixed: '720px'
    // or percentage: '30vw'
  }}
/>
```

### Responsive Breakpoints

The component automatically adapts at these breakpoints:

- **Desktop**: `> 1024px` - Full layout, side-by-side grid and timeline
- **Tablet**: `768px - 1024px` - Adjusted grid width, responsive spacing
- **Mobile Landscape**: `480px - 768px` - Stacked layout, full-width grid
- **Mobile Portrait**: `< 480px` - Compact layout, icon-only buttons

## Customization Examples

### Example 1: Match Your Brand Colors

```css
/* Your project CSS */
.my-brand .gantt-page-wrapper {
  --wx-gantt-primary: #6366f1;        /* Your primary color */
  --wx-gantt-success: #10b981;        /* Your success color */
  --wx-gantt-warning: #f59e0b;        /* Your warning color */
  --wx-gantt-danger: #ef4444;         /* Your danger color */
  --wx-gantt-background: #ffffff;      /* Your background */
  --wx-gantt-font-color: #1f2937;     /* Your text color */
}
```

### Example 2: Use Your Project Fonts

```css
.my-project .gantt-page-wrapper {
  --wx-gantt-font-family: 'Inter', 'Roboto', sans-serif;
  --wx-gantt-font-size: 16px;
  --wx-gantt-font-weight: 400;
  --wx-gantt-line-height: 1.5;
}
```

### Example 3: Responsive Container

```tsx
function MyGantt() {
  return (
    <div style={{ height: '100vh', padding: '20px' }}>
      <Gantt
        tasks={tasks}
        config={{
          containerHeight: '100%',           // Fill parent
          containerMinHeight: '500px',       // Minimum on mobile
          gridWidth: 'clamp(250px, 25vw, 600px)', // Responsive grid
        }}
      />
    </div>
  )
}
```

### Example 4: Match Ant Design Theme

```css
/* If using Ant Design ConfigProvider */
.ant-app .gantt-page-wrapper {
  --wx-gantt-primary: var(--ant-primary-color);
  --wx-gantt-background: var(--ant-component-background);
  --wx-gantt-font-color: var(--ant-text-color);
  --wx-gantt-border-color: var(--ant-border-color-base);
  --wx-gantt-font-family: var(--ant-font-family);
}
```

## Available CSS Variables

### Colors
- `--wx-gantt-primary`
- `--wx-gantt-primary-selected`
- `--wx-gantt-success`
- `--wx-gantt-warning`
- `--wx-gantt-danger`
- `--wx-gantt-background`
- `--wx-gantt-background-alt`
- `--wx-gantt-background-hover`
- `--wx-gantt-font-color`
- `--wx-gantt-font-color-alt`
- `--wx-gantt-border-color`

### Layout
- `--gantt-container-height` (default: `100%`)
- `--gantt-container-min-height` (default: `400px`)
- `--gantt-grid-width` (default: `clamp(280px, 30vw, 720px)`)
- `--gantt-header-height` (default: `clamp(60px, 8vh, 84px)`)
- `--gantt-row-height` (default: `clamp(36px, 5vh, 44px)`)
- `--gantt-scale-height` (default: `clamp(24px, 3vh, 28px)`)

### Typography
- `--wx-gantt-font-family` (default: inherits from parent)
- `--wx-gantt-font-size` (default: inherits from parent)
- `--wx-gantt-font-weight` (default: inherits from parent)
- `--wx-gantt-line-height` (default: inherits from parent)

### Spacing
- `--gantt-spacing-xs` (default: `clamp(4px, 0.5vw, 8px)`)
- `--gantt-spacing-sm` (default: `clamp(8px, 1vw, 12px)`)
- `--gantt-spacing-md` (default: `clamp(12px, 1.5vw, 16px)`)
- `--gantt-spacing-lg` (default: `clamp(16px, 2vw, 24px)`)

## Mobile Optimizations

The component automatically:
- ✅ Stacks grid and timeline vertically on mobile
- ✅ Makes buttons touch-friendly (min 44px)
- ✅ Hides button text, shows icons only on small screens
- ✅ Adjusts font sizes responsively
- ✅ Enables smooth scrolling on touch devices
- ✅ Adapts modal widths to viewport

## Integration Checklist

- [ ] Override CSS variables to match your brand
- [ ] Set container height to fit your layout
- [ ] Configure grid width for your use case
- [ ] Test on mobile devices
- [ ] Verify fonts match your project
- [ ] Check colors match your theme
- [ ] Ensure spacing feels consistent

## Best Practices

1. **Use CSS Variables**: Override variables instead of using `!important`
2. **Test Responsive**: Check all breakpoints (mobile, tablet, desktop)
3. **Match Your Theme**: Use your project's color palette and fonts
4. **Container Height**: Set appropriate height for your layout context
5. **Grid Width**: Use `clamp()` for truly responsive widths

## Example: Complete Integration

```tsx
// In your project
import { Gantt } from 'iris-gantt'
import 'iris-gantt/gantt.css'
import './gantt-customizations.css' // Your overrides

function ProjectGantt() {
  return (
    <div className="my-project-container">
      <Gantt
        tasks={tasks}
        config={{
          containerHeight: '100%',
          containerMinHeight: '500px',
          gridWidth: 'clamp(300px, 35vw, 800px)',
          theme: 'light',
        }}
      />
    </div>
  )
}
```

```css
/* gantt-customizations.css */
.my-project-container .gantt-page-wrapper {
  /* Match your brand */
  --wx-gantt-primary: #your-color;
  --wx-gantt-font-family: 'Your Font', sans-serif;
  
  /* Responsive sizing */
  --gantt-container-height: 100%;
  --gantt-container-min-height: 500px;
  --gantt-grid-width: clamp(300px, 35vw, 800px);
}
```

The component will automatically adapt to your project's styles and be fully responsive!
