/**
 * Adapter to convert between SVAR format and internal format
 */

import type { Task, Link, LinkType, TaskId } from '@gantt/core';
import type { SvarTask, SvarLink } from './types';

export function svarTaskToTask(svarTask: SvarTask): Task {
  return {
    id: svarTask.id,
    name: svarTask.text,
    type: svarTask.type || 'task',
    start: svarTask.start_date ? new Date(svarTask.start_date) : undefined,
    end: svarTask.end_date ? new Date(svarTask.end_date) : undefined,
    duration: svarTask.duration,
    progress: svarTask.progress,
    parent: svarTask.parent,
    expanded: svarTask.open !== false,
    readonly: svarTask.readonly,
  };
}

export function taskToSvarTask(task: Task): SvarTask {
  return {
    id: task.id,
    text: task.name,
    type: task.type || 'task',
    start_date: task.start?.toISOString().split('T')[0] || '',
    end_date: task.end?.toISOString().split('T')[0],
    duration: task.duration,
    progress: task.progress,
    parent: task.parent,
    open: task.expanded !== false,
    readonly: task.readonly,
  };
}

export function svarLinkToLink(svarLink: SvarLink): Link {
  const linkTypeMap: Record<number, LinkType> = {
    0: 'finish-to-start',
    1: 'start-to-start',
    2: 'finish-to-finish',
    3: 'start-to-finish',
  };

  return {
    id: String(svarLink.id),
    source: svarLink.source,
    target: svarLink.target,
    type: linkTypeMap[svarLink.type] || 'finish-to-start',
    lag: svarLink.lag,
  };
}

export function linkToSvarLink(link: Link): SvarLink {
  const typeMap: Record<LinkType, number> = {
    'finish-to-start': 0,
    'start-to-start': 1,
    'finish-to-finish': 2,
    'start-to-finish': 3,
  };

  return {
    id: link.id,
    source: link.source,
    target: link.target,
    type: typeMap[link.type] || 0,
    lag: link.lag,
  };
}
