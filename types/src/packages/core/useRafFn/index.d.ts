import type { Fn, ConfigurableWindow, Pausable } from '../../types';
export interface RafFnOptions extends ConfigurableWindow {
    /**
     * Start the requestAnimationFrame loop immediately on creation
     *
     * @default true
     */
    immediate?: boolean;
}
export declare function useRafFn(fn: Fn, options?: RafFnOptions): Pausable;
