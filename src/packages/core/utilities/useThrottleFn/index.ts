import type { MaybeRefOrGetter, AnyFn } from '../../../types'
import type { ThrottleSettings } from 'lodash'
import { createThrottleWrapper } from '../../../utils'
import { toValue } from '../../shared'

export function useThrottleFn(
  fn: AnyFn,
  delay: MaybeRefOrGetter<number> = 200,
  options?: ThrottleSettings
) {
  return createThrottleWrapper(
    fn,
    toValue(delay),
    options
  )
}