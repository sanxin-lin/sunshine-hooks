import type { MaybeRefOrGetter } from '../../types';
export interface UseScrollOptions {
    /**
     * Throttle time for scroll event, it’s disabled by default.
     *
     * @default 0
     */
    throttle?: number;
    /**
     * The check time when scrolling ends.
     * This configuration will be setting to (throttle + idle) when the `throttle` is configured.
     *
     * @default 200
     */
    idle?: number;
    /**
     * Offset arrived states by x pixels
     *
     */
    offset?: {
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;
    };
    /**
     * Trigger it when scrolling.
     *
     */
    onScroll?: (e: Event) => void;
    /**
     * Trigger it when scrolling ends.
     *
     */
    onStop?: (e: Event) => void;
    /**
     * Listener options for scroll event.
     *
     * @default {capture: false, passive: true}
     */
    eventListenerOptions?: boolean | AddEventListenerOptions;
    /**
     * Optionally specify a scroll behavior of `auto` (default, not smooth scrolling) or
     * `smooth` (for smooth scrolling) which takes effect when changing the `x` or `y` refs.
     *
     * @default 'auto'
     */
    behavior?: MaybeRefOrGetter<ScrollBehavior>;
}
/**
 * Reactive scroll.
 * @param element
 * @param options
 */
export declare function useScroll(element: MaybeRefOrGetter<HTMLElement | SVGElement | Window | Document | null | undefined>, options?: UseScrollOptions): {
    x: import("vue").WritableComputedRef<number>;
    y: import("vue").WritableComputedRef<number>;
    isScrolling: import("vue").Ref<boolean>;
    arrivedState: {
        left: boolean;
        right: boolean;
        top: boolean;
        bottom: boolean;
    };
    directions: {
        left: boolean;
        right: boolean;
        top: boolean;
        bottom: boolean;
    };
    measure(): void;
};
