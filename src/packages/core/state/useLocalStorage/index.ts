import type { MaybeRefOrGetter, RemovableRef } from '../../../types';
import type { UseStorageOptions } from '../useStorage';
import { useStorage } from '../useStorage';
import { defaultWindow } from '../../../utils';

export function useLocalStorage(
  key: string,
  initialValue: MaybeRefOrGetter<string>,
  options?: UseStorageOptions<string>,
): RemovableRef<string>;
export function useLocalStorage(
  key: string,
  initialValue: MaybeRefOrGetter<boolean>,
  options?: UseStorageOptions<boolean>,
): RemovableRef<boolean>;
export function useLocalStorage(
  key: string,
  initialValue: MaybeRefOrGetter<number>,
  options?: UseStorageOptions<number>,
): RemovableRef<number>;
export function useLocalStorage<T>(
  key: string,
  initialValue: MaybeRefOrGetter<T>,
  options?: UseStorageOptions<T>,
): RemovableRef<T>;
export function useLocalStorage<T = unknown>(
  key: string,
  initialValue: MaybeRefOrGetter<null>,
  options?: UseStorageOptions<T>,
): RemovableRef<T>;

/**
 * Reactive LocalStorage.
 * @param key
 * @param initialValue
 * @param options
 */
export function useLocalStorage<T extends string | number | boolean | object | null>(
  key: string,
  initialValue: MaybeRefOrGetter<T>,
  options: UseStorageOptions<T> = {},
): RemovableRef<any> {
  const _window = defaultWindow;
  return useStorage(key, initialValue, _window?.localStorage, options);
}
