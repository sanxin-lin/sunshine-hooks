import type { Ref } from 'vue';
import { ref } from 'vue';
import type { Pausable } from '../../../types';
import { useIntervalFn } from '../useIntervalFn';
import { useRafFn } from '../useRafFn';

export interface UseNowOptions<Controls extends boolean> {
  /**
   * Expose more controls
   *
   * @default false
   */
  controls?: Controls;

  /**
   * Update interval, or use requestAnimationFrame
   *
   * @default requestAnimationFrame
   */
  interval?: 'requestAnimationFrame' | number;
}

export function useNow(options?: UseNowOptions<false>): Ref<Date>;
export function useNow(options: UseNowOptions<true>): { now: Ref<Date> } & Pausable;
export function useNow(options: UseNowOptions<boolean> = {}) {
  const { controls: exposeControls = false, interval = 'requestAnimationFrame' } = options;

  const now = ref(new Date());

  const update = () => (now.value = new Date());

  const controls =
    interval === 'requestAnimationFrame'
      ? useRafFn(update, { immediate: true })
      : useIntervalFn(update, interval, { immediate: true });

  if (exposeControls) {
    return {
      now,
      ...controls,
    };
  }

  return now;
}
