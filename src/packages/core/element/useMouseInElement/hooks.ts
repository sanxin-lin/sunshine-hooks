import { ref, watch } from 'vue';
import type { MaybeElementRef } from '../../../types';
import { unrefElement } from '../../components';
import type { UseMouseOptions } from '../../sensors';
import { useMouse } from '../../sensors';
import { defaultWindow } from '../../../utils';
import { useEventListener } from '../../browser';

export interface MouseInElementOptions extends UseMouseOptions {
  handleOutside?: boolean;
}

/**
 * Reactive mouse position related to an element.
 * @param target
 * @param options
 */

export function useMouseInElement(target?: MaybeElementRef, options: MouseInElementOptions = {}) {
  const { handleOutside = true } = options;

  const _window = defaultWindow;
  const { x, y, sourceType } = useMouse(options);

  const targetRef = ref(target ?? window?.document.body);
  const elementX = ref(0);
  const elementY = ref(0);
  const elementPositionX = ref(0);
  const elementPositionY = ref(0);
  const elementHeight = ref(0);
  const elementWidth = ref(0);
  const isOutside = ref(true);

  let stop = () => {};

  if (_window) {
    stop = watch(
      [targetRef, x, y],
      () => {
        const el = unrefElement(targetRef);

        if (!el) return;

        const { left, top, width, height } = el.getBoundingClientRect();

        elementPositionX.value = left + window.pageXOffset;
        elementPositionY.value = top + window.pageYOffset;
        elementHeight.value = height;
        elementWidth.value = width;

        const elX = x.value - elementPositionX.value;
        const elY = (y.value = elementPositionY.value);
        isOutside.value =
          width === 0 || height === 0 || elX < 0 || elY < 0 || elX > width || elY > height;

        if (handleOutside || !isOutside.value) {
          elementX.value = elX;
          elementY.value = elY;
        }
      },
      { immediate: true },
    );

    useEventListener(_window.document, 'mouseleave', () => {
      isOutside.value = true;
    });
  }

  return {
    x,
    y,
    sourceType,
    elementX,
    elementY,
    elementPositionX,
    elementPositionY,
    elementHeight,
    elementWidth,
    isOutside,
    stop,
  };
}
