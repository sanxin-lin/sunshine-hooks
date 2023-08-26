import type { MaybeRefOrGetter, RemovableRef } from '../../../types';
import { watchWithFilter } from '../../watch';
import { toValue, bypassFilter } from '../../shared';
import type { Ref } from 'vue';
import { ref, shallowRef } from 'vue';
import type { StorageLikeAsync } from '../../../utils';
import { getSSRHandler, defaultWindow } from '../../../utils';
import type { SerializerAsync, UseStorageOptions } from '../useStorage';
import { StorageSerializers } from '../useStorage';
import { useEventListener } from '../../browser';
import { guessSerializerType } from '../useStorage/guess';

export interface UseStorageAsyncOptions<T> extends Omit<UseStorageOptions<T>, 'serializer'> {
  /**
   * Custom data serialization
   */
  serializer?: SerializerAsync<T>;
}

export function useStorageAsync(
  key: string,
  initialValue: MaybeRefOrGetter<string>,
  storage?: StorageLikeAsync,
  options?: UseStorageAsyncOptions<string>,
): RemovableRef<string>;
export function useStorageAsync(
  key: string,
  initialValue: MaybeRefOrGetter<boolean>,
  storage?: StorageLikeAsync,
  options?: UseStorageAsyncOptions<boolean>,
): RemovableRef<boolean>;
export function useStorageAsync(
  key: string,
  initialValue: MaybeRefOrGetter<number>,
  storage?: StorageLikeAsync,
  options?: UseStorageAsyncOptions<number>,
): RemovableRef<number>;
export function useStorageAsync<T>(
  key: string,
  initialValue: MaybeRefOrGetter<T>,
  storage?: StorageLikeAsync,
  options?: UseStorageAsyncOptions<T>,
): RemovableRef<T>;
export function useStorageAsync<T = unknown>(
  key: string,
  initialValue: MaybeRefOrGetter<null>,
  storage?: StorageLikeAsync,
  options?: UseStorageAsyncOptions<T>,
): RemovableRef<T>;

/**
 * Reactive Storage in with async support.
 * @param key
 * @param initialValue
 * @param storage
 * @param options
 */

export function useStorageAsync<T extends string | number | boolean | object | null>(
  key: string,
  initialValue: MaybeRefOrGetter<T>,
  storage: StorageLikeAsync | undefined,
  options: UseStorageAsyncOptions<T> = {},
): RemovableRef<T> {
  const {
    flush = 'pre',
    deep = true,
    listenToStorageChanges = true,
    writeDefaults = true,
    mergeDefaults = false,
    shallow,
    eventFilter = bypassFilter,
    onError = (e) => {
      console.error(e);
    },
  } = options;

  const rawInit: T = toValue(initialValue);
  const type = guessSerializerType<T>(rawInit);

  const data = (shallow ? shallowRef : ref)(initialValue) as Ref<T>;
  const serializer = options.serializer ?? StorageSerializers[type];

  if (!storage) {
    try {
      storage = getSSRHandler('getDefaultStorage', () => defaultWindow?.localStorage)();
    } catch (e) {
      onError(e);
    }
  }

  async function read(event?: StorageEvent) {
    if (!storage || (event && event.key !== key)) return;

    try {
      const rawValue = event ? event.newValue : await storage.getItem(key);
      if (rawValue == null) {
        data.value = rawInit;
        if (writeDefaults && rawInit !== null)
          await storage.setItem(key, await serializer.write(rawInit));
      } else if (mergeDefaults) {
        const value = await serializer.read(rawValue);
        if (typeof mergeDefaults === 'function') data.value = mergeDefaults(value, rawInit);
        else if (type === 'object' && !Array.isArray(value))
          data.value = { ...(rawInit as any), ...value };
        else data.value = value;
      } else {
        data.value = await serializer.read(rawValue);
      }
    } catch (e) {
      onError(e);
    }
  }

  read();

  if (window && listenToStorageChanges)
    useEventListener(window, 'storage', (e) => Promise.resolve().then(() => read(e)));

  if (storage) {
    watchWithFilter(
      data,
      async () => {
        try {
          if (data.value == null) await storage!.removeItem(key);
          else await storage!.setItem(key, await serializer.write(data.value));
        } catch (e) {
          onError(e);
        }
      },
      {
        flush,
        deep,
        eventFilter,
      },
    );
  }

  return data as RemovableRef<T>;
}
