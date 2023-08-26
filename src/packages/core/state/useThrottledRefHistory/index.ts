import type { MaybeRef } from '../../../types';
import type { Ref } from 'vue';
import type { UseRefHistoryOptions, UseRefHistoryReturn } from '../useRefHistory';
import { useRefHistory } from '../useRefHistory';
import throttle from 'lodash/throttle';
import { toValue, bypassFilter } from '../../shared';

export type UseThrottledRefHistoryOptions = Omit<UseRefHistoryOptions, 'eventFilter'> & {
  delay?: MaybeRef<number>;
  trailing?: boolean;
};

export type UseThrottledRefHistoryReturn<Raw> = UseRefHistoryReturn<Raw>;

/**
 * @param source
 * @param options
 */
export function useThrottledRefHistory<Raw>(
  source: Ref<Raw>,
  options: UseThrottledRefHistoryOptions = {},
): UseThrottledRefHistoryReturn<Raw> {
  const { delay = 200, trailing = true } = options;
  const _throttle = throttle(bypassFilter, toValue(delay), { trailing });
  const history = useRefHistory(source, { ...options, eventFilter: _throttle });

  return {
    ...history,
  };
}
