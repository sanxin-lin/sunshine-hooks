import { readonly, ref } from 'vue';
import type { AnyFn, MaybeRefOrGetter, Stoppable } from '../../../types';
import { toValue } from '../../shared/toValue';
import { isClient } from '../../../utils';
import { tryOnScopeDispose } from '../../reactivity'

export interface UseTimeoutFnOptions {
  /**
   * Start the timer immediate after calling this function
   *
   * @default true
   */
  immediate?: boolean;
}

/**
 * Wrapper for `setTimeout` with controls.
 *
 * @param cb
 * @param interval
 * @param options
 */
export function useTimeoutFn<CallbackFn extends AnyFn>(
  cb: CallbackFn,
  interval: MaybeRefOrGetter<number>,
  options: UseTimeoutFnOptions = {},
): Stoppable<Parameters<CallbackFn> | []> {
  const { immediate = true } = options;
  const isPending = ref(false);
  let timer: ReturnType<typeof setTimeout> | null;

  const clear = () => {
    if (!timer) return;
    clearTimeout(timer);
    timer = null;
  };

  const stop = () => {
    isPending.value = false;
    clear();
  };

  const start = (...args: Parameters<CallbackFn> | []) => {
    clear();
    isPending.value = true;
    timer = setTimeout(() => {
      isPending.value = false;
      clear();
      cb(...args);
    }, toValue(interval));
  };

  if (immediate && isClient) {
    start();
  }

  tryOnScopeDispose(stop);

  return {
    isPending: readonly(isPending),
    start,
    stop,
  };
}
