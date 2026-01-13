/**
 * Link validation (cycle detection, etc.)
 */

import type { TaskId, Link } from '../types';

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

export class LinkValidator {
  validateLink(
    sourceId: TaskId,
    targetId: TaskId,
    existingLinks: Link[]
  ): ValidationResult {
    // Self-reference check
    if (sourceId === targetId) {
      return { valid: false, reason: 'Task cannot depend on itself' };
    }

    // Cycle detection
    if (this.wouldCreateCycle(sourceId, targetId, existingLinks)) {
      return { valid: false, reason: 'This link would create a circular dependency' };
    }

    return { valid: true };
  }

  private wouldCreateCycle(
    sourceId: TaskId,
    targetId: TaskId,
    existingLinks: Link[]
  ): boolean {
    // Check if target has a path back to source
    const visited = new Set<TaskId>();
    const checkPath = (currentId: TaskId): boolean => {
      if (currentId === sourceId) return true;
      if (visited.has(currentId)) return false;
      visited.add(currentId);

      const outgoingLinks = existingLinks.filter((link) => link.source === currentId);
      for (const link of outgoingLinks) {
        if (checkPath(link.target)) return true;
      }
      return false;
    };

    return checkPath(targetId);
  }

  validateAllLinks(links: Link[]): ValidationResult {
    for (const link of links) {
      const result = this.validateLink(link.source, link.target, links.filter((l) => l.id !== link.id));
      if (!result.valid) {
        return result;
      }
    }
    return { valid: true };
  }
}
