import type { ComputedRef } from 'vue';
import { computed } from 'vue';
import type { MaybeRefOrGetter } from '../../../types';
import { toValue } from '../../shared/toValue';

/**
 * Reactive `Array.findIndex`
 * @param {Array} list - the array was called upon.
 * @param fn - a function to test each element.
 *
 * @returns {number} the index of the first element in the array that passes the test. Otherwise, "-1".
 */

export function useArrayFindIndex<T>(
  list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>,
  fn: (element: T, index: number, array: MaybeRefOrGetter<T[]>) => boolean,
): ComputedRef<number> {
  return computed(() =>
    toValue(list)
      .map(element => toValue(element))
      .findIndex(fn),
  );
}
