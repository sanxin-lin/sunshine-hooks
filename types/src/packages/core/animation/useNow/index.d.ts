import type { Ref } from 'vue';
import type { Pausable } from '../../../types';
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
export declare function useNow(options?: UseNowOptions<false>): Ref<Date>;
export declare function useNow(options: UseNowOptions<true>): {
    now: Ref<Date>;
} & Pausable;
