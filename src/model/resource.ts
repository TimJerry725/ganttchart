/**
 * Resource model
 */

import type { Resource } from '../types';

export class ResourceModel {
  private resources: Map<string, Resource> = new Map();

  constructor(resources: Resource[] = []) {
    this.loadResources(resources);
  }

  loadResources(resources: Resource[]): void {
    this.resources.clear();
    for (const resource of resources) {
      this.resources.set(resource.id, { ...resource });
    }
  }

  getResource(id: string): Resource | undefined {
    return this.resources.get(id);
  }

  getAllResources(): Resource[] {
    return Array.from(this.resources.values());
  }

  addResource(resource: Resource): void {
    this.resources.set(resource.id, { ...resource });
  }

  updateResource(id: string, updates: Partial<Resource>): void {
    const resource = this.resources.get(id);
    if (resource) {
      this.resources.set(id, { ...resource, ...updates });
    }
  }

  removeResource(id: string): void {
    this.resources.delete(id);
  }
}
