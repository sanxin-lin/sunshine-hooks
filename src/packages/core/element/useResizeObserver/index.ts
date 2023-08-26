import { tryOnScopeDispose } from '../../reactivity';
import { computed, watch } from 'vue';
import type { MaybeComputedElementRef } from '../../../types';
import { unrefElement } from '../../components';
import { useSupported } from '../../utilities';
import { defaultWindow } from '../../../utils';
import isArray from 'lodash/isArray';

export interface ResizeObserverSize {
  readonly inlineSize: number;
  readonly blockSize: number;
}

export interface ResizeObserverEntry {
  readonly target: Element;
  readonly contentRect: DOMRectReadOnly;
  readonly borderBoxSize?: ReadonlyArray<ResizeObserverSize>;
  readonly contentBoxSize?: ReadonlyArray<ResizeObserverSize>;
  readonly devicePixelContentBoxSize?: ReadonlyArray<ResizeObserverSize>;
}

export type ResizeObserverCallback = (
  entries: ReadonlyArray<ResizeObserverEntry>,
  observer: ResizeObserver,
) => void;

export interface UseResizeObserverOptions {
  /**
   * Sets which box model the observer will observe changes to. Possible values
   * are `content-box` (the default), `border-box` and `device-pixel-content-box`.
   *
   * @default 'content-box'
   */
  box?: ResizeObserverBoxOptions;
}

declare class ResizeObserver {
  constructor(callback: ResizeObserverCallback);
  disconnect(): void;
  observe(target: Element, options?: UseResizeObserverOptions): void;
  unobserve(target: Element): void;
}

/**
 * Reports changes to the dimensions of an Element's content or the border-box
 * @param target
 * @param callback
 * @param options
 */

export function useResizeObserver(
  target: MaybeComputedElementRef | MaybeComputedElementRef[],
  callback: ResizeObserverCallback,
  options: UseResizeObserverOptions = {},
) {
  const _window = defaultWindow;
  let observer: ResizeObserver | undefined;
  const isSupported = useSupported(() => _window && 'ResizeObserver' in window);

  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = undefined;
    }
  };

  const targets = computed(() => {
    return isArray(target) ? target.map((el) => unrefElement(el)) : [unrefElement(target)];
  });

  const stopWatch = watch(
    targets,
    (els) => {
      cleanup();
      if (isSupported.value && _window) {
        observer = new ResizeObserver(callback);
        for (const _el of els) {
          _el && observer.observe(_el, options);
        }
      }
    },
    { immediate: true, flush: 'post', deep: true },
  );

  const stop = () => {
    cleanup();
    stopWatch();
  };

  tryOnScopeDispose(stop);

  return {
    isSupported,
    stop,
  };
}
