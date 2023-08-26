import type { MaybeRefOrGetter } from '../../../types';
/**
 * Lock scrolling of the element.
 * @param element
 */
export declare function useScrollLock(element: MaybeRefOrGetter<HTMLElement | SVGElement | Window | Document | null | undefined>, initialState?: boolean): import("vue").WritableComputedRef<boolean>;
