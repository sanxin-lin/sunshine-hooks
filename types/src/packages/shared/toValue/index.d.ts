import type { MaybeRefOrGetter } from '../../types';
/**
 * Get the value of value/ref/getter.
 */
export declare function toValue<T>(r: MaybeRefOrGetter<T>): T;
