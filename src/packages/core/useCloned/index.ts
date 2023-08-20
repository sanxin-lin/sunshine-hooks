import type { MaybeRefOrGetter } from '../../types';
import { toValue } from '../../shared';
import type { ComputedRef, WatchOptions } from 'vue-demi';
import { computed } from 'vue-demi';
import cloneDeep from 'lodash/cloneDeep';

export interface UseClonedOptions<T = any> extends WatchOptions {
  /**
   * Custom clone function.
   *
   * By default, it use `JSON.parse(JSON.stringify(value))` to clone.
   */
  clone?: (source: T) => T;

  /**
   * Manually sync the ref
   *
   * @default false
   */
  manual?: boolean;
}

export function useCloned<T>(
  source: MaybeRefOrGetter<T>,
  options: UseClonedOptions = {},
): ComputedRef<T> {
  const { clone = cloneDeep } = options;
  return computed(() => clone(toValue(source)));
}
