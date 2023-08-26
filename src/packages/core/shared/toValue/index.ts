// eslint-disable-next-line no-restricted-imports
import { unref } from 'vue'
import type { AnyFn, MaybeRefOrGetter } from '../../../types'
import isFunction from 'lodash/isFunction'

/**
 * Get the value of value/ref/getter.
 */

export function toValue<T>(r: MaybeRefOrGetter<T>): T {
  return isFunction(r) ? (r as AnyFn)() : unref(r)
}