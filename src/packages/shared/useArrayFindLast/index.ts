import type { ComputedRef } from 'vue-demi';
import { computed } from 'vue-demi';
import type { MaybeRefOrGetter } from '../../types';
import { toValue } from '../toValue';

/**
 * Reactive `Array.findLast`
 * @param {Array} list - the array was called upon.
 * @param fn - a function to test each element.
 *
 * @returns {number} the index of the first element in the array that passes the test. Otherwise, "-1".
 */

export function useArrayFindLast<T>(
  list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>,
  fn: (element: T, index: number, array: MaybeRefOrGetter<T[]>) => boolean,
): ComputedRef<MaybeRefOrGetter<T> | undefined> {
  return computed(() =>
    toValue(list)
      .map(element => toValue(element))
      .findLast(fn),
  );
}
