import { getCurrentInstance, onMounted, onUpdated } from 'vue'
import { computedWithControl } from '../../reactivity'

export function useCurrentElement<T extends Element = Element>() {
  const vm = getCurrentInstance()
  const currentElement = computedWithControl(
    () => null,
    () => vm?.proxy!.$el as T
  )

  onUpdated(currentElement.trigger)
  onMounted(currentElement.trigger)

  return currentElement
}