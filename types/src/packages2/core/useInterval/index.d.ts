import type { Ref } from 'vue';
import type { MaybeRefOrGetter, Pausable } from '../../types';
export interface UseIntervalOptions<Controls extends boolean> {
    /**
     * Expose more controls
     *
     * @default false
     */
    controls?: Controls;
    /**
     * Execute the update immediately on calling
     *
     * @default true
     */
    immediate?: boolean;
    /**
     * Callback on every interval
     */
    callback?: (count: number) => void;
}
export interface UseIntervalControls {
    counter: Ref<number>;
    reset: () => void;
}
export declare function useInterval(interval?: MaybeRefOrGetter<number>, options?: UseIntervalOptions<false>): Ref<number>;
export declare function useInterval(interval: MaybeRefOrGetter<number>, options: UseIntervalOptions<true>): UseIntervalControls & Pausable;
