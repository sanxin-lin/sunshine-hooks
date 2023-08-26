import { computed } from 'vue'
import { useMounted } from '../../components'

export function useSupported(cb: () => unknown) {
  const isMounted = useMounted()

  return computed(() => {
    isMounted.value
    return Boolean(cb())
  })
}