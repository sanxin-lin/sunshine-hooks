import { tryOnScopeDispose } from '../../reactivity';
import { watch } from 'vue';
import type { MaybeElementRef } from '../../../types';
import { unrefElement } from '../../components';
import { useSupported } from '../../utilities';
import { defaultWindow } from '../../../utils';

export interface UseMutationObserverOptions extends MutationObserverInit {}

/**
 * Watch for changes being made to the DOM tree.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver MutationObserver MDN
 * @param target
 * @param callback
 * @param options
 */

export function useMutationObserver(
  target: MaybeElementRef,
  callback: MutationCallback,
  options: UseMutationObserverOptions = {},
) {
  const _window = defaultWindow;
  let observer: MutationObserver | undefined;
  const isSupported = useSupported(() => _window && 'MutationObserver' in window);

  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = undefined;
    }
  };

  const stopWatch = watch(
    () => unrefElement(target),
    (el) => {
      cleanup();

      if (isSupported.value && _window && el) {
        observer = new MutationObserver(callback);
        observer.observe(el, options);
      }
    },
    { immediate: true },
  );

  const stop = () => {
    cleanup();
    stopWatch();
  };

  tryOnScopeDispose(stop);

  return {
    isSupported,
    stop,
  };
}
