import { ref } from 'vue-demi';
import type { Fn, ConfigurableWindow, Pausable } from '../../types';
import { defaultWindow } from '../../utils';
import { tryOnScopeDispose } from '../../shared';

export interface RafFnOptions extends ConfigurableWindow {
  /**
   * Start the requestAnimationFrame loop immediately on creation
   *
   * @default true
   */
  immediate?: boolean;
}

export function useRafFn(fn: Fn, options: RafFnOptions = {}): Pausable {
  const { immediate, window = defaultWindow } = options;

  const isActive = ref(false);

  const loop = () => {
    if (isActive.value && window) {
      fn();
      window?.requestAnimationFrame(loop);
    }
  };

  const resume = () => {
    if (!isActive.value && window) {
      isActive.value = true;
      loop();
    }
  };

  const pause = () => {
    isActive.value = false;
  };

  if (immediate) {
    resume();
  }

  tryOnScopeDispose(pause);

  return {
    resume,
    pause,
    isActive,
  };
}
