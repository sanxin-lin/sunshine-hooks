import type { ComputedRef } from 'vue';
import type { UseTimeoutFnOptions } from '../../shared';
import type { Fn, Stoppable } from '../../types';
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
export declare function useTimeout(interval?: number, options?: UseTimeoutOptions<false>): ComputedRef<boolean>;
export declare function useTimeout(interval: number, options: UseTimeoutOptions<true>): {
    ready: ComputedRef<boolean>;
} & Stoppable;
