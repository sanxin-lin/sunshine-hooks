import type { Ref } from 'vue';
import type { Fn } from './common';
export interface Pausable {
    /**
     * A ref indicate whether a pusable instance is active
     */
    isActive: Ref<boolean>;
    /**
     * Temporary pause the effect from executing
     */
    pause: Fn;
    /**
     * Resume the effects
     */
    resume: Fn;
}
export interface Stoppable<StartFnArgs extends any[] = any[]> {
    /**
     * A ref indicate whether a stoppable instance is executing
     */
    isPending: Readonly<Ref<boolean>>;
    /**
     * Stop the effect from executing
     */
    stop: Fn;
    /**
     * Start the effects
     */
    start: (...args: StartFnArgs) => void;
}
