export interface Task {
  id: string;
  text: string;
  start: Date;
  end: Date;
  duration: number;
  progress: number;
  type?: 'task' | 'milestone' | 'project';
  parent?: string;
  open?: boolean;
  color?: string;
  details?: string;
  owner?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'completed' | 'in-progress' | 'delayed' | 'not-started';
  onHoldPeriods?: { start: Date; end: Date }[];
  dependencies?: string[]; // Array of task IDs this task depends on
  segments?: TaskSegment[]; // For split tasks
  sequence_id?: number;
  stage_id?: string | null;
}

export interface TaskSegment {
  start: Date;
  end: Date;
  duration: number;
}

export interface Link {
  id: string;
  source: string;
  target: string;
  type: 'e2s' | 's2s' | 'e2e' | 's2e'; // end-to-start, start-to-start, end-to-end, start-to-end
  lag?: number; // lag time in days (positive = delay, negative = lead time)
  lagUnit?: 'day' | 'hour' | 'week' | 'month'; // unit for lag time (default: 'day')
}

export interface Scale {
  unit: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
  step: number;
  format?: string;
}

export interface Column {
  name: string;
  label: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  resize?: boolean;
  sort?: boolean;
  template?: (task: Task) => React.ReactNode;
}

export interface GanttConfig {
  columns?: Column[];
  scales?: Scale[];
  readonly?: boolean;
  editable?: boolean;
  taskHeight?: number;
  rowHeight?: number;
  scaleHeight?: number;
  columnWidth?: number;
  minColumnWidth?: number;
  autoSchedule?: boolean; // PRO
  criticalPath?: boolean; // PRO
  baselines?: boolean; // PRO
  markers?: Marker[]; // PRO
  weekends?: boolean;
  holidays?: Date[];
  theme?: 'light' | 'dark';
  locale?: string;
  containerHeight?: string; // Responsive: e.g., '100%', '600px', '100vh'
  containerMinHeight?: string; // Responsive: e.g., '400px', '50vh'
  gridWidth?: string; // Responsive: e.g., '720px', '30vw', 'clamp(280px, 30vw, 720px)'
  // Today and Project Start lines
  showTodayLine?: boolean; // Show vertical line for today's date
  todayLineColor?: string; // Color for today line (default: red)
  todayLineLabel?: string; // Label for today line (default: 'Today')
  todayLineWidth?: number; // Width of today line in pixels (default: 2)
  todayLineStyle?: 'solid' | 'dashed' | 'dotted'; // Line style (default: 'solid')
  todayLineOpacity?: number; // Line opacity 0-1 (default: 1)
  showProjectStartLine?: boolean; // Show vertical line for project start date
  projectStartDate?: Date; // Project start date (default: earliest task start)
  projectStartLineColor?: string; // Color for project start line (default: light blue)
  projectStartLineLabel?: string; // Label for project start line (default: 'Start Project')
  projectStartLineWidth?: number; // Width of project start line in pixels (default: 2)
  projectStartLineStyle?: 'solid' | 'dashed' | 'dotted'; // Line style (default: 'solid')
  projectStartLineOpacity?: number; // Line opacity 0-1 (default: 1)
  // Label styling
  todayLineLabelStyle?: React.CSSProperties; // Custom styles for today label
  projectStartLineLabelStyle?: React.CSSProperties; // Custom styles for project start label
  // Marker styling
  showTodayLineMarker?: boolean; // Show marker at top of today line (default: true)
  todayLineMarkerSize?: number; // Size of marker in pixels (default: 8)
  todayLineMarkerStyle?: 'triangle' | 'arrow' | 'dot'; // Marker style (default: 'triangle')
  showProjectStartLineMarker?: boolean; // Show marker at top of project start line (default: true)
  projectStartLineMarkerSize?: number; // Size of marker in pixels (default: 8)
  projectStartLineMarkerStyle?: 'triangle' | 'arrow' | 'dot'; // Marker style (default: 'triangle')
}

// Icon configuration - allows custom icon components or FontAwesome icon names
export interface GanttIconConfig {
  // Toolbar icons
  addTask?: React.ReactNode | string; // React component or FontAwesome icon name
  zoomIn?: React.ReactNode | string;
  zoomOut?: React.ReactNode | string;
  resetZoom?: React.ReactNode | string;
  exportCSV?: React.ReactNode | string;
  exportExcel?: React.ReactNode | string;
  exportJSON?: React.ReactNode | string;
  exportPDF?: React.ReactNode | string;

  // Grid icons
  gripVertical?: React.ReactNode | string;
  chevronRight?: React.ReactNode | string;
  chevronDown?: React.ReactNode | string;
  plus?: React.ReactNode | string;

  // Context menu icons
  edit?: React.ReactNode | string;
  delete?: React.ReactNode | string;
  copy?: React.ReactNode | string;
  link?: React.ReactNode | string;
  flag?: React.ReactNode | string;
  folder?: React.ReactNode | string;
  tasks?: React.ReactNode | string;
  rotateLeft?: React.ReactNode | string;
}

// Style configuration for colors, fonts, and theme
export interface GanttStyleConfig {
  // Colors
  primary?: string;
  primarySelected?: string;
  success?: string;
  warning?: string;
  danger?: string;
  background?: string;
  backgroundAlt?: string;
  backgroundHover?: string;
  selectColor?: string;
  taskColor?: string;
  taskFillColor?: string;
  projectColor?: string;
  milestoneColor?: string;
  fontColor?: string;
  fontColorAlt?: string;
  iconColor?: string;
  borderColor?: string;

  // Fonts
  fontFamily?: string;
  fontMono?: string;
  fontSize?: string;
  fontWeight?: string | number;
  lineHeight?: string | number;

  // Layout spacing
  spacingXS?: string;
  spacingSM?: string;
  spacingMD?: string;
  spacingLG?: string;

  // Popover & Modal Styling
  popoverBackground?: string;
  popoverBorderColor?: string;
  popoverBorderRadius?: string;
  popoverShadow?: string;
  popoverPadding?: string;
  popoverMaxWidth?: string;
  popoverFontFamily?: string;
  popoverFontSize?: string;

  modalBackground?: string;
  modalBorderColor?: string;
  modalBorderRadius?: string;
  modalShadow?: string;
  modalOverlayBackground?: string;

  // Button Styling
  buttonPrimaryBackground?: string;
  buttonPrimaryColor?: string;
  buttonPrimaryHoverBackground?: string;
  buttonPrimaryBorderRadius?: string;
  buttonPrimaryFontWeight?: string | number;
  buttonPrimaryFontFamily?: string;

  buttonDangerBackground?: string;
  buttonDangerColor?: string;
  buttonDangerHoverBackground?: string;

  buttonSecondaryBackground?: string;
  buttonSecondaryColor?: string;
  buttonSecondaryBorderColor?: string;

  // Input Styling
  inputBackground?: string;
  inputBorderColor?: string;
  inputBorderRadius?: string;
  inputFocusBorderColor?: string;
  inputFontFamily?: string;
  inputFontSize?: string;
  inputPadding?: string;

  // List & Menu Styling
  listItemHoverBackground?: string;
  listItemSelectedBackground?: string;
  listItemBorderColor?: string;

  menuBackground?: string;
  menuBorderColor?: string;
  menuItemHoverBackground?: string;

  // Badge & Tag Styling
  badgeBackground?: string;
  badgeBorderColor?: string;
  badgeColor?: string;
  badgeFontSize?: string;
  badgePadding?: string;
  badgeBorderRadius?: string;

  // Link Styling
  linkColor?: string;
  linkHoverColor?: string;
  linkFontWeight?: string | number;

  // Custom CSS variables (for advanced customization)
  customCSSVariables?: Record<string, string>;
}

export interface Marker {
  id: string;
  date: Date;
  text: string;
  css?: string;
}

export interface Baseline {
  taskId: string;
  start: Date;
  end: Date;
}

export interface TaskReorderMeta {
  currentSequenceId: number;
  targetSequenceId: number;
  targetStageId: string | null;
}

export type ZoomLevel = number;

export interface DropIndicator {
  taskId: string;
  position: 'above' | 'below' | 'inside';
}

export interface GanttUIConfig {
  // Header
  headerTitle?: string;
  showHeader?: boolean;

  // Toolbar Buttons Visibility
  showAddTaskButton?: boolean;
  showBaselineButton?: boolean;
  showZoomButtons?: boolean;
  showExportButtons?: boolean;
  showFilterSearch?: boolean;

  // Toolbar Button Labels
  addTaskButtonText?: string;
  baselineButtonText?: string;
  baselineButtonTextActive?: string;
  zoomOutTooltip?: string;
  zoomInTooltip?: string;
  resetZoomTooltip?: string;
  exportCSVTooltip?: string;
  exportExcelTooltip?: string;
  exportJSONTooltip?: string;
  exportPDFTooltip?: string;
  hideBaselinesTooltip?: string;
  showBaselinesTooltip?: string;

  // Task Creator Modal
  taskCreatorTitle?: string;
  taskCreatorOkText?: string;
  taskCreatorCancelText?: string;
  taskNameLabel?: string;
  taskNamePlaceholder?: string;
  typeLabel?: string;
  priorityLabel?: string;
  startDateLabel?: string;
  durationLabel?: string;
  colorLabel?: string;
  progressLabel?: string;
  ownerLabel?: string;
  ownerPlaceholder?: string;
  detailsLabel?: string;
  detailsPlaceholder?: string;
  taskTypeOptions?: {
    task?: string;
    milestone?: string;
    project?: string;
  };
  priorityOptions?: {
    low?: string;
    medium?: string;
    high?: string;
  };

  // Task Editor Modal
  taskEditorTitle?: string;
  taskEditorSaveText?: string;
  taskEditorCancelText?: string;
  taskEditorDeleteText?: string;
  deleteConfirmTitle?: string;
  deleteConfirmContent?: string;
  deleteConfirmOkText?: string;
  deleteConfirmCancelText?: string;

  // Filter Search
  searchPlaceholder?: string;
  allOwnersText?: string;
  allStatusText?: string;
  allPriorityText?: string;
  clearFiltersText?: string;
  statusOptions?: {
    all?: string;
    notStarted?: string;
    inProgress?: string;
    completed?: string;
  };
  priorityFilterOptions?: {
    all?: string;
    low?: string;
    medium?: string;
    high?: string;
  };

  // Column Labels (if not using custom columns)
  columnLabels?: {
    name?: string;
    dependsOn?: string;
    duration?: string;
    start?: string;
  };

  // Validation Messages
  taskNameRequired?: string;
}
