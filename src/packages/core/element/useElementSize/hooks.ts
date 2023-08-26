import { computed, ref, watch } from 'vue';
import type { MaybeComputedElementRef } from '../../components';
import type { UseResizeObserverOptions } from '../useResizeObserver';
import { useResizeObserver } from '../useResizeObserver';
import { unrefElement } from '../../components';
import { defaultWindow } from '../../../utils';
import isArray from 'lodash/isArray';

export interface ElementSize {
  width: number;
  height: number;
}

/**
 * Reactive size of an HTML element.
 * @param target
 * @param callback
 * @param options
 */
export function useElementSize(
  target: MaybeComputedElementRef,
  initialSize: ElementSize = { width: 0, height: 0 },
  options: UseResizeObserverOptions = {},
) {
  const _window = defaultWindow;
  const { box = 'content-box' } = options;
  const isSVG = computed(() => unrefElement(target)?.namespaceURI?.includes('svg'));
  const width = ref(initialSize.width);
  const height = ref(initialSize.height);

  useResizeObserver(
    target,
    ([entry]) => {
      const boxSize =
        box === 'border-box'
          ? entry.borderBoxSize
          : box === 'content-box'
          ? entry.contentBoxSize
          : entry.devicePixelContentBoxSize;

      if (_window && isSVG.value) {
        const $elem = unrefElement(target);
        if ($elem) {
          const styles = _window.getComputedStyle($elem);
          width.value = Number.parseFloat(styles.width);
          height.value = Number.parseFloat(styles.height);
        }
      } else {
        if (boxSize) {
          const formatBoxSize = isArray(boxSize) ? boxSize : [boxSize];
          width.value = formatBoxSize.reduce((acc, { inlineSize }) => acc + inlineSize, 0);
          height.value = formatBoxSize.reduce((acc, { blockSize }) => acc + blockSize, 0);
        } else {
          width.value = entry.contentRect.width;
          height.value = entry.contentRect.height;
        }
      }
    },
    options,
  );

  watch(
    () => unrefElement(target),
    (ele) => {
      width.value = ele ? initialSize.width : 0;
      height.value = ele ? initialSize.height : 0;
    },
  );

  return {
    width,
    height,
  };
}

export type UseElementSizeReturn = ReturnType<typeof useElementSize>