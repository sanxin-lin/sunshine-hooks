import type { Ref, ComponentPublicInstance } from 'vue';
export interface ConfigurableWindow {
    window?: Window;
}
export interface ConfigurableDocument {
    document?: Document;
}
export interface ConfigurableNavigator {
    navigator?: Navigator;
}
export interface ConfigurableLocation {
    location?: Location;
}
/**
 * Any function
 */
export type Fn = () => void;
/**
 * Any function
 */
export type AnyFn = (...args: any[]) => any;
/**
 * Maybe it's a ref, or not.
 *
 * ```ts
 * type MaybeRef<T> = T | Ref<T>
 * ```
 */
export type MaybeRef<T> = T | Ref<T>;
/**
 * Make all the nested attributes of an object or array to MaybeRef<T>
 *
 * Good for accepting options that will be wrapped with `reactive` or `ref`
 *
 * ```ts
 * UnwrapRef<DeepMaybeRef<T>> === T
 * ```
 */
export type DeepMaybeRef<T> = T extends Ref<infer V> ? MaybeRef<V> : T extends Array<any> | object ? {
    [K in keyof T]: DeepMaybeRef<T[K]>;
} : MaybeRef<T>;
export type Arrayable<T> = T[] | T;
export type MaybeElement = HTMLElement | SVGElement | VueInstance | undefined | null;
export type MaybeComputedElementRef<T extends MaybeElement = MaybeElement> = MaybeRefOrGetter<T>;
export type UnRefElementReturn<T extends MaybeElement = MaybeElement> = T extends VueInstance ? Exclude<MaybeElement, VueInstance> : T | undefined;
/**
 * Maybe it's a ref, or a plain value, or a getter function
 *
 * ```ts
 * type MaybeRefOrGetter<T> = (() => T) | T | Ref<T> | ComputedRef<T>
 * ```
 */
export type MaybeRefOrGetter<T> = MaybeRef<T> | (() => T);
export interface GeneralEventListener<E = Event> {
    (evt: E): void;
}
export type WindowEventName = keyof WindowEventMap;
export type DocumentEventName = keyof DocumentEventMap;
export type VueInstance = ComponentPublicInstance;
export type MaybeElementRef = MaybeRef<HTMLElement | SVGElement | VueInstance | undefined | null>;
export type SettimeoutType = ReturnType<typeof setTimeout> | undefined;
export type SetIntervalType = ReturnType<typeof setInterval> | undefined;
