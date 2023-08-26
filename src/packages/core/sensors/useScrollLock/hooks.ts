import { computed, ref, watch } from 'vue';
import type { Fn, MaybeRefOrGetter } from '../../../types';
import { toValue } from '../../shared';
import { tryOnScopeDispose, toRef } from '../../reactivity';
import { isIOS } from '../../../utils';

import { useEventListener } from '../../browser/useEventListener';

function checkOverflowScroll(ele: Element): boolean {
  const style = window.getComputedStyle(ele);
  if (
    style.overflowX === 'scroll' ||
    style.overflowY === 'scroll' ||
    (style.overflowX === 'auto' && ele.clientWidth < ele.scrollWidth) ||
    (style.overflowY === 'auto' && ele.clientHeight < ele.scrollHeight)
  ) {
    return true;
  } else {
    const parent = ele.parentNode as Element;

    if (!parent || parent.tagName === 'BODY') return false;

    return checkOverflowScroll(parent);
  }
}

function preventDefault(rawEvent: TouchEvent): boolean {
  const e = rawEvent || window.event;

  const _target = e.target as Element;

  // Do not prevent if element or parentNodes have overflow: scroll set.
  if (checkOverflowScroll(_target)) return false;

  // Do not prevent if the event has more than one touch (usually meaning this is a multi touch gesture like pinch to zoom).
  if (e.touches.length > 1) return true;

  if (e.preventDefault) e.preventDefault();

  return false;
}

/**
 * Lock scrolling of the element.
 * @param element
 */
export function useScrollLock(
  element: MaybeRefOrGetter<HTMLElement | SVGElement | Window | Document | null | undefined>,
  initialState = false,
) {
  const isLocked = ref(initialState);
  let stopTouchMoveListener: Fn | null = null;
  let initialOverflow: CSSStyleDeclaration['overflow'];

  watch(
    toRef(element),
    (el) => {
      if (el) {
        const ele = el as HTMLElement;
        initialOverflow = ele.style.overflow;
        if (isLocked.value) ele.style.overflow = 'hidden';
      }
    },
    {
      immediate: true,
    },
  );

  const lock = () => {
    const ele = toValue(element) as HTMLElement;
    if (!ele || isLocked.value) return;
    if (isIOS) {
      stopTouchMoveListener = useEventListener(
        ele,
        'touchmove',
        (e) => {
          preventDefault(e as TouchEvent);
        },
        { passive: false },
      );
    }
    ele.style.overflow = 'hidden';
    isLocked.value = true;
  };

  const unlock = () => {
    const ele = toValue(element) as HTMLElement;
    if (!ele || !isLocked.value) return;
    isIOS && stopTouchMoveListener?.();
    ele.style.overflow = initialOverflow;
    isLocked.value = false;
  };

  tryOnScopeDispose(unlock);

  return computed<boolean>({
    get() {
      return isLocked.value;
    },
    set(v) {
      if (v) lock();
      else unlock();
    },
  });
}
