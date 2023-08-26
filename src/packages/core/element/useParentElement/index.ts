import { toValue } from '../../shared';
import { tryOnMounted, unrefElement } from '../../components'
import { shallowRef, watch } from 'vue';
import { useCurrentElement } from '../../components/useCurrentElement';

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
