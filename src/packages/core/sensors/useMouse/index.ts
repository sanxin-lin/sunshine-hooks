import { ref } from 'vue';
import type { MaybeRefOrGetter, Position } from '../../../types';
import { useEventListener } from '../../browser';
import { defaultWindow } from '../../../utils';
import isFunction from 'lodash/isFunction';
import { tryOnMounted } from '../../components';

export type UseMouseCoordType = 'page' | 'client' | 'screen' | 'movement';
export type UseMouseSourceType = 'mouse' | 'touch' | null;
export type UseMouseEventExtractor = (
  event: MouseEvent | Touch,
) => [x: number, y: number] | null | undefined;

export interface UseMouseOptions {
  /**
   * Mouse position based by page, client, screen, or relative to previous position
   *
   * @default 'page'
   */
  type?: UseMouseCoordType | UseMouseEventExtractor;

  /**
   * Listen events on `target` element
   *
   * @default 'Window'
   */
  target?: MaybeRefOrGetter<Window | EventTarget | null | undefined>;

  /**
   * Listen to `touchmove` events
   *
   * @default true
   */
  touch?: boolean;

  /**
   * Reset to initial value when `touchend` event fired
   *
   * @default false
   */
  resetOnTouchEnds?: boolean;

  /**
   * Initial values
   */
  initialValue?: Position;
}

const BuiltinExtractors: Record<UseMouseCoordType, UseMouseEventExtractor> = {
  page: (event) => [event.pageX, event.pageY],
  client: (event) => [event.clientX, event.clientY],
  screen: (event) => [event.screenX, event.screenY],
  movement: (event) => (event instanceof Touch ? null : [event.movementX, event.movementY]),
} as const;

/**
 * Reactive mouse position.
 * @param options
 */

export function useMouse(options: UseMouseOptions = {}) {
  const {
    type = 'page',
    touch = true,
    resetOnTouchEnds = false,
    initialValue = { x: 0, y: 0 },
    target = defaultWindow,
  } = options;

  const x = ref(initialValue.x);
  const y = ref(initialValue.y);
  const sourceType = ref<UseMouseSourceType>(null);

  const extractor = isFunction(type) ? type : BuiltinExtractors[type];

  const mouseHandler = (event: MouseEvent) => {
    const result = extractor(event);

    if (result) {
      [x.value, y.value] = result;
      sourceType.value = 'mouse';
    }
  };

  const touchHandler = (event: TouchEvent) => {
    if (event.touches.length > 0) {
      const result = extractor(event.touches[0]);
      if (result) {
        [x.value, y.value] = result;
        sourceType.value = 'touch';
      }
    }
  };

  const reset = () => {
    x.value = initialValue.x;
    y.value = initialValue.y;
  };

  tryOnMounted(() => {
    if (target) {
      const listenerOptions = { passive: true };
      useEventListener(target, ['mousemove', 'dragover'], mouseHandler, listenerOptions);
      if (touch && type !== 'movement') {
        useEventListener(target, ['touchstart', 'touchmove'], touchHandler, listenerOptions);
        if (resetOnTouchEnds) useEventListener(target, 'touchend', reset, listenerOptions);
      }
    }
  });

  return {
    x,
    y,
    sourceType,
  };
}
