import type { ComputedRef } from 'vue-demi';
import { computed } from 'vue-demi';
import type { UseTimeoutFnOptions } from '../../shared';
import { useTimeoutFn } from '../../shared';
import type { Fn, Stoppable } from '../../types';
import { noop } from '../../utils';

export interface UseTimeoutOptions<Controls extends boolean> extends UseTimeoutFnOptions {
  /**
   * Expose more controls
   *
   * @default false
   */
  controls?: Controls;
  /**
   * Callback on timeout
   */
  callback?: Fn;
}

export function useTimeout(
  interval?: number,
  options?: UseTimeoutOptions<false>,
): ComputedRef<boolean>;
export function useTimeout(
  interval: number,
  options: UseTimeoutOptions<true>,
): { ready: ComputedRef<boolean> } & Stoppable;
export function useTimeout(interval = 1000, options: UseTimeoutOptions<boolean> = {}) {
  const { controls: exposeControls = false, callback = noop } = options;

  const controls = useTimeoutFn(callback, interval, options);

  const ready = computed(() => !controls.isPending.value);

  if (exposeControls) {
    return {
      ready,
      ...controls,
    };
  }

  return ready;
}
