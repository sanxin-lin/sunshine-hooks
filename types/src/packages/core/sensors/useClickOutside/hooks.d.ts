import type { MaybeElementRef } from '../../../types';
export interface OnClickOutsideOptions {
    /**
     * List of elements that should not trigger the event.
     */
    ignore?: (MaybeElementRef | string)[];
    /**
     * Use capturing phase for internal event listener.
     * @default true
     */
    capture?: boolean;
    /**
     * Run handler function if focus moves to an iframe.
     * @default false
     */
    detectIframe?: boolean;
}
export type OnClickOutsideHandler<T extends {
    detectIframe: OnClickOutsideOptions['detectIframe'];
} = {
    detectIframe: false;
}> = (evt: T['detectIframe'] extends true ? PointerEvent | FocusEvent : PointerEvent) => void;
export declare function useClickOutside(target: MaybeElementRef, handler: OnClickOutsideHandler, options?: OnClickOutsideOptions): (() => void) | undefined;
