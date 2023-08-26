import { ref } from 'vue'
import { useEventListener } from '../../browser'
import { defaultWindow } from '../../../utils'

/**
 * Reactive window scroll.
 * @param options
 */
export function useWindowScroll() {
  const _window = defaultWindow
  if (!_window) {
    return {
      x: ref(0),
      y: ref(0),
    }
  }

  const x = ref(_window.scrollX)
  const y = ref(_window.scrollY)

  useEventListener(
    _window,
    'scroll',
    () => {
      x.value = _window.scrollX
      y.value = _window.scrollY
    },
    {
      capture: false,
      passive: true,
    },
  )

  return { x, y }
}

export type UseWindowScrollReturn = ReturnType<typeof useWindowScroll>
