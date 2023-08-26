import type { ComputedRef } from 'vue';
import type { MaybeRefOrGetter } from '../../../types';
/**
 * Reactive `Array.map`
 * @param {Array} list - the array was called upon.
 * @param fn - a function that is called for every element of the given `list`. Each time `fn` executes, the returned value is added to the new array.
 *
 * @returns {Array} a new array with each element being the result of the callback function.
 */
export declare function useArrayMap<T, U = T>(list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>, fn: (element: T, index: number, array: T[]) => U): ComputedRef<U[]>;
