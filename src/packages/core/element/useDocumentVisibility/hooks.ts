import type { Ref } from 'vue'
import { ref } from 'vue'
import { useEventListener } from '../../browser'
import { defaultDocument } from '../../../utils'


/**
 * Reactively track `document.visibilityState`.
 */

export function useDocumentVisibility(): Ref<DocumentVisibilityState> {
  const _document = defaultDocument

  if (!_document) return ref('visible')

  const visibility = ref(_document.visibilityState)

  useEventListener(_document, 'visibilitychange', () => {
    visibility.value = document.visibilityState
  })

  return visibility
}