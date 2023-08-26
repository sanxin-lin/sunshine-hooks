import type { Fn, MaybeRefOrGetter, Pausable } from '../../types';
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
export declare function useIntervalFn(cb: Fn, interval?: MaybeRefOrGetter<number>, options?: UseIntervalFnOptions): Pausable;
