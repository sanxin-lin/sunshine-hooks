import { tryOnMounted } from '../../components';
import { ref } from 'vue';
import { useEventListener } from '../../browser';
import { defaultWindow } from '../../../utils';

export interface UseWindowSizeOptions {
  initialWidth?: number;
  initialHeight?: number;
  /**
   * Listen to window `orientationchange` event
   *
   * @default true
   */
  listenOrientation?: boolean;

  /**
   * Whether the scrollbar should be included in the width and height
   * @default true
   */
  includeScrollbar?: boolean;
}

/**
 * Reactive window size.
 * @param options
 */

export function useWindowSize(options: UseWindowSizeOptions = {}) {
  const {
    initialWidth = Number.POSITIVE_INFINITY,
    initialHeight = Number.POSITIVE_INFINITY,
    includeScrollbar = true,
  } = options;

  const _window = defaultWindow;

  const width = ref(initialWidth);
  const height = ref(initialHeight);

  const update = () => {
    if (_window) {
      if (includeScrollbar) {
        width.value = _window.innerWidth;
        height.value = _window.innerHeight;
      } else {
        width.value = _window.document.documentElement.clientWidth;
        height.value = _window.document.documentElement.clientHeight;
      }
    }
  };

  update();
  tryOnMounted(update);

  if (_window) {
    useEventListener('resize', update, { passive: true });
  }

  return {
    width,
    height,
  };
}
