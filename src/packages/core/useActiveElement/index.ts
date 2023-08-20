import { computed, ref } from 'vue-demi';
import { useEventListener } from '../useEventListener';
import type { ConfigurableWindow } from '../../types';
import { defaultWindow } from '../../utils';

export function useActiveElement<T extends HTMLElement>(options: ConfigurableWindow = {}) {
  const { window = defaultWindow } = options;
  const counter = ref(0);

  if (window) {
    useEventListener(window, 'blur', () => (counter.value += 1), true);
    useEventListener(window, 'focus', () => (counter.value += 1), true);
  }

  return computed(() => {
    counter.value;
    return window?.document.activeElement as T | null | undefined;
  });
}
