import type { ObjectDirective, App } from 'vue';
import { useClickOutside } from './hooks';
import type { OnClickOutsideHandler, OnClickOutsideOptions } from './hooks';
import isFunction from 'lodash/isFunction';
import merge from 'lodash/merge';

export const vClickOutside: ObjectDirective<
  HTMLElement,
  OnClickOutsideHandler | [(evt: any) => void, OnClickOutsideOptions]
> = {
  mounted(el, binding) {
    const capture = !binding.modifiers.bubble;
    if (isFunction(binding.value)) {
      (el as any).__useClickOutside_stop = useClickOutside(el, binding.value, { capture });
    } else {
      const [handler, options] = binding.value;
      (el as any).__useClickOutside_stop = useClickOutside(
        el,
        handler,
        merge({ capture }, options),
      );
    }
  },
  unmounted(el) {
    (el as any).__useClickOutside_stop();
  },
};

export const vClickOutsideUse = {
  install: (app: App<Element>) => {
    app.directive('vScroll', vClickOutside);
  },
};
