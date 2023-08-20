import type {
  Fn,
  GeneralEventListener,
  MaybeRefOrGetter,
  Arrayable,
  MaybeElementRef,
} from '../../types';
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
import { watch } from 'vue-demi';
import { defaultWindow, noop } from '../../utils';
import { toValue, tryOnScopeDispose, unrefElement } from '../../shared';

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

export function useEventListener<E extends keyof WindowEventMap>(
  event: Arrayable<E>,
  listener: Arrayable<(this: Window, ev: WindowEventMap[E]) => any>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>,
): Fn;

export function useEventListener<E extends keyof WindowEventMap>(
  target: Window,
  event: Arrayable<E>,
  listener: Arrayable<(this: Window, ev: WindowEventMap[E]) => any>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>,
): Fn;

export function useEventListener<E extends keyof DocumentEventMap>(
  target: DocumentOrShadowRoot,
  event: Arrayable<E>,
  listener: Arrayable<(this: Document, ev: DocumentEventMap[E]) => any>,
  options?: boolean | AddEventListenerOptions,
): Fn;

export function useEventListener<Names extends string, EventType = Event>(
  target: InferEventTarget<Names>,
  event: Arrayable<Names>,
  listener: Arrayable<GeneralEventListener<EventType>>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>,
): Fn;

export function useEventListener<EventType = Event>(
  target: MaybeRefOrGetter<EventTarget | null | undefined>,
  event: string,
  listener: GeneralEventListener<EventType>,
  options?: boolean | AddEventListenerOptions,
): Fn;

export function useEventListener(...args: any[]) {
  let target: MaybeRefOrGetter<EventTarget> | undefined;
  let events: Arrayable<string>;
  let listeners: Arrayable<Function>;
  let options: any;

  if (isString(args[0]) || isArray(args[0])) {
    [events, listeners, options] = args;
    target = defaultWindow;
  } else {
    [target, events, listeners, options] = args;
  }

  if (!target) {
    return noop;
  }

  if (!isArray(events)) {
    events = [events];
  }
  if (!isArray(listeners)) {
    listeners = [listeners];
  }

  const cleanups: Function[] = [];
  const cleanup = () => {
    cleanups.forEach(fn => fn());
    cleanups.length = 0;
  };

  const register = (el: any, event: string, listener: any, options: any) => {
    el.addEventListener(event, listener, options);
    return () => el.removeEventListener(event, listener, options);
  };

  const stopWatch = watch(
    () => [unrefElement(target as unknown as MaybeElementRef), toValue(options)],
    ([el, options]) => {
      cleanup();
      if (!el) return;

      cleanups.push(
        ...(events as string[]).flatMap(event => {
          return (listeners as Function[]).map(listener => register(el, event, listener, options));
        }),
      );
    },
    {
      immediate: true,
      flush: 'post',
    },
  );

  const stop = () => {
    stopWatch();
    cleanup();
  };

  tryOnScopeDispose(stop);

  return stop;
}
