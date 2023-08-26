// import { getCurrentScope } from 'vue';
import {
  events,
  type EventBusIdentifier,
  type EventBusListener,
  type UseEventBusReturn,
} from './constants';

export function useEventBus<T = unknown>(key: EventBusIdentifier): UseEventBusReturn<T> {
  // const scope = getCurrentScope();

  const on = (listener: EventBusListener<T>) => {
    const listeners = events.get(key) || [];
    listeners.push(listener);
    events.set(key, listeners);

    const _off = () => off(listener);

    // auto unsubscribe when scope get disposed
    // scope?.cleanups.push(_off)
    return _off;
  };

  const once = (listener: EventBusListener<T>) => {
    const _listener = (...args: any[]) => {
      off(_listener);
      // @ts-expect-error cast
      listener(...args);
    };
    return on(_listener);
  };

  const off = (listener: EventBusListener<T>) => {
    const listeners = events.get(key);
    if (!listeners) return;

    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
    if (!listeners.length) {
      events.delete(key);
    }
  };

  const reset = () => {
    events.delete(key);
  };

  const emit = (event?: T) => {
    events.get(key)?.forEach(v => v(event));
  };

  return {
    on,
    once,
    off,
    emit,
    reset,
  };
}
