import type { Ref } from 'vue-demi';
import { computed } from 'vue-demi';
import type { MaybeElementRef, ConfigurableWindow } from '../../types';
import { unrefElement } from '../../shared/unrefElement';
import { useActiveElement } from '../useActiveElement';
export interface FocusWithinReturn {
  /**
   * True if the element or any of its descendants are focused
   */
  focused: Ref<boolean>;
}

export function useFocusWithin(
  target: MaybeElementRef,
  options: ConfigurableWindow,
): FocusWithinReturn {
  const activeElement = useActiveElement(options);
  const targetElement = computed(() => unrefElement(target));

  const focused = computed(() => {
    return targetElement.value && activeElement.value
      ? targetElement.value.contains(activeElement.value)
      : false;
  });

  return {
    focused,
  };
}
