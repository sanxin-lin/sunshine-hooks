import type { WindowEventName } from '../../types';
import type { Ref } from 'vue';
export interface UseIdleOptions {
    /**
     * Event names that listen to for detected user activity
     *
     * @default ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel']
     */
    events?: WindowEventName[];
    /**
     * Listen for document visibility change
     *
     * @default true
     */
    listenForVisibilityChange?: boolean;
    /**
     * Initial state of the ref idle
     *
     * @default false
     */
    initialState?: boolean;
}
export interface UseIdleReturn {
    idle: Ref<boolean>;
    lastActive: Ref<number>;
    reset: () => void;
}
/**
 * Tracks whether the user is being inactive.
 * @param timeout default to 1 minute
 * @param options IdleOptions
 */
export declare function useIdle(timeout?: number, options?: UseIdleOptions): UseIdleReturn;
