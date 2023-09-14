import { isRef, ref, watch } from 'vue';
import { isClient } from '../../../utils';
import { tryOnScopeDispose } from '../../reactivity';
import type { Fn, MaybeRefOrGetter, Pausable } from '../../../types';
import { toValue } from '../../shared/toValue';

export interface UseIntervalFnOptions {
  /**
   * Start the timer immediately
   *
   * @default true
   */
  immediate?: boolean;

  /**
   * Execute the callback immediate after calling this function
   *
   * @default false
   */
  immediateCallback?: boolean;
}

export function useIntervalFn(
  cb: Fn,
  interval: MaybeRefOrGetter<number> = 1000,
  options: UseIntervalFnOptions = {},
): Pausable {
  const { immediate, immediateCallback } = options;

  const isActive = ref(false);
  let timer: ReturnType<typeof setInterval> | null = null;

  const clean = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const pause = () => {
    isActive.value = false;
    clean();
  };
  const resume = () => {
    const intervalValue = toValue(interval);
    console.log(intervalValue)
    if (intervalValue <= 0) return;
    isActive.value = true;
    if (immediateCallback) {
      cb();
    }
    clean();
    console.log('-intervalValue-', intervalValue)
    timer = setInterval(cb, intervalValue);
  };

  if (immediate && isClient) {
    resume();
  }

  if (isRef(interval)) {
    const stopWatch = watch(interval, () => {
      if (immediate && isClient) {
        resume();
      }
    });
    tryOnScopeDispose(stopWatch);
  }

  tryOnScopeDispose(pause);

  return {
    isActive,
    pause,
    resume,
  };
}
