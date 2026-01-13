/**
 * Link model and operations
 */

import type { Link } from '../types';

export class LinkModel {
  private links: Map<string, Link> = new Map();

  constructor(links: Link[] = []) {
    this.loadLinks(links);
  }

  loadLinks(links: Link[]): void {
    this.links.clear();
    for (const link of links) {
      this.links.set(link.id, { ...link });
    }
  }

  getLink(id: string): Link | undefined {
    return this.links.get(id);
  }

  getAllLinks(): Link[] {
    return Array.from(this.links.values());
  }

  getLinksForTask(taskId: string | number): Link[] {
    return this.getAllLinks().filter(
      (link) => link.source === taskId || link.target === taskId
    );
  }

  addLink(link: Link): void {
    this.links.set(link.id, { ...link });
  }

  updateLink(id: string, updates: Partial<Link>): void {
    const link = this.links.get(id);
    if (link) {
      this.links.set(id, { ...link, ...updates });
    }
  }

  removeLink(id: string): void {
    this.links.delete(id);
  }

  validateCycle(sourceId: string | number, targetId: string | number): boolean {
    // Simple cycle detection - check if target has path back to source
    const visited = new Set<string | number>();
    const checkPath = (currentId: string | number): boolean => {
      if (currentId === sourceId) return true;
      if (visited.has(currentId)) return false;
      visited.add(currentId);

      const outgoingLinks = this.getAllLinks().filter((link) => link.source === currentId);
      for (const link of outgoingLinks) {
        if (checkPath(link.target)) return true;
      }
      return false;
    };

    return checkPath(targetId);
  }
}
