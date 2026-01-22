# Column Visibility and Subtask Button Fix

## Issues Fixed

### 1. ✅ Duration and Start Columns Visibility
**Problem:** Duration and Start columns were not visible in the grid.

**Solution:**
- Increased column widths: Duration (110px), Start (130px)
- Increased grid minimum width to 650px to accommodate all columns
- Changed cell overflow from `hidden` to `visible`
- Added `min-width: fit-content` to header cells
- Added `minWidth` to each column cell to maintain width
- Changed grid body overflow-x to `auto` to allow horizontal scroll if needed

### 2. ✅ Add Subtask Button
**Problem:** Add subtask button was not visible or not working properly.

**Solution:**
- Enhanced button styling with primary type and better visibility
- Set explicit width (28px) and height (28px) for the button
- Added `display: flex`, `alignItems: center`, `justifyContent: center` to ensure visibility
- Added `visibility: visible` and `opacity: 1` to the add column cell
- Updated header to show "Add" text label
- Button now properly calls `onAddTask(task.id)` to create subtasks

### 3. ✅ Baseline Bar Visibility
**Problem:** Baseline bar was only half visible due to row height constraints.

**Solution:**
- Increased minimum row height from `clamp(36px, 5vh, 44px)` to `clamp(44px, 5vh, 48px)`
- Fixed baseline bar positioning:
  - Task bar: 28px high, centered at 50%
  - Task bar bottom: 50% + 14px
  - Baseline position: 50% + 14px + 2px gap + 3px (half of 6px) = 50% + 19px
  - Then `translateY(-50%)` centers the 6px baseline bar
- Set timeline row `min-height: 44px` to ensure baseline fits
- Changed row overflow to `visible` to prevent clipping

## Files Modified

1. **src/components/Gantt/Gantt.tsx**
   - Updated `getDefaultColumns` with better column widths
   - Added state for tracking parent task in TaskCreator
   - Updated `handleCreateTask` to accept parentId for subtasks

2. **src/components/Gantt/Grid.tsx**
   - Enhanced add button with primary styling and explicit sizing
   - Added visibility and opacity styles to ensure add column is visible
   - Updated header to show "Add" text
   - Added `minWidth` to column cells

3. **src/components/Gantt/TaskCreator.tsx**
   - Added `parentId` and `parentTaskName` props
   - Updated modal title to show "Create Subtask for [Parent]" when adding subtasks
   - Task creation now sets parent relationship

4. **src/components/Gantt/gantt.css**
   - Increased grid min-width to 650px
   - Changed cell overflow to `visible`
   - Updated row height minimum to 44px
   - Fixed baseline bar positioning calculation
   - Added overflow-x: auto to grid body

## Column Configuration

Default columns with widths:
- Index: 40px
- Name: 250px
- Depends on: 120px
- Duration: 110px (now visible)
- Start: 130px (now visible)
- Add: 50px (subtask button)

Total minimum width: ~700px

## Baseline Bar Positioning

For a 44px row:
- Center: 22px
- Task bar: 28px high, centered, spans 8px to 36px
- Baseline: 6px high, positioned at 38px to 44px (fully visible)
- Calculation: `top: calc(50% + 19px)`, then `translateY(-50%)`

## Subtask Functionality

- Click the blue "+" button in the "Add" column for any task
- Modal opens with title "Create Subtask for [Parent Task Name]"
- New task is automatically assigned as a child of the parent task
- Subtasks appear indented in the task list based on depth

## Testing

After these fixes:
1. ✅ Duration column shows task durations
2. ✅ Start column shows task start dates
3. ✅ Add subtask button is visible and clickable
4. ✅ Baseline bars are fully visible below task bars
5. ✅ All columns fit within the grid with proper scrolling
