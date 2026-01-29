# Gantt Chart Style Customization

The Gantt chart component supports comprehensive styling through the `styleConfig` prop, allowing you to match any project's design system.

## Basic Usage

```tsx
import { Gantt } from 'iris-gantt';
import type { GanttStyleConfig } from 'iris-gantt';

const myStyleConfig: Partial<GanttStyleConfig> = {
  // Fonts
  fontFamily: "'Inter', -apple-system, sans-serif",
  fontSize: '14px',
  fontWeight: 400,
  
  // Primary colors
  primary: '#6366f1',
  linkColor: '#6366f1',
  
  // Popover styling
  popoverBackground: '#ffffff',
  popoverBorderRadius: '12px',
  popoverFontFamily: "'Inter', sans-serif",
  
  // Button styling
  buttonPrimaryBackground: '#6366f1',
  buttonPrimaryColor: '#ffffff',
  buttonPrimaryBorderRadius: '8px',
  buttonPrimaryFontWeight: 600,
  
  // Input styling
  inputBorderRadius: '8px',
  inputBorderColor: '#e5e7eb',
  inputFocusBorderColor: '#6366f1',
};

<Gantt
  tasks={tasks}
  links={links}
  styleConfig={myStyleConfig}
/>
```

## Complete Style Configuration Options

### Colors
- `primary` - Primary brand color
- `primarySelected` - Selected state color
- `success` - Success state color
- `warning` - Warning state color
- `danger` - Danger/error state color
- `background` - Main background color
- `backgroundAlt` - Alternative background color
- `backgroundHover` - Hover state background
- `fontColor` - Main text color
- `fontColorAlt` - Alternative text color
- `iconColor` - Icon color
- `borderColor` - Border color

### Typography
- `fontFamily` - Main font family
- `fontMono` - Monospace font family
- `fontSize` - Base font size
- `fontWeight` - Base font weight
- `lineHeight` - Line height

### Spacing
- `spacingXS` - Extra small spacing
- `spacingSM` - Small spacing
- `spacingMD` - Medium spacing
- `spacingLG` - Large spacing

### Popover & Modal
- `popoverBackground` - Popover background color
- `popoverBorderColor` - Popover border color
- `popoverBorderRadius` - Popover border radius
- `popoverShadow` - Popover box shadow
- `popoverPadding` - Popover padding
- `popoverFontFamily` - Popover font family
- `popoverFontSize` - Popover font size
- `modalBackground` - Modal background color
- `modalBorderRadius` - Modal border radius
- `modalShadow` - Modal box shadow

### Buttons
- `buttonPrimaryBackground` - Primary button background
- `buttonPrimaryColor` - Primary button text color
- `buttonPrimaryHoverBackground` - Primary button hover background
- `buttonPrimaryBorderRadius` - Primary button border radius
- `buttonPrimaryFontWeight` - Primary button font weight
- `buttonPrimaryFontFamily` - Primary button font family
- `buttonDangerBackground` - Danger button background
- `buttonDangerColor` - Danger button text color
- `buttonSecondaryBackground` - Secondary button background
- `buttonSecondaryColor` - Secondary button text color
- `buttonSecondaryBorderColor` - Secondary button border color

### Inputs
- `inputBackground` - Input background color
- `inputBorderColor` - Input border color
- `inputBorderRadius` - Input border radius
- `inputFocusBorderColor` - Input focus border color
- `inputFontFamily` - Input font family
- `inputFontSize` - Input font size
- `inputPadding` - Input padding

### Lists & Menus
- `listItemHoverBackground` - List item hover background
- `listItemSelectedBackground` - List item selected background
- `listItemBorderColor` - List item border color
- `menuBackground` - Menu background color
- `menuBorderColor` - Menu border color
- `menuItemHoverBackground` - Menu item hover background

### Badges & Tags
- `badgeBackground` - Badge background color
- `badgeBorderColor` - Badge border color
- `badgeColor` - Badge text color
- `badgeFontSize` - Badge font size
- `badgePadding` - Badge padding
- `badgeBorderRadius` - Badge border radius

### Links
- `linkColor` - Link color
- `linkHoverColor` - Link hover color
- `linkFontWeight` - Link font weight

### Advanced Customization
- `customCSSVariables` - Custom CSS variables object

## Example: Material Design Theme

```tsx
const materialTheme: Partial<GanttStyleConfig> = {
  fontFamily: "'Roboto', sans-serif",
  fontSize: '14px',
  
  primary: '#1976d2',
  linkColor: '#1976d2',
  
  popoverBorderRadius: '4px',
  popoverShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14)',
  
  buttonPrimaryBackground: '#1976d2',
  buttonPrimaryBorderRadius: '4px',
  buttonPrimaryFontWeight: 500,
  
  inputBorderRadius: '4px',
  badgeBorderRadius: '16px',
};
```

## Example: Tailwind-inspired Theme

```tsx
const tailwindTheme: Partial<GanttStyleConfig> = {
  fontFamily: "'Inter var', sans-serif",
  fontSize: '14px',
  
  primary: '#3b82f6',
  linkColor: '#3b82f6',
  
  popoverBackground: '#ffffff',
  popoverBorderRadius: '0.5rem',
  popoverShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  
  buttonPrimaryBackground: '#3b82f6',
  buttonPrimaryBorderRadius: '0.375rem',
  buttonPrimaryFontWeight: 600,
  
  inputBorderRadius: '0.375rem',
  inputBorderColor: '#d1d5db',
  inputFocusBorderColor: '#3b82f6',
  
  badgeBackground: '#dbeafe',
  badgeBorderColor: '#93c5fd',
  badgeColor: '#1e40af',
  badgeBorderRadius: '0.25rem',
};
```

## Example: Dark Theme

```tsx
const darkTheme: Partial<GanttStyleConfig> = {
  fontFamily: "'Inter', sans-serif",
  
  background: '#1a1a1a',
  backgroundAlt: '#2a2a2a',
  fontColor: '#e5e5e5',
  fontColorAlt: '#a3a3a3',
  
  primary: '#6366f1',
  linkColor: '#818cf8',
  
  popoverBackground: '#2a2a2a',
  popoverBorderColor: '#404040',
  popoverBorderRadius: '8px',
  
  buttonPrimaryBackground: '#6366f1',
  buttonPrimaryColor: '#ffffff',
  
  inputBackground: '#1a1a1a',
  inputBorderColor: '#404040',
  inputFocusBorderColor: '#6366f1',
  
  listItemHoverBackground: '#333333',
  listItemSelectedBackground: '#3a3a5a',
  
  badgeBackground: '#3730a3',
  badgeBorderColor: '#4f46e5',
  badgeColor: '#c7d2fe',
};
```

## Integration with Existing Design Systems

### With Ant Design
```tsx
import { theme } from 'antd';

const { token } = theme.useToken();

const antdStyleConfig: Partial<GanttStyleConfig> = {
  fontFamily: token.fontFamily,
  fontSize: `${token.fontSize}px`,
  primary: token.colorPrimary,
  linkColor: token.colorLink,
  buttonPrimaryBackground: token.colorPrimary,
  inputBorderRadius: `${token.borderRadius}px`,
};
```

### With Material-UI
```tsx
import { useTheme } from '@mui/material/styles';

const theme = useTheme();

const muiStyleConfig: Partial<GanttStyleConfig> = {
  fontFamily: theme.typography.fontFamily,
  fontSize: theme.typography.fontSize + 'px',
  primary: theme.palette.primary.main,
  linkColor: theme.palette.primary.main,
  buttonPrimaryBackground: theme.palette.primary.main,
  buttonPrimaryBorderRadius: `${theme.shape.borderRadius}px`,
};
```

### With Chakra UI
```tsx
import { useTheme } from '@chakra-ui/react';

const theme = useTheme();

const chakraStyleConfig: Partial<GanttStyleConfig> = {
  fontFamily: theme.fonts.body,
  fontSize: theme.fontSizes.md,
  primary: theme.colors.blue[500],
  linkColor: theme.colors.blue[500],
  buttonPrimaryBorderRadius: theme.radii.md,
  inputBorderRadius: theme.radii.md,
};
```

## Notes

- All style properties are optional
- Unspecified properties will use sensible defaults
- The `styleConfig` prop provides type safety and autocomplete in TypeScript
- For advanced customization, use `customCSSVariables` to inject any CSS variable
