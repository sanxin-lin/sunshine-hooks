import type { Ref } from 'vue';
import { computed, watch } from 'vue';
import type { MaybeElementRef, ConfigurableWindow } from '../../../types';
import { unrefElement } from '../../components/unrefElement';
import { useActiveElement } from '../../element/useActiveElement';

export interface FocusOptions extends ConfigurableWindow {
  /**
   * Initial value. If set true, then focus will be set on the target
   *
   * @default false
   */
  initialValue?: boolean;

  /**
   * The target element for the focus and blur events.
   */
  target?: MaybeElementRef;
}

export interface FocusReturn {
  /**
   * If read as true, then the element has focus. If read as false, then the element does not have focus
   * If set to true, then the element will be focused. If set to false, the element will be blurred.
   */
  focused: Ref<boolean>;
}

export function useFocus(options: FocusOptions = {}): FocusReturn {
  const { initialValue = false } = options;

  const activeEelement = useActiveElement(options);
  const target = computed(() => unrefElement(options.target));
  const focused = computed({
    get() {
      return activeEelement.value === target.value;
    },
    set(value: boolean) {
      if (!value && focused.value) {
        target.value?.blur();
      }

      if (value && !focused.value) {
        target.value?.focus();
      }
    },
  });

  watch(
    target,
    () => {
      focused.value = initialValue;
    },
    { immediate: true, flush: 'post' },
  );

  return {
    focused,
  };
}
