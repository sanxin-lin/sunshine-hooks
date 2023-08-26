import { ref } from 'vue';
import type { UseIntervalFnOptions } from '../../animation';
import { useIntervalFn } from '../../animation';
import { useSupported } from '../../utilities'
import { defaultWindow } from '../../../utils';

/**
 * Performance.memory
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Performance/memory
 */
export interface MemoryInfo {
  /**
   * The maximum size of the heap, in bytes, that is available to the context.
   */
  readonly jsHeapSizeLimit: number;
  /**
   *  The total allocated heap size, in bytes.
   */
  readonly totalJSHeapSize: number;
  /**
   * The currently active segment of JS heap, in bytes.
   */
  readonly usedJSHeapSize: number;

  [Symbol.toStringTag]: 'MemoryInfo';
}

export interface UseMemoryOptions extends UseIntervalFnOptions {
  interval?: number;
}

type PerformanceMemory = Performance & {
  memory: MemoryInfo;
};

/**
 * Reactive Memory Info.
 * @param options
 */

export function useMemory(options: UseMemoryOptions = {}) {
  const memory = ref<MemoryInfo>();
  const isSupported = useSupported(() => defaultWindow && 'performance' in defaultWindow);
  const { immediate = true, immediateCallback = true } = options;

  if (isSupported.value) {
    const { interval } = options;
    useIntervalFn(
      () => {
        memory.value = (performance as PerformanceMemory).memory;
      },
      interval,
      { immediate, immediateCallback },
    );
  }

  return {
    isSupported,
    memory,
  };
}
