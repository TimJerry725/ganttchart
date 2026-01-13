/**
 * Plugin system for extending Gantt functionality
 */

import type { GanttModel } from './model';
import type { EventBus } from './event-bus';
import type { CommandManager } from './command';

export interface PluginContext {
  model: GanttModel;
  eventBus: EventBus;
  commandManager: CommandManager;
}

export interface Plugin {
  name: string;
  version: string;
  initialize(context: PluginContext): void;
  destroy?(): void;
}

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private context?: PluginContext;

  register(plugin: Plugin, context: PluginContext): void {
    if (this.plugins.has(plugin.name)) {
      console.warn(`Plugin ${plugin.name} is already registered`);
      return;
    }

    this.context = context;
    this.plugins.set(plugin.name, plugin);
    plugin.initialize(context);
  }

  unregister(pluginName: string): void {
    const plugin = this.plugins.get(pluginName);
    if (plugin) {
      if (plugin.destroy) {
        plugin.destroy();
      }
      this.plugins.delete(pluginName);
    }
  }

  getPlugin(pluginName: string): Plugin | undefined {
    return this.plugins.get(pluginName);
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  clear(): void {
    this.plugins.forEach((plugin) => {
      if (plugin.destroy) {
        plugin.destroy();
      }
    });
    this.plugins.clear();
  }
}
