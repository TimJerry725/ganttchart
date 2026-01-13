# SVAR Gantt Feature Parity Matrix

This document tracks feature parity between this library and SVAR Gantt.

## Core Features

| Feature | SVAR Free | SVAR Pro | This Library | Status |
|---------|-----------|----------|--------------|--------|
| Task Management | ✅ | ✅ | ✅ | ✅ Complete |
| Dependencies | ✅ | ✅ | ✅ | ✅ Complete |
| Drag & Drop | ✅ | ✅ | ✅ | ✅ Complete |
| Inline Editing | ✅ | ✅ | ✅ | ✅ Complete |
| Zoom Levels | ✅ | ✅ | ✅ | ✅ Complete |
| Today Marker | ✅ | ✅ | ✅ | ✅ Complete |
| Grid Columns | ✅ | ✅ | ✅ | ✅ Complete |
| Task Types | ✅ | ✅ | ✅ | ✅ Complete |
| Milestones | ✅ | ✅ | ✅ | ✅ Complete |
| Progress Tracking | ✅ | ✅ | ✅ | ✅ Complete |

## Pro Features

| Feature | SVAR Pro | This Library | Status |
|---------|----------|--------------|--------|
| Auto-scheduling | ✅ | ✅ | ✅ Complete |
| Baselines | ✅ | ✅ | ✅ Complete |
| Critical Path | ✅ | ✅ | ✅ Complete |
| Resource Management | ✅ | ✅ | ✅ Complete |
| Resource Histogram | ✅ | ✅ | ✅ Complete |
| Undo/Redo | ✅ | ✅ | ✅ Complete |
| Export (CSV/Excel/PDF/PNG) | ✅ | ✅ | ✅ Complete |
| Constraints | ✅ | ✅ | ✅ Complete |
| Calendars | ✅ | ✅ | ✅ Complete |
| Markers | ✅ | ✅ | ✅ Complete |
| Collaboration Hooks | ✅ | ✅ | ✅ Complete |
| Keyboard Navigation | ✅ | ✅ | ✅ Complete |
| Accessibility (ARIA) | ✅ | ✅ | ✅ Complete |
| i18n Support | ✅ | ✅ | ✅ Complete |
| RTL Support | ✅ | ✅ | ✅ Complete |

## API Compatibility

| SVAR API Method | This Library | Notes |
|----------------|--------------|-------|
| `parse()` | ✅ | Via `@gantt/compat-svar` |
| `addTask()` | ✅ | Via `@gantt/compat-svar` |
| `updateTask()` | ✅ | Via `@gantt/compat-svar` |
| `removeTask()` | ✅ | Via `@gantt/compat-svar` |
| `addLink()` | ✅ | Via `@gantt/compat-svar` |
| `updateLink()` | ✅ | Via `@gantt/compat-svar` |
| `removeLink()` | ✅ | Via `@gantt/compat-svar` |
| `selectTask()` | ✅ | Via `@gantt/compat-svar` |
| `scrollTo()` | ✅ | Via `@gantt/compat-svar` |
| `zoomIn()` / `zoomOut()` | ✅ | Via `@gantt/compat-svar` |

## Events

| SVAR Event | This Library | Notes |
|------------|--------------|-------|
| `onTaskClick` | ✅ | Via `@gantt/compat-svar` |
| `onTaskDblClick` | ✅ | Via `@gantt/compat-svar` |
| `onTaskSelected` | ✅ | Via `@gantt/compat-svar` |
| `onAfterTaskAdd` | ✅ | Via `@gantt/compat-svar` |
| `onAfterTaskUpdate` | ✅ | Via `@gantt/compat-svar` |
| `onAfterTaskDelete` | ✅ | Via `@gantt/compat-svar` |
| `onAfterLinkAdd` | ✅ | Via `@gantt/compat-svar` |
| `onAfterLinkUpdate` | ✅ | Via `@gantt/compat-svar` |
| `onAfterLinkDelete` | ✅ | Via `@gantt/compat-svar` |

## Migration Guide

See [MIGRATION.md](../MIGRATION.md) for detailed migration instructions.
