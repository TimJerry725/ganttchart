/**
 * SVAR Gantt API facade
 */

import React from 'react';
import { Gantt } from '@gantt/react';
import type { GanttProps } from '@gantt/react';
import { GanttModel } from '@gantt/core';
import { EventBus } from '@gantt/core';
import type { SvarConfig, SvarEvents, SvarTask, SvarLink } from './types';
import { svarTaskToTask, svarLinkToLink, taskToSvarTask, linkToSvarLink } from './adapter';
import type { Task, Link, TaskId } from '@gantt/core';
import type { GridColumn, TimeScale } from '@gantt/renderer';

export interface SvarGanttInstance {
  getGantt: () => GanttModel;
  parse: (data: { data: SvarTask[]; links?: SvarLink[] }) => void;
  addTask: (task: SvarTask, parentId?: TaskId) => TaskId;
  updateTask: (id: TaskId, task: Partial<SvarTask>) => void;
  removeTask: (id: TaskId) => void;
  getTask: (id: TaskId) => SvarTask | null;
  addLink: (link: SvarLink) => string;
  updateLink: (id: string, link: Partial<SvarLink>) => void;
  removeLink: (id: string) => void;
  getLink: (id: string) => SvarLink | null;
  selectTask: (id: TaskId) => void;
  unselectTask: () => void;
  scrollTo: (date: Date) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setScale: (scale: string) => void;
  refresh: () => void;
  destroy: () => void;
}

export function createSvarGantt(
  container: string | HTMLElement,
  config?: SvarConfig,
  events?: SvarEvents
): SvarGanttInstance {
  const model = new GanttModel();
  const eventBus = new EventBus();

  // Convert SVAR config to internal format
  const tasks: Task[] = (config?.tasks || []).map(svarTaskToTask);
  const links: Link[] = (config?.links || []).map(svarLinkToLink);

  model.loadProject({ tasks, links });

  // Convert columns
  const columns: GridColumn[] =
    config?.columns?.map((col) => ({
      id: col.name,
      label: col.label,
      width: col.width || 150,
      field: col.name,
    })) || [];

  // Convert time scale
  const timeScale: Partial<TimeScale> = {
    unit: config?.scales?.[0]?.unit || 'day',
    pixelsPerUnit: 20,
  };

  // Wire up events
  if (events) {
    eventBus.on('task:click', (e) => {
      if (e.payload && typeof e.payload === 'object' && 'taskId' in e.payload) {
        events.onTaskClick?.(e.payload.taskId as TaskId, new MouseEvent('click'));
      }
    });

    eventBus.on('task:select', (e) => {
      if (e.payload && typeof e.payload === 'object' && 'taskId' in e.payload) {
        events.onTaskSelected?.(e.payload.taskId as TaskId);
      }
    });

    // Add more event mappings as needed
  }

  const instance: SvarGanttInstance = {
    getGantt: () => model,
    parse: (data) => {
      const tasks = data.data.map(svarTaskToTask);
      const links = (data.links || []).map(svarLinkToLink);
      model.loadProject({ tasks, links });
    },
    addTask: (task, parentId) => {
      const internalTask = svarTaskToTask(task);
      if (parentId) {
        internalTask.parent = parentId;
      }
      model.addTask(internalTask);
      events?.onAfterTaskAdd?.(internalTask.id, task);
      return internalTask.id;
    },
    updateTask: (id, updates) => {
      const task = model.getTask(id);
      if (task) {
        const svarTask = taskToSvarTask({ ...task, ...updates });
        model.updateTask(id, svarTaskToTask(svarTask));
        events?.onAfterTaskUpdate?.(id, svarTask);
      }
    },
    removeTask: (id) => {
      model.removeTask(id);
      events?.onAfterTaskDelete?.(id);
    },
    getTask: (id) => {
      const task = model.getTask(id);
      return task ? taskToSvarTask(task) : null;
    },
    addLink: (link) => {
      const internalLink = svarLinkToLink(link);
      model.addLink(internalLink);
      events?.onAfterLinkAdd?.(internalLink.id, link);
      return internalLink.id;
    },
    updateLink: (id, updates) => {
      const link = model.getLink(id);
      if (link) {
        const svarLink = linkToSvarLink({ ...link, ...updates });
        model.updateLink(id, svarLinkToLink(svarLink));
        events?.onAfterLinkUpdate?.(id, svarLink);
      }
    },
    removeLink: (id) => {
      model.removeLink(id);
      events?.onAfterLinkDelete?.(id);
    },
    getLink: (id) => {
      const link = model.getLink(id);
      return link ? linkToSvarLink(link) : null;
    },
    selectTask: (id) => {
      eventBus.emit('task:select', { taskId: id });
      events?.onTaskSelected?.(id);
    },
    unselectTask: () => {
      events?.onTaskUnselected?.('');
    },
    scrollTo: (date) => {
      // Implementation would scroll to date
    },
    zoomIn: () => {
      // Implementation would zoom in
    },
    zoomOut: () => {
      // Implementation would zoom out
    },
    setScale: (scale) => {
      events?.onScaleChange?.(scale);
    },
    refresh: () => {
      // Trigger re-render
    },
    destroy: () => {
      eventBus.clear();
    },
  };

  return instance;
}

/**
 * React component wrapper for SVAR API
 */
export interface SvarGanttProps extends SvarConfig, SvarEvents {
  container?: string | HTMLElement;
}

export const SvarGantt: React.FC<SvarGanttProps> = (props) => {
  const { tasks = [], links = [], columns, ...rest } = props;

  const internalTasks = tasks.map(svarTaskToTask);
  const internalLinks = links.map(svarLinkToLink);
  const internalColumns = columns?.map((col) => ({
    id: col.name,
    label: col.label,
    width: col.width || 150,
    field: col.name,
  }));

  const ganttProps: GanttProps = {
    tasks: internalTasks,
    links: internalLinks,
    columns: internalColumns,
    rowHeight: props.row_height,
    barHeight: props.bar_height,
    onTaskClick: props.onTaskClick ? (id) => props.onTaskClick?.(id, new MouseEvent('click')) : undefined,
    onTaskDoubleClick: props.onTaskDblClick ? (id) => props.onTaskDblClick?.(id, new MouseEvent('dblclick')) : undefined,
  };

  return React.createElement(Gantt, ganttProps);
};
