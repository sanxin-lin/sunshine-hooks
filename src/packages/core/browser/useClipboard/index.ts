import type { MaybeRefOrGetter, ConfigurableNavigator } from '../../../types';
import { useTimeoutFn } from '../../animation';
import { useSupported } from '../../utilities';
import { toValue } from '../../shared';
import type { Ref } from 'vue';
import { computed, ref } from 'vue';
import { useEventListener } from '../useEventListener';
import { defaultNavigator } from '../../../utils';
import isNil from 'lodash/isNil';

export interface UseClipboardOptions<Source> extends ConfigurableNavigator {
  /**
   * Enabled reading for clipboard
   *
   * @default false
   */
  read?: boolean;

  /**
   * Copy source
   */
  source?: Source;

  /**
   * Milliseconds to reset state of `copied` ref
   *
   * @default 1500
   */
  copiedDuring?: number;

  /**
   * Whether fallback to document.execCommand('copy') if clipboard is undefined.
   *
   * @default false
   */
  legacy?: boolean;
}

export interface UseClipboardReturn<Optional> {
  isSupported: Ref<boolean>;
  text: Ref<string>;
  copied: Ref<boolean>;
  copy: Optional extends true ? (text?: string) => Promise<void> : (text: string) => Promise<void>;
}

/**
 * Reactive Clipboard API.
 * @param options
 */

export function useClipboard(options?: UseClipboardOptions<undefined>): UseClipboardReturn<false>;
export function useClipboard(
  options: UseClipboardOptions<MaybeRefOrGetter<string>>,
): UseClipboardReturn<true>;
export function useClipboard(
  options: UseClipboardOptions<MaybeRefOrGetter<string> | undefined> = {},
): UseClipboardReturn<boolean> {
  const {
    navigator = defaultNavigator,
    read = false,
    source,
    copiedDuring = 1500,
    legacy = false,
  } = options;

  const isClipboardApiSupported = useSupported(() => navigator && 'clipboard' in navigator);
  const isSupported = computed(() => isClipboardApiSupported.value || legacy);
  const text = ref('');
  const copied = ref(false);
  const timeout = useTimeoutFn(() => (copied.value = false), copiedDuring);

  const copy = async (value = toValue(source)) => {
    if (isClipboardApiSupported.value && !isNil(value)) {
      if (isClipboardApiSupported.value) {
        await navigator!.clipboard.writeText(value);
      } else {
        legacyCopy(value);
      }

      text.value = value;
      copied.value = true;
      timeout.start();
    }
  };

  const updateText = () => {
    if (isClipboardApiSupported.value) {
      navigator!.clipboard.readText().then(value => {
        text.value = value;
      });
    } else {
      text.value = legacyRead();
    }
  };

  const legacyCopy = (value: string) => {
    const ta = document.createElement('textarea');
    ta.value = value ?? '';
    ta.style.position = 'absolute';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  };

  const legacyRead = () => {
    return document?.getSelection?.()?.toString() ?? '';
  };

  if (isSupported.value && read) {
    useEventListener(['copy', 'cut'], updateText);
  }

  return {
    isSupported,
    text,
    copied,
    copy,
  };
}
