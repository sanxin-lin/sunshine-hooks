import type { MaybeRefOrGetter, AnyFn } from '../../types'
import type { DebounceSettings } from 'lodash'
import { createDebounceWrapper } from '../../utils'
import { toValue } from '../toValue'

export function useDebounceFn(
  fn: AnyFn,
  delay: MaybeRefOrGetter<number> = 200,
  options?: DebounceSettings
) {
  return createDebounceWrapper(
    fn,
    toValue(delay),
    options
  )
}