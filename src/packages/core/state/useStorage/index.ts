import { nextTick, ref, shallowRef } from 'vue';
import type {
  Awaitable,
  ConfigurableFlush,
  MaybeRefOrGetter,
  RemovableRef,
  ConfigurableEventFilter,
} from '../../../types';
import { bypassFilter, toValue } from '../../shared';
import type { StorageLike } from '../../../utils';
import { getSSRHandler } from '../../../utils';
import { useEventListener } from '../../browser';
import { defaultWindow } from '../../../utils';
import { guessSerializerType } from './guess';
import { watchPausable } from '../../watch';
import isNil from 'lodash/isNil';
import isFunction from 'lodash/isFunction';
import isPlainObject from 'lodash/isPlainObject';
import merge from 'lodash/merge';
import isString from 'lodash/isString';

export interface Serializer<T> {
  read(raw: string): T;
  write(value: T): string;
}

export interface SerializerAsync<T> {
  read(raw: string): Awaitable<T>;
  write(value: T): Awaitable<string>;
}

export const StorageSerializers: Record<
  'boolean' | 'object' | 'number' | 'any' | 'string' | 'map' | 'set' | 'date',
  Serializer<any>
> = {
  boolean: {
    read: (v: any) => v === 'true',
    write: (v: any) => String(v),
  },
  object: {
    read: (v: any) => JSON.parse(v),
    write: (v: any) => JSON.stringify(v),
  },
  number: {
    read: (v: any) => Number.parseFloat(v),
    write: (v: any) => String(v),
  },
  any: {
    read: (v: any) => v,
    write: (v: any) => String(v),
  },
  string: {
    read: (v: any) => v,
    write: (v: any) => String(v),
  },
  map: {
    read: (v: any) => new Map(JSON.parse(v)),
    write: (v: any) => JSON.stringify(Array.from((v as Map<any, any>).entries())),
  },
  set: {
    read: (v: any) => new Set(JSON.parse(v)),
    write: (v: any) => JSON.stringify(Array.from(v as Set<any>)),
  },
  date: {
    read: (v: any) => new Date(v),
    write: (v: any) => v.toISOString(),
  },
};

export const customStorageEventName = 'sunshine-storage';

export interface StorageEventLike {
  storageArea: StorageLike | null;
  key: StorageEvent['key'];
  oldValue: StorageEvent['oldValue'];
  newValue: StorageEvent['newValue'];
}

export interface UseStorageOptions<T> extends ConfigurableFlush, ConfigurableEventFilter {
  /**
   * Watch for deep changes
   *
   * @default true
   */
  deep?: boolean;

  /**
   * Listen to storage changes, useful for multiple tabs application
   *
   * @default true
   */
  listenToStorageChanges?: boolean;

  /**
   * Write the default value to the storage when it does not exist
   *
   * @default true
   */
  writeDefaults?: boolean;

  /**
   * Merge the default value with the value read from the storage.
   *
   * When setting it to true, it will perform a **shallow merge** for objects.
   * You can pass a function to perform custom merge (e.g. deep merge), for example:
   *
   * @default false
   */
  mergeDefaults?: boolean | ((storageValue: T, defaults: T) => T);

  /**
   * Custom data serialization
   */
  serializer?: Serializer<T>;

  /**
   * On error callback
   *
   * Default log error to `console.error`
   */
  onError?: (error: unknown) => void;

  /**
   * Use shallow ref as reference
   *
   * @default false
   */
  shallow?: boolean;
}

export function useStorage(
  key: string,
  defaults: MaybeRefOrGetter<string>,
  storage?: StorageLike,
  options?: UseStorageOptions<string>,
): RemovableRef<string>;
export function useStorage(
  key: string,
  defaults: MaybeRefOrGetter<boolean>,
  storage?: StorageLike,
  options?: UseStorageOptions<boolean>,
): RemovableRef<boolean>;
export function useStorage(
  key: string,
  defaults: MaybeRefOrGetter<number>,
  storage?: StorageLike,
  options?: UseStorageOptions<number>,
): RemovableRef<number>;
export function useStorage<T>(
  key: string,
  defaults: MaybeRefOrGetter<T>,
  storage?: StorageLike,
  options?: UseStorageOptions<T>,
): RemovableRef<T>;
export function useStorage<T = unknown>(
  key: string,
  defaults: MaybeRefOrGetter<null>,
  storage?: StorageLike,
  options?: UseStorageOptions<T>,
): RemovableRef<T>;

/**
 * Reactive LocalStorage/SessionStorage.
 */

export function useStorage<T extends string | number | boolean | object | null>(
  key: string,
  defaults: MaybeRefOrGetter<T>,
  storage: StorageLike | undefined,
  options: UseStorageOptions<T> = {},
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

  const _window = defaultWindow;
  const data = (shallow ? shallowRef : ref)(defaults) as RemovableRef<T>;

  if (!storage) {
    try {
      storage = getSSRHandler('getDefaultStorage', () => _window?.localStorage)();
    } catch (e) {
      onError(e);
    }
  }

  if (!storage) return data;

  const rawInit: T = toValue(defaults);
  const type = guessSerializerType<T>(rawInit);
  const serializer = options.serializer ?? StorageSerializers[type];

  const { pause: pauseWatch, resume: resumeWatch } = watchPausable(data, () => write(data.value), {
    flush,
    deep,
    eventFilter,
  });

  const write = (v: unknown) => {
    try {
      if (isNil(v)) {
        storage?.removeItem(key);
      } else {
        const serialized = serializer.write(v);
        const oldValue = storage!.getItem(key);
        if (oldValue !== serialized) {
          storage?.setItem(key, serialized);

          if (_window) {
            _window.dispatchEvent(
              new CustomEvent<StorageEventLike>(customStorageEventName, {
                detail: {
                  key,
                  oldValue,
                  newValue: serialized,
                  storageArea: storage!,
                },
              }),
            );
          }
        }
      }
    } catch (e) {
      onError(e);
    }
  };

  const read = (event?: StorageEventLike) => {
    const rawValue = event ? event.newValue : storage!.getItem(key);

    if (isNil(rawValue)) {
      if (writeDefaults && isNil(rawInit)) {
        storage!.setItem(key, serializer.write(rawInit));
        return rawInit;
      }
    } else if (!event && mergeDefaults) {
      const value = serializer.read(rawValue);
      if (isFunction(mergeDefaults)) {
        return mergeDefaults(value, rawInit);
      } else if (isPlainObject(value)) {
        return merge(rawInit, value);
      }
      return value;
    } else if (!isString(rawValue)) {
      return rawValue;
    } else {
      return serializer.read(rawValue);
    }
  };

  const updateFromCustomEvent = (event: CustomEvent<StorageEventLike>) => {
    update(event.detail);
  };

  const update = (event?: StorageEventLike) => {
    if (event && event.storageArea !== storage) return;
    if (event && isNil(event.key)) return;
    if (event && event.key !== key) return;

    pauseWatch();

    try {
      data.value = read(event);
    } catch (e) {
      onError(e);
    } finally {
      // use nextTick to avoid infinite loop
      if (event) nextTick(resumeWatch);
      else resumeWatch();
    }
  };

  if (window && listenToStorageChanges) {
    useEventListener(window, 'storage', update);
    useEventListener(window, customStorageEventName, updateFromCustomEvent);
  }

  update();

  return data;
}
