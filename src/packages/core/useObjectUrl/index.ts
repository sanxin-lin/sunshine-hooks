import { readonly, ref, watch } from 'vue-demi';
import { toValue } from '../../shared';
import type { MaybeRefOrGetter } from '../../types';
import { tryOnScopeDispose } from '../../shared'

export function useObjectUrl(object: MaybeRefOrGetter<Blob | MediaSource | null | undefined>) {
  const url = ref<string | undefined>();

  const release = () => {
    if (url.value) {
      URL.revokeObjectURL(url.value);
    }

    url.value = undefined;
  };

  watch(
    () => toValue(object),
    o => {
      release();

      if (o) {
        url.value = URL.createObjectURL(o);
      }
    },
    { immediate: true },
  );

  tryOnScopeDispose(release);

  return readonly(url);
}
