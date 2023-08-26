import type { MaybeRefOrGetter } from '../../../types';
import { toRef } from '../../reactivity';
import { isClient } from '../../../utils';
import { ref, watch } from 'vue';
import QRCode from 'qrcode';

/**
 * Wrapper for qrcode.
 * @param text
 * @param options
 */
export function useQRCode(text: MaybeRefOrGetter<string>, options?: QRCode.QRCodeToDataURLOptions) {
  const src = toRef(text);
  const result = ref('');

  watch(
    src,
    async (value) => {
      if (src.value && isClient) result.value = await QRCode.toDataURL(value, options);
    },
    { immediate: true },
  );

  return result;
}
