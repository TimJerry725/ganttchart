# Storybook Guide

This project includes comprehensive Storybook documentation for all Gantt chart components.

## Running Storybook

```bash
# Install dependencies (if not already done)
pnpm install

# Start Storybook development server
pnpm storybook
```

Storybook will open at `http://localhost:6006`

## Building Storybook

To build a static version of Storybook:

```bash
pnpm build-storybook
```

The static files will be in the `storybook-static` directory.

## Available Stories

### Gantt/React Component
- **Basic** - Simple Gantt chart with tasks and links
- **WithProgress** - Tasks with different progress percentages
- **WithHierarchy** - Nested tasks with parent-child relationships
- **WithMilestones** - Tasks with milestone markers
- **LargeDataset** - Performance test with 20 tasks
- **DifferentLinkTypes** - Demonstrates all link types (FS, SS, FF, SF)
- **Interactive** - Shows click and double-click handlers
- **CustomColumns** - Custom grid column configuration

### Gantt/Ant Design/Toolbar
- **Basic** - Standard toolbar with zoom controls
- **WithUndoRedo** - Toolbar with undo/redo functionality
- **AllFeatures** - Complete toolbar with all features enabled

### Gantt/SVAR Compatibility
- **Basic** - SVAR API compatibility example
- **WithSVARColumns** - SVAR-style column configuration
- **WithEvents** - SVAR event handlers
- **Readonly** - Read-only mode example

## Story Structure

Each story demonstrates:
- Component props and configuration
- Interactive features
- Different use cases
- Best practices

## Adding New Stories

To add a new story:

1. Create a `*.stories.tsx` file in the component's directory
2. Follow the existing story structure
3. Use the `Meta` and `StoryObj` types from `@storybook/react`
4. Export stories with descriptive names

Example:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  title: 'Category/Component',
  component: MyComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const MyStory: Story = {
  args: {
    // component props
  },
};
```

## Documentation

Storybook automatically generates documentation from:
- Component prop types
- JSDoc comments
- Story descriptions
- Controls configuration

## Tips

- Use the **Controls** panel to interactively change props
- Use the **Actions** panel to see event handlers
- Use the **Docs** tab for component documentation
- Use the **Canvas** tab for interactive testing
