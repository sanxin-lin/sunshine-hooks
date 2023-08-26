import type { Fn } from '../../../types'

export type EventBusListener<T = unknown> = (event: T) => void;
export type EventBusEvents<T> = EventBusListener<T>[];
export interface EventBusKey extends Symbol {}
export type EventBusIdentifier = EventBusKey | string | number;

/* #__PURE__ */
export const events = new Map<EventBusIdentifier, EventBusEvents<any>>();

export interface UseEventBusReturn<T> {
  /**
   * Subscribe to an event. When calling emit, the listeners will execute.
   * @param listener watch listener.
   * @returns a stop function to remove the current callback.
   */
  on: (listener: EventBusListener<T>) => Fn;
  /**
   * Similar to `on`, but only fires once
   * @param listener watch listener.
   * @returns a stop function to remove the current callback.
   */
  once: (listener: EventBusListener<T>) => Fn;
  /**
   * Emit an event, the corresponding event listeners will execute.
   * @param event data sent.
   */
  emit: (event?: T) => void;
  /**
   * Remove the corresponding listener.
   * @param listener watch listener.
   */
  off: (listener: EventBusListener<T>) => void;
  /**
   * Clear all events
   */
  reset: () => void;
}
