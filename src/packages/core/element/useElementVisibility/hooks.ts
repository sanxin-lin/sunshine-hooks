import { ref } from 'vue';
import type { MaybeComputedElementRef, MaybeRefOrGetter } from '../../../types';
import { useIntersectionObserver } from '../useIntersectionObserver';

export interface UseElementVisibilityOptions {
  scrollTarget?: MaybeRefOrGetter<HTMLElement | undefined | null>;
}

/**
 * Tracks the visibility of an element within the viewport.
 * @param element
 * @param options
 */
export function useElementVisibility(
  element: MaybeComputedElementRef,
  options: UseElementVisibilityOptions = {},
) {
  const { scrollTarget } = options;
  const elementIsVisible = ref(false);

  useIntersectionObserver(
    element,
    ([{ isIntersecting }]) => {
      elementIsVisible.value = isIntersecting;
    },
    {
      root: scrollTarget,
    },
  );

  return elementIsVisible;
}
