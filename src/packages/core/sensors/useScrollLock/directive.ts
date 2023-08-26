import type { ObjectDirective, App } from 'vue';
import { ref, watch } from 'vue';
import { useScrollLock } from './hooks';

export const vScrollLock = (() => {
  const state = ref(false);
  let isLocked = null as unknown as ReturnType<typeof useScrollLock>;
  return {
    mounted(el, binding) {
      state.value = binding.value;
      isLocked = useScrollLock(el, binding.value);
      watch(state, (v) => (isLocked.value = v));
    },
    updated(_, binding) {
      state.value = binding.value;
    },
  } as ObjectDirective<HTMLElement, boolean>;
})();

export const vScrollLockUse = {
  install: (app: App<Element>) => {
    app.directive('vScrollLock', vScrollLock);
  },
};
