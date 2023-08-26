import { ref } from 'vue'
import { useEventListener } from '../../browser'
import { defaultWindow } from '../../../utils'

/**
 * Reactively track window focus with `window.onfocus` and `window.onblur`.
 * @param options
 */

export function useWindowFocus() {
  const _window = defaultWindow

  if (!_window) return ref(false)

  const focused = ref(_window.document.hasFocus())

  useEventListener(_window, 'blur', () => {
    focused.value = false
  })

  useEventListener(_window, 'focus', () => {
    focused.value = true
  })

  return focused
}