import type { AnyFn, MaybeRefOrGetter, Stoppable } from '../../types';
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
export declare function useTimeoutFn<CallbackFn extends AnyFn>(cb: CallbackFn, interval: MaybeRefOrGetter<number>, options?: UseTimeoutFnOptions): Stoppable<Parameters<CallbackFn> | []>;
