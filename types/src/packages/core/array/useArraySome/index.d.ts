import type { ComputedRef } from 'vue';
import type { MaybeRefOrGetter } from '../../../types';
/**
 * Reactive `Array.some`
 * @param {Array} list - the array was called upon.
 * @param fn - a function to test each element.
 *
 * @returns {boolean} **true** if the `fn` function returns a **truthy** value for any element from the array. Otherwise, **false**.
 */
export declare function useArraySome<T>(list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>, fn: (element: T, index: number, array: MaybeRefOrGetter<T>[]) => unknown): ComputedRef<boolean>;
