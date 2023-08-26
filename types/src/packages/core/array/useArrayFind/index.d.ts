import type { ComputedRef } from 'vue';
import type { MaybeRefOrGetter } from '../../../types';
/**
 * Reactive `Array.find`
 * @param {Array} list - the array was called upon.
 * @param fn - a function to test each element.
 *
 * @returns the first element in the array that satisfies the provided testing function. Otherwise, undefined is returned.
 */
export declare function useArrayFind<T>(list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>, fn: (element: T, index: number, array: MaybeRefOrGetter<T[]>) => boolean): ComputedRef<MaybeRefOrGetter<T> | undefined>;
