import type { UseIntervalFnOptions } from '../../shared';
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
/**
 * Reactive Memory Info.
 * @param options
 */
export declare function useMemory(options?: UseMemoryOptions): {
    isSupported: import("vue").ComputedRef<boolean>;
    memory: import("vue").Ref<MemoryInfo | undefined>;
};
