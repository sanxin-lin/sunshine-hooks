import type { Ref } from 'vue';
export interface UseFpsOptions {
    /**
     * Calculate the FPS on every x frames.
     * @default 10
     */
    every?: number;
}
export declare function useFps(options?: UseFpsOptions): Ref<number>;
