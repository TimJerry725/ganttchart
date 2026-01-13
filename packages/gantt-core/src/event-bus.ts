/**
 * Event bus for Gantt chart events
 */

export type EventType =
  | 'task:add'
  | 'task:update'
  | 'task:remove'
  | 'task:click'
  | 'task:select'
  | 'task:dblclick'
  | 'link:add'
  | 'link:update'
  | 'link:remove'
  | 'link:click'
  | 'schedule:change'
  | 'view:change'
  | 'zoom:change';

export interface GanttEvent {
  type: EventType;
  payload?: unknown;
  timestamp: number;
}

export type EventHandler = (event: GanttEvent) => void;

export class EventBus {
  private handlers: Map<EventType, Set<EventHandler>> = new Map();

  on(type: EventType, handler: EventHandler): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.handlers.get(type);
      if (handlers) {
        handlers.delete(handler);
      }
    };
  }

  off(type: EventType, handler: EventHandler): void {
    const handlers = this.handlers.get(type);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  emit(type: EventType, payload?: unknown): void {
    const handlers = this.handlers.get(type);
    if (handlers) {
      const event: GanttEvent = {
        type,
        payload,
        timestamp: Date.now(),
      };
      handlers.forEach((handler) => {
        try {
          handler(event);
        } catch (error) {
          console.error(`Error in event handler for ${type}:`, error);
        }
      });
    }
  }

  once(type: EventType, handler: EventHandler): () => void {
    const wrappedHandler: EventHandler = (event) => {
      handler(event);
      this.off(type, wrappedHandler);
    };
    return this.on(type, wrappedHandler);
  }

  clear(): void {
    this.handlers.clear();
  }
}
