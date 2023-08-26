import type { WindowEventName, SettimeoutType } from '../../../types';
import type { Ref } from 'vue';
import { readonly, ref } from 'vue';
import { useEventListener } from '../../browser/useEventListener';
import { defaultDocument, timestamp } from '../../../utils';
import { useDebounceFn } from '../../utilities'

const defaultEvents: WindowEventName[] = [
  'mousemove',
  'mousedown',
  'resize',
  'keydown',
  'touchstart',
  'wheel',
];
const oneMinute = 60_000;

export interface UseIdleOptions {
  /**
   * Event names that listen to for detected user activity
   *
   * @default ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel']
   */
  events?: WindowEventName[];
  /**
   * Listen for document visibility change
   *
   * @default true
   */
  listenForVisibilityChange?: boolean;
  /**
   * Initial state of the ref idle
   *
   * @default false
   */
  initialState?: boolean;
}

export interface UseIdleReturn {
  idle: Ref<boolean>;
  lastActive: Ref<number>;
  reset: () => void;
}

/**
 * Tracks whether the user is being inactive.
 * @param timeout default to 1 minute
 * @param options IdleOptions
 */

export function useIdle(timeout: number = oneMinute, options: UseIdleOptions = {}): UseIdleReturn {
  const {
    initialState = false,
    listenForVisibilityChange = true,
    events = defaultEvents,
  } = options;
  const document = defaultDocument;

  const idle = ref(initialState);
  const lastActive = ref(timestamp());

  let timer: SettimeoutType;

  const reset = () => {
    idle.value = false;
    clearTimeout(timer);
    timer = setTimeout(() => (idle.value = true), timeout);
  };

  const onEvent = useDebounceFn(() => {
    lastActive.value = timestamp();
    reset();
  }, 50);

  if (document) {
    for (const event of events) {
      useEventListener(window, event, onEvent, { passive: true });
    }
    if (listenForVisibilityChange) {
      useEventListener(document, 'visibilitychange', () => {
        if (!document.hidden) {
          onEvent();
        }
      });
    }
  }

  return {
    idle: readonly(idle),
    reset,
    lastActive: readonly(lastActive),
  };
}
