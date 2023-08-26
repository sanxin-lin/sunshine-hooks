import type { Ref, ComponentPublicInstance, WatchOptions, WatchSource } from 'vue';

export interface ConfigurableWindow {
  /*
   * Specify a custom `window` instance, e.g. working with iframes or in testing environments.
   */
  window?: Window;
}

export interface ConfigurableDocument {
  /*
   * Specify a custom `document` instance, e.g. working with iframes or in testing environments.
   */
  document?: Document;
}

export interface ConfigurableNavigator {
  /*
   * Specify a custom `navigator` instance, e.g. working with iframes or in testing environments.
   */
  navigator?: Navigator;
}

export interface ConfigurableLocation {
  /*
   * Specify a custom `location` instance, e.g. working with iframes or in testing environments.
   */
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
export type DeepMaybeRef<T> = T extends Ref<infer V>
  ? MaybeRef<V>
  : T extends Array<any> | object
  ? { [K in keyof T]: DeepMaybeRef<T[K]> }
  : MaybeRef<T>;

export type Arrayable<T> = T[] | T;

export type MaybeElement = HTMLElement | SVGElement | VueInstance | undefined | null;

export type MaybeComputedElementRef<T extends MaybeElement = MaybeElement> = MaybeRefOrGetter<T>;

export type UnRefElementReturn<T extends MaybeElement = MaybeElement> = T extends VueInstance
  ? Exclude<MaybeElement, VueInstance>
  : T | undefined;

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

export interface RenderableComponent {
  /**
   * The element that the component should be rendered as
   *
   * @default 'div'
   */
  as?: Object | string;
}

export interface Position {
  x: number;
  y: number;
}

export type Awaitable<T> = Promise<T> | T;

export interface ConfigurableFlush {
  /**
   * Timing for monitoring changes, refer to WatchOptions for more details
   *
   * @default 'pre'
   */
  flush?: WatchOptions['flush'];
}

/**
 * A ref that allow to set null or undefined
 */
export type RemovableRef<T> = Omit<Ref<T>, 'value'> & {
  get value(): T;
  set value(value: T | null | undefined);
};

export type MapSources<T> = {
  [K in keyof T]: T[K] extends WatchSource<infer V> ? V : never;
};
export type MapOldSources<T, Immediate> = {
  [K in keyof T]: T[K] extends WatchSource<infer V>
    ? Immediate extends true
      ? V | undefined
      : V
    : never;
};

export type FunctionArgs<Args extends any[] = any[], Return = void> = (...args: Args) => Return;

export interface FunctionWrapperOptions<Args extends any[] = any[], This = any> {
  fn: FunctionArgs<Args, This>;
  args: Args;
  thisArg: This;
}

export type EventFilter<Args extends any[] = any[], This = any, Invoke extends AnyFn = AnyFn> = (
  invoke: Invoke,
  options: FunctionWrapperOptions<Args, This>,
) => ReturnType<Invoke> | Promise<ReturnType<Invoke>>;

export interface ConfigurableEventFilter {
  /**
   * Filter for if events should to be received.
   */
  eventFilter?: EventFilter;
}

export type ArgumentsType<T> = T extends (...args: infer U) => any ? U : never


export type ElementOf<T> = T extends (infer E)[] ? E : never

export type ShallowUnwrapRef<T> = T extends Ref<infer P> ? P : T