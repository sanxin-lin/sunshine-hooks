import { toValue, tryOnMounted, unrefElement } from '../../shared';
import { shallowRef, watch } from 'vue-demi';
import { useCurrentElement } from '../useCurrentElement';

export function useParentElement(element = useCurrentElement<HTMLElement | SVGAElement>()) {
  const parentElement = shallowRef<HTMLElement | SVGElement | null | undefined>();

  const update = () => {
    const el = unrefElement(element);
    if (el) {
      parentElement.value = el.parentElement;
    }
  };

  tryOnMounted(update);
  watch(() => toValue(element), update);

  return parentElement;
}
