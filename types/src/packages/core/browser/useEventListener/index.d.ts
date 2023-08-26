import type { Fn, GeneralEventListener, MaybeRefOrGetter, Arrayable } from '../../../types';
interface InferEventTarget<Events> {
    addEventListener(event: Events, fn?: any, options?: any): any;
    removeEventListener(event: Events, fn?: any, options?: any): any;
}
/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 * @param event
 * @param listener
 * @param options
 */
export declare function useEventListener<E extends keyof WindowEventMap>(event: Arrayable<E>, listener: Arrayable<(this: Window, ev: WindowEventMap[E]) => any>, options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>): Fn;
export declare function useEventListener<E extends keyof WindowEventMap>(target: Window, event: Arrayable<E>, listener: Arrayable<(this: Window, ev: WindowEventMap[E]) => any>, options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>): Fn;
export declare function useEventListener<E extends keyof DocumentEventMap>(target: DocumentOrShadowRoot, event: Arrayable<E>, listener: Arrayable<(this: Document, ev: DocumentEventMap[E]) => any>, options?: boolean | AddEventListenerOptions): Fn;
export declare function useEventListener<Names extends string, EventType = Event>(target: InferEventTarget<Names>, event: Arrayable<Names>, listener: Arrayable<GeneralEventListener<EventType>>, options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>): Fn;
export declare function useEventListener<EventType = Event>(target: MaybeRefOrGetter<EventTarget | null | undefined>, event: string, listener: GeneralEventListener<EventType>, options?: boolean | AddEventListenerOptions): Fn;
export {};
