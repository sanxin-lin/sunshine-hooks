import type { Ref } from 'vue';
import type { MaybeRefOrGetter, Pausable, MaybeComputedElementRef, MaybeElement } from '../../../types';
export interface UseIntersectionObserverOptions {
    /**
     * Start the IntersectionObserver immediately on creation
     *
     * @default true
     */
    immediate?: boolean;
    /**
     * The Element or Document whose bounds are used as the bounding box when testing for intersection.
     */
    root?: MaybeComputedElementRef;
    /**
     * A string which specifies a set of offsets to add to the root's bounding_box when calculating intersections.
     */
    rootMargin?: string;
    /**
     * Either a single number or an array of numbers between 0.0 and 1.
     */
    threshold?: number | number[];
}
export interface UseIntersectionObserverReturn extends Pausable {
    isSupported: Ref<boolean>;
    stop: () => void;
}
/**
 * Detects that a target element's visibility.
 * @param target
 * @param callback
 * @param options
 */
export declare function useIntersectionObserver(target: MaybeComputedElementRef | MaybeRefOrGetter<MaybeElement[]> | MaybeComputedElementRef[], callback: IntersectionObserverCallback, options?: UseIntersectionObserverOptions): UseIntersectionObserverReturn;
