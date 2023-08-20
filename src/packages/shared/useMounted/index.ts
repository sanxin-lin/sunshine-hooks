import { getCurrentInstance, onMounted, ref, readonly } from 'vue-demi';

/**
 * Mounted state in ref.
 * @param options
 */

export function useMounted() {
  const isMounted = ref(false);

  if (getCurrentInstance()) {
    onMounted(() => {
      isMounted.value = true;
    });
  }

  return readonly(isMounted)
}
