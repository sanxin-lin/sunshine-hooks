import { computed } from 'vue-demi'
import { useMounted } from '../useMounted'

export function useSupported(cb: () => unknown) {
  const isMounted = useMounted()

  return computed(() => {
    isMounted.value
    return Boolean(cb())
  })
}