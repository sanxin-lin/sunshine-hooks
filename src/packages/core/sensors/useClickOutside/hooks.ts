import type { Fn, MaybeElementRef } from '../../../types';
import { isIOS, noop, defaultWindow } from '../../../utils';
import { unrefElement } from '../../components';
import { useEventListener } from '../../browser/useEventListener';
import isString from 'lodash/isString';

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

export type OnClickOutsideHandler<
  T extends { detectIframe: OnClickOutsideOptions['detectIframe'] } = { detectIframe: false },
> = (evt: T['detectIframe'] extends true ? PointerEvent | FocusEvent : PointerEvent) => void;

/**
 * Listen for clicks outside of an element.
 * @param target
 * @param handler
 * @param options
 */

let _iOSWorkaround = false;

export function useClickOutside(
  target: MaybeElementRef,
  handler: OnClickOutsideHandler,
  options: OnClickOutsideOptions = {},
) {
  const { ignore = [], capture = true, detectIframe = false } = options;
  const _window = defaultWindow;

  if (!_window) return;

  // ios safari bug
  if (isIOS && !_iOSWorkaround) {
    _iOSWorkaround = true;
    Array.from(window.document.body.children).forEach((el) => el.addEventListener('click', noop));
    window.document.documentElement.addEventListener('click', noop);
  }

  let shouldListen = true;

  const shouldIgnore = (event: PointerEvent) => {
    return ignore.some((target) => {
      if (isString(target)) {
        return Array.from(_window.document.querySelectorAll(target)).some((el) => {
          return el === event.target || event.composedPath().includes(el);
        });
      } else {
        const el = unrefElement(target);
        return el && (el === event.target || event.composedPath().includes(el));
      }
    });
  };

  const listener = (event: PointerEvent) => {
    const el = unrefElement(target);

    if (!el || el === event.target || event.composedPath().includes(el)) return;

    if (event.detail === 0) {
      shouldListen = !shouldIgnore(event);
    }

    if (!shouldListen) {
      shouldListen = true;
      return;
    }

    handler(event);
  };

  const cleanup = [
    useEventListener(_window, 'click', listener, { passive: true, capture }),
    // useEventListener(_window, 'pointerdown', listener, { passive: true, capture }),
    useEventListener(
      window,
      'pointerdown',
      (e) => {
        const el = unrefElement(target);
        if (el) {
          shouldListen = !e.composedPath().includes(el) && !shouldIgnore(e);
        }
      },
      { passive: true },
    ),
    detectIframe &&
      useEventListener(_window, 'blur', (event) => {
        setTimeout(() => {
          const el = unrefElement(target);
          if (
            _window.document.activeElement?.tagName === 'IFRAME' &&
            !el?.contains(_window.document.activeElement)
          ) {
            handler(event as any);
          }
        }, 0);
      }),
  ].filter(Boolean) as Fn[];

  const stop = () => cleanup.forEach((fn) => fn());

  return stop;
}
