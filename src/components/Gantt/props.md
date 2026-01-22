## `TaskEditor` props

`TaskEditor` is a controlled modal form for editing a single Gantt task.

```ts
interface TaskEditorProps {
  task: Task
  onUpdate: (task: Task) => void
  onDelete: (taskId: string) => void
  onClose: () => void
}
```

- **`task`**  
  - **Type**: `Task`  
  - **Required**: Yes  
  - **Description**: The task being edited. Its fields are used to pre-populate the form and are merged with the submitted values on save.

- **`onUpdate`**  
  - **Type**: `(task: Task) => void`  
  - **Required**: Yes  
  - **Description**: Called after the user clicks **Save Changes** and the form validates. Receives a full `Task` object with updated values, including:
    - `text`, `start`, `end`, `duration`, `progress`
    - `type` (`'task' | 'milestone' | 'project'`)
    - `color` (hex string, defaults to `'#4A90E2'` if not provided)
    - `owner`, `priority` (`'low' | 'medium' | 'high'`), `details`

- **`onDelete`**  
  - **Type**: `(taskId: string) => void`  
  - **Required**: Yes  
  - **Description**: Called when the user confirms deletion in the confirmation dialog. Receives the `id` of the task to delete.

- **`onClose`**  
  - **Type**: `() => void`  
  - **Required**: Yes  
  - **Description**: Called when the modal should be closed (Cancel, Save, or after successful delete). Parent components should use this to hide/unmount `TaskEditor`.

### `Task` shape

Imported from `./types`:

```ts
interface Task {
  id: string
  text: string
  start: Date
  end: Date
  duration: number
  progress: number
  type?: 'task' | 'milestone' | 'project'
  parent?: string
  open?: boolean
  color?: string
  details?: string
  owner?: string
  priority?: 'low' | 'medium' | 'high'
  dependencies?: string[]
  segments?: TaskSegment[]
}
```

When reusing `TaskEditor`, ensure:

- You pass a fully-formed `task` object (in particular, `id`, `text`, `start`, and `duration` must be valid).
- `start` is a `Date` instance (not a string), because it is converted with `dayjs(task.start)` and the AntD `DatePicker` produces a Dayjs object that is converted back via `.toDate()`.
- Your `onUpdate` and `onDelete` handlers update your local task collection and trigger any necessary re-renders.

